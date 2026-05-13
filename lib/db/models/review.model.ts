import { Document, Model, Schema, Types, model, models } from 'mongoose'

export interface IReview extends Document {
  product: Types.ObjectId
  reviewerName: string
  reviewerEmail: string
  rating: number
  title: string
  comment: string
  createdAt: Date
  updatedAt: Date
}

const reviewSchema = new Schema<IReview>(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
      index: true,
    },
    reviewerName: {
      type: String,
      required: true,
      trim: true,
    },
    reviewerEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    comment: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
)

reviewSchema.index({ product: 1, reviewerEmail: 1 }, { unique: true })

const Review =
  (models.Review as Model<IReview>) || model<IReview>('Review', reviewSchema)

export default Review
