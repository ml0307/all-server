const express = require('express')
const router = express.Router()
const multer =require('multer')

let path = require("path");
let fs = require("fs");

let upload = multer({dest:'head_portrait'})
router.post('/file',upload.single(),(req,res)=>{   // file 与前端input 的name属性一致


  console.log(req);
//   2. 上传的文件信息保存在req.file属性中
    let oldName = req.file.path; // 上传后默认的文件名 : 15daede910f2695c1352dccbb5c3e897
    let newName = 'head_portrait/'+req.file.originalname  // 指定文件路径和文件名
    // 3. 将上传后的文件重命名
    fs.renameSync(oldName, newName);
    // 4. 文件上传成功,返回上传成功后的文件路径
    res.json({
        err: null,   
        url: "http://localhost:3000/" +newName // 复制URL链接直接浏览器可以访问
    });
console.log(1);
})


module.exports= router