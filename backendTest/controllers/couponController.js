import { coupon_Schema } from "../models/CouponSchema.js";

// Create a new coupon
export const createCoupon = async (req, res) => {
    try {
        const { couponData } = req.body;
        const coupon = await coupon_Schema.create(couponData);
        res.status(201).json({
            success: true,
            message: "Coupon created successfully!",
            coupon,
        });
    } catch (e) {
        res.status(500).json({
            success: false,
            message: "Coupon creation failed!",
            error: e.message,
        });
    }
};

// Fetch all coupons
export const fetchCoupons = async (req, res) => {
    try {
        const coupons = await coupon_Schema.find();
        res.status(200).json({
            success: true,
            message: "All coupons fetched successfully!",
            coupons,
        });
    } catch (e) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch coupons",
            error: e.message,
        });
    }
};

// Update coupon by ID
export const updateCoupon = async (req, res) => {
    try {
        const { id } = req.params;
        const { couponData } = req.body;

        const updatedCoupon = await coupon_Schema.findByIdAndUpdate(id, couponData, {
            new: true,
            runValidators: true,
        });

        if (!updatedCoupon) {
            return res.status(404).json({ success: false, message: "Coupon not found!" });
        }

        res.status(200).json({
            success: true,
            message: "Coupon updated successfully!",
            updatedCoupon,
        });
    } catch (e) {
        res.status(500).json({
            success: false,
            message: "Coupon update failed!",
            error: e.message,
        });
    }
};

// Delete coupon by ID
export const deleteCoupon = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedCoupon = await coupon_Schema.findByIdAndDelete(id);

        if (!deletedCoupon) {
            return res.status(404).json({ success: false, message: "Coupon not found!" });
        }

        res.status(200).json({
            success: true,
            message: "Coupon deleted successfully!",
            deletedCoupon,
        });
    } catch (e) {
        res.status(500).json({
            success: false,
            message: "Coupon deletion failed!",
            error: e.message,
        });
    }
};


export const applyCoupon = async (req, res) => {
  try {
    const { code, userId, type } = req.body;

    if (!code || !userId) {
      return res.status(400).json({ error: "Code and userId are required" });
    }

    const coupon = await coupon_Schema.findOne({ code });

    if (!coupon || !coupon.isActive) {
      return res.status(400).json({ error: "Invalid or inactive coupon code" });
    }

    // Check expiry
    if (coupon.expiryDate && new Date() > new Date(coupon.expiryDate)) {
      return res.status(400).json({ error: "Coupon has expired" });
    }

    // Check total usage limit
    if (coupon.usedCount >= coupon.maxUsages) {
      return res.status(400).json({ error: "Coupon usage limit exceeded" });
    }

    // Check applicable type if passed
    if (type && !coupon.ApplicableType.includes(type)) {
      return res.status(400).json({ error: `Coupon not valid for ${type}` });
    }

    // Check if user already used it
    const userUsage = coupon.usersUsed.find(u =>
      u.userId.toString() === userId
    );

    if (userUsage && userUsage.usedCount >= coupon.maxUsagePerUser) {
      return res.status(400).json({ error: "You have already used this coupon" });
    }

    // Update coupon usage
    coupon.usedCount += 1;

    if (userUsage) {
      userUsage.usedCount += 1;
    } else {
      coupon.usersUsed.push({
        userId: new mongoose.Types.ObjectId(userId),
        usedCount: 1
      });
    }

    await coupon.save();

    return res.status(200).json({
      success: true,
      message: "Coupon applied successfully",
      discount: coupon.DiscountPercent,
    });
  } catch (error) {
    console.error("Coupon apply error:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

