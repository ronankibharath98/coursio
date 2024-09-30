import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        require: true,
        trim: true,
        unique: true
    },
    description: {
        type: String,
        require: true,
        trim: true
    },
    price:{
        type: String,
        require: true,
        trim: true
    },
    imageUrl: {
        // need to add image upload functionality
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin',
        require: true,

    }
}, {timestamps: true});

export const Courses = mongoose.model('Courses', courseSchema);