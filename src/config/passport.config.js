import passport from "passport";
import local from "passport-local";
import usersModel from "../dao/models/user.model.js";
import bcrypt from 'bcrypt'
import userModel from "../dao/models/user.model.js";
import jwt from 'passport-jwt';
import UsersDTO from "../dao/DTOs/Users.dto.js";
import cartModel from "../dao/models/cart.model.js";

const LocalStrategy = local.Strategy;

const JWTStrategy = jwt.Strategy;
const ExtractJWT = jwt.ExtractJwt;

const cookieExtractor = (req) => {
    let token = null;
    if (req && req.cookies){
        token = req.cookies['token'];
    }
    return token;
}

const initializePassport = () => {

    

    passport.use('jwt', new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
        secretOrKey: 'ClaveSecretaJWT'
    }, async (jwt_payload, done) => {
        try {
            return done(null,jwt_payload)
        } catch (error) {
            return done(error);
        }
    }))

    passport.use('register', new LocalStrategy(
        {passReqToCallback:true,usernameField:"email"}, async (req, username, password, done) => {
            let userData = req.body;
            userData.role = 'user';
            try {
                let userExist = await usersModel.findOne({email: userData.email});
                if(userExist){
                    console.log('El email ya está registrado');
                    return done(null,false);
                }
                userData.password = bcrypt.hashSync(userData.password, bcrypt.genSaltSync(10));
                // crear un carrito
                let userCart = new cartModel()
                let carrito = await userCart.save();

                // asignarle un carrito a ese usuario
                userData.cart = carrito._id;


                console.log('Prueba: ' + JSON.stringify(userData));

                let newUser = new usersModel(userData);
                const userCreado = await newUser.save();

               

                return done(null, userCreado)
            } catch (error) {
                return done("Error al intentar registrar al usuario" + error);
            }
        }
    ));

    passport.use('login', new LocalStrategy({usernameField:"email"}, async(username,password,done) => {
        try {
            const user = await userModel.findOne({email:username});
            if(!user){
                console.log('Usuario inexistente');
                return done(null,false)
            }
            if(!bcrypt.compareSync(password, user.password)){
                console.log('Password incorrecto');
                return done(null,false)
            }
            // USUARIO LOGEADO
      
            const dataUser = new UsersDTO(user);
            
            return done(null,dataUser)
        } catch (error) {
            return done("Error al intentar logear al usuario" + error);
        }
    }))



    passport.serializeUser((user,done)=> {
        done(null, user._id)
    })

    passport.deserializeUser(async (id, done) => {
        let user = await userModel.findById(id);
        done(null, user)
    });


}

export default initializePassport;