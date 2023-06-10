//@ts-check
import { Router } from "express";
import { ProductService } from "../services/products.service.js";

const router = Router();
const service = new ProductService();

router.get("/", async (req, res) => {
    let products = await service.getProducts();
    if (!!products){
        if (!!req.query.limit && Number(req.query.limit)>=0 && products.length > Number(req.query.limit)) products = products.slice(0, Number(req.query.limit))
        else if (Number(req.query.limit)<0) return res.status(400).json({
            status: "Error",
            message: "Invalid limit specified",
            data: null
        })
        return res.status(200).json(products);
    }else return res.status(404).json({
            status: "Error",
            message: "Products not found",
            data: null
    });
});

router.get('/:pid', async (req, res) => {
    try {
        const id = req.params.pid;
        const response = await service.getProductById(id);
        if (!!response) return res.status(200).json({
            status: "Success",
            message: "Product found",
            data: response
        })
        else return res.status(404).json({
            status: "Error",
            message: `Product with id=${id} not found`,
            data: null
        });
    } catch (e) {
        return res.status(e.status).json({
            status: "Error",
            message: `${e.name}: ${e.message}`,
            data: null
        });
    }
});

router.post("/", async (req, res) => {
    try{
        if(Object.keys(req.body).length !== 0) {
            console.log(req.body);
            const product = req.body;
            const response = await service.addProduct(product);
            return res.status(201).json({
                status: "Success",
                message: `Product created successfully with id=${response._id}`,
                data: response
            });
        } else return res.status(404).json({
            status: "Error",
            message: "No product found to add on body request.",
            data: null
        });
    } catch (e) {
        return res.status(e.status).json({
            status: "Error",
            message: e.message,
            data: null
        })
    };
});

router.put("/:pid", async (req, res) => {
    try {
        if (!!req.body){
            const id = req.params.pid;
            const product = req.body;
            const response = await service.updateProduct(id, product);
                return res.status(200).json({
                    status: "Success",
                    message: "Products found",
                    data: response
                });
        } else return res.status(400).json({
            status: "Error",
            message: "No product found to add on body request.",
            data: null
        });
    } catch (e) {
        return res.status(e.status).json({
            status: "Error",
            message: e.message,
            data: null
        });
    }
});

router.delete('/:pid', async (req, res) => {
    try {
        const id = req.params.pid;
        const resp = await service.deleteProduct(id);
        console.log(resp);
        if (resp.deletedCount!=0){
            return res.status(200).json({
                status: "Success",
                message: `Product with id=${id} was successfully deleted`
            })
        } else {
            return res.status(404).json({
                status: "Not Found",
                message: `Product with id=${id} was not found in the database`
            })
        }
    } catch (e) {
        return res.status(e.status).json({
            status: "Error",
            message: e.message
        });
    }
});

export default router;