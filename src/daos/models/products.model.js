//@ts-check
import { Schema, model } from "mongoose";

const PRODUCT_TABLE = "products";

export const ProductModel = model(PRODUCT_TABLE, new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    code: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    category: { type: String, required: true },
    status: { type: Boolean, required: false, default: true},
    thumbnails: { type: Array, required: false, default: []}
    })
);
