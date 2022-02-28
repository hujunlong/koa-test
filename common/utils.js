/*
 * @Author: your name
 * @Date: 2022-02-22 12:45:40
 * @LastEditTime: 2022-02-25 18:26:37
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \vue3g:\nodejs_test\express_demo\utils.js
 */
var md5 = require('md5-node')
var enums = require("./enum")
var nodemailer = require("nodemailer")
var url = require("url")
var dbDao = require("../dao/dbDao")

class utils {
    constructor(){
        this.encryptKey = enums.encryptKey
        this.HTTP_MD5_PARAM = enums.HTTP_MD5_PARAM
    }
    
    //排序
    short_http_param = function (key) {
        if (Object.prototype.hasOwnProperty.call(this.HTTP_MD5_PARAM, key)) {
            let params = this.HTTP_MD5_PARAM[key]

            //每个消息都有divice,所有就在这里进行添加
            params.push('device')
            params = params.sort((a, b) => a < b ? -1 : 1)
            return params
        } else {
            console.error(`not find key = ${key}`)
            return
        }
    }

    //进行md5校验 字段为number
    check_md5 = function (key, request_data) {
        let response = {}
        if (enums.OPEN_TEST) {
            response = { error: enums.ERR_CODE.SUCCESS }
            return response
        }

        let sort_result_params = this.short_http_param(key)
        console.log("---check_md5 sort params---", sort_result_params, "request_data=", request_data)
        
        //检查是否有路由参数请求
        if (typeof (sort_result_params) == 'undefined'){
            response = { error: enums.ERR_CODE.ROUTER_ERROR }
            return response 
        }

        //对应路由参数检查
        if (!request_data instanceof Object) { 
            console.error(`check_md5 not find ${key}`)
            response = { error: enums.ERR_CODE.PARAMETER_ERROR}
            return response
        }

        let preStr = ''
        for (key in sort_result_params) {
            let param = sort_result_params[key] 
            //如果没有传，则返回参数不全
            
            if (typeof request_data[param] == 'undefined') {
                response = { error: enums.ERR_CODE.PARAMETER_ERROR }
                return response
            }

            if (typeof request_data[param] === 'number' || typeof request_data[param] === 'string') {
                preStr = preStr + param + '=' + request_data[param] + "&"
            }
        }

        preStr = preStr + "key=" + this.encryptKey
        console.log("md5 preStr:", preStr, "md5:", md5(preStr))

        if (md5(preStr) === request_data.md5) {
            response = { error: enums.ERR_CODE.SUCCESS }
            return response
        }
        
        response = { error: enums.ERR_CODE.MD5_ERROR }
        return response
    }

    //获取传入的对象字段
    getReqBody = function(ctx) {
        let reqBody
        if (ctx.method == 'GET') {
            reqBody = ctx.query
        } else if (ctx.method == 'POST') {
            reqBody = ctx.request.body
        } else {
            console.log("request not avalilable url=", ctx.url)
            return
        }
        return reqBody
    }

    //获取路由字段
    getRouterKey = function (url) {
        if (typeof url != "string") {
            console.log(`getRouterKey url = ${url}`)
            return
        }
        var array_list = url.split('/')
        if (array_list.length > 0) {
            return array_list[array_list.length - 1]
        }
    }

    //添加desc
    addErrorDesc = function (ctx) {
        let body = ctx.response.body
        if (typeof body.error != 'undefined') {
            body.desc = enums.ERR_DESC[body.error]
            ctx.response.body = body
        } 
    }

    //发送邮件
    sendMail = async function (to_mail, subject, text) {
        let is_send_sucess = false

        console.log("enums.MAIL_CFG.MAIL_USER:", enums.MAIL_CFG.MAIL_USER, "enums.MAIL_CFG.PASS:", enums.MAIL_CFG.PASS)

        let transporter = nodemailer.createTransport({
            host: "smtp.163.com",
            port: 465,
            secure: true, // true for 465, false for other ports
            auth: {
                user: enums.MAIL_CFG.MAIL_USER,  
                pass: enums.MAIL_CFG.PASS,  
            },
        })

        let mail_info = {
            from: enums.MAIL_CFG.FROM_MAIL, // sender address
            to: to_mail, // list of receivers
            subject: subject, // Subject line
            text: text, // plain text body
        }
        console.log('mail_info:', mail_info)

        let info = await transporter.sendMail(mail_info)
        console.log("transporter resturn info:", info)
        
        if (info.messageId) { //有值发送成功
            is_send_sucess = true
        }

        return is_send_sucess
    }

    //获取ip
    getIp = function(ctx) {
        let req = ctx.req
        let ipstr = ctx.header['x-forwarded-for'] || 
                    (req.connection && req.connection.remoteAddress) ||
                    (req.socket && req.socket.remoteAddress) ||
                    (req.connection && req.connection.socket && req.connection.socket.remoteAddress) ||
                    ""
        if (ipstr.startsWith("::ffff:")) {
            return ipstr.substring(7)
        }
        return ipstr
    }
}
module.exports = new utils()