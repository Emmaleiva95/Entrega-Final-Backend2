import { Router } from "express";
import { authAdmin, passportCall } from "../../utils.js";



const router = Router();

// PERFIL O CURRENT



router.get('/api/admin/', [passportCall('jwt'), authAdmin], async (req,res) => {
    console.log('Panel de admin') 
    res.send(req.user);
})


export default router;