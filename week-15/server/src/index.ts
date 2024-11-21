import express from 'express'
import { Routes } from './routes/v1'

const app = express()
app.use(express.json())
app.use('/api/v1',Routes)
app.listen(9000,()=>{
    console.log('server is listening at 9000')
})