var  mysql =  require("mysql");
var set = require("./Setting");
var pool = mysql.createPool(set.poolSetting);


module.exports = pool;