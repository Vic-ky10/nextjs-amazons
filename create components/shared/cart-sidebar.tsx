"use client";

import useCartStore from "@/hooks/use-cart-store";
import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";

import Image from "next/image";

import { ChevronRight, ShoppingBag, TrashIcon } from "lucide-react";

import { FREE_SHIPPING_MIN_PRICE } from "@/lib/constants";
import ProductPrice from "@/components/shared/product/product-price";
import { Button, buttonVariants } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCartSidebarControls } from "@/create hooks/use-cart-sidebar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function CartSidebar() {
  const {
    cart: { items, itemsPrice },
    updateItem,
    removeItem,
  } = useCartStore();
  const { closeCartSidebar } = useCartSidebarControls();

  return (
    <aside className="hidden w-64 shrink-0 xl:block">
      <div className="fixed right-0 top-0 z-40 flex h-screen w-64 flex-col border-l border-border bg-background/95 shadow-xl backdrop-blur">
        <div className="border-b border-border p-3">
          <div className="space-y-2.5">
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0">
                <div className="text-xs font-medium uppercase text-muted-foreground">
                  Cart subtotal
                </div>
                <div className="mt-0.5 text-xl font-bold leading-tight">
                  <ProductPrice price={itemsPrice} plain />
                </div>
              </div>
              <Button
                type="button"
                variant="outline"
                size="icon-sm"
                onClick={closeCartSidebar}
                aria-label="Close side cart"
                title="Close side cart"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            {itemsPrice > FREE_SHIPPING_MIN_PRICE && (
              <div className="rounded-md border border-green-200 bg-green-50 px-2.5 py-1.5 text-xs font-medium leading-5 text-green-800">
                Your order qualifies for FREE Shipping
              </div>
            )}

            <div className="grid grid-cols-2 gap-2">
              <Link
                className={cn(
                  buttonVariants({ variant: "outline", size: "sm" }),
                  "hover:no-underline",
                )}
                href="/cart"
              >
                Cart
              </Link>
              <Link
                className={cn(
                  buttonVariants({ size: "sm" }),
                  "hover:no-underline",
                )}
                href="/checkout"
              >
                Checkout
              </Link>
            </div>
          </div>
        </div>

        <ScrollArea className="min-h-0 flex-1">
          <div className="space-y-2 p-2.5">
            {items.length === 0 && (
              <div className="rounded-lg border border-dashed p-4 text-center text-sm text-muted-foreground">
                <ShoppingBag className="mx-auto mb-2 h-5 w-5" />
                Your cart is empty
              </div>
            )}
            {items.map((item) => (
              <div
                key={item.clientId}
                className="rounded-lg border border-border bg-card p-2.5 shadow-sm"
              >
                <div className="flex gap-2.5">
                  <Link
                    href={`/product/${item.slug}`}
                    className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md bg-muted"
                    aria-label={item.name}
                  >
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="56px"
                      className="object-contain p-1"
                    />
                  </Link>
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/product/${item.slug}`}
                      className="line-clamp-2 text-xs font-medium leading-5 hover:underline"
                    >
                      {item.name}
                    </Link>
                    <div className="mt-1 flex items-center justify-between gap-2">
                      <div className="text-sm font-bold">
                        <ProductPrice price={item.price} plain />
                      </div>
                      {(item.color || item.size) && (
                        <div className="truncate text-[11px] text-muted-foreground">
                          {[item.color, item.size].filter(Boolean).join(" / ")}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="mt-2 flex items-center justify-between gap-2">
                  <Select
                    value={item.quantity.toString()}
                    onValueChange={(value) => {
                      updateItem(item, Number(value));
                    }}
                  >
                    <SelectTrigger className="h-7 w-16 rounded-md text-xs">
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
                    variant={"outline"}
                    size={"icon-xs"}
                    onClick={() => {
                      removeItem(item);
                    }}
                    aria-label={`Remove ${item.name}`}
                  >
                    <TrashIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="border-t border-border px-3 py-2 text-center text-xs text-muted-foreground">
          {items.length} item{items.length === 1 ? "" : "s"} in cart
        </div>
      </div>
    </aside>
  );
}
