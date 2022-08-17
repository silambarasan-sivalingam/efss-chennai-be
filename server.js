import express from 'express'
const app = express()

import dotenv from 'dotenv'
dotenv.config()

import 'express-async-errors'
import morgan from 'morgan'

import { dirname } from 'path'
import { fileURLToPath } from 'url'
import path from 'path'

//security
// import helmet from 'helmet'
// import xss from 'xss-clean'
// import mongoSanitize from 'express-mongo-sanitize'
// import rateLimiter from 'express-rate-limit'

//db and authenticateUser
import connectDB from './db/connect.js'

//routers
import authRouters from './routes/authRoutes.js'
import clientsRouter from './routes/clientsRouter.js'

//middleware
import notFoundMiddleware from './middleware/not-found.js'
import errorHandlerMiddleware from './middleware/error-handler.js'
import authenticateUser from './middleware/auth.js'

if(process.env.NODE_ENV !== 'production'){
    app.use(morgan('dev'))
}

app.use(express.json())


app.get('/', (req, res)=>{
    res.send({ msg: 'welcome'})
} )

app.get('/api/v1', (req, res)=>{
    res.send({ msg: 'API Client'})
} )

app.use('/api/v1/auth', authRouters)
app.use('/api/v1/clients',clientsRouter)

app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

const port = process.env.PORT || 5000

const start = async() => {
    try {
        await connectDB(process.env.MONGO_URL)
        app.listen(port, ()=> {
            console.log(`Server is listening on port ${port}`)
        })
    } catch (error) {
            console.log(error)
    }
}

start()