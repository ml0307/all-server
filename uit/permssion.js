const jwt = require("./token");
module.exports = (request,response,next)=>{
    // console.log(request.headers);
    // let a =0 
    // console.log(a);
    // next()
    // console.log(req);
    let token = request.headers.authorization
    console.log(token);
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
    }else{
        response.json(result)
    }
    // console.log(1111);
    // next()

}