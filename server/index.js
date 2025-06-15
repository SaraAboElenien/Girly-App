import dotenv from "dotenv";
import path from "path";
dotenv.config();
import express from 'express'
import { initApp } from './src/initApp.js';
const app = express()

let port = process.env.PORT || 3001
initApp(app, express)
   
app.listen(port, () => console.log(`running successfully on ${port}!`))

