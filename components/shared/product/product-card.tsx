import Image from "next/image";
import Link from "next/link";
import React from "react";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { IProduct } from "@/lib/db/models/product.model";

import Rating from "./rating";
import { formatNumber, generateId, round2 } from "@/lib/utils";
import ProductPrice from "./product-price";
import ImageHover from "./image-hover";
import AddToCart from "./add-to-cart";
import WishlistButton from "./wishlist-button";

type ProductCardProps = {
  product: IProduct;
  hideDetails?: boolean;
  hideBorder?: boolean;
  hideAddToCart?: boolean;
};

const ProductImage = ({ product }: { product: IProduct }) => {
  const primaryImage = product.images[0];
  const hoverImage = product.images[1];

  return (
    <div className="relative">
      <div className="absolute top-2 right-2 z-20">
        <WishlistButton
          product={{
            _id: product._id.toString(),
            name: product.name,
            price: product.price,
            image: primaryImage,
            slug: product.slug,
          }}
        />
      </div>

      <Link href={`/product/${product.slug}`}>
        <div className="relative h-52">
          {hoverImage ? (
            <ImageHover
              src={primaryImage}
              hoverSrc={hoverImage}
              alt={product.name}
            />
          ) : (
            <div className="relative h-52">
              <Image
                src={primaryImage}
                alt={product.name}
                fill
                sizes="80vw"
                className="object-contain"
              />
            </div>
          )}
        </div>
      </Link>
    </div>
  );
};

const ProductDetails = ({ product }: { product: IProduct }) => (
  <div className="flex-1 space-y-2">
    <p className="font-bold">{product.brand}</p>
    <Link
      href={`/product/${product.slug}`}
      className="overflow-hidden text-ellipsis"
      style={{
        display: "-webkit-box",
        WebkitLineClamp: 2,
        WebkitBoxOrient: "vertical",
      }}
    >
      {product.name}
    </Link>
    <div className="flex gap-2 justify-center">
      <Rating rating={product.avgRating} />
      <span>({formatNumber(product.numReviews)})</span>
    </div>

    <ProductPrice
      isDeal={product.tags.includes("todays-deal")}
      price={product.price}
      listPrice={product.listPrice}
      forListing
    />
  </div>
);

const AddButton = ({ product }: { product: IProduct }) => (
  <div className="w-full text-center">
    <AddToCart
      minimal
      item={{
        clientId: generateId(),
        product: product._id.toString(),
        size: product.sizes[0],
        color: product.colors[0],
        countInStock: product.countInStock,
        name: product.name,
        slug: product.slug,
        category: product.category,
        price: round2(product.price),
        quantity: 1,
        image: product.images[0],
      }}
    />
  </div>
);

const ProductCard = ({
  product,
  hideBorder = false,
  hideDetails = false,
  hideAddToCart = false,
}: ProductCardProps) => {
  return hideBorder ? (
    <div className="flex flex-col">
      <ProductImage product={product} />
      {!hideDetails && (
        <>
          <div className="p-3 flex-1 text-center">
            <ProductDetails product={product} />
          </div>
          {!hideAddToCart && <AddButton product={product} />}
        </>
      )}
    </div>
  ) : (
    <Card className="flex flex-col  ">
      <CardHeader className="p-3">
        <ProductImage product={product} />
      </CardHeader>
      {!hideDetails && (
        <>
          <CardContent className="p-3 flex-1  text-center">
            <ProductDetails product={product} />
          </CardContent>
          <CardFooter className="p-3">
            {!hideAddToCart && <AddButton product={product} />}
          </CardFooter>
        </>
      )}
    </Card>
  );
};

export default ProductCard;
