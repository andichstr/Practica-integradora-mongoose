//@ts-check
import { Router } from "express";
import { CartService } from "../services/carts.service.js";

const router = Router();
const service = new CartService();

router.post("/", async (req, res) => {
    try {
        const addedCart = await service.addCart();
        return res.status(201).json({
            status: "Success",
            message: "Cart created successfully",
            data: addedCart
        });
    } catch (e) {
        return res.status(e.status).json({
            status: "Error",
            message: `${e.name}: ${e.message}`,
            data: null
        })
    }
});

router.get('/:cid', async (req, res) => {
    try {
        const id = req.params.cid;
        const cart = await service.getCartById(id);
        return res.status(200).json({
            status: "Success",
            message: "Cart found",
            data: !!cart ? cart.products : []
        })
    } catch (e) {
        console.log(e);
        return res.status(e.status||500).json({
            status: "Error",
            message: `${e.name}: ${e.message}`,
            data: null
        });
    }
});

router.post("/:cid/product/:pid", async (req, res) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const addedProduct = await service.addProductToCart(cartId, productId);
        return res.status(201).json({
            status: "Success",
            message: "Product added successfully",
            data: addedProduct
        });
    } catch (e) {
        return res.status(e.status).json({
            status: "Error",
            message: `${e.name}: ${e.message}`,
            data: null
        });
    }
});

export default router;