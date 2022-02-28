/*
 * @Author: your name
 * @Date: 2022-02-25 17:50:01
 * @LastEditTime: 2022-02-25 18:06:55
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \vue3g:\nodejs_test\express_demo\common\http_utils.js
 */
/*
 * @Author: your name
 * @Date: 2022-02-22 12:45:40
 * @LastEditTime: 2022-02-25 17:39:18
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \vue3g:\nodejs_test\express_demo\utils.js
 */
var enums = require("./enum") 
var url = require("url")
var utils = require("./utils")

class httpUtils {
    //获取重复消息的key
     
    repeatLimitMap = {}
    
    getRepeatMsgKey = function (ctx) {
        let reqBody = utils.getReqBody(ctx)
        let device = reqBody.device
        let key = device + ctx.header['user-agent']

        var router_key = utils.getRouterKey(url.parse(ctx.url).pathname)
        if (enums.REPEAT_PARAM[router_key] != null) {
            let param_list = enums.REPEAT_PARAM[router_key]
            if (param_list != null) {
                param_list.forEach(element => {
                    key = key + reqBody[element]
                })
            }
        }
        return key
    }

    //检查是否重复发送
    msgCheckRepeat = function (ctx, expireTime) {
        let key = this.getRepeatMsgKey(ctx)

        if (this.repeatLimitMap[key] == null) {
            this.repeatLimitMap[key] = Date.now() + expireTime
            return false
        } else {
            if (this.repeatLimitMap[key] < Date.now()) {
                this.repeatLimitMap[key] = Date.now() + expireTime
                return false
            } else {
                return true
            }
        }
    }

    //删除该消息
    CompleteCheckRepeat = function (ctx) {
        console.log("CompleteCheckRepeat delete befor:", this.repeatLimitMap)
        let key = this.getRepeatMsgKey(ctx)
        delete this.repeatLimitMap[key]
        console.log("CompleteCheckRepeat delete after:", this.repeatLimitMap)
    }
}

module.exports = new httpUtils()