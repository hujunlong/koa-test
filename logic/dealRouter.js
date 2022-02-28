/*
 * @Author: your name
 * @Date: 2022-02-21 18:17:04
 * @LastEditTime: 2022-02-25 19:08:30
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \vue3g:\nodejs_test\express_demo\route.js
 */
var dealMsgLogic = require("./dealMsgLogic")

//注册
var auth_register = async (ctx, next) => {
    var result = await dealMsgLogic.auth_register(ctx)
    ctx.response.body = result
    console.log("auth_login result:", result)
    await next()
};

//account登陆
var auth_login = async (ctx, next) => {
    var result = await dealMsgLogic.auth_login(ctx)
    ctx.response.body = result
    await next()
};


//token登陆
var fn_logintoken = async (ctx, next) => {
    var result = await dealMsgLogic.token_login(ctx)
    ctx.response.body = result
    console.log("fn_logintoken result:", result)
    await next()
};

//发送邮件
var fn_getcode = async (ctx, next) => {
    var result = await dealMsgLogic.getcode(ctx)
    ctx.response.body = result
    console.log("fn_logintoken result:", result)
    await next()
}

module.exports = {
    'GET /auth/register': auth_register,//注册
    'POST /auth/register': auth_register,//登入

    'GET /auth/login': auth_login,//登入
    'POST /auth/login': auth_login,//登入
    'GET /auth/logintoken': fn_logintoken,//根据token 登陆
    'POST /auth/logintoken': fn_logintoken,//根据token 登陆

    'GET /getcode': fn_getcode,
    'POST /getcode': fn_getcode,

    // 'GET /auth/loginOut': auth_loginOut,//登出
    // 'POST /auth/loginOut': auth_loginOut,//登出
}
