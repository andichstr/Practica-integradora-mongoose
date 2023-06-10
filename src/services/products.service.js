//@ts-check
import { ProductModel } from '../daos/models/products.model.js';
import { ProductsException } from '../exceptions/products.exceptions.js';

export class ProductService {
    constructor () {}

    /**
     * @param {{ 
     * title: string,
     * description: string,
     * code: string,
     * price: number,
     * stock: number,
     * category: string
     *  }} product
     */
    async addProduct(product) {
        await ProductModel.validate(product);
        const codeRepeated = await this.isCodeRepeated(product.code);
        console.log(codeRepeated);
        if (!codeRepeated){
            return await ProductModel.create(product);
        } else {
            throw new ProductsException(
                `Error al agregar producto ingresado con codigo ${product.code}: Codigo repetido.`,
                400
            )
        }
    }

    async getProducts() {
        const products = await ProductModel.find({}).lean();
        if (!!products) return products;
        else throw new ProductsException("No products found", 404);
    }

    /**
     * @param {string} id
     */
    async getProductById(id) {
        const foundProduct = await ProductModel.findById(id);
        if(!foundProduct?.$isEmpty) return foundProduct;
        else throw new ProductsException(`Product with id: ${id} not found.`, 404);
    }

    /**
     * @param {string} id
     * @param {object} product
     */
    async updateProduct(id, product) {
        await ProductModel.validate(product);
        const filter = {_id: id};
        return await ProductModel.findOneAndUpdate(filter, product);
    }

    /**
     * @param {string} id
     */
    async deleteProduct(id) {
        await ProductModel.deleteOne({_id: id});
    }

    /**
     * @param {string} id
     */
    async checkStock(id) {
        const product = await ProductModel.findById(id);
        return (!!product && product.stock>0);
    }
    /**
     * @param {string | any[]} products
     */
    async reduceStock(products){
        let i = 0;
        let hasStock = true;
        let product;
        while(hasStock && i < products.length) {
            product = await ProductModel.findById(products[i].id);
            if (!!product && product.stock < products[i].quantity) hasStock = false;
            i++;
        }
        if (hasStock){
            for (let n = 0; n < products.length; n++){
                product = await ProductModel.findById(products[n].id);
                if (!!product) { 
                    product.stock -= products[n].quantity
                    await this.updateProduct(products[n].id, product);
                }
            }
            return true;
        }
        return false;
    }
    /**
     * @param {string} id
     */
    async reduceProductStock(id){
        const product = await ProductModel.findById(id);
        if (!product) return;
        product.stock--;
        await this.updateProduct(id, product);
    }
    /**
     * @param {string} code
     */
    async isCodeRepeated(code) {
        const product = await ProductModel.find({ code: code });
        console.log(product);
        return product.length > 0;
    }

    /**
     * @param {{ title: string; description: string; code: string; price: number; stock: number; category: string; }} product
     */
    errorForProps(product) {
        if (!!product.title && typeof(product.title)!="string") return "Title is required and must be a string";
        if (!!product.description && typeof(product.description)!="string") return "Description is required and must be a string";
        if (!!product.code && typeof(product.code)!="string") return "Code is required and must be a string";
        if (!!product.price && typeof(product.price)!="number") return "Price is required and must be a number";
        if (!!product.stock && typeof(product.stock)!="number") return "Stock is required and must be a number";
        if (!!product.category && typeof(product.category)!="string") return "Category is required and must be a string";
    }
}