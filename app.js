import express from 'express';
import { connectDB } from './db.js'
import dotenv from 'dotenv'

dotenv.config()
import ProductRoutes from './src/routes/product.router.js'
import CartRoutes from './src/routes/cart.router.js'
import indexRoutes from './src/routes/index.router.js'
import userRoutes from './src/routes/user.router.js'
import adminRoutes from './src/routes/admin.router.js'
import session from 'express-session';
import cookieParser from 'cookie-parser';
// PASSPORT
import passport from 'passport';
import initializePassport from './src/config/passport.config.js';


import { Server } from 'socket.io';

import {__dirname} from './utils.js';


const app = express();

// view engine setup
app.set('views', __dirname + '/src/views');
app.set('view engine', 'ejs')


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// COOKIES, SESSION , PASSPORT
app.use(cookieParser());

app.use(session({secret:"Mensaje secreto",
  resave:false,
  saveUninitialized:true}));
  
initializePassport();
app.use(passport.initialize())
app.use(passport.session())

//CONFIGURO LA RUTA PUBLICA, PARA ARCHIVOS PUBLICO (CSS,JS,IMG)
app.use(express.static(__dirname + '/src/public'));
app.use(ProductRoutes)
app.use(CartRoutes)
app.use(indexRoutes)
app.use(userRoutes)
app.use(adminRoutes)

// CONEXIÓN CON LA BD
connectDB();

const httpServer = app.listen(process.env.PORT, () => console.log('Servidor listo en el puerto '+ process.env.PORT));

