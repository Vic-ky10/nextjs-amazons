import { Schema, model, models } from "mongoose"

export interface ICoupon {
  code: string

  type: "percentage" | "fixed"

  discount: number

  minOrderAmount: number

  expiryDate: Date

  isActive: boolean
}

const couponSchema = new Schema<ICoupon>(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
    },

    type: {
      type: String,
      enum: ["percentage", "fixed"],
      required: true,
    },

    discount: {
      type: Number,
      required: true,
    },

    minOrderAmount: {
      type: Number,
      default: 0,
    },

    expiryDate: {
      type: Date,
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
)

const Coupon =
  models.Coupon ||
  model<ICoupon>("Coupon", couponSchema)

export default Coupon