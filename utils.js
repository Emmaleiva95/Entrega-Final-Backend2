import {fileURLToPath} from 'url';
import {dirname} from 'path';
import passport from 'passport';
import usersModel from "./src/dao/models/user.model.js";

const __filename = fileURLToPath(import.meta.url)
export const __dirname = dirname(__filename);

export const passportCall = (strategy) => {
    return async (req,res,next) => {
        passport.authenticate(strategy, function (err,user,info){
            if(err) return next(err);
            if(!user){
                return res.status(401).send({error:info.messages?info.message:info.toString()})
            }
            req.user = user;
            next();
        })(req,res,next)
    }
}


export const authAdmin = async  (req, res, next) =>  {
    let idUsuario = req.user.user.id 
    const usuarioEncontrado = await usersModel.findById(idUsuario);

    const esAdmin = usuarioEncontrado.role == 'admin';

    if(!esAdmin) return res.status(403).json({ message: "Es requerido tener rol admin para realizar esa acción."})
    next();
}

export const authOnlyUser = async  (req, res, next) =>  {
    let idUsuario = req.user.user.id 
    const usuarioEncontrado = await usersModel.findById(idUsuario);
  
    const esUser = usuarioEncontrado.role == 'user';

    if(!esUser) return res.status(403).json({ message: "Es requerido tener rol user para realizar esa acción."})
    next();
}