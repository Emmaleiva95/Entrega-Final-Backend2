import { Router } from "express";

import cartModel from "../dao/models/cart.model.js";
import productsModel from "../dao/models/products.model.js";
import { authOnlyUser, passportCall } from "../../utils.js";
import ticketModel from "../dao/models/ticket.model.js";

const router = Router();

/* 
    ID DEL CARRITO ESTÁTICO : 6691317f727c2ab92728c2ec.
*/


// OBTENER PRODUCTOS DEL CARRITO.
router.get('/api/carts/:cid',[passportCall('jwt'), authOnlyUser], async (req, res) => {
    const idCarrito = req.params.cid;
    try {
        const cart = await cartModel.findById(idCarrito).populate({
            path: 'products.product',
            model: productsModel
        });

        console.log(JSON.stringify(cart, null, 4));
        res.render('cart', { products: cart.products, idCarrito });
    } catch (error) {
        console.log(error);
    }

});




// PETICIÓN PUT - MODIFICAR CARRITO COMPLETO
router.put('/api/carts/:cid', async (req, res) => {
    const { products } = req.body;
    const idCarrito = req.params.cid;
    try {
        if (products == undefined || products == '' || products.length == 0) {
            res.send('No puede modificar un carrito sin productos.');
        } else {

            const carritoModificado = await cartModel.findByIdAndUpdate(idCarrito, products, { new: true });
            if (!carritoModificado) return res.status(404).send("No se ha encontrado el curso solicitado.")

            res.send(carritoModificado);
        }

    } catch (error) {
        console.log(error);
    }

});


router.delete('/api/carts/:cid/product/:pid', async (req, res) => {
    const idProducto = req.params.pid;
    const idCarrito = req.params.cid;
    try {
        /* VALIDAR QUE EXISTA EL CARRITO */
        const carritoEncontrado = await cartModel.findById(idCarrito);
        if (!carritoEncontrado) return res.send("No se ha encontrado el curso solicitado.");

        /* ELIMINAR EL PRODUCTO DEL CARRITO */
        const indexProduct = carritoEncontrado.products.findIndex((element) => { return element.product == idProducto });
        if (indexProduct >= 0) {
            carritoEncontrado.products.splice(indexProduct, 1);
            await carritoEncontrado.save();

            res.send('producto eliminado')
        } else {
            res.send('ese producto no se encuentra dentro del carrito');
        }


    } catch (error) {
        console.log(error);
    }

});


router.delete('/api/carts/:cid', async (req, res) => {

    const idCarrito = req.params.cid;
    try {
        /* VALIDAR QUE EXISTA EL CARRITO */
        const carritoEncontrado = await cartModel.findById(idCarrito);
        if (!carritoEncontrado) return res.send("No se ha encontrado el carrito solicitado.");

        carritoEncontrado.products = [];
        await carritoEncontrado.save();
        res.send('carrito vacío');
    } catch (error) {
        console.log(error);
    }

});

/* FINALIZAR COMPRA */

