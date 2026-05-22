import { buttonVariants } from '@/components/ui/button'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { APP_NAME } from '@/lib/constants'
import { cn } from '@/lib/utils'
import {
  ArrowRight,
  Check,
  CreditCard,
  Home,
  MapPin,
  PackageCheck,
  ShoppingCart,
  UserRound,
} from 'lucide-react'
import Link from 'next/link'

export const metadata = {
  title: 'Account',
}

const accountLinks = [
  {
    title: 'Profile',
    description: 'Edit your name, email, phone, and delivery address.',
    href: '/profile',
    action: 'Manage profile',
    icon: UserRound,
    accent: 'bg-pink-50 text-pink-700 ring-pink-100',
  },
  {
    title: 'Orders',
    description: 'Check your order history and delivery status.',
    href: '/orders',
    action: 'Track orders',
    icon: PackageCheck,
    accent: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
  },
  {
    title: 'Cart',
    description: 'Review saved cart items before checkout.',
    href: '/cart',
    action: 'View cart',
    icon: ShoppingCart,
    accent: 'bg-amber-50 text-amber-700 ring-amber-100',
  },
  {
    title: 'Checkout',
    description: 'Enter shipping details and place your order.',
    href: '/checkout',
    action: 'Start checkout',
    icon: CreditCard,
    accent: 'bg-sky-50 text-sky-700 ring-sky-100',
  },
]

export default function AccountPage() {
  return (
    <div className='space-y-5'>
      <section className='overflow-hidden rounded-lg border bg-card'>
        <div className='grid gap-0 lg:grid-cols-[1.35fr_0.65fr]'>
          <div className='space-y-5 p-5 sm:p-6'>
            <div className='flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between'>
              <div className='max-w-2xl'>
                <div className='mb-2 flex w-fit items-center gap-2 rounded-full bg-pink-50 px-3 py-1 text-xs font-semibold text-pink-700 ring-1 ring-pink-100'>
                  <Home className='h-3.5 w-3.5' />
                  {APP_NAME} account center
                </div>
                <h1 className='text-3xl font-bold tracking-normal text-foreground'>
                  Your account
                </h1>
                <p className='mt-2 text-sm leading-6 text-muted-foreground sm:text-base'>
                  Manage your {APP_NAME} shopping activity in one place.
                </p>
              </div>
              <Link href='/profile' className={buttonVariants()}>
                Update details
                <ArrowRight className='h-4 w-4' />
              </Link>
            </div>

            <div className='grid gap-3 sm:grid-cols-3'>
              <div className='rounded-lg border bg-background p-4'>
                <div className='text-xs font-medium uppercase text-muted-foreground'>
                  Account status
                </div>
                <div className='mt-1 text-lg font-semibold'>Ready</div>
              </div>
              <div className='rounded-lg border bg-background p-4'>
                <div className='text-xs font-medium uppercase text-muted-foreground'>
                  Saved cart
                </div>
                <div className='mt-1 text-lg font-semibold'>Review items</div>
              </div>
              <div className='rounded-lg border bg-background p-4'>
                <div className='text-xs font-medium uppercase text-muted-foreground'>
                  Delivery
                </div>
                <div className='mt-1 text-lg font-semibold'>Address needed</div>
              </div>
            </div>
          </div>

          <div className='border-t bg-muted/40 p-5 sm:p-6 lg:border-l lg:border-t-0'>
            <div className='flex h-full flex-col justify-between gap-5'>
              <div>
                <div className='flex h-11 w-11 items-center justify-center rounded-lg bg-pink-600 text-white'>
                  <MapPin className='h-5 w-5' />
                </div>
                <h2 className='mt-4 text-base font-semibold'>
                  Complete your delivery profile
                </h2>
                <p className='mt-2 text-sm leading-6 text-muted-foreground'>
                  Add your phone and default address once, then move faster from
                  cart to checkout.
                </p>
              </div>
              <Link
                href='/checkout'
                className={buttonVariants({
                  variant: 'outline',
                  className: 'w-fit bg-background',
                })}
              >
                Continue to checkout
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
        {accountLinks.map((item) => {
          const Icon = item.icon

          return (
            <Card
              key={item.href}
              className='rounded-lg border-border transition-all hover:-translate-y-0.5 hover:border-pink-200 hover:shadow-sm'
            >
              <CardHeader>
                <div
                  className={cn(
                    'mb-2 flex h-11 w-11 items-center justify-center rounded-lg ring-1',
                    item.accent
                  )}
                >
                  <Icon className='h-5 w-5' />
                </div>
                <CardTitle>{item.title}</CardTitle>
                <CardAction>
                  <ArrowRight className='h-4 w-4 text-muted-foreground transition-transform group-hover/card:translate-x-0.5 group-hover/card:text-pink-600' />
                </CardAction>
                <CardDescription>{item.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Link
                  href={item.href}
                  className={buttonVariants({
                    variant: 'outline',
                    className: 'w-full justify-between',
                  })}
                >
                  {item.action}
                  <ArrowRight className='h-4 w-4' />
                </Link>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Card className='rounded-lg border-border'>
        <CardHeader>
          <CardTitle>Quick account checklist</CardTitle>
          <CardDescription>
            Keep these details current for smoother shopping and delivery.
          </CardDescription>
        </CardHeader>
        <CardContent className='grid gap-3 sm:grid-cols-3'>
          {[
            'Confirm your profile details',
            'Review saved cart items',
            'Track your latest order status',
          ].map((item) => (
            <div
              key={item}
              className='flex items-center gap-3 rounded-lg border bg-background p-3 text-sm font-medium'
            >
              <span className='flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-pink-50 text-xs font-semibold text-pink-700 ring-1 ring-pink-100'>
                <Check className='h-4 w-4' />
              </span>
              {item}
            </div>
          ))}
        </CardContent>
        <CardFooter className='justify-between gap-3 rounded-b-lg'>
          <p className='text-sm text-muted-foreground'>
            Everything important is one click away.
          </p>
          <Link href='/' className={buttonVariants({ variant: 'link' })}>
            Continue shopping
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
