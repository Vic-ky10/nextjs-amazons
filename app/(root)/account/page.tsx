import { buttonVariants } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { APP_NAME } from '@/lib/constants'
import Link from 'next/link'

export const metadata = {
  title: 'Account',
}

const accountLinks = [
  {
    title: 'Profile',
    description: 'Edit your name, email, phone, and delivery address.',
    href: '/profile',
  },
  {
    title: 'Orders',
    description: 'Check your order history and delivery status.',
    href: '/orders',
  },
  {
    title: 'Cart',
    description: 'Review saved cart items before checkout.',
    href: '/cart',
  },
  {
    title: 'Checkout',
    description: 'Enter shipping details and place your order.',
    href: '/checkout',
  },
]

export default function AccountPage() {
  return (
    <div className='space-y-4'>
      <div>
        <h1 className='text-2xl font-bold'>Your account</h1>
        <p className='text-muted-foreground'>
          Manage your {APP_NAME} shopping activity in one place.
        </p>
      </div>

      <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
        {accountLinks.map((item) => (
          <Card key={item.href} className='rounded-none'>
            <CardHeader>
              <CardTitle>{item.title}</CardTitle>
              <CardDescription>{item.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Link
                href={item.href}
                className={buttonVariants({ variant: 'outline' })}
              >
                Open {item.title}
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
