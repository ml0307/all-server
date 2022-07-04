const jwt = require('jsonwebtoken')
const fs = require('fs')
const {resolve}=require('path')
const express = require('express')
let public_key = fs.readFileSync(resolve('uit','public_key.pem'))
let private_key =fs.readFileSync(resolve('uit','private_key.pem'))
// console.log(public_key);

class JWT{
    public_key=public_key
    private_key=private_key
    jwt=jwt
    constructor(){}
    sign(payload={},expiresIn =60){
        return jwt.sign(payload,this.private_key,{algorithm:'RS256',expiresIn})
    }
    verify(token){
        try {
            const result = jwt.verify(token,this.public_key,{algorithm:'RS256'})
            return {
                code:200,
                data:result
            }
            

        } catch (e) {
            switch(e.message){
                case "jwt expired":
                    return {
                        code:40001,
                        msg: '认证过期'
                    }
                case "invalid token":
                    return {
                        code:40001,
                        msg: '认证失败'
                    }
                case "jwt malformed":
                    return {
                        code:40003,
                        msg:'错误token'
                    }
                case "invalid signature":
                    return {
                        code:40004,
                        msg:'签名认证失败'
                    }
                default :
                    return {
                        code:40005,
                        msg: '未知错误'
                    }
            }
        }

    }
}
module.exports = new JWT()

// const token = jwt.sign({
//     'id':1215454
//     },
//     private_key,
//     {
//         algorithm:'RS256',
//         expiresIn: 60*60
        
//     }
// )
// // console.log(a);
// let result = jwt.verify(token,public_key,{algorithm:'RS256'})
// console.log(result);