const express=require('express')
const md5 = require('md5')
const { ObjectId } = require('mongodb')
const {join} = require('path')
const router =express.Router()
const client = require('../db/index')
const permssion = require('../uit/permssion')
const jwt = require('../uit/token')
// console.log(jwt);
// console.log(permssion);


//注册管理员账号
router.post('/test',async (request,response)=>{
    
    let username = request.body.username
    let password = request.body.password
    let age = request.body.age
    let gender = request.body.gender
    let phone_number =request.body.phone_number
    let wallet = 0.00
    wallet = wallet.toFixed(2)
    password = md5(password)
    // console.log(password);
    await client.connect()
    const db =client.db('902')
    const business_collection = db.collection('business')

    const find_result =  await business_collection.find({username}).toArray()
    const result_all = await business_collection.find().toArray()
   
    if(find_result.length>0){
        response.json({
            code :'用户名已存在',
            msg : '添加失败'
        })
        client.close()
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
    const result =  await business_collection.insertOne({_id:+id,username,password,age,gender,phone_number,wallet,creat_time,update_time})
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



//登录管理员账号
router.post('/test/sign',async(request,response)=>{
    let username = request.body.username
    let password = request.body.password
    password=md5(password)
    await client.connect()
    let db  = client.db('902')
    let business_collection = db.collection('business')

    const find_result = await business_collection.find({username}).toArray()
    const all_result = await business_collection.find({username,password}).toArray()
    client.close()
    if(find_result.length<1){
        response.json({
            code :'用户名不存在',
            msg : '用户名不存在'
        })
    return
    }else if (all_result.length>0){
        const token =jwt.sign({id: all_result[0]._id},60*60*12 )
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



//获取所有用户个人账号信息
router.get ('/api/test',permssion,async(request, response)=>{
    await client.connect()
    const db = client.db('902')
    const user_collection = db.collection('user')
    let  result =await user_collection.find().toArray()
    result.forEach(item=>{
        delete item.password
    })

    response.json(result)
    client.close()
})



//修改管理员账号信息
router.put('/test',permssion,async(request,response)=>{
    
    let _id = request.body.id
    if(_id==undefined) res.json({code:1,msg:'id必传'})
    client.connect()
    let db = client.db('902')
    let business_collection = db.collection('business')
    let result  = await  business_collection.find({_id: +_id}).toArray()
    let wallet =Number( request.body.wallet ||result[0].wallet)
    wallet = wallet.toFixed(2)

    let password = request.body.password ||result[0].password
    let age = request.body.age ||result[0].age
    let gender = request.body.gender ||result[0].gender
    let phone_number =request.body.phone_number ||result[0].phone_number
    password =  md5(password)
    if(result.length<1) res.json({code:1,msg:'id错误'})

    let username = request.body.username 
    if(username == undefined){
        username = result[0].username 
    }else{
        const find_result =  await user_collection.find({username}).toArray()
        if(find_result.length>0){
            response.json({
                code :'用户名已存在',
                msg : '更新失败'
            })
            client.close()
        return
        }   
    }


    const update_time = new Date()
    const all_result =await business_collection.update({_id:+_id},{$set:{username,password,age,gender,phone_number,update_time}});
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


//删除管理员账号信息
router.delete('/test',permssion,async(request,response)=>{
    let _id = request.body.id
    if(_id==undefined) res.json({code:1,msg:'id必传'})
    client.connect()
    let db = client.db('902')
    let business_collection = db.collection('business')
    let result  = await business_collection.find({_id: ObjectId(_id)}).toArray().length
    if(result<1) res.json({code:-1,msg:'id错误'})


    const all_result =await business_collection.remove({_id: ObjectId(_id)});
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