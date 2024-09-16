import mongoose from "mongoose";


const cartSchema = new mongoose.Schema({

    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Products"
            }
            ,
            quantity: {
                type: Number
            }
        }

    ]

})

export default mongoose.model('Cart', cartSchema);