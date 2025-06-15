import { connection } from '../db/connection.js'
import { AppError } from '../helpers/classError.js'
import { globleErrorHandling } from '../helpers/globleErrorHandling.js'
import { deleteFromCloudinary } from '../helpers/deleteFromCloudinary.js'
import { deleteFromDB } from '../helpers/deleteFromDB.js'
import * as routers from '../src/modules/index.routes.js'
import cors from 'cors'

export const initApp = (app, express) => {
  app.get("/", (req, res) => {
    res.status(200).json({message: "Your project is now ONLINE SARA"})
  })

  const allowedOrigins = [
    'http://localhost:5173', 
    'http://localhost:3000',
    'https://girly-app-sara-aboeleniens-projects.vercel.app',
    'https://girly-app.vercel.app'
  ];

  app.use(cors({
    origin: function(origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) {
        console.log('Request with no origin - allowing');
        return callback(null, true);
      }
      
      console.log('Request origin:', origin);
      
      if (allowedOrigins.indexOf(origin) === -1) {
        console.log('Origin not allowed:', origin);
        const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
        return callback(new Error(msg), false);
      }
      
      console.log('Origin allowed:', origin);
      return callback(null, true);
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
  }));

  app.use(express.json())
  connection()  
  
  // app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));  
  app.use('/api/v1/auth/user', routers.userRoutes)
  app.use('/api/v1/auth/post', routers.postRoutes)

  
  
  app.get(/(.*)/, (req, res, next) => {
    const err = new AppError(`Invalid URL${req.originalUrl}`, 404)
    next(err)
  })
  
  app.use(globleErrorHandling, deleteFromCloudinary, deleteFromDB)
}