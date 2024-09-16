import { Router } from "express";
import { promises as fsp } from "fs"
import productsModel from "../dao/models/products.model.js";

const router = Router();

router.get('/', async (req, res) => {
  res.render('index', {})
});

router.get('/home', async (req, res) => {

  try {
    const data = await fsp.readFile('src/data/products.json')
    const arrayProductos = JSON.parse(data);
    console.log(arrayProductos);

    res.render('home', { productos: arrayProductos })

  } catch (error) {
    console.log(error);
  }


});


export default router;