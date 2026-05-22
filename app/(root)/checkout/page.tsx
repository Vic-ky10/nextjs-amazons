'use client'

import ProductPrice from '@/components/shared/product/product-price'
import { Button, buttonVariants } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { useToast } from '@/components/ui/use-toast'
import { useDemoProfile } from '@/hooks/use-demo-profile'
import useCartStore from '@/hooks/use-cart-store'
import { APP_NAME } from '@/lib/constants'
import {
  Building2,
  CheckCircle2Icon,
  Home,
  MapPin,
  Phone,
  UserRound,
  XIcon,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { FormEvent, useState } from 'react'

const emptyShipping = {
  fullName: '',
  phone: '',
  address: '',
  city: '',
  postalCode: '',
}

export default function CheckoutPage() {
  const [shipping, setShipping] = useState(emptyShipping)
  const [orderCompleted, setOrderCompleted] = useState(false)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const { profile, isConnected } = useDemoProfile()
  const { toast } = useToast()
  const {
    cart: { items, itemsPrice, shippingPrice, taxPrice, totalPrice },
  } = useCartStore()

  const resolvedShipping = {
    ...shipping,
    fullName: shipping.fullName || (isConnected ? profile.name : ''),
    phone: shipping.phone || (isConnected ? profile.phone : ''),
    address: shipping.address || (isConnected ? profile.address : ''),
  }

  const updateShipping = (field: keyof typeof emptyShipping, value: string) => {
    setShipping((current) => ({ ...current, [field]: value }))
    setOrderCompleted(false)
    setIsConfirmOpen(false)
  }

  const useSavedProfile = () => {
    setShipping((current) => ({
      ...current,
      fullName: profile.name,
      phone: profile.phone,
      address: profile.address,
    }))
    setOrderCompleted(false)
    setIsConfirmOpen(false)
  }

  const handlePlaceOrder = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const hasMissingField = Object.values(resolvedShipping).some(
      (value) => !value.trim()
    )

    if (hasMissingField) {
      toast(
        'Shipping details missing',
        'Please fill name, phone number, address, city, and postal code.',
        'warning'
      )
      return
    }

    setIsConfirmOpen(true)
  }

  const completeOrder = () => {
    setIsConfirmOpen(false)
    setOrderCompleted(true)
    toast(
      'Order placed',
      `Delivery to ${resolvedShipping.address}, ${resolvedShipping.city} - ${resolvedShipping.postalCode}.`,
      'success'
    )
  }

  if (items.length === 0) {
    return (
      <Card className='rounded-none'>
        <CardHeader>
          <CardTitle>Your cart is empty</CardTitle>
          <CardDescription>
            Add products before starting checkout.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link
            href='/'
            className={buttonVariants({ className: 'rounded-full' })}
          >
            Continue shopping on {APP_NAME}
          </Link>
        </CardContent>
      </Card>
    )
  }

  return (
    <form
      onSubmit={handlePlaceOrder}
      className='grid grid-cols-1 gap-4 lg:grid-cols-3'
    >
      <div className='space-y-4 lg:col-span-2'>
        <Card className='overflow-hidden rounded-lg border-border'>
          <CardHeader className='border-b bg-muted/40'>
            <div className='flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between'>
              <div className='flex gap-3'>
                <div className='flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-pink-600 text-white'>
                  <MapPin className='h-5 w-5' />
                </div>
                <div>
                  <CardTitle>Shipping details</CardTitle>
                  <CardDescription>
                    Enter where this order should be delivered.
                  </CardDescription>
                </div>
              </div>
              <div className='flex items-center gap-2'>
                {isConnected && (
                  <div className='rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-semibold text-green-800'>
                    Profile connected
                  </div>
                )}
                {isConnected && (
                  <Button
                    type='button'
                    variant='outline'
                    size='sm'
                    onClick={useSavedProfile}
                  >
                    Use saved
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className='space-y-5 p-5'>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
              <label className='space-y-1.5 text-sm font-medium'>
                Full name
                <div className='relative'>
                  <UserRound className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
                  <Input
                    required
                    className='h-10 pl-9'
                    placeholder='Full name'
                    value={resolvedShipping.fullName}
                    onChange={(event) =>
                      updateShipping('fullName', event.target.value)
                    }
                  />
                </div>
              </label>
              <label className='space-y-1.5 text-sm font-medium'>
                Phone number
                <div className='relative'>
                  <Phone className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
                  <Input
                    required
                    type='tel'
                    className='h-10 pl-9'
                    placeholder='Phone number'
                    value={resolvedShipping.phone}
                    onChange={(event) =>
                      updateShipping('phone', event.target.value)
                    }
                  />
                </div>
              </label>
              <label className='space-y-1.5 text-sm font-medium md:col-span-2'>
                Address line
                <div className='relative'>
                  <Home className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
                  <Input
                    required
                    className='h-10 pl-9'
                    placeholder='House number, street, area'
                    value={resolvedShipping.address}
                    onChange={(event) =>
                      updateShipping('address', event.target.value)
                    }
                  />
                </div>
              </label>
              <label className='space-y-1.5 text-sm font-medium'>
                City
                <div className='relative'>
                  <Building2 className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
                  <Input
                    required
                    className='h-10 pl-9'
                    placeholder='City'
                    value={shipping.city}
                    onChange={(event) =>
                      updateShipping('city', event.target.value)
                    }
                  />
                </div>
              </label>
              <label className='space-y-1.5 text-sm font-medium'>
                Postal code
                <div className='relative'>
                  <MapPin className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
                  <Input
                    required
                    className='h-10 pl-9'
                    placeholder='Postal code'
                    value={shipping.postalCode}
                    onChange={(event) =>
                      updateShipping('postalCode', event.target.value)
                    }
                  />
                </div>
              </label>
            </div>

            <div className='grid gap-3 rounded-lg border bg-background p-3 text-sm sm:grid-cols-3'>
              <div>
                <div className='text-xs font-medium uppercase text-muted-foreground'>
                  Delivery type
                </div>
                <div className='mt-1 font-semibold'>Standard</div>
              </div>
              <div>
                <div className='text-xs font-medium uppercase text-muted-foreground'>
                  Payment
                </div>
                <div className='mt-1 font-semibold'>Pay on delivery</div>
              </div>
              <div>
                <div className='text-xs font-medium uppercase text-muted-foreground'>
                  Contact
                </div>
                <div className='mt-1 font-semibold'>Phone required</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className='rounded-none'>
          <CardHeader>
            <CardTitle>Items</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            {items.map((item) => (
              <div
                key={item.clientId}
                className='flex items-center gap-4 border-b pb-4 last:border-b-0 last:pb-0'
              >
                <div className='relative h-20 w-20 shrink-0'>
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes='80px'
                    className='object-contain'
                  />
                </div>
                <div className='flex-1'>
                  <Link href={`/product/${item.slug}`} className='font-medium'>
                    {item.name}
                  </Link>
                  <div className='text-sm text-muted-foreground'>
                    Qty {item.quantity} - {item.color || 'Default'} -{' '}
                    {item.size || 'Default'}
                  </div>
                </div>
                <ProductPrice price={item.price * item.quantity} plain />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className='h-fit rounded-none'>
        <CardHeader>
          <CardTitle>Order summary</CardTitle>
        </CardHeader>
        <CardContent className='space-y-3'>
          <div className='flex justify-between'>
            <span>Items</span>
            <ProductPrice price={itemsPrice} plain />
          </div>
          <div className='flex justify-between'>
            <span>Shipping</span>
            <ProductPrice price={shippingPrice ?? 0} plain />
          </div>
          <div className='flex justify-between'>
            <span>Tax</span>
            <ProductPrice price={taxPrice ?? 0} plain />
          </div>
          <Separator />
          <div className='flex justify-between text-lg font-bold'>
            <span>Total</span>
            <ProductPrice price={totalPrice || itemsPrice} plain />
          </div>
          {orderCompleted && (
            <div className='space-y-1 rounded-lg border border-green-600 bg-green-50 p-3 text-sm text-green-800'>
              <div className='flex items-center gap-2 font-semibold'>
                <CheckCircle2Icon className='h-4 w-4' />
                Order completed
              </div>
              <div>
                Delivery for {resolvedShipping.fullName} at{' '}
                {resolvedShipping.address}, {resolvedShipping.city} -{' '}
                {resolvedShipping.postalCode}.
              </div>
            </div>
          )}
          <Button type='submit' className='w-full rounded-full'>
            Place order now
          </Button>
        </CardContent>
      </Card>
      {isConfirmOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4'>
          <div className='w-full max-w-md rounded-lg bg-background p-5 text-foreground shadow-xl'>
            <div className='flex items-start justify-between gap-4'>
              <div>
                <h2 className='text-xl font-bold'>Confirm your order</h2>
                <p className='text-sm text-muted-foreground'>
                  Please check the delivery details before placing the order.
                </p>
              </div>
              <Button
                type='button'
                variant='ghost'
                size='icon'
                onClick={() => setIsConfirmOpen(false)}
              >
                <XIcon className='h-4 w-4' />
              </Button>
            </div>

            <div className='mt-4 space-y-3 rounded-lg border p-4 text-sm'>
              <div>
                <div className='font-medium'>Customer</div>
                <div className='text-muted-foreground'>
                  {resolvedShipping.fullName}
                </div>
              </div>
              <div>
                <div className='font-medium'>Phone</div>
                <div className='text-muted-foreground'>
                  {resolvedShipping.phone}
                </div>
              </div>
              <div>
                <div className='font-medium'>Delivery address</div>
                <div className='text-muted-foreground'>
                  {resolvedShipping.address}, {resolvedShipping.city} -{' '}
                  {resolvedShipping.postalCode}
                </div>
              </div>
              <div className='flex justify-between border-t pt-3 font-bold'>
                <span>Total</span>
                <ProductPrice price={totalPrice || itemsPrice} plain />
              </div>
            </div>

            <div className='mt-5 flex flex-col gap-2 sm:flex-row'>
              <Button
                type='button'
                className='flex-1 rounded-full'
                onClick={completeOrder}
              >
                Confirm and place order
              </Button>
              <Button
                type='button'
                variant='outline'
                className='flex-1 rounded-full'
                onClick={() => setIsConfirmOpen(false)}
              >
                Edit details
              </Button>
            </div>
          </div>
        </div>
      )}
    </form>
  )
}
