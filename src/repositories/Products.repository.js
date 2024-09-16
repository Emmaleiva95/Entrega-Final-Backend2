import ProductsDTO from "../dao/DTOs/Products.dto.js";


export default class ProductsRepository{
    constructor(dao){
        this.dao = dao;
    }

    getProducts = async(filter,options) => {
        let result = await this.dao.getAll(filter,options);
        return result
    }

    createProduct = async(data) => {
        let productDto = new ProductsDTO(data);

        if(productDto.title == '' || productDto.description == '' || productDto.code == '' || productDto.price == '' || productDto.stock == '' || productDto.description == undefined || productDto.category == '' || productDto.thumbnails == undefined){
            return null;
        }else{
           
            let result = await this.dao.create(productDto);
            return result;
        }

       
    }

    deleteProduct = async (id) => {
        let result = await this.dao.delete(id);
        return result;
    }

    updateProduct = async(id,data) => {
        let productDto = new ProductsDTO(data);

        if(productDto.title == '' || productDto.description == '' || productDto.code == '' || productDto.price == '' || productDto.stock == '' || productDto.description == undefined || productDto.category == '' || productDto.thumbnails == undefined){
            return null;
        }else{
           
            let result = await this.dao.update(id,productDto);
            return result;
        }

    }
}