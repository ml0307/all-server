const express=require('express')
const app =express()
const { resolve }=require('path')
const index_routre = require('./router/index.js')
const mongo_router = require('./router/mongo.js')
const permssion = require('./uit/permssion.js')

// app.get('/',(req,res)=>{
//     res.end('nihao')
// })
// app.get('/owner',(req,res)=>{
//     res.json(req.query)
// })


app.use(express.json()) // for parsing application/json
app.use(express.urlencoded()) // for parsing application/x-www-form-urlencoded

app.use('',mongo_router)
// app.use(permssion)
app.use('/api',index_routre)

// app.post('/owner',(req,res)=>{
//     console.log(req.body)
//     res.json(req.body)
// })
app.listen(3000,()=>{
    console.log('sever is running at port:3000');
})