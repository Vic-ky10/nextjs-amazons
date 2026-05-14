"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { createCoupon } from "@/lib/actions/admin/coupon.action";
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import React, { useTransition } from "react";
import { useToast } from '@/components/ui/use-toast'

export default function CreateCouponPage() {
  const [isPending, startTransition] = useTransition();
  // using toasts for all messages
  const { toast } = useToast();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    startTransition(async () => {
      // normalize and validate
      const code = String(formData.get("code") || "").trim();
      const type = (formData.get("type") as string) || "percentage";
      const discount = Number(formData.get("discount") || 0);
      const minOrderAmount = Number(formData.get("minOrderAmount") || 0);
      const expiryDate = String(formData.get("expiryDate") || "").trim();

      if (!code) {
        toast('Validation error', 'Coupon code is required', 'error');
        return;
      }

      if (discount <= 0) {
        toast('Validation error', 'Discount must be greater than 0', 'error');
        return;
      }

      // expiry date must be in the future
      if (expiryDate) {
        const selected = new Date(expiryDate);
        const now = new Date();
        // clear time on now for comparison to allow same-day expiry if time is later
        if (selected <= now) {
          toast('Validation error', 'Expiry date must be in the future', 'error');
          return;
        }
      }

      const result = await createCoupon({
        code,
        type: type as 'percentage' | 'fixed',
        discount,
        minOrderAmount,
        expiryDate,
      });

      // show result via toasts only
      if (result.success) {
        toast('Coupon created', result.message || 'Coupon created successfully', 'success');
        form.reset();
      } else {
        toast('Failed', result.message || 'Failed to create coupon', 'error');
      }
    });
  }

  return (
    <div className="max-w-2xl mx-auto py-10">
      <Card className="rounded-2xl">
        <CardHeader>
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold">Create Coupon</h1>
            <p className="text-sm text-muted-foreground">Create a discount coupon for customers.</p>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="col-span-1">
                <label className="block text-sm font-medium mb-1">Coupon code</label>
                <Input name="code" placeholder="SAVE20" required className="focus-visible:ring-2 focus-visible:ring-ring/10 focus-visible:border-ring" />
             
              </div>

              <div className="col-span-1">
                <label className="block text-sm font-medium mb-1">Type</label>
                <select
                  name="type"
                  required
                  className="w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-base focus-visible:ring-2 focus-visible:ring-ring/10 focus-visible:border-ring"
                >
                  <option value="percentage">Percentage</option>
                  <option value="fixed">Fixed</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Discount</label>
                <Input name="discount" type="number" placeholder="20" required className="focus-visible:ring-2 focus-visible:ring-ring/10 focus-visible:border-ring" />
            
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Minimum order</label>
                <Input name="minOrderAmount" type="number" placeholder="100" 
                className="focus-visible:ring-2 focus-visible:ring-ring/10 focus-visible:border-ring"/>
              
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Expiry date</label>
                <Input name="expiryDate" type="date" required className="focus-visible:ring-2 focus-visible:ring-ring/10 focus-visible:border-ring" />
             
              </div>
            </div>

            {/* messages shown via toast notifications */}

            <div className="pt-2">
              <Button type="submit" disabled={isPending} className="w-full rounded-lg h-11 text-base">
                {isPending ? "Creating..." : "Create Coupon"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

// <form onSubmit={handleSubmit} className="space-y-4">
//   <Input name="code" placeholder="Coupon code" required />

//   <select name="type" required>
//     <option value="percentage"> Percentage</option>
//     <option value="fixed"> Fixed</option>
//   </select>

//   <Input name="discount " type="number" placeholder="Discount" required />
//   <Input
//     name="minOrderAmounnt "
//     type="number"
//     placeholder="Minimum order "
//   />
//   <Input name="expiryDate" type="date" required />

//   {message && <p> {message}</p>}

//   <Button type="submit" disabled={isPending}>
//     {isPending ? "Creating.." : "Create Coupon"}
//   </Button>

// </form>
