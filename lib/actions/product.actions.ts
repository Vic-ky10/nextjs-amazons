"use server";

import { connectToDatabase } from "@/lib/db";
import Product, { IProduct } from "@/lib/db/models/product.model";
import type { SortOrder } from "mongoose";
import { PAGE_SIZE } from "../constants";

const escapeRegex = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export async function getAllProducts({
  query,
  category,
  tag,
  sort = "best-selling",
  page = 1,
  limit = PAGE_SIZE,
}: {
  query?: string;
  category?: string;
  tag?: string;
  sort?: string;
  page?: number;
  limit?: number;
}) {
  await connectToDatabase();

  const conditions: Record<string, unknown> = { isPublished: true };

  if (query && query !== "all") {
    conditions.name = { $regex: escapeRegex(query), $options: "i" };
  }

  if (category && category !== "all") {
    conditions.category = category;
  }

  if (tag && tag !== "all") {
    conditions.tags = { $in: [tag] };
  }

  const sortBy: Record<string, SortOrder> =
    sort === "lowest"
      ? { price: 1 }
      : sort === "highest"
        ? { price: -1 }
        : sort === "newest"
          ? { createdAt: -1 }
          : { numSales: -1 };

  const skipAmount = (Number(page) - 1) * limit;
  const products = await Product.find(conditions)
    .sort(sortBy)
    .skip(skipAmount)
    .limit(limit);
  const productsCount = await Product.countDocuments(conditions);

  return {
    data: JSON.parse(JSON.stringify(products)) as IProduct[],
    totalPages: Math.ceil(productsCount / limit),
    totalProducts: productsCount,
  };
}
// GET PRODUCTS BY TAG
export async function getProductsByTag({
  tag,
  limit = 10,
}: {
  tag: string;
  limit?: number;
}) {
  await connectToDatabase();
  const products = await Product.find({
    tags: { $in: [tag] },
    isPublished: true,
  })
    .sort({ createdAt: "desc" })
    .limit(limit);
  return JSON.parse(JSON.stringify(products)) as IProduct[];
}

export async function getAllCategories() {
  await connectToDatabase();
  const categories = await Product.find({ isPublished: true }).distinct(
    "category",
  );
  return categories;
}
export async function getProductsForCard({
  tag,
  limit = 4,
}: {
  tag: string;
  limit?: number;
}) {
  await connectToDatabase();
  const products = await Product.find(
    { tags: { $in: [tag] }, isPublished: true },
    {
      name: 1,
      href: { $concat: ["/product/", "$slug"] },
      image: { $arrayElemAt: ["$images", 0] },
    },
  )
    .sort({ createdAt: "desc" })
    .limit(limit);
  return JSON.parse(JSON.stringify(products)) as {
    name: string;
    href: string;
    image: string;
  }[];
}
// GET ONE PRODUCT BY SLUG
export async function getProductBySlug(slug: string) {
  await connectToDatabase()
  const product = await Product.findOne({ slug, isPublished: true })
  if (!product) throw new Error('Product not found')
  return JSON.parse(JSON.stringify(product)) as IProduct
}
// GET RELATED PRODUCTS: PRODUCTS WITH SAME CATEGORY
export async function getRelatedProductsByCategory({
  category,
  productId,
  limit = PAGE_SIZE,
  page = 1,
}: {
  category: string
  productId: string
  limit?: number
  page: number
}) {
  await connectToDatabase()
  const skipAmount = (Number(page) - 1) * limit
  const conditions = {
    isPublished: true,
    category,
    _id: { $ne: productId },
  }
  const products = await Product.find(conditions)
    .sort({ numSales: 'desc' })
    .skip(skipAmount)
    .limit(limit)
  const productsCount = await Product.countDocuments(conditions)
  return {
    data: JSON.parse(JSON.stringify(products)) as IProduct[],
    totalPages: Math.ceil(productsCount / limit),
  }
}
