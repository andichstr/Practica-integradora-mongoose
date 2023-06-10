//@ts-check
import { CartModel } from '../daos/models/carts.model.js';
import { CartsException } from '../exceptions/carts.exceptions.js';
import { ProductService } from './products.service.js'

export class CartService {
    constructor() {
        this.productService = new ProductService();
    }

    async getCarts() {
        const carts = await CartModel.find({}); 
        return carts;
    }

    async addCart() {
        const cart = await CartModel.create({
            "products": []
        })
        if (!!cart) return cart;
        else throw new CartsException(`Something went wrong, cart not created. Please try again.`, 500);
    }

    /**
     * @param {String} id
     */
    async getCartById(id) {
        const foundCart = CartModel.findById(id);
        if (!!foundCart) return foundCart;
        else throw new CartsException(`Cart with id: ${id} not found.`, 404);
    }

    /**
     * @param {String} cartId
     * @param {String} productId
     */
    async addProductToCart(cartId, productId) {
        if (!await this.productService.checkStock(productId)) return null;
        //si pasa ambas condiciones, agrego el producto al carrito
        //y disminuyo stock del producto.
        const cart = await CartModel.findById(cartId);
        if (!cart) throw new CartsException("Cart not found", 404);
        cart.products.push(productId);
        await this.productService.reduceProductStock(productId);
        await CartModel.findOneAndUpdate({_id: cartId}, cart.products);
        return await this.productService.getProductById(productId);
    }
}