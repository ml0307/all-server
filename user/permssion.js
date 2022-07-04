
const jwt = require('./token')
module.exports = (request,response,next)=>{
    let token = request.headers.authorization
    // console.log(token);
    if(!token){
        response.json({
            code:'50000',
            msg:'未登录，请先登录'
        })
        return
    }
    
    token = token.split(' ')[1]
    console.log(token);
    const result = jwt.verify(token)
    if(result.code==200){
        // console.log(111);
        // response.json(result)
        next()
        return result
    }else{
        response.json(result)
    }
}