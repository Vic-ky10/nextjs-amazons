'use client'

import { useActionState, useState } from 'react'
import { Star } from 'lucide-react'

import {
  createOrUpdateReview,
  ReviewActionState,
  ReviewListItem,
} from '@/lib/actions/review.actions'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import Rating from './rating'
import { useDemoProfile } from '@/hooks/use-demo-profile'

type EditableReview = {
  rating: number
  title: string
  comment: string
}

const initialState: ReviewActionState = {
  success: false,
  message: '',
}

const REVIEW_DATE_FORMATTER = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  timeZone: 'UTC',
})

export default function ProductReviews({
  productId,
  slug,
  reviews,
}: {
  productId: string
  slug: string
  reviews: ReviewListItem[]
}) {
  const { profile } = useDemoProfile()
  const [state, formAction, isPending] = useActionState(
    createOrUpdateReview,
    initialState
  )
  const [rating, setRating] = useState(5)
  const [reviewerName, setReviewerName] = useState(profile.name)
  const [reviewerEmail, setReviewerEmail] = useState(profile.email)
  const [title, setTitle] = useState('')
  const [comment, setComment] = useState('')

  const startEdit = (review: EditableReview) => {
    setRating(review.rating)
    setTitle(review.title)
    setComment(review.comment)
  }

  return (
    <section className="mt-10 space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold">Customer reviews</h2>
          <p className="text-sm text-muted-foreground">
            {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[360px_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Write a review</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={formAction} className="space-y-3">
              <input type="hidden" name="productId" value={productId} />
              <input type="hidden" name="slug" value={slug} />
              <input type="hidden" name="rating" value={rating} />

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1">
                <Input
                  name="reviewerName"
                  value={reviewerName}
                  onChange={(event) => setReviewerName(event.target.value)}
                  placeholder="Your name"
                  required
                />
                <Input
                  name="reviewerEmail"
                  type="email"
                  value={reviewerEmail}
                  onChange={(event) => setReviewerEmail(event.target.value)}
                  placeholder="Your email"
                  required
                />
              </div>

              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setRating(value)}
                    className="rounded-md p-1 text-primary hover:bg-muted"
                    aria-label={`${value} star rating`}
                  >
                    <Star
                      className={`h-6 w-6 ${
                        value <= rating ? 'fill-primary' : ''
                      }`}
                    />
                  </button>
                ))}
              </div>

              <Input
                name="title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Review title"
                required
              />

              <textarea
                name="comment"
                value={comment}
                onChange={(event) => setComment(event.target.value)}
                placeholder="What did you like or dislike?"
                required
                className="min-h-28 w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              />

              {state.message && (
                <p
                  className={`text-sm ${
                    state.success ? 'text-green-700' : 'text-destructive'
                  }`}
                >
                  {state.message}
                </p>
              )}

              <Button type="submit" disabled={isPending}>
                {isPending ? 'Saving...' : 'Submit review'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-3">
          {reviews.length === 0 ? (
            <Card>
              <CardContent className="py-6 text-muted-foreground">
                No reviews yet.
              </CardContent>
            </Card>
          ) : (
            reviews.map((review) => (
              <Card key={review._id}>
                <CardContent className="space-y-2 py-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <div className="font-medium">{review.title}</div>
                      <div className="text-sm text-muted-foreground">
                        {review.reviewerName}
                      </div>
                    </div>
                    <Rating rating={review.rating} size={4} />
                  </div>
                  <p className="text-sm leading-6">{review.comment}</p>
                  <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
                    <span>
                      {REVIEW_DATE_FORMATTER.format(new Date(review.updatedAt))}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => startEdit(review)}
                    >
                      Edit
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </section>
  )
}
