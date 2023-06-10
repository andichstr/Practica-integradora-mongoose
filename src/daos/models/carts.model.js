//@ts-check
import { Schema, model } from "mongoose";

const CART_TABLE = "carts";

export const CartModel = model(CART_TABLE, new Schema({
    products: { type: Array, required: true },
    })
);
