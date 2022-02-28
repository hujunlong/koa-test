/*
 * @Author: your name
 * @Date: 2022-02-25 14:10:29
 * @LastEditTime: 2022-02-28 10:37:06
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \vue3g:\nodejs_test\express_demo\dao\mongo\models.ts
 */
module.exports = {
    //注意 存储数据库: 会自动转换为小写的名字 例如:UserMode转换为usermodes  LimitIpLoginMode转换为limitiploginmodes
    //玩家信息
    UserMode : {
        account: String,
        password: String,
        devicetype: String,
        ip: String,
        browsertype: String,
        token: String,
        last_time: Number,
    },

    //登陆
    LimitIpLoginMode : {
        ip: String,
    },

    LimitAccountLoginMode: {
        account: String,
    },
}