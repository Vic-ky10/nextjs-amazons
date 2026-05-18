import { buttonVariants } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { CheckCircle2, Clock3, Package, Truck } from 'lucide-react'
import Link from 'next/link'

export const metadata = {
  title: 'Orders',
}

const timeline = [
  {
    label: 'Order Placed',
    detail: 'Payment confirmed and order received',
    time: 'Today, 10:18 AM',
    icon: CheckCircle2,
    status: 'complete',
  },
  {
    label: 'Packed',
    detail: 'Items checked and packed at the seller facility',
    time: 'Today, 1:42 PM',
    icon: Package,
    status: 'complete',
  },
  {
    label: 'Shipped',
    detail: 'Package is moving through the delivery network',
    time: 'Expected tonight',
    icon: Truck,
    status: 'active',
  },
  {
    label: 'Delivered',
    detail: 'Delivery confirmation will appear here',
    time: 'Expected tomorrow',
    icon: CheckCircle2,
    status: 'pending',
  },
]

export default function OrdersPage() {
  return (
    <div className='space-y-4'>
      <Card className='rounded-none'>
        <CardHeader>
          <CardTitle>Your orders</CardTitle>
          <CardDescription>
            Track each order from checkout to delivery.
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-5'>
          <div className='rounded-md border bg-background p-4'>
            <div className='flex flex-col gap-2 border-b pb-4 sm:flex-row sm:items-center sm:justify-between'>
              <div>
                <div className='font-semibold'>Demo order #AMZ-1048</div>
                <div className='text-sm text-muted-foreground'>
                  Estimated delivery: Tomorrow by 8 PM
                </div>
              </div>
              <div className='flex w-fit items-center gap-2 rounded-md bg-pink-600 px-3 py-2 text-sm font-semibold text-white'>
                <Clock3 className='h-4 w-4' />
                In transit
              </div>
            </div>

            <div className='mt-5 grid gap-0 md:grid-cols-4'>
              {timeline.map((step, index) => {
                const Icon = step.icon
                const isComplete = step.status === 'complete'
                const isActive = step.status === 'active'

                return (
                  <div key={step.label} className='relative pb-8 md:pb-0'>
                    {index < timeline.length - 1 && (
                      <div
                        className={cn(
                          'absolute left-5 top-10 h-full w-px md:left-10 md:top-5 md:h-px md:w-full',
                          isComplete ? 'bg-pink-600' : 'bg-border'
                        )}
                      />
                    )}
                    <div className='relative z-10 flex gap-3 md:flex-col md:gap-2'>
                      <div
                        className={cn(
                          'flex h-10 w-10 shrink-0 items-center justify-center rounded-full border bg-background',
                          isComplete && 'border-pink-600 bg-pink-600 text-white',
                          isActive && 'border-pink-600 text-pink-600'
                        )}
                      >
                        <Icon className='h-5 w-5' />
                      </div>
                      <div className='pr-4'>
                        <div className='font-semibold'>{step.label}</div>
                        <div className='text-sm text-muted-foreground'>
                          {step.detail}
                        </div>
                        <div className='mt-1 text-xs font-medium text-pink-600'>
                          {step.time}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className='flex flex-col gap-3 sm:flex-row'>
            <Link href='/' className={buttonVariants()}>
              Continue shopping
            </Link>
            <Link
              href='/cart'
              className={buttonVariants({ variant: 'outline' })}
            >
              View cart
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
