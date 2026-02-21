import mongoose from "mongoose";

const CouponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
    },
    DiscountPercent: {
      type: Number,
      required: true,
    },
    maxUsages: {
      type: Number,
      default: 100,
    },
    usedCount: {
      type: Number,
      default: 0,
    },
    maxUsagePerUser: {
      type: Number,
      default: 1,
    },
    usersUsed: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        usedCount: {
          type: Number,
          default: 1,
        },
      },
    ],
    ApplicableType: [{ type: String, enum: ["counselling", "tool"] }],
    isActive: {
      type: Boolean,
      default: true,
    },
    expiryDate: {
      type: Date,
      default: null, // optional field; will be null if not provided
    },
  },
  { timestamps: true }
);

export const coupon_Schema = mongoose.model("Coupons", CouponSchema);
