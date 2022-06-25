const express=require('express')
const md5 = require('md5')
const { ObjectId } = require('mongodb')
const {join} = require('path')
const router =express.Router()
const client = require('../db/index')
const permssion = require('../uit/permssion')
const jwt = require('../uit/token')
// console.log(jwt);
console.log(permssion);
// console.log(permssion);



router.post('/test',async (request,response)=>{
    let usename = request.body.usename
    let password = request.body.password
    password = md5(password)
    // console.log(password);
    await client.connect()
    const db =client.db('902')
    const huawei_collection = db.collection('huawei')

    const find_result =  await huawei_collection.find({usename}).toArray().length
    console.log(find_result);
    if(find_result>0){
        response.json({
            code :'用户名已存在',
            msg : '添加失败'
        })
        client.close()
    return

    }

    const result =  await huawei_collection.insertOne({usename,password})
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
    // console.log(result);
})



//登录
router.post('/test/sign',async(request,response)=>{
    let usename = request.body.usename
    let password = request.body.password
    console.log(usename);
    password=md5(password)
    console.log(password);
    await client.connect()
    let db  = client.db('902')
    let huawei_collection = db.collection('huawei')

    const find_result = await huawei_collection.find({usename}).toArray()
    const all_result = await huawei_collection.find({usename,password}).toArray()
// console.log(all_result.length)
    client.close()
    if(find_result.length<1){
        response.json({
            code :'用户名不存在',
            msg : '用户名不存在'
        })
    return
    }else if (all_result.length>0){
        const token =jwt.sign({id: all_result[0]._id},60*60*12 )
        console.log(token);
        response.json({
            code :'登录成功',
            token,
            msg : '登录成功'
        })
        return
    }else{
        response.json({
            code :'登录失败',
            msg : '密码错误'
        })
        return
    }

})

router.get ('/test',permssion,async(request, response)=>{
    await client.connect()
    const db = client.db('902')
    const huawei_collection = db.collection('huawei')
    const result =await huawei_collection.find().toArray()
    result.forEach(item=>{
        delete item.password

    })
    response.json(result)
    client.close()
})

router.put('/test',async(request,response)=>{
    let password = request.body.password
    let usename = request.body.usename
    let _id = request.body.id
    if(_id==undefined) res.json({code:1,msg:'id必传'})
    client.connect()
    let db = client.db('902')
    let huawei_collection = db.collection('huawei')
    let result  = await  huawei_collection.find({_id: ObjectId(_id)}).toArray()
    if(result.length<1) res.json({code:1,msg:'id错误'})

    const all_result =await huawei_collection.update({_id: ObjectId(_id)},{$set:{usename,password}});
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



router.delete('/test',async(request,response)=>{
    let _id = request.body.id
    if(_id==undefined) res.json({code:1,msg:'id必传'})
    client.connect()
    let db = client.db('902')
    let huawei_collection = db.collection('huawei')
    let result  = await huawei_collection.find({_id: ObjectId(_id)}).toArray().length
    if(result<1) res.json({code:1,msg:'id错误'})


    const all_result =await huawei_collection.remove({_id: ObjectId(_id)});
    console.log(all_result);
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

module.exports =router