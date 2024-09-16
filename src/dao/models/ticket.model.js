import mongoose from "mongoose";


const ticketsSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true
    },
    purchase_datetime: {
        type: Date,
        required: true,
        default: Date.now
    },
    amount: {
        type: Number,
        required: true
    },
   
    purchaser: {
        type: String,
        required: true,
        trim:true
    }
    
})


export default mongoose.model('Tickets', ticketsSchema);