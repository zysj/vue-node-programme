var sqlUtil = require("../utils/sqlUtil");
var sqlMap = require("../sqlMap/userMap");

module.exports = {
	selectUsers:function(limit){
		return sqlUtil.pageLimitForSql(sqlMap.queryUser,limit);
	},
	queryEnterprisesByEntType:function(limit,qParams){
		var sqlBody ={};
		sqlBody.sql = sqlUtil.pageLimitForSql(sqlMap.queryEnterpriseByEntType(qParams).sql,limit);
		sqlBody.params = sqlMap.queryEnterpriseByEntType(qParams).params;
		return sqlBody;
	},
	checkLoginName(qParams){
		return {
			sql:sqlMap.checkRepeatName(qParams).sql,
			params:sqlMap.checkRepeatName(qParams).params
		}
	},
	loginDao(user){
		return{
			sql:sqlMap.loginSql(user).sql,
			params:sqlMap.loginSql(user).params
		}
	}
}