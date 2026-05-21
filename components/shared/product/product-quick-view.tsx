'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Eye, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

import { Button, buttonVariants } from '@/components/ui/button'
import type { IProduct } from '@/lib/db/models/product.model'
import { cn, formatNumber, generateId, round2 } from '@/lib/utils'

import AddToCart from './add-to-cart'
import ProductPrice from './product-price'
import Rating from './rating'

export default function ProductQuickView({ product }: { product: IProduct }) {
  const [open, setOpen] = useState(false)
  const primaryImage = product.images[0]

  useEffect(() => {
    if (!open) return

    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }

    window.addEventListener('keydown', closeOnEscape)

    return () => {
      document.body.style.overflow = originalOverflow
      window.removeEventListener('keydown', closeOnEscape)
    }
  }, [open])

  const modal =
    open && typeof document !== 'undefined'
      ? createPortal(
          <div
            className='fixed inset-0 z-[100] flex items-center justify-center bg-black/65 p-3 backdrop-blur-sm sm:p-4'
            role='dialog'
            aria-modal='true'
            aria-label={`Quick view for ${product.name}`}
            onClick={() => setOpen(false)}
          >
            <div
              className='grid max-h-[92vh] w-full max-w-4xl overflow-hidden rounded-lg bg-background shadow-2xl'
              onClick={(event) => event.stopPropagation()}
            >
              <div className='flex items-start justify-between gap-4 border-b p-4'>
                <div className='min-w-0'>
                  <p className='text-sm font-semibold uppercase tracking-wide text-pink-600'>
                    Quick view
                  </p>
                  <h3 className='line-clamp-2 text-lg font-bold sm:line-clamp-1'>
                    {product.name}
                  </h3>
                </div>
                <Button
                  type='button'
                  variant='ghost'
                  size='icon'
                  className='shrink-0'
                  onClick={() => setOpen(false)}
                  aria-label='Close quick view'
                >
                  <X className='h-5 w-5' />
                </Button>
              </div>

              <div className='grid max-h-[calc(92vh-73px)] gap-5 overflow-y-auto p-4 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] md:p-6'>
                <div className='relative aspect-square min-h-64 overflow-hidden rounded-md bg-muted/40'>
                  <Image
                    src={primaryImage}
                    alt={product.name}
                    fill
                    sizes='(min-width: 768px) 40vw, 90vw'
                    className='object-contain p-4'
                  />
                </div>

                <div className='flex min-w-0 flex-col gap-4'>
                  <div>
                    <div className='flex flex-wrap items-center gap-2 text-sm text-muted-foreground'>
                      <span className='font-semibold text-foreground'>
                        {product.brand}
                      </span>
                      <span>-</span>
                      <span>{product.category}</span>
                      <span
                        className={cn(
                          'rounded-sm px-2 py-0.5 text-xs font-semibold',
                          product.countInStock > 0
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-muted text-muted-foreground'
                        )}
                      >
                        {product.countInStock > 0 ? 'In stock' : 'Sold out'}
                      </span>
                    </div>
                    <h4 className='mt-2 text-2xl font-bold leading-tight'>
                      {product.name}
                    </h4>
                  </div>

                  <div className='flex flex-wrap items-center gap-2'>
                    <Rating rating={product.avgRating} />
                    <span className='text-sm text-muted-foreground'>
                      {formatNumber(product.numReviews)} reviews
                    </span>
                  </div>

                  <ProductPrice
                    price={product.price}
                    listPrice={product.listPrice}
                    isDeal={product.tags.includes('todays-deal')}
                  />

                  {product.description && (
                    <p className='text-sm leading-6 text-muted-foreground'>
                      {product.description}
                    </p>
                  )}

                  <div className='grid gap-3 text-sm sm:grid-cols-2'>
                    <div>
                      <p className='font-semibold'>Colors</p>
                      <div className='mt-2 flex flex-wrap gap-2'>
                        {product.colors.map((color) => (
                          <span
                            key={color}
                            className='rounded-sm border px-2 py-1 text-muted-foreground'
                          >
                            {color}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className='font-semibold'>Sizes</p>
                      <div className='mt-2 flex flex-wrap gap-2'>
                        {product.sizes.map((size) => (
                          <span
                            key={size}
                            className='rounded-sm border px-2 py-1 text-muted-foreground'
                          >
                            {size}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className='mt-auto flex flex-col gap-3 sm:flex-row'>
                    <AddToCart
                      item={{
                        clientId: generateId(),
                        product: product._id.toString(),
                        size: product.sizes[0],
                        color: product.colors[0],
                        countInStock: product.countInStock,
                        name: product.name,
                        slug: product.slug,
                        category: product.category,
                        price: round2(product.price),
                        quantity: 1,
                        image: primaryImage,
                      }}
                    />
                    <Link
                      href={`/product/${product.slug}`}
                      className={cn(
                        buttonVariants({ variant: 'outline' }),
                        'h-9'
                      )}
                      onClick={() => setOpen(false)}
                    >
                      View full details
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )
      : null

  return (
    <>
      <Button
        type='button'
        variant='secondary'
        size='sm'
        className='shadow-sm'
        onClick={(event) => {
          event.preventDefault()
          event.stopPropagation()
          setOpen(true)
        }}
        aria-label={`Quick view ${product.name}`}
      >
        <Eye className='h-4 w-4' />
        Quick view
      </Button>
      {modal}
    </>
  )
}
