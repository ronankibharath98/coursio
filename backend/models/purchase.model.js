import mongoose, { model, mongo } from "mongoose";

const purchaseSchema = new mongoose.Schema({
    transactionId: {
        type: String,
        default: "ACRAF23DB3C4",
        required: true
    },
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }
}, {timestamps: true})


export const Purchases = mongoose.model('Purchases', purchaseSchema);