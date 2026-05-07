'use client'

import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/components/ui/use-toast'
import useCartStore from '@/hooks/use-cart-store'
import { OrderItem } from '@/types'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function AddToCart({
  item,
  minimal = false,
}: {
  item: OrderItem
  minimal?: boolean
}) {
  const router = useRouter()
  const { toast } = useToast()

  const { addItem } = useCartStore()

  const [quantity, setQuantity] = useState(1)

  return minimal ? (
    <Button
      className='rounded-full w-auto'
      onClick={async () => {
        try {
          await addItem(item, 1)
          toast('Added to cart', `${item.name} is now in your cart.`, 'success')
        } catch (error) {
          toast(
            'Could not add item',
            error instanceof Error ? error.message : 'Please try again.',
            'error'
          )
        }
      }}
    >
      Add to Cart
    </Button>
  ) : (
    <div className='w-full space-y-2'>
      <Select
        value={quantity.toString()}
        onValueChange={(i) => setQuantity(Number(i))}
      >
        <SelectTrigger className=''>
          <SelectValue>Quantity: {quantity}</SelectValue>
        </SelectTrigger>
        <SelectContent side='bottom' align='start'>
          {Array.from({ length: item.countInStock }).map((_, i) => (
            <SelectItem key={i + 1} value={`${i + 1}`}>
              {i + 1}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button
        className='rounded-full w-full'
        type='button'
        onClick={async () => {
          try {
            const itemId = await addItem(item, quantity)
            toast('Added to cart', `${item.name} is now in your cart.`, 'success')
            router.push(`/cart/${itemId}`)
          } catch (error) {
            toast(
              'Could not add item',
              error instanceof Error ? error.message : 'Please try again.',
              'error'
            )
          }
        }}
      >
        Add to Cart
      </Button>
      <Button
        variant='secondary'
        onClick={async () => {
          try {
            await addItem(item, quantity)
            toast('Added to cart', `${item.name} is ready for checkout.`, 'success')
            router.push(`/checkout`)
          } catch (error) {
            toast(
              'Could not add item',
              error instanceof Error ? error.message : 'Please try again.',
              'error'
            )
          }
        }}
        className='w-full rounded-full '
      >
        Buy Now
      </Button>
    </div>
  )
}
