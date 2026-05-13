"use server"

import Coupon from "../db/models/coupon.model"
import { connectToDatabase } from "../db"

type CouponValidationResult =
  | {
      success: false
      message: string
    }
  | {
      success: true
      message: string
      coupon: {
        code: string
        discount: number
        type: "percentage" | "fixed"
      }
      discountAmount: number
      finalTotal: number
    }

export async function validateCoupon(
  code: string,
  cartTotal: number
): Promise<CouponValidationResult> {

  await connectToDatabase()

  // Find coupon
  const coupon = await Coupon.findOne({
    code: code.toUpperCase(),
  })

  // Coupon not found
  if (!coupon) {
    return {
      success: false,
      message: "Invalid coupon code",
    }
  }

  // Coupon inactive
  if (!coupon.isActive) {
    return {
      success: false,
      message: "Coupon is inactive",
    }
  }

  // Coupon expired
  const now = new Date()

  if (coupon.expiryDate < now) {
    return {
      success: false,
      message: "Coupon expired",
    }
  }

  // Minimum order validation
  if (cartTotal < coupon.minOrderAmount) {
    return {
      success: false,
      message: `Minimum order should be $${coupon.minOrderAmount}`,
    }
  }

  // Calculate discount
  let discountAmount = 0

  if (coupon.type === "percentage") {

    discountAmount =
      (cartTotal * coupon.discount) / 100

  } else {

    discountAmount = coupon.discount
  }

  // Prevent negative total
  const finalTotal = Math.max(
    cartTotal - discountAmount,
    0
  )

  return {
    success: true,

    message: "Coupon applied successfully",

    coupon: {
      code: coupon.code,
      discount: coupon.discount,
      type: coupon.type,
    },

    discountAmount,

    finalTotal,
  }
}
