import express from "express";
import { APP_PORT, DB_URL } from "./config";
import errorHandler from "./middlewares/errorHandler";
import router from './routes/index';
import mongoose from 'mongoose';
import path from 'path';

const app = express()

// Database connection

// mongoose.connect(DB_URL, {
//     useNewUrlParse: true,
//     useUnifiedTopology: true,
//     useCreateIndex: true,
//     useFindAndModify: false
// }).then(() => {
//     console.log("DB connected")
// }).catch((error) => {
//     console.log(error)
// })

mongoose.connect(DB_URL, {
    useNewUrlParse: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
});
const db = mongoose.connection;
db.on('error', console.log.bind(console, 'connection error:'));
db.once('open', ()=>{
    console.log('DB Connected...')
})

global.appRoot = path.resolve(__dirname)
app.use(express.urlencoded({extended:false}))
app.use(express.json())
app.use("/api",router)
app.use("/uploads",express.static('uploads'))
app.use(errorHandler)

app.listen(APP_PORT,()=> console.log(`Listing on Port ${APP_PORT}`))