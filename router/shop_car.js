const express = require('express')
const router = express.Router()
const permssion = require('../uit/permssion')
const client = require('../db/index')
const { response } = require('express')
const {v1:uuid} = require('uuid')

//加入购物车
router.post('/shop_car',async(request,response)=>{
    let order_number = uuid()
    let user = request.body.user_id
    let order_status = 1
    let commodity = request.body.commodity_id
    let number = request.body.number
    await client.connect()
    const db = client.db('902')
    const shop_car_collection = db.collection('shop_car')
    const result_all = await shop_car_collection.find().toArray()
    const subscript =result_all.length-1
    let id
    if(subscript>=0){
        id = result_all[subscript]._id
    }else if(subscript<0){
        id=0
    }
    id++
    const creat_time = new Date()
    const update_time = new Date()
    const result = await shop_car_collection.insertOne({_id:+id,user,number,order_status,commodity,order_number,creat_time,update_time})
    client.close()
    if(result.acknowledged){
        response.json({
            code : 200,
            msg :'新增成功'
        })
    }else{
        response.json({
            code :-1,
            msg : '添加失败'
        })
    }
})

//删除购物车或支付成功后从购物车移除
router.delete('/shop_car',async(request,response)=>{
    let id = request.body.id
    if(id==undefined) res.json({code:1,msg:'id必传'})
    await client.connect()
    const db = client.db('902')
    const shop_car_collection = db.collection('shop_car')
    const result = await shop_car_collection.find({_id:+id}).toArray()
    if(result.length<1) res.json({code:1,msg:'id错误'})
    const all_result =await shop_car_collection.deleteOne({_id: +id});
    client.close()
    if(all_result.acknowledged){
        response.json({
            code : 200,
            msg :'删除成功'
        })
    }else{
        response.json({
            code :-1,
            msg : "删除失败"
        })
    }
   
})

//更改购物车订单
router.put('/shop_car',async(request,response)=>{
    let id = request.body.id
    if(id==undefined) res.json({code:1,msg:'id必传'})
    const db = client.db('902')
    const shop_car_collection = db.collection('shop_car')
    const result = await shop_car_collection.find({_id:+id}).toArray()
    if(result.length<1) response.json({code:-1,msg:'id错误'})
    let order_status = 1
    let commodity = request.body.commodity_id ||result[0].commodity_id
    let number = +(request.body.number ||result[0].number)
    const update_time = new Date()
    const all_result =await shop_car_collection.updateOne({_id:+id},{$set:{number,commodity,order_status,update_time}});
    client.close()
    if(all_result.acknowledged){
        response.json({
            code : 200,
            msg :'更新成功'
        })
    }else{
        response.json({
            code :-1,
            msg : "更新失败"
        })
    }



})


//获取当前账号购物车订单信息
router.get('/shop_car',async(request, response)=>{
    let id = 2
    let result_all =[]
    // console.log(111);xx
    await client.connect()
    const db = client.db('902')
    const shop_car_collection = db.collection('shop_car')
    // let result_one = await shop_car_collection.find({_id:+id}).toArray()
    let result = await shop_car_collection.aggregate([
        { 
            "$lookup":{
                 "from":"user",
                 "localField":"user",
                 "foreignField":"_id", 
                 "as":"docs_member"
                }
        },
        {
             "$lookup":{ 
                "from":"commodity", 
                "localField":"commodity",
                "foreignField":"_id",
                 "as":"comdy"
                }
        },
        {
            $unwind:"$docs_member"
        },
        {
             $project :{
                _id : 0,
                "docs_member._id":0,
                "docs_member.password":0,
                "docs_member.age":0
                }
        }
    ]).toArray()
    result.forEach(item =>{
        // console.log(id);
        // console.log(item);
        if (id == item.user){
            result_all.push(item)
        }
    })
    if(result_all.length>0){
        response.json(result_all)

    }else{
        response.json({msg:'购物车为空'})
    }
})





// db.shop_car.aggregate([{ "$lookup":{ "from":"user", "localField":"user","foreignField":"_id", "as":"docs_member"}},{$unwind:"$docs_member"},{ $project :{_id : 0,"docs_member._id":0 }}]).pretty()

module.exports = router