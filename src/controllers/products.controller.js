import { productsServiceRepository } from "../repositories/index.js";

export const crearProducto =  async (req,res) => {

 
    try {
      // DEBO LLAMAR AL DAO Y PASARLE LOS DATOS PARA CREAR EL NUEVO PRODUCTO
      let result = await productsServiceRepository.createProduct(req.body);

      if(result){
        res.send(result);
      }else{
        res.send('No puede dejar campos vacíos');
      }


    } catch (error) {
      console.log(error);
    }

}

export const eliminarProducto =  async (req, res) => {
    const idProducto = req.params.idp;

    try{
      let result = await productsServiceRepository.deleteProduct(idProducto);
      res.send(result);
    }catch(error){
        console.log(error);
    }
   
  };



export const actualizarProducto = async (req, res) => {
  const idProducto = req.params.idp;
  
    try{
     // DEBO LLAMAR AL DAO Y PASARLE LOS DATOS PARA MODIFICAR EL NUEVO PRODUCTO
     let result = await productsServiceRepository.updateProduct(idProducto,req.body);
     res.send(result);
     
    }catch(error){
        console.log(error);
    }
  
 
}

export const listarProductos = async (req, res) => {

    let limit = req.query.limit || 10;
    let page = req.query.page || 1;
    let sort = req.query.sort;
    let query = req.query.query;
    let msg = req.query.msg || null;
    const options = {};
    options.limit = limit;
    options.page = page;
    console.log(sort);
    if(sort != undefined && sort != ''){
      options.sort = {price:parseInt(sort)};
    }
    const filter = {};
    if(query != undefined && query != ''){
      filter.category = query;
    }
  
    
    try{

      let result = await productsServiceRepository.getProducts(filter,options);
      
      result.prevLink =  result.hasPrevPage ? `/api/products?page=${(result.page-1)}` : null;  
      result.nextLink =  result.hasNextPage ? `/api/products?page=${(result.page+1)}` : null;  
      result.success = true;
      result.payload = result.docs;
      result.options = options;
      result.filter = filter;
   

     
      res.render('index', { result, idCarrito: req.user?.cart, msg })
      
     
    }catch(error){
        console.log(error);
    }
  
  }