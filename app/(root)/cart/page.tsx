"use client";
import BrowsingHistoryList from "@/components/shared/browsing-history-list";
import ProductPrice from "@/components/shared/product/product-price";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useCartStore from "@/hooks/use-cart-store";
import { APP_NAME, FREE_SHIPPING_MIN_PRICE } from "@/lib/constants";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { validateCoupon } from "@/lib/actions/coupon.actions";
import { CheckCircle2, Tag, XCircle } from "lucide-react";

export default function CartPage() {
  const {
    cart: { items, itemsPrice },
    updateItem,
    removeItem,
  } = useCartStore();
  const router = useRouter();
  const [couponCode, setCouponCode] = React.useState("");

  const [couponLoading, setCouponLoading] = React.useState(false);

  const [couponError, setCouponError] = React.useState("");

  const [discountAmount, setDiscountAmount] = React.useState(0);

  const [finalTotal, setFinalTotal] = React.useState(itemsPrice);

  const [appliedCoupon, setAppliedCoupon] = React.useState("");

  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const hasDiscount = discountAmount > 0;

  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCouponCode("");
    setCouponError("");
    setAppliedCoupon("");
    setDiscountAmount(0);
    setFinalTotal(itemsPrice);
  }, [itemsPrice]);

  const handleApplyCoupon = async (event?: React.FormEvent) => {
    event?.preventDefault();

    const normalizedCode = couponCode.trim();

    if (!normalizedCode) {
      setCouponError("Enter a coupon code first");
      return;
    }

    try {
      setCouponLoading(true);

      setCouponError("");

      const result = await validateCoupon(normalizedCode, itemsPrice);

      if (!result.success) {
        setCouponError(result.message);

        setDiscountAmount(0);

        setFinalTotal(itemsPrice);

        return;
      }

      setAppliedCoupon(result.coupon.code);

      setDiscountAmount(result.discountAmount);

      setFinalTotal(result.finalTotal);
    } catch (e) {
      console.log(e);
      setCouponError("Something went wrong");
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setCouponCode("");
    setCouponError("");
    setAppliedCoupon("");
    setDiscountAmount(0);
    setFinalTotal(itemsPrice);
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-4  md:gap-4">
        {items.length === 0 ? (
          <Card className="col-span-4 rounded-none">
            <CardHeader className="text-3xl  ">
              Your Shopping Cart is empty
            </CardHeader>
            <CardContent>
              Continue shopping on <Link href="/">{APP_NAME}</Link>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="col-span-3">
              <Card className="rounded-none">
                <CardHeader className="text-3xl pb-0">Shopping Cart</CardHeader>
                <CardContent className="p-4">
                  <div className="flex justify-end border-b mb-4">Price</div>

                  {items.map((item) => (
                    <div
                      key={item.clientId}
                      className="flex flex-col md:flex-row justify-between py-4 border-b gap-4"
                    >
                      <Link href={`/product/${item.slug}`}>
                        <div className="relative w-40 h-40">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            sizes="20vw"
                            style={{
                              objectFit: "contain",
                            }}
                          />
                        </div>
                      </Link>

                      <div className="flex-1 space-y-4">
                        <Link
                          href={`/product/${item.slug}`}
                          className="text-lg hover:no-underline  "
                        >
                          {item.name}
                        </Link>
                        <div>
                          <p className="text-sm">
                            <span className="font-bold">Color: </span>{" "}
                            {item.color}
                          </p>
                          <p className="text-sm">
                            <span className="font-bold">Size: </span>{" "}
                            {item.size}
                          </p>
                        </div>
                        <div className="flex gap-2 items-center">
                          <Select
                            value={item.quantity.toString()}
                            onValueChange={(value) =>
                              updateItem(item, Number(value))
                            }
                          >
                            <SelectTrigger className="w-auto">
                              <SelectValue>
                                Quantity: {item.quantity}
                              </SelectValue>
                            </SelectTrigger>
                            <SelectContent side="bottom" align="start">
                              {Array.from({
                                length: item.countInStock,
                              }).map((_, i) => (
                                <SelectItem key={i + 1} value={`${i + 1}`}>
                                  {i + 1}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Button
                            variant={"outline"}
                            onClick={() => removeItem(item)}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                      <div>
                        <p className="text-right">
                          {item.quantity > 1 && (
                            <>
                              {item.quantity} x
                              <ProductPrice price={item.price} plain />
                              <br />
                            </>
                          )}

                          <span className="font-bold text-lg">
                            <ProductPrice
                              price={item.price * item.quantity}
                              plain
                            />
                          </span>
                        </p>
                      </div>
                    </div>
                  ))}

                  <div className="flex justify-end text-lg my-2">
                    Subtotal ({itemCount} Items):{" "}
                    <span className="font-bold ml-1">
                      <ProductPrice price={itemsPrice} plain />
                    </span>{" "}
                  </div>
                </CardContent>
              </Card>
            </div>
            <div>
              <Card className="rounded-none md:sticky md:top-4">
                <CardHeader className="border-b">
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                  <form onSubmit={handleApplyCoupon} className="space-y-3">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <Tag className="size-4 text-muted-foreground" />
                      Apply coupon
                    </div>
                    <div className="flex gap-2">
                      <Input
                        type="text"
                        placeholder="Coupon code"
                        value={couponCode}
                        onChange={(e) => {
                          setCouponCode(e.target.value.toUpperCase());
                          setCouponError("");
                        }}
                        aria-invalid={Boolean(couponError)}
                        disabled={couponLoading || Boolean(appliedCoupon)}
                        className="uppercase"
                      />
                      <Button
                        type="submit"
                        disabled={couponLoading || Boolean(appliedCoupon)}
                      >
                        {couponLoading ? "Applying" : "Apply"}
                      </Button>
                    </div>

                    {couponError && (
                      <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                        <XCircle className="size-4" />
                        <span>{couponError}</span>
                      </div>
                    )}

                    {appliedCoupon && (
                      <div className="flex items-center justify-between gap-3 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700 dark:border-green-900/60 dark:bg-green-950/30 dark:text-green-300">
                        <span className="flex items-center gap-2">
                          <CheckCircle2 className="size-4" />
                          {appliedCoupon} applied
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={handleRemoveCoupon}
                        >
                          Remove
                        </Button>
                      </div>
                    )}
                  </form>

                  <Separator />

                  {itemsPrice < FREE_SHIPPING_MIN_PRICE ? (
                    <div className="rounded-lg bg-muted/60 p-3 text-sm text-muted-foreground">
                      Add{" "}
                      <span className="font-medium text-green-700 dark:text-green-400">
                        <ProductPrice
                          price={FREE_SHIPPING_MIN_PRICE - itemsPrice}
                          plain
                        />
                      </span>{" "}
                      of eligible items to your order to qualify for FREE
                      Shipping
                    </div>
                  ) : (
                    <div className="rounded-lg bg-green-50 p-3 text-sm text-green-700 dark:bg-green-950/30 dark:text-green-300">
                      <span className="font-medium">
                        Your order qualifies for FREE Shipping
                      </span>{" "}
                      Choose this option at checkout
                    </div>
                  )}

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">
                        Subtotal ({itemCount} items)
                      </span>
                      <ProductPrice price={itemsPrice} plain />
                    </div>
                    {hasDiscount && (
                      <div className="flex items-center justify-between text-green-700 dark:text-green-400">
                        <span>Coupon discount</span>
                        <span>- ${discountAmount.toFixed(2)}</span>
                      </div>
                    )}
                    <Separator />
                    <div className="flex items-center justify-between text-base font-bold">
                      <span>Total</span>
                      <span>${finalTotal.toFixed(2)}</span>
                    </div>
                  </div>

                  <Button
                    onClick={() => router.push("/checkout")}
                    className="rounded-full w-full"
                  >
                    Proceed to Checkout
                  </Button>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
      <BrowsingHistoryList className="mt-10" />
    </div>
  );
}
