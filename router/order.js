const express = require('express')
const router = express.Router()
const permssion = require('../uit/permssion')
const client = require('../db/index')
const { response } = require('express')
const {alipaySdk,AlipayFormData} = require('../alipay/alipay')
const urllib = require('urllib')
const {v1:uuid} = require('uuid')

//生成订单
router.post('/order',async(request,response)=>{
    let order_number = uuid()
    let user = request.body.user_id
    let commodity = request.body.commodity_id
    let number = request.body.number
    let returnUrl = request.body.returnUrl
    let order_status = request.body.order_status
    if(returnUrl==undefined) response.json({code:1,msg:'returnUrl必传'})

    await client.connect()
    const db = client.db('902')
    const order_collection = db.collection('order')
    const result_all = await order_collection.find().toArray()
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
    const result = await order_collection.insertOne({_id:+id,user,number,order_status,commodity,order_number,creat_time,update_time})
    client.close()
    if(result.acknowledged){
        try {
            const formData = new AlipayFormData();
          // 调用 setMethod 并传入 get，会返回可以跳转到支付页面的 url
          formData.setMethod('get');
          formData.addField('notifyUrl', returnUrl);
          formData.addField('bizContent', {
            outTradeNo: order_number,
            totalAmount: '999999',
            subject: '商品', 
            productCode: 'FAST_INSTANT_TRADE_PAY',
          });
          formData.addField('returnUrl',returnUrl)
          const result1 = await alipaySdk.exec('alipay.trade.page.pay',{},{ formData: formData });
          response.end(result1)
          // result 为可以跳转到支付链接的 url
        } catch (e) {
            console.log(e);
        }
    }else{
        response.json({
            code :-1,
            msg : '添加失败'
        })
    }
})

module.exports = router