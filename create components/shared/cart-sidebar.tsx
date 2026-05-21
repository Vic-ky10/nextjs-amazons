'use client'

import useCartStore from '@/hooks/use-cart-store'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import React from 'react'

import Image from 'next/image'

import { ChevronRight, TrashIcon } from 'lucide-react'

import { FREE_SHIPPING_MIN_PRICE } from '@/lib/constants'
import ProductPrice from '@/components/shared/product/product-price'
import { Button, buttonVariants } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useCartSidebarControls } from '@/create hooks/use-cart-sidebar'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export default function CartSidebar() {
  const {
    cart: { items, itemsPrice },
    updateItem,
    removeItem,
  } = useCartStore()
  const { closeCartSidebar } = useCartSidebarControls()

  return (
    <aside className='hidden w-72 shrink-0 xl:block'>
      <div className='fixed right-0 top-0 z-40 flex h-screen w-72 flex-col border-l border-border bg-background/95 shadow-xl backdrop-blur'>
        <div className='border-b border-border p-4'>
          <div className='space-y-3'>
            <div className='flex items-start justify-between gap-3'>
              <div>
                <div className='text-xs font-medium uppercase text-muted-foreground'>
                  Cart subtotal
                </div>
                <div className='mt-1 text-2xl font-bold'>
                  <ProductPrice price={itemsPrice} plain />
                </div>
              </div>
              <Button
                type='button'
                variant='outline'
                size='icon-sm'
                onClick={closeCartSidebar}
                aria-label='Close side cart'
                title='Close side cart'
              >
                <ChevronRight className='h-4 w-4' />
              </Button>
            </div>
            {itemsPrice > FREE_SHIPPING_MIN_PRICE && (
              <div className='rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-xs font-medium text-green-800'>
                Your order qualifies for FREE Shipping
              </div>
            )}

            <Link
              className={cn(
                buttonVariants({ variant: 'outline' }),
                'h-9 w-full rounded-full hover:no-underline'
              )}
              href='/cart'
            >
              Go to Cart
            </Link>
          </div>
        </div>

        <ScrollArea className='min-h-0 flex-1'>
          <div className='space-y-3 p-3'>
            {items.map((item) => (
              <div
                key={item.clientId}
                className='rounded-lg border border-border bg-card p-3 shadow-sm'
              >
                <div className='flex gap-3'>
                  <Link
                    href={`/product/${item.slug}`}
                    className='relative h-20 w-20 shrink-0 rounded-md bg-muted'
                    aria-label={item.name}
                  >
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes='80px'
                      className='object-contain p-1'
                    />
                  </Link>
                  <div className='min-w-0 flex-1 space-y-2'>
                    <Link
                      href={`/product/${item.slug}`}
                      className='line-clamp-2 text-sm font-medium hover:underline'
                    >
                      {item.name}
                    </Link>
                    <div className='text-sm font-bold'>
                      <ProductPrice price={item.price} plain />
                    </div>
                  </div>
                </div>
                <div className='mt-3 flex items-center justify-between gap-2'>
                  <Select
                    value={item.quantity.toString()}
                    onValueChange={(value) => {
                      updateItem(item, Number(value))
                    }}
                  >
                    <SelectTrigger className='h-8 w-20 text-xs'>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: item.countInStock }).map((_, i) => (
                        <SelectItem value={(i + 1).toString()} key={i + 1}>
                          {i + 1}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    variant={'outline'}
                    size={'icon-sm'}
                    onClick={() => {
                      removeItem(item)
                    }}
                    aria-label={`Remove ${item.name}`}
                  >
                    <TrashIcon className='h-4 w-4' />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className='border-t border-border p-3 text-center text-xs text-muted-foreground'>
          {items.length} item{items.length === 1 ? '' : 's'} in your cart
        </div>
      </div>
    </aside>
  )
}
