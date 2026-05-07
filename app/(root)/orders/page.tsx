import { buttonVariants } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import Link from 'next/link'

export const metadata = {
  title: 'Orders',
}

export default function OrdersPage() {
  return (
    <Card className='rounded-none'>
      <CardHeader>
        <CardTitle>Your orders</CardTitle>
        <CardDescription>
          Order history will appear here after checkout is connected to a real
          order database.
        </CardDescription>
      </CardHeader>
      <CardContent className='flex flex-col gap-3 sm:flex-row'>
        <Link href='/' className={buttonVariants()}>
          Continue shopping
        </Link>
        <Link href='/cart' className={buttonVariants({ variant: 'outline' })}>
          View cart
        </Link>
      </CardContent>
    </Card>
  )
}
