var pool = require("../runPool");
var systemUtil = require("../utils/systemUtil");
var sqlUtil = require("../utils/sqlUtil");
var userService = require("../services/userService");

module.exports = {
	loginValid
}

//登录或注册用户验证
function loginValid(val,type){
	val = $.trim(val);
	var nameReg = /([a-zA-Z0-9\.\?\!\,\_\-\+\u4e00-\u9fa5])/g;
	if(val){
		if(val.length>0 && val.length<21){
			if(type== 'loginName'){
				var result = val.match(nameReg);
				if(result && val.length == result.length){
					return true;
				}else{
					return false;
				}
			}
		}
		if(type=='password'){
			return true;
		}
	}else{
		if(type=='password'){
			return false;
		}
		if(type== 'loginName'){
			return false;
		}
	}
}