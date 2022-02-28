/*
 * @Author: your name
 * @Date: 2022-02-16 18:25:30
 * @LastEditTime: 2022-02-28 11:16:19
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \vue3g:\nodejs_test\express_demo\index.js
 */
var url = require("url")
var koa = require("koa")
var router = require('koa-router')()
var app = new koa()
var dealRoute = require("./logic/dealRouter")
var utils = require('./common/utils')
var httpUtils = require('./common/httpUtils')
var limitLoginLogic = require("./logic/limitLoginLogic")
var enums = require("./common/enum")

//添加前置中间件
const befor_middler = async(ctx)=>{
        let response = {}
        //对连续持续发送的消息进行校验 3000毫秒进行限制
        if (httpUtils.msgCheckRepeat(ctx, 3000)) {
            console.log("重复发送消息")
            response = { error: enums.ERR_CODE.INVALID_DATA_ERROR }
            return response
        }

        //黑名单
        let ip_is_limit = await limitLoginLogic.checkIpLimitLogin(ctx)
        if (ip_is_limit) {
            response = {error: enums.ERR_CODE.INVALID_DATA_ERROR}
            return response
        }
           
        //进行自动校验
        var request_body = utils.getReqBody(ctx)
        var router_key = utils.getRouterKey(url.parse(ctx.url).pathname)
        if (router_key == 'favicon.ico'){
            return
        }
        console.log(`request_body:`,{request_body} ,`router_key: ${router_key}`)
    
        //进行MD5检查
        let md5_result = utils.check_md5(router_key, request_body)
        if (md5_result.error != enums.ERR_CODE.SUCCESS) {
            return md5_result
        }

        //TODO 进行其他检查
        return { error: enums.ERR_CODE.SUCCESS}
   // })   
}

app.use(async (ctx,next)=>{
    //console.log("ctx:", ctx)
    const start_time = Date.now()
    var response_msg = await befor_middler(ctx)
    console.log("befor_middler result=", response_msg)
    if (response_msg.error != enums.ERR_CODE.SUCCESS){
        ctx.response.body = response_msg
        
        httpUtils.CompleteCheckRepeat(ctx) //移除消息
        utils.addErrorDesc(ctx)
        return
    }
    
    await next()
    const use_ms = Date.now() - start_time
    ctx.set('X-Response-Time', use_ms)
    console.log(`${ctx.url} use_ms = ${use_ms}ms`)
})

//添加路由
function add_router() {
    for (var key in dealRoute) {
        var result = key.split(' ')
        if (typeof (result) == "object") {
            if (result[0] == 'GET') {
                router.get(result[1], dealRoute[key])
                console.log("add get router:", result[0], result[1])
            } else if (result[0] == 'POST') {
                router.post(result[1], dealRoute[key])
                console.log("add post router:", result[0], result[1])
            }
        } else {
            console.error("add Router error")
        }
    }
}

//启动路由
add_router()
app.use(router.routes()) 
app.use(router.allowedMethods())

//添加后置中间件
const afterMiddler = async (ctx) => {
    utils.addErrorDesc(ctx)
    httpUtils.CompleteCheckRepeat(ctx) //移除消息
}

app.use(async (ctx,next)=>{
    var result = await afterMiddler(ctx)
    await next()
})


app.on('error', err => {
    console.error('server error', err)
});


 
app.listen(3000)