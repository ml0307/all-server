const express=require('express')
const app =express()
const cors = require('cors')
const { resolve ,join}=require('path')
const index_routre = require('./router/index.js')
const mongo_router = require('./router/mongo.js')
// const permssion = require('./uit/permssion.js')
const user_router = require('./router/user.js')
const commodity_router = require('./router/commodity')
const head_router = require('./router/head_portrait')
const shop_car_router =require('./router/shop_car')
const order_router = require('./router/order')
// console.log(shop_car_router);
// console.log(order_router);
// app.get('/',(req,res)=>{
//     res.end('nihao')
// })
// app.get('/owner',(req,res)=>{
//     res.json(req.query)
// })

app.use(cors())
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded()) // for parsing application/x-www-form-urlencoded
app.use('',user_router)
app.use('',mongo_router)
app.use('',commodity_router)
app.use('',head_router)

app.use('/head_portrait',express.static(join(__dirname,'/head_portrait/')));
// app.use(permssion)
app.use ('',order_router)
app.use ('',shop_car_router)
app.use('/api',index_routre)


// app.post('/owner',(req,res)=>{
//     console.log(req.body)
//     res.json(req.body)
// })
app.listen(3000,()=>{
    console.log('sever is running at port:3000');
})