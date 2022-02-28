/*
 * @Author: your name
 * @Date: 2022-02-21 18:59:35
 * @LastEditTime: 2022-02-25 17:42:41
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \vue3g:\nodejs_test\express_demo\dealLogic.js
 */
var dbDao = require("../dao/dbDao")
var utils = require("../common/utils")
var enums = require("../common/enum")
var md5 = require("md5-node")
var format = require("string-format")

class Logic {
    constructor(){
        this.timerStart(enums.HEART_BEAT_CHECK)
        this.timerCheckMailCode(enums.MAIL_CFG.CHECK_TIMEOUT_INTERVAL)
    }

    players_list_by_token = {}
    players_list_by_account = {}
    mail_list_code = {} //key email 

    
    //auth_register
    async auth_register(ctx) {
        let response = {}
        let request_body = utils.getReqBody(ctx)
        let db_userinfo = await dbDao.findOne('UserMode', {
            account: request_body.email,
        })

        if (db_userinfo) {
            response = { error: enums.ERR_CODE.REPEAT_REGISTER_MAIL_ERR }
            return response
        } else {
            let db_save_result = await dbDao.save('UserMode', {
                account: request_body.email,
                password: request_body.password,
                vericode: request_body.vericode,
                devicetype: request_body.devicetype,
                ip: request_body.ip,
                browsertype: request_body.browsertype,
                url: request_body.url,
            })

            if (!db_save_result) {
                response = { error: enums.ERR_CODE.SAVE_DB_ERROR }
                return response
            }
        }

        //注册成功
        response = { error: enums.ERR_CODE.SUCCESS }
        return response
    }          
    
    async auth_login(ctx){
        let response = {}
        let request_body = utils.getReqBody(ctx)

        //检查是否已经登陆了
        if (this.players_list_by_account[request_body.account]) {
            response = { error: enums.ERR_CODE.REPEAT_LOGIN_ERROR }
            return response
        }
        
        let db_userinfo = await dbDao.findOne('UserMode', {
            name: request_body.account,
            password: request_body.password,
        })
   
        console.log("auth_login:" + db_userinfo)
        if (db_userinfo) {
            response = {error: enums.ERR_CODE.SUCCESS}

            let account = request_body.account
            //登陆成功后将数据加载到内存中
            this.players_list_by_account[account] = db_userinfo
            //产生新的token 
            let token = md5(Date.now() + request_body.account)
            
            //根据token产生验证登陆信息
            this.players_list_by_account[account].token = token
            ctx.cookies.set('token', token)

            this.players_list_by_account[account].last_time = Date.now() 
            console.log("---this.players_list_by_account[account]---", this.players_list_by_account[account])
            
            this.players_list_by_token[token] = this.players_list_by_account[account]

            response.roleinfo = this.players_list_by_account[account]
            dbDao.update('UserMode', { account : account}, this.players_list_by_account[account])

            console.log("this.players_list_by_account=", this.players_list_by_account, "this.players_list_by_token=", this.players_list_by_token)
        } else { 
            response = {error: enums.ERR_CODE.PASSWORLD_ERR}
        }
        return response
    } 
    
    async token_login(ctx) {
        console.log("--token_login---", ctx.cookies.get('token'))
        let request_body = utils.getReqBody(ctx)

        let response = {}
        //检查是否已经登陆了
        if (this.players_list_by_token[request_body.token]) {
            response = { error: enums.ERR_CODE.REPEAT_LOGIN_ERROR }
            return response
        }

        let result = await dbDao.findOne('UserMode', {
            name: request_body.account,
            token: request_body.token,
        })

        if (result){
            response = {error: enums.ERR_CODE.SUCCESS}
        }else{
            response = { error: enums.ERR_CODE.LOGIN_TOKEN_OR_ACCOUNT_ERROR }
            return response
        }

        let account = result.account
        result.last_time = Date.now()
        this.players_list_by_account[account] = result
        this.players_list_by_token[request_body.token] = result
        dbDao.update('UserMode', { account: account }, this.players_list_by_account[account])

        return response
    }
   
    //获取邮件验证码
    async getcode(ctx) {
        let response = {}

        let request_body = utils.getReqBody(ctx)

        let to_email = request_body.email

        //重复检查
        if (this.mail_list_code[to_email] && 
            this.mail_list_code[to_email].send_time + enums.MAIL_CFG.REPEAT_LIMIT > Date.now()) {
            response = { error: enums.ERR_CODE.REPEAT_SEND_MAIL_ERROR }
            return response
        }

        //邮件检查
        var reg = /^\w+@[a-zA-Z0-9]{2,10}(?:\.[a-z]{2,4}){1,3}$/
        if (!reg.test(to_email) ) {
            response = { error: enums.ERR_CODE.MAIL_FORMAT_ERROR }
            return response
        }

        //产生6位随机数
        const base_num = 100000
        const rand_num_str = toString(parseInt(Math.random() * 900000) + base_num)
    
        //发送邮件
        let text = format(enums.MAIL_CFG.REGISTER_TEXT, rand_num_str)//邮件内容 
       
        let is_send_sucess = await utils.sendMail(to_email, enums.MAIL_CFG.REGISTER_SUBJECT, text)
        if (is_send_sucess){
            response = { error: enums.ERR_CODE.SUCCESS , text:text}
            
            let send_mail_item = {
                code: rand_num_str, 
                send_time:Date.now(),
            }

            //记录上次发送的请求时间，用来验证邮件信息
            this.mail_list_code[to_email] = send_mail_item

            //TODO 存储
        }else {
            response = { error: enums.ERR_CODE.MAIL_SEND_ERROR}
        }
        
        return response
    }

    //定时心跳
    async timerStart(milliseconds){
        this.timerHeartToken = setInterval(() => {
            for (let account in this.players_list_by_account){
                if (this.players_list_by_account[account].last_time + enums.HEART_TIME_OUT < Date.now())  {
                    let token = this.players_list_by_account[account].token
                    delete this.players_list_by_token[token]
                    delete this.players_list_by_account[account]
                }
            }

            console.log("开启心跳检查")
        }, milliseconds);
    }

    //开启邮件过期检测
    async timerCheckMailCode(milliseconds) {
        this.timerToken = setInterval(() => {
            let is_need_save_db = false
            for (let email in this.mail_list_code) {
                if (this.mail_list_code[email].send_time + enums.MAIL_CFG.TIME_OUT < Date.now()) {
                    delete this.mail_list_code[email]
                    is_need_save_db = true
                }
            }
            //TODO保存数据库
            console.log("开启邮件是否生效定时检查")
        }, milliseconds);
    }

}

module.exports = new Logic()