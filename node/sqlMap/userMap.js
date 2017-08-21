module.exports = {
	queryUser : "select * from pub_user",
	checkRepeatName(user){
		var sql = "select * from pub_user where 1=1 ";
		var params = [];
		if(user.loginName){
			sql += " and login_name = ?";
			params.push(user.loginName);
		}
		return {
			sql,params
		}
	},
	loginSql(user){
		var sql = "select * from pub_user where login_name = ? and password = ?";
		var params = [user.loginName,user.password];
		return {
			sql,params
		}
	}
}