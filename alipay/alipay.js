const AlipaySdk = require('alipay-sdk').default
const  AlipayFormData =require('alipay-sdk/lib/form').default
const fs = require('fs')
const {resolve} =require('path')

// console.log(a);
let alipaySdk = new AlipaySdk({
    // 参考下方 SDK 配置
    appId: '2021000121611668',
  
    privateKey: fs.readFileSync(resolve('alipay','private_key.pem'), 'ascii'),
    alipayPublicKey:fs.readFileSync(resolve('alipay','public_key.pem'), 'ascii'),
    gateway:'https://openapi.alipaydev.com/gateway.do'
  });




module.exports = {
  AlipayFormData,
  alipaySdk
}


  // async function fn(){ 
  //   const formData = new AlipayFormData();
  //   // 调用 setMethod 并传入 get，会返回可以跳转到支付页面的 url
  //   formData.setMethod('get');
  //   formData.addField('notifyUrl', 'http://127.0.0.1:5500/index.html');
  //   formData.addField('bizContent', {
  //     outTradeNo: 2545845,
  //     totalAmount: '999999',
  //     subject: '商品', 
  //     productCode: 'FAST_INSTANT_TRADE_PAY',
  //   });
  //   formData.addField('returnUrl','http://127.0.0.1:5500/index.html')
  //   const result = await alipaySdk.exec('alipay.trade.page.pay',{},{ formData: formData });
    
  //   // result 为可以跳转到支付链接的 url
  //   console.log(result);
  // }
  // fn()