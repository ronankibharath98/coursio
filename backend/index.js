import express from 'express';
import userRouter from './routes/user.routes.js'
import courseRouter from './routes/course.routes.js';
import adminRouter from './routes/admin.routes.js';
import purchaseRouter from './routes/purchase.routes.js';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv'
import connectDB from './utils/db.js';


dotenv.config({});
const app = express();

//middlewares
app.use(express.json());
app.use(cookieParser());


//Routing api's
app.use('/api/v1/user', userRouter);
app.use('/api/v1/courses', courseRouter);
app.use('/api/v1/admin', adminRouter);
app.use('/api/v1/purchases', purchaseRouter);

const PORT = process.env.PORT || 8080;



async function main() {
    try {
        await connectDB()
        app.listen(PORT, () => {
            console.log(`Server running on http:localhost:${PORT}`);
        })
    } catch (err) {
        console.log(err)
        process.exit(1)
    }

}
main()