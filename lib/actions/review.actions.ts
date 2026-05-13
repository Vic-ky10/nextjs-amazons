'use server'

import { revalidatePath } from 'next/cache'
import { Types } from 'mongoose'

import { connectToDatabase } from '@/lib/db'
import Product from '@/lib/db/models/product.model'
import Review from '@/lib/db/models/review.model'
import { ReviewInputSchema } from '@/lib/validator'

export type ReviewActionState = {
  success: boolean
  message: string
}

export type ReviewListItem = {
  _id: string
  reviewerName: string
  reviewerEmail: string
  rating: number
  title: string
  comment: string
  createdAt: string
  updatedAt: string
}

const defaultReviewState: ReviewActionState = {
  success: false,
  message: '',
}

async function updateProductReviewStats(productId: string) {
  const reviews = await Review.find({ product: productId })

  const numReviews = reviews.length
  const avgRating =
    numReviews === 0
      ? 0
      : reviews.reduce((sum, review) => sum + review.rating, 0) / numReviews

  const ratingDistribution = [5, 4, 3, 2, 1].map((rating) => ({
    rating,
    count: reviews.filter((review) => review.rating === rating).length,
  }))

  await Product.findByIdAndUpdate(productId, {
    avgRating,
    numReviews,
    ratingDistribution,
    reviews: reviews.map((review) => review._id),
  })
}

export async function createOrUpdateReview(
  _prevState: ReviewActionState = defaultReviewState,
  formData: FormData
): Promise<ReviewActionState> {
  void _prevState

  const parsed = ReviewInputSchema.safeParse({
    productId: formData.get('productId'),
    slug: formData.get('slug'),
    reviewerName: formData.get('reviewerName'),
    reviewerEmail: formData.get('reviewerEmail'),
    rating: formData.get('rating'),
    title: formData.get('title'),
    comment: formData.get('comment'),
  })

  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message || 'Invalid review',
    }
  }

  const data = parsed.data

  if (!Types.ObjectId.isValid(data.productId)) {
    return {
      success: false,
      message: 'Invalid product',
    }
  }

  await connectToDatabase()

  const product = await Product.findById(data.productId)
  if (!product) {
    return {
      success: false,
      message: 'Product not found',
    }
  }

  const reviewerEmail = data.reviewerEmail.toLowerCase()
  const existingReview = await Review.findOne({
    product: data.productId,
    reviewerEmail,
  })

  if (existingReview) {
    existingReview.reviewerName = data.reviewerName
    existingReview.rating = data.rating
    existingReview.title = data.title
    existingReview.comment = data.comment
    await existingReview.save()
  } else {
    await Review.create({
      product: data.productId,
      reviewerName: data.reviewerName,
      reviewerEmail,
      rating: data.rating,
      title: data.title,
      comment: data.comment,
    })
  }

  await updateProductReviewStats(data.productId)
  revalidatePath(`/product/${data.slug}`)

  return {
    success: true,
    message: existingReview ? 'Review updated' : 'Review added',
  }
}

export async function getReviewsByProductId(productId: string) {
  await connectToDatabase()

  const reviews = await Review.find({ product: productId }).sort({
    updatedAt: 'desc',
  })

  return JSON.parse(JSON.stringify(reviews)) as ReviewListItem[]
}