router.post('/api/carts/:cid/purchase', [passportCall('jwt'), authOnlyUser], async (req, res) => {

    const idCarrito = req.params.cid;
    try {
        /* VALIDAR QUE EXISTA EL CARRITO */
        const cart = await cartModel.findById(idCarrito).populate({
            path: 'products.product',
            model: productsModel
        });

        if (!cart) return res.send("No se ha encontrado el carrito solicitado.");

        let procesados = cart.products.filter((productos) => productos.product.stock >= productos.quantity);
        let cartNoProcesados = {products:[]}
        for (const productos of cart.products) {
            if (productos.product.stock < productos.quantity) {
                cartNoProcesados.products.push({product: productos.product.id, quantity: productos.quantity});
            }
        }
        
        if(procesados.length > 0){
            for (const producto of procesados) {
                let idProducto = producto.product._id
                let cantidad = producto.quantity;
                const productoEncontrado = await productsModel.findById(idProducto);
                productoEncontrado.stock -= cantidad;
                await productoEncontrado.save();
            }
           
        }

        console.log(procesados)

        //
        
        if (cartNoProcesados.products.length > 0) {
            
            const carritoModificado = await cartModel.findByIdAndUpdate(cart._id, cartNoProcesados, { new: true });
            if (carritoModificado) {
                console.log('carrito modificado')
            }
        }else{
            const limpiarCarrito = {products: []}
            const carritoModificado = await cartModel.findByIdAndUpdate(cart._id, limpiarCarrito, { new: true });
            if (carritoModificado) {
                console.log('carrito modificado')
            }
        }

        let purchaser = req.user.user.email;

        let amount = 0;
        for (const producto of procesados) {

            amount += producto.product.price * producto.quantity
        }

        let code = Math.random().toString(36).substring(2, 10 + 2);
        const ticket = { code, amount, purchaser }

        const nuevoTicket = new ticketModel(ticket);
        const ticketGuardado = await nuevoTicket.save();

        /* carritoEncontrado.products = [];
         await carritoEncontrado.save();*/
        res.send(ticketGuardado);
    } catch (error) {
        console.log(error);
    }

});



router.put('/api/carts/:cid/product/:pid', async (req, res) => {
    const idProducto = req.params.pid;
    const idCarrito = req.params.cid;
    const quantity = req.body.quantity;
    try {
        if (quantity == undefined || quantity <= 0) {
            res.send('La cantidad debe ser mayor a 0.');
        } else {

            /* VALIDAR QUE EXISTA EL CARRITO */
            const carritoEncontrado = await cartModel.findById(idCarrito);
            if (!carritoEncontrado) return res.send("No se ha encontrado el carrito solicitado.");

            /* ELIMINAR EL PRODUCTO DEL CARRITO */
            const indexProduct = carritoEncontrado.products.findIndex((element) => { return element.product == idProducto });
            if (indexProduct >= 0) {
                carritoEncontrado.products[indexProduct].quantity = quantity;
                await carritoEncontrado.save();
                res.send('producto actualizado')
            } else {
                res.send('ese producto no se encuentra dentro del carrito');
            }
        }



    } catch (error) {
        console.log(error);
    }

});

// PETICIÓN POST - AGREGAR PRODUCTO AL CARRITO
router.post('/api/carts/:cid/product/:pid', async (req, res) => {
    const quantity = parseInt(req.body.quantity);
    const idCarrito = req.params.cid;
    const idProducto = req.params.pid;
    try {
        if (quantity == undefined || quantity <= 0) {
            res.send('La cantidad debe ser mayor a 0.');
        } else {

            /* VALIDAR QUE EXISTA EL CARRITO */
            const carritoEncontrado = await cartModel.findById(idCarrito);
            if (!carritoEncontrado) return res.send("No se ha encontrado el curso solicitado.");

            /* VALIDAR QUE EXISTA EL PRODUCTO */
            const productoEncontrado = await productsModel.findById(idProducto);
            if (!productoEncontrado) return res.send("No se ha encontrado el producto solicitado.");



            /* VALIDAR QUE EL PRODUCTO ESTE O NO EN EL CARRITO */
            const productoEnElCarrito = carritoEncontrado.products.findIndex((element) => { return element.product == idProducto })
            console.log('indice en el carrito: ', productoEnElCarrito)
            // VERIFICAR SI EL PRODUCTO YA SE ENCUENTRA EN EL CARRITO
            if (productoEnElCarrito >= 0) {
                carritoEncontrado.products[productoEnElCarrito].quantity += quantity;
                await carritoEncontrado.save();
            } else {
                carritoEncontrado.products.push({ product: idProducto, quantity });
                await carritoEncontrado.save();
            }

            res.redirect('/api/products?msg=1')
        }

    } catch (error) {
        console.log(error);
    }


});

export default router;