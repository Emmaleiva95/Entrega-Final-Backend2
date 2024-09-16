import { Router } from "express";
import { actualizarProducto, crearProducto, eliminarProducto, listarProductos } from "../controllers/products.controller.js";
import { passportCall, authAdmin } from "../../utils.js";




const router = Router();

router.get('/api/products/', listarProductos);


  // PETICIÓN POST - CREAR RECURSO
router.post('/api/products/', [passportCall('jwt'), authAdmin], crearProducto)


// PETICIÓN PUT - ACTUALIZAR RECURSO
router.put('/api/products/:idp',[passportCall('jwt'), authAdmin], actualizarProducto);

// PETICIÓN DELETE - ELIMINAR RECURSO

router.delete('/api/products/:idp',[passportCall('jwt'), authAdmin], eliminarProducto);

export default router;
