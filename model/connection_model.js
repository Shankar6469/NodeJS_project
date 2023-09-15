const mongoose = require('mongoose')
var monsoose = require('mongoose')
var url =('mongodb://127.0.0.1:27017/admin_details')
monsoose.connect(url)
console.log('connected to mongoose')
var db=mongoose.connection
module.exports = db