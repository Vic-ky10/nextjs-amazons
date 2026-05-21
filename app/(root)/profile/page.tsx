'use client'

import { Button, buttonVariants } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'
import {
  defaultDemoProfile,
  saveDemoProfile,
  useDemoProfile,
} from '@/hooks/use-demo-profile'
import Link from 'next/link'
import { FormEvent } from 'react'
import {
  CheckCircle2,
  Mail,
  MapPin,
  Phone,
  ShoppingBag,
  User,
} from 'lucide-react'

export default function ProfilePage() {
  const { profile, setProfile, isConnected } = useDemoProfile()
  const { toast } = useToast()

  const updateProfile = (field: keyof typeof defaultDemoProfile, value: string) => {
    if (field === 'phone') {
      const normalizedPhone = value.startsWith('+91') ? value : `+91 ${value}`
      setProfile((current) => ({ ...current, phone: normalizedPhone }))
      return
    }

    setProfile((current) => ({ ...current, [field]: value }))
  }

  const saveProfile = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    saveDemoProfile(profile)
    toast(
      'Account connected',
      `${profile.name} is now connected to this app.`,
      'success'
    )
  }

  return (
    <div className='grid grid-cols-1 gap-5 lg:grid-cols-3'>
      <Card className='overflow-hidden rounded-xl border-border lg:col-span-2'>
        <CardHeader className='border-b bg-muted/40'>
          <div className='flex items-center gap-3'>
            <div className='flex h-11 w-11 items-center justify-center rounded-full bg-pink-600 text-white'>
              <User className='h-5 w-5' />
            </div>
            <div>
              <CardTitle>Your profile</CardTitle>
              <CardDescription>
                Save your India delivery details to connect this account.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className='p-5'>
          <form onSubmit={saveProfile} className='grid gap-4 sm:grid-cols-2'>
            <label className='space-y-1.5 text-sm font-medium'>
              Full name
              <Input
                required
                placeholder='Full name'
                className='h-10'
                value={profile.name}
                onChange={(event) => updateProfile('name', event.target.value)}
              />
            </label>
            <label className='space-y-1.5 text-sm font-medium'>
              Email address
              <Input
                required
                type='email'
                placeholder='Email address'
                className='h-10'
                value={profile.email}
                onChange={(event) => updateProfile('email', event.target.value)}
              />
            </label>
            <label className='space-y-1.5 text-sm font-medium'>
              Phone number
              <div className='flex overflow-hidden rounded-lg border border-input focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50'>
                <span className='flex h-10 items-center border-r border-input bg-muted px-3 text-sm font-semibold'>
                  +91
                </span>
                <Input
                  type='tel'
                  placeholder='98765 43210'
                  className='h-10 rounded-none border-0 focus-visible:ring-0'
                  value={profile.phone.replace(/^\+91\s*/, '')}
                  onChange={(event) =>
                    updateProfile('phone', `+91 ${event.target.value}`)
                  }
                />
              </div>
            </label>
            <label className='space-y-1.5 text-sm font-medium'>
              Default address
              <Input
                placeholder='Default address'
                className='h-10'
                value={profile.address}
                onChange={(event) =>
                  updateProfile('address', event.target.value)
                }
              />
            </label>
            <div className='sm:col-span-2'>
              <Button type='submit' className='h-10 rounded-full px-5'>
                Save profile
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className='space-y-4'>
        <Card className='rounded-xl border-border'>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <CheckCircle2 className='h-5 w-5 text-green-600' />
              Account summary
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-3 text-sm'>
            <div className='rounded-lg border border-green-200 bg-green-50 p-3 font-medium text-green-800'>
              {isConnected
                ? 'This account is connected for this app.'
                : 'Save your profile to connect this account.'}
            </div>
            <div className='flex gap-3 rounded-lg bg-muted/40 p-3'>
              <User className='mt-0.5 h-4 w-4 text-muted-foreground' />
              <div>
                <div className='font-medium'>Name</div>
                <div className='text-muted-foreground'>{profile.name}</div>
              </div>
            </div>
            <div className='flex gap-3 rounded-lg bg-muted/40 p-3'>
              <Mail className='mt-0.5 h-4 w-4 text-muted-foreground' />
              <div>
                <div className='font-medium'>Email</div>
                <div className='text-muted-foreground'>{profile.email}</div>
              </div>
            </div>
            <div className='flex gap-3 rounded-lg bg-muted/40 p-3'>
              <Phone className='mt-0.5 h-4 w-4 text-muted-foreground' />
              <div>
                <div className='font-medium'>Phone</div>
                <div className='text-muted-foreground'>
                  {profile.phone || '+91'}
                </div>
              </div>
            </div>
            <div className='flex gap-3 rounded-lg bg-muted/40 p-3'>
              <MapPin className='mt-0.5 h-4 w-4 text-muted-foreground' />
              <div>
                <div className='font-medium'>Default delivery</div>
                <div className='text-muted-foreground'>
                  {profile.address || 'No address saved yet'}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className='rounded-xl border-border'>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <ShoppingBag className='h-5 w-5 text-pink-600' />
              Quick links
            </CardTitle>
          </CardHeader>
          <CardContent className='flex flex-col gap-2'>
            <Link
              href='/account'
              className={buttonVariants({
                variant: 'outline',
                className: 'justify-start',
              })}
            >
              Account
            </Link>
            <Link
              href='/cart'
              className={buttonVariants({
                variant: 'outline',
                className: 'justify-start',
              })}
            >
              Shopping cart
            </Link>
            <Link
              href='/checkout'
              className={buttonVariants({
                variant: 'outline',
                className: 'justify-start',
              })}
            >
              Checkout
            </Link>
            <Link
              href='/orders'
              className={buttonVariants({
                variant: 'outline',
                className: 'justify-start',
              })}
            >
              Orders
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
