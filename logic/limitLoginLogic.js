/*
 * @Author: your name
 * @Date: 2022-02-25 18:29:22
 * @LastEditTime: 2022-02-28 10:30:44
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \vue3g:\nodejs_test\express_demo\logic\limitLoginLogic.js
 */
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

class LimitLoginLogic {
    constructor() {
    }

    //检查黑名单
    checkIpLimitLogin = async function(ctx) {
        let ip = utils.getIp(ctx)
        console.log("---checkIpLimitLogin---", ip)

        if (ip != "") {
            let dbLimitIp = await dbDao.findOne('LimitIpLoginMode', {
               ip:ip,
            })

            console.log("dbLimitIp:", dbLimitIp, dbLimitIp != null)
            if (dbLimitIp != null) {
                return true
            }
        }
        return false
    }

    //检查account现在

    //检查token限制

}

module.exports = new LimitLoginLogic()