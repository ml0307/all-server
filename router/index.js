const express=require('express')
const router =express.Router()
const fs = require("fs/promises")
router.get('/owner',async(req,res)=>{
   let data =await fs.readFile("./data.json")
   res.set('content-type','application/json; charset=uft-8')
   res.end(data.toString())
})
router.post('/owner',async(req,res)=>{
    let params = req.body
    if(!Reflect.has(params,'name')) res.json({code:-1,msg:"name必传"});
    if(!Reflect.has(params,'age')) res.json({code:-1,msg:"age必传"});
    if(!Reflect.has(params,'hascar')) res.json({code:-1,msg:"hascar必传"});
    
    let data =await fs.readFile("./data.json")
    data=JSON.parse(data.toString())
    let id

    if (Object.is(+data.length, 0)) {

        id = -1
    
    } else {
        id = data[data.length - 1].id
    
    }


    let obj = {
        id:++id,
        name:params.name,
        age:params.age,
        hascar:params.hascar
    }
    data.push(obj)
    try {
        await fs.writeFile('./data.json',JSON.stringify(data))
        res.json({
            code:200,
            msg:'新增成功'
        })
        
    } catch (error) {
        res.json({
            code:-1,
            msg:'新增失败'
        })
    }

})

router.delete('/owner',async(req,res)=>{
    let newid = req.body.id
    if(newid==undefined){
       res.json({
        code:-1,
        msg:"id必传"
       }) 
    }
    let data =await fs.readFile("./data.json")
    data=JSON.parse(data.toString())
    let oldid = []
    let pd
    data.forEach((item,index)=>{
        oldid.push(item.id)
        pd = oldid.find((n)=>n==newid)
        console.log(oldid);
        console.log(pd);
        item.int = index
   
    })
    if(pd==undefined){
        res.json({
          code:-1,
          msg:'id不存在'
        })
    }else{
        data.forEach((item,index)=>{
          if(pd==item.id){
              data.splice(item.int,1)
            }
            
          delete  item.int
        })
      
    }
    console.log(pd);
    console.log(newid);
    
    try {
        await fs.writeFile('./data.json',JSON.stringify(data))
        res.json({
            code:200,
            msg:'删除成功'
        })
    } catch (error) {
        res.json({
            code:-1,
            msg:'删除失败'
        })
    }

})

router.put('/owner',async(req,res)=>{
    let params = req.body
    let id = req.body.id
    let loop = false
    if(id==undefined) res.json({code:1,msg:'id必传'})
    const keys = ['name','age','hascar']
    Object.keys(params).forEach((item)=>{
        console.log(item);
        if(!keys.includes(item)&&item!=='id'){
            loop=true
            res.json({
                code:-1,
                msg:'参数错误'
            })
        }
    })
    if(loop) return;
    let data =await fs.readFile("./data.json")
    data=JSON.parse(data.toString())
   
    let index = data.findIndex(item=>{
        if(item.id==id){
            return item
        }
    })
    Object.keys(params).forEach(item=>{
        data[index][item]=params[item]
    })

    try {
        await fs.writeFile('./data.json',JSON.stringify(data))
        res.json({
            code:200,
            msg:'新增成功'
        })
        
    } catch (error) {
       
    }

})

module.exports=router