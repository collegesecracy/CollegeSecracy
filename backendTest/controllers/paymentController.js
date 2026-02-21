import Razorpay from "../config/razorpay.js";
import Plan_Schema from '../models/PlanSchema.js';
import { coupon_Schema } from "../models/CouponSchema.js";
import UserPurchase_Schema from "../models/UserPurchaseSchema.js";
import Notification from "../models/Notification.js";
import { User } from "../models/User.js";
import crypto from 'crypto';
import { eventHandlers, handlePaymentCaptured } from '../utils/razorpayEventHandlers.js';

// ✅ Create Order
export const createOrder = async (req, res) => {
  try {
    const { planId, couponCode } = req.body;
    const userId = req.user._id;

    const user = await User.findById(userId).select('+active'); 
    if (!user.active) {
    return res.status(403).json({ message: 'Account is deactivated. You cannot purchase a plan.' });
}
    const plan = await Plan_Schema.findById(planId);
    if (!plan) return res.status(404).json({ message: "Plan not found" });

    const planType = plan.planType || plan.Plantype;

  if (new Date(plan.expiryDate).getTime() <= Date.now()) {
    return res.status(400).json({ message: "The selected plan has expired. Please select a valid plan." });
}

// 🔥 DEV MODE PAYMENT BYPASS
if (process.env.PAYMENT_MODE === "dev") {

  let purchase = await UserPurchase_Schema.findOne({ userId, planId });

  // 🧠 Case 1 — Already Paid
  if (purchase?.status === "paid") {
    return res.status(200).json({
      success: true,
      devMode: true,
      message: "Already unlocked (Dev mode)",
      purchaseId: purchase._id
    });
  }

  // 🧠 Case 2 — Created → Reuse
  if (!purchase) {

    const validity =
      planType === "tool"
        ? new Date("2099-12-31")
        : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    const devOrderId = `dev_order_${planId}_${Date.now()}`;;

    purchase = await UserPurchase_Schema.create({
      userId,
      planId,
      fullName: user.fullName,
      PlanName: plan.title,
      orderId: devOrderId,
      amount: plan.price,
      currency: "INR",
      receipt: `dev_receipt_${Date.now()}`,
      status: "created",
      validity,
      couponUsed: null
    });
  }

  // 🔥 CAPTURE SIMULATION (same as verify)
  const fakePayment = {
    id: `dev_payment_${Date.now()}`,
    order_id: purchase.orderId,
    notes: {
      userId: userId.toString(),
      planId: planId.toString(),
      validity: purchase.validity.toISOString()
    }
  };

  const result = await handlePaymentCaptured(fakePayment, "dev");

  return res.status(200).json({
    success: true,
    devMode: true,
    message: result?.message || "Dev unlock success",
    purchaseId: purchase._id
  });
}

    const existingPurchase = await UserPurchase_Schema.findOne({ userId, planId });
    if (existingPurchase) {
      if (existingPurchase.status === 'paid') {
        return res.status(400).json({ message: 'Plan already purchased.' });
      }
      if (existingPurchase.status === 'created') {
        return res.status(200).json({
          success: true,
          fullName: user.fullName,
          email: user.email,
          phone: user.phone,
          message: "Order already created. Proceed to payment.",
          orderId: existingPurchase.orderId,
          currency: existingPurchase.currency,
          amount: existingPurchase.amount * 100,
          planName: plan.title,
          purchaseId: existingPurchase._id
        });
      }
    }


    let price = plan.price;
    let discountApplied = 0;
    let couponDetails = null;

    if (couponCode) {
      const coupon = await coupon_Schema.findOne({ code: couponCode });
      const now = new Date();

      if (!coupon) return res.status(400).json({ message: "Invalid Coupon" });
      if (!coupon.isActive) return res.status(400).json({ message: "Coupon is not active" });
      if (coupon.expiryDate < now) return res.status(400).json({ message: "Coupon has expired" });
      if (!coupon.applicablePlans.includes(planType)) {
        return res.status(400).json({ message: 'Coupon is not valid for this plan' });
      }

      discountApplied = (price * coupon.discountPercent) / 100;
      price -= discountApplied;
      couponDetails = {
        code: coupon.code,
        discountPercent: coupon.discountPercent,
        discountAmount: discountApplied
      };
    }

    let validity = planType === 'tool'
      ? new Date('2099-12-31')
      : (plan.expiryDate ? new Date(plan.expiryDate) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000));

    const options = {
      amount: Math.round(price * 100),
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      notes: {
        userId: userId.toString(),
        planId: planId.toString(),
        coupon: couponDetails ? JSON.stringify(couponDetails) : null,
        validity: validity.toISOString()
      }
    };

    const order = await Razorpay.orders.create(options);

    const purchase = await UserPurchase_Schema.create({
      userId,
      planId,
      fullName: user.fullName,
      PlanName: plan.title,
      orderId: order.id,
      amount: price,
      currency: order.currency,
      receipt: order.receipt,
      status: 'created',
      validity,
      couponUsed: couponDetails?.code || null
    });

    res.status(200).json({
      success: true,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      message: "Order created",
      orderId: order.id,
      currency: order.currency,
      amount: price * 100,
      planName: plan.title,
      purchaseId: purchase._id
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Something went wrong', error: err.message });
  }
};


export const verifyPayment = async (req, res) => {
  try {

    // Dev mode bypass for payment verification
      if (process.env.PAYMENT_MODE === "dev") {
        return res.status(200).json({
        success: true,
        message: "Dev mode: verification skipped"
      });
    }
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Invalid signature", success: false });
    }

    const payment = await Razorpay.payments.fetch(razorpay_payment_id);
    const result = await handlePaymentCaptured(payment, 'verify');

    return res.status(200).json({
      success: true,
      message: result.message || 'Payment verified and user updated'
    });

  } catch (err) {
    console.error("❌ Payment verification error:", err);
    return res.status(500).json({ message: 'Error verifying payment', error: err.message });
  }
};

// ✅ Webhook Handler
export const paymentWebhook = async (req, res) => {
  try {

    const shasum = crypto.createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET);
    shasum.update(JSON.stringify(req.body));
    const digest = shasum.digest('hex');

    if (digest !== req.headers['x-razorpay-signature']) {
      return res.status(400).json({ message: 'Invalid webhook signature' });
    }

    const event = req.body.event;
    const payment = req.body.payload?.payment?.entity;

    if (!payment || !event) {
      return res.status(400).json({ message: 'Invalid webhook payload' });
    }

    if (!eventHandlers[event]) {
      console.warn(`Unhandled event: ${event}`);
      return res.status(200).json({ message: `Unhandled event: ${event}` });
    }

    const result = await eventHandlers[event](payment);
    return res.status(200).json({ success: true, message: result.message || 'Handled' });

  } catch (err) {
    console.error('⚠️ Webhook Error:', err.message);
    return res.status(500).json({ message: 'Webhook processing failed', error: err.message });
  }
};

// ✅ Admin Payments Fetch
export const getAllPayments = async (req, res) => {
  try {
    if (req.user?.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }

    const payments = await UserPurchase_Schema.find({})
      .populate('userId', 'fullName email role phone') 
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      totalPayments: payments.length,
      data: payments,
    });
  } catch (error) {
    console.error('Error fetching payments:', error);
    res.status(500).json({ message: 'Server error while fetching payments.' });
  }
};
