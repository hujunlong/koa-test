/*
 * @Author: your name
 * @Date: 2022-02-22 12:46:01
 * @LastEditTime: 2022-02-25 19:05:42
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \vue3g:\nodejs_test\express_demo\enum.js
 */

const ERR_CODE = {
    SUCCESS: 0,
    SERVER_UPDATING: 1,
    NOTLOGIN: 3,
    /**验证码失效 */
    VERRICODE_INVALID: 4,
    QUERE_NO_DATA: 5,
    PASSWORLD_ERR: 6,
    REPEAT_REGISTER_MAIL_ERR : 7,
    SAVE_DB_ERROR : 8,
    MD5_ERROR : 9,
    ROUTER_PATH_ERROR : 10,
    REPEAT_LOGIN_ERROR : 11,
    LOGIN_TOKEN_OR_ACCOUNT_ERROR : 12,
    PARAMETER_ERROR :13,
    ROUTER_ERROR:14,
    MAIL_SEND_ERROR:15,
    MAIL_FORMAT_ERROR : 16,
    REPEAT_SEND_MAIL_ERROR:17,
    INVALID_DATA_ERROR:18,
}

const ERR_DESC = {
    [ERR_CODE.SUCCESS]: "成功",
    [ERR_CODE.SERVER_UPDATING]: "服务器更新中",
    [ERR_CODE.NOTLOGIN]: "未进行登陆",
    [ERR_CODE.VERRICODE_INVALID]: "验证码失效",
    [ERR_CODE.QUERE_NO_DATA]: "数据查询失败",
    [ERR_CODE.PASSWORLD_ERR]: "账号密码错误",
    [ERR_CODE.REPEAT_REGISTER_MAIL_ERR]: "该邮箱已经被注册",
    [ERR_CODE.SAVE_DB_ERROR]: "数据库写入失败",
    [ERR_CODE.MD5_ERROR]: "md5校验错误",
    [ERR_CODE.ROUTER_PATH_ERROR]:"无法解析该路由",
    [ERR_CODE.REPEAT_LOGIN_ERROR]: "重复登陆",
    [ERR_CODE.LOGIN_TOKEN_OR_ACCOUNT_ERROR]: "token或者account错误",
    [ERR_CODE.PARAMETER_ERROR]: "参数不全",
    [ERR_CODE.ROUTER_ERROR]: "路由不正确",
    [ERR_CODE.MAIL_SEND_ERROR]: "邮件发送失败",
    [ERR_CODE.MAIL_FORMAT_ERROR]: "邮箱格式填写不正确",
    [ERR_CODE.REPEAT_SEND_MAIL_ERROR]: "发送邮件太频繁,请稍后发送",
    [ERR_CODE.INVALID_DATA_ERROR]: "无效数据",
}

const encryptKey = "test" //加密http通信的key
const OPEN_TEST = true //开启测试 不进行md5校验
const HEART_BEAT_CHECK = 10*1000 //心跳30秒检查一次
const HEART_TIME_OUT = 30*1000 //心跳超时为120秒
const TOKEN_TIME_OUT = 24*3600 * 1000 //token过期时间为1天

const MAIL_CFG = {
    FROM_MAIL : 'junlong622@163.com', //配置服务器发送的邮件
    MAIL_USER: "junlong622@163.com",
    PASS: "",
    REGISTER_SUBJECT:"验证码信息",
    REGISTER_TEXT:"您收到的验证码信息为:{},有效时间20分钟",
    TIME_OUT: 20*60*1000,//20分钟过期
    REPEAT_LIMIT: 60*1000,//发送频率现在为1分钟内不能重复发送
    CHECK_TIMEOUT_INTERVAL:60*1000,//检查邮件过期频率为1分钟检查一次
}

//http md5检查
//注意 每个消息都有 device
const HTTP_MD5_PARAM = {
    login: ["account", "password", "devicetype", "ip", "browsertype"],
    logintoken: ["account", "token", "devicetype", "ip", "browsertype"],
    register: ["password", "email", "vericode", "devicetype", "ip", "browsertype", "url"],
    getcode: ["email"],
} 

//需要判断重复的
const REPEAT_PARAM = {

}

module.exports = {
    ERR_CODE : ERR_CODE,
    ERR_DESC : ERR_DESC,
    HEART_BEAT_CHECK: HEART_BEAT_CHECK,
    HEART_TIME_OUT : HEART_TIME_OUT,
    TOKEN_TIME_OUT: TOKEN_TIME_OUT,
    MAIL_CFG: MAIL_CFG,
    OPEN_TEST: OPEN_TEST,
    encryptKey:encryptKey,
    HTTP_MD5_PARAM:HTTP_MD5_PARAM,
    REPEAT_PARAM: REPEAT_PARAM,
}