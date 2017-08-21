var userDao = require("../dao/userDao");
var systemUtil = require("../utils/systemUtil");
var sqlUtil = require("../utils/sqlUtil");

module.exports = {
	selectUsers:function(con,limit){
		return function(){
			return new Promise(function(resolve,reject){
				systemUtil.log({time:systemUtil.LOG_STRAT,desc:userDao.selectUsers(limit)},systemUtil.SQL);
				con.query(userDao.selectUsers(limit),sqlUtil.closeTranscation(con,resolve,reject));
			});
		}
	},
	queryEnterprisesByEntType:function(con,limit,qParams){
		return function(){
			return new Promise(function(resolve,reject){
				systemUtil.log({time:systemUtil.LOG_STRAT,desc:userDao.queryEnterprisesByEntType(limit,qParams).sql},systemUtil.SQL);
				con.query(userDao.queryEnterprisesByEntType(limit,qParams).sql,userDao.queryEnterprisesByEntType(limit,qParams).params,sqlUtil.closeTranscation(con,resolve,reject));
			});
		}
	},
	queryRepeatName(con,qParams){
		return function(){
			return new Promise(function(resolve,reject){
				con.query(userDao.checkLoginName(qParams).sql,userDao.checkLoginName(qParams).params,sqlUtil.closeTranscation(con,resolve,reject));
			});
		}
	},
	userLogin:function(con,qParams){
		return function(){
			return new Promise(function(resolve,reject){
				con.query(userDao.loginDao(qParams).sql,userDao.loginDao(qParams).params,sqlUtil.closeTranscation(con,resolve,reject));
			});
		}
	}
}