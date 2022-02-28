/*
 * @Author: your name
 * @Date: 2022-02-16 18:26:28
 * @LastEditTime: 2022-02-28 11:17:29
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \vue3g:\nodejs_test\express_demo\mongoose.js
 */
var mongoose = require("mongoose")
var config = require("../../config/config")
var models = require("./models")


class MongoClient  {
    constructor(){
        console.log("mongoclient.js constructor")
        this.mongo_url = config.mongodb
        
        this.connect() //创建连接
        this.loadMode() //加载model
    }
    
    connect() {
        this.db = mongoose.createConnection(this.mongo_url)
        this.db.on('error', function () {
            console.log("---mongodb 错误---")
        })

        this.db.once('open', () => {
            console.log("mongodb connect sucess ...")
        })
    }

    loadMode() { 
        //加载所有的数据模型
        for (let key in models) {
            console.log("load model key:", key)
            this[key] = this.db.model(key, new mongoose.Schema(models[key]))
        }
    }
}

module.exports = new MongoClient()
 