import ProductsDao from "../dao/products.dao.js"
import ProductsRepository from "./Products.repository.js"

export const productsServiceRepository = new ProductsRepository(new ProductsDao()); 