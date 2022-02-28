/*
 * @Author: your name
 * @Date: 2022-02-17 15:08:59
 * @LastEditTime: 2022-02-25 18:32:39
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \vue3g:\nodejs_test\express_demo\dbDao.js
 */
var mongo_client = require("./mongo/mongoclient")
 
class DbDao {
    async save(modeDB, data) {
        return new Promise((resolve, reject) =>{
            console.log("save modeDB:", modeDB, "data:", data)
            var record = new mongo_client[modeDB](data)
            record.save((err, result) => {
                console.log("save() err:", err, "result:", result)
                if (err == null){
                    resolve(result)
                }else{
                    reject(err, result)
                }
            })
        }) 
    }

   async remove(modeDB, data) {
        return new Promise((resolve, reject) => {
            console.log("remove modeDB:", modeDB, "data:", data)
            var record =  mongo_client[modeDB]
            record.remove(data, (err, result) => {
                console.log("remove() err:", err, "result:", result)

                if (err == null) {
                    resolve(result)
                } else {
                    reject(err, result)
                }
            })
        })
    }

    async findOne(modeDB, data){
        return new Promise((resolve, reject) => {
            console.log("findOne modeDB:", modeDB, "data:", data)
            var record = mongo_client[modeDB]
            record.findOne(data, (err, result) => {
                console.log("findOne() err:", err, "result:", result)
                if (err == null) {
                    resolve(result)
                } else {
                    reject(err, result)
                }
            })
        })
    }
    
    //查询多条
    async find(modeDB, data)  {
        return new Promise((resolve, reject) => {
            console.log("find modeDB:", modeDB, "data:", data)
            var record =  mongo_client[modeDB] 
            record.find(data, (err, result) => {
                console.log("find() err:", err, "result:", result)

                if (err == null) {
                    resolve(result)
                } else {
                    reject(err, result)
                }
            })
        })
    }

    async findOneAndUpdate(modeDB, old_data, new_data) {
        return new Promise((resolve, reject) => {
            console.log("findOneAndUpdate modeDB:", modeDB, "old_data:", old_data, "new_data:", new_data)
            var record = mongo_client[modeDB] 
            record.findOneAndUpdate(old_data, new_data, (err, result) => {
                console.log("remove() err:", err, "result:", result)
                if (err == null) {
                    resolve(result)
                } else {
                    reject(err, result)
                }
            })
        })
    }

    async update(modeDB, old_data, new_data) {
        return new Promise((resolve, reject) => {
            console.log("update modeDB:", modeDB, "old_data:", old_data, "new_data:", new_data)
            var record = mongo_client[modeDB]
            record.update(old_data, new_data, (err, result) => {
                console.log("remove() err:", err, "result:", result)
                if (err == null) {
                    resolve(result)
                } else {
                    reject(err, result)
                }
            })
        })
    }

}
//export default new DbDao()
module.exports = new DbDao()