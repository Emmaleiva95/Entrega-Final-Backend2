import productsModel from "./models/products.model.js";

export default class Products {
    

    get = async () => {
        try {
            let products = await productsModel.find();
            return products;
        } catch (error) {
            console.log(error)
            return null;
        }

    }

    getAll = async (filter, options) => {

        try {
            let products = await productsModel.paginate(filter, options);
            return products;
        } catch (error) {
            console.log(error)
            return null;
        }
    }
    create = async (data) => {
        const nuevoProducto = new productsModel(data);

        try {
            
            const productoGuardado = await nuevoProducto.save();
            return productoGuardado;
        } catch (error) {
            console.log(error)
            return null;
        }
    }

    update = async (id, data) => {
        try {
            // El parametro new:true me devuelve el curso actualizada y no el registro anterior.
            const productoActualizado = await productsModel.findByIdAndUpdate(id, data, { new: true });
            if (!productoActualizado) return "No se ha encontrado el producto solicitado."
            return productoActualizado;
        } catch (error) {
            console.log(error)
            return null;
        }


    }

    delete = async (id) => {
        try {
            const product = await productsModel.findById(id);
            if (!product) return "No se ha encontrado el curso solicitado."
            const productEliminado = await productsModel.findByIdAndDelete(id);
            return productEliminado;
        } catch (error) {
            console.log(error)
            return null;
        }

    
    }

}