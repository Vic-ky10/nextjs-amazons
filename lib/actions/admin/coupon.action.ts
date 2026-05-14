"use server"

import { connectToDatabase } from "@/lib/db"
import Coupon from "@/lib/db/models/coupon.model"


type CreateCouponParams = {
  code: string
  type: "percentage" | "fixed"
  discount: number
  minOrderAmount: number
  expiryDate: string
}

export async function createCoupon(
  data: CreateCouponParams
) {

 await connectToDatabase()
  // Check existing coupon
  const existingCoupon =
    await Coupon.findOne({
      code: data.code.toUpperCase(),
    })

  if (existingCoupon) {
    return {
      success: false,
      message: "Coupon already exists",
    }
  }

  // Create coupon
  await Coupon.create({
    code: data.code.toUpperCase(),

    type: data.type,

    discount: data.discount,

    minOrderAmount:
      data.minOrderAmount,

    expiryDate: new Date(
      data.expiryDate
    ),

    isActive: true,
  })

  return {
    success: true,
    message: "Coupon created successfully",
  }
}