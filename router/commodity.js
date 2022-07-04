const { response, request } = require('express')
const express = require('express')
const router = express.Router()
const client = require('../db/index')

router.post('/commodity',async(request,response)=>{

    const name = request.body.name
    const unit_price = request.body.unit_price
    await client.connect()
    const db = client.db('902')
    const comdy_collection  =  db.collection('commodity')
    const result_name = await comdy_collection.find({name}).toArray()
    const result_all = await comdy_collection.find().toArray()
    if(result_name.length>0){
       response.json({
           code : -2 ,
           msg : '该商品已存在'
       })
       return
    }


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
    const result = await comdy_collection.insertOne({_id:+id,name,unit_price,creat_time,update_time})
    client.close()
    if(result.acknowledged){
        response.json({
            code : 1 ,
            msg :'商品添加成功'
        })
    }else{
        response.json({
            code : -1,
            msg: ' 商品添加失败，请重试'
        })
    }
})

//查看商品信息
router.get('/commodity',async(request,response)=>{
    await client.connect()
    const db = client.db('902')
    const comdy_collection = db.collection('commodity')
    const result  = await comdy_collection.find().toArray()
    client.close()
    response.json(result)
})

//更改商品信息

router.put('/commodity',async(request,response)=>{
    const _id = request.body.id
    if (_id==undefined) response.json({
        code : -1,
        msg:'商品id必传'
    })

    await client.connect()
    const db = client.db('902')
    const comdy_collection = db.collection('commodity')
    const result = await comdy_collection.find({_id:+_id}).toArray()
    if(result.length<1) res.json({code:-1,msg:'id错误'})
    let name = request.body.name 

    if(name == undefined){
       naem = result[0].name 
    }else{
        const find_result =  await comdy_collection.find({name}).toArray()
        if(find_result.length>0){
            response.json({
                code :'商品已存在',
                msg : '更新失败'
            })
            client.close()
        return
        }   
    }

    let unit_price = request.body.unit_price ||result[0].unit_price
    


    const update_time = new Date()
    const all_result =await comdy_collection.update({_id:+_id},{$set:{name,unit_price,update_time}});
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




//删除商品
router.delete('/commodity',async(request,response)=>{
    const _id = request.body.id
    if (_id==undefined) response.json({
        code : -1,
        msg:'商品id必传'
    })

    await client.connect()
    const db = client.db('902')
    const comdy_collection = db.collection('commodity')
    const result = await comdy_collection.find({_id:+_id}).toArray()
    if(result.length<1) res.json({code:-1,msg:'id错误'})

    const all_result =await comdy_collection.remove({_id:+_id});
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


module.exports = router