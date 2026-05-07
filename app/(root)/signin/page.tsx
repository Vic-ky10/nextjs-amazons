import { buttonVariants } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { APP_NAME } from '@/lib/constants'
import Link from 'next/link'

export const metadata = {
  title: 'Sign in',
}

export default function SignInPage() {
  return (
    <Card className='mx-auto w-full max-w-md rounded-none'>
      <CardHeader>
        <CardTitle>Sign in</CardTitle>
        <CardDescription>
          Continue to your {APP_NAME} profile and orders.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className='space-y-4'>
          <Input type='email' placeholder='Email address' />
          <Input type='password' placeholder='Password' />
          <Link href='/account' className={buttonVariants({ className: 'w-full' })}>
            Continue
          </Link>
        </form>
        <p className='mt-4 text-center text-sm text-muted-foreground'>
          Demo app: authentication UI only.
        </p>
      </CardContent>
    </Card>
  )
}
