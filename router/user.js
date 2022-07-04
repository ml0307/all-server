const express = require('express')
const {ObjectId} = require('mongodb')
const router = express.Router()
const client = require('../db/index')
const md5 = require('md5')
const jwt = require('../user/token')
const permssion =  require('../user/permssion')
const { response, request } = require('express')
const multer = require('multer')
const upload = multer({ dest: 'active/' })





//用户注册
router.post('/owner/register',async (request,response)=>{
    let username = request.body.username
    let password = request.body.password
    let age = request.body.age
    let gender = request.body.gender
    let phone_number =request.body.phone_number
    let wallet = 0.00
    let avarat ='http://localhost:3000/touxiang/4.webp'
    wallet = wallet.toFixed(2)
    console.log(wallet);
    password = md5(password)
    // console.log(password);
    await client.connect()
    const db =client.db('902')
    const user_collection = db.collection('user')

    const find_result =  await user_collection.find({username}).toArray()
    const result_all = await user_collection.find().toArray()

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
    const result =  await user_collection.insertOne({_id:+id,username,password,age,gender,phone_number,wallet,avarat,creat_time,update_time})
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


//个人账号登录
router.post('/owner/sign',async(request,response)=>{
    let username = request.body.username
    let password = request.body.password
    console.log(username);
    password=md5(password)
    console.log(password);
    await client.connect()
    let db  = client.db('902')
    let user_collection = db.collection('user')


    const find_result = await user_collection.find({username}).toArray()
    const all_result = await user_collection.find({username,password}).toArray()
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

//获取当前账号信息
router.post('/owner',permssion,async(request,response)=>{
    let token = request.headers.authorization
    console.log(token);
    token = token.split(' ')[1]
    let result_jwt = jwt.verify(token)
    let id = result_jwt.data.id
    await client.connect()
    const db = client.db('902')
    const user_collection = db.collection('user')
    
    let  result =await user_collection.find({_id:+id}).toArray()
        result = result[0]
        delete result.password

    response.json(result)
    client.close()
})

//个人信息修改,id必传
router.put('/owner/modify',permssion,async(request,response)=>{

    let id = request.body.id
    if(id==undefined) res.json({code:1,msg:'id必传'})
    client.connect()
    let db = client.db('902')
    let user_collection = db.collection('user')
    let result = await user_collection.find({_id:+id}).toArray()
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
        console.log(find_result);
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
    const all_result =await user_collection.updateOne({_id:+id},{$set:{username,password,age,gender,phone_number,update_time}});
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


//注销账号,id必传
router.delete('owner/delete',permssion,async(request,response)=>{
    let id = request.body.id
    if(id==undefined) res.json({code:1,msg:'id必传'})
    client.connect()
    let db = client.db('902')
    let user_collection = db.collection('user')
    let result  = await user_collection.find({_id: +id}).toArray()
    if(result.length<1) res.json({code:1,msg:'id错误'})


    const all_result =await user_collection.deleteOne({_id: +id});
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

