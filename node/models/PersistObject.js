var systemUtil = require("../utils/systemUtil");
var sqlUtil = require("../utils/sqlUtil");

//把普通对象包装成持久类对象，object里面的属性必须与object所对应的表字段一一对应，可以少，但不能多。
//必须赋予表名，否则不能使用原型中的增删改查方法，并且抛出错误信息
function PersistObject(object,tableName){
	/*this.id = '';
	this.userName = '';
	this.loginName ='';
	this.password ='';
	this.email = '';
	this.cellPhone = '';
	this.userPicId = '';
	this.createTime = '';
	this.updateTime = '';
	this.country ='';
	this.province = '';
	this.city = '';*/
	/*if(user){
		for(var i in this){
			if(user[i]){
				this[i] = user[i];
			}
		}
	}*/
	if(object && object.toString() === "[object Object]"){
		for(var i in object){
			this[i] = object[i];
		}
	}else{
		throw new Error('请赋予一个普通对象');
		return;
	}
	if(!tableName){
		throw new Error("请给予一个表名");
		return;
	}
	this.tableName = tableName;
}

//插入一条记录
//对应表结构中的主键属性必须有值，否则报错
PersistObject.prototype.insert =function(con){
	var hasVal = 0;
	var sql = "insert into "+this.tableName+" ";
	var params = [];
	var paramVal = [];
	var paramPos = [];
	for(var i in this){
		if(this[i].toString() && this[i].toString().trim() && (this[i] || this[i] === 0) && typeof this[i] != 'function' && i !='tableName'){
			params.push(sqlUtil.toUnderScore(i));
			paramVal.push(this[i]);
			paramPos.push("?");
			hasVal++;
		}
	};
	if(hasVal == 0){
		return;
	}
	sql = sql+"("+params.join(",")+")  VALUES ("+paramPos.join(",")+")";
	return sqlUtil.wrapByTransaction(con,function(){
		return new Promise(function(resolve,reject){
			//systemUtil.log({time:systemUtil.LOG_STRAT,desc:userDao.queryEnterprisesByEntType(limit,qParams).sql},systemUtil.SQL);
			con.query(sql,paramVal,sqlUtil.closeTranscation(con,resolve,reject));
		});
	});
};

//更新记录
//keys值为必输，作为'where'中的条件，也可以加多一些其他的字段名，keys必须为用','连接的属性或数组
PersistObject.prototype.update = function(con,keys){
	if(!keys){
		throw new Error("请赋予一个主键名");
		return;
	}
	var hasVal =0;
	var sql = "update "+this.tableName+" set ";
	var where = ' where ';
	var set = '';
	var paramVal = [];
	for(var i in this){
		if(this[i].toString() && this[i].toString().trim() && (this[i] || this[i] ===0) && typeof this[i] != "function" && i != 'tableName'){
			if(typeof keys == "string"){
				if(keys.indexOf(i) != -1){
					where += (sqlUtil.toUnderScore(i)+" = ? and");
					paramVal.push(this[i]);
					continue;
				}
			}
			if(typeof keys == "array"){
				if(keys.some(function(val){return i == val})){
					where += (sqlUtil.toUnderScore(i)+" = ? and");
					paramVal.push(this[i]);
					continue;
				}
			}
			set = sqlUtil.toUnderScore(i)+" = ?, "+set;
			paramVal.unshift(this[i]);
			hasVal++;
		}
	}
	if(hasVal == 0){
		return;
	}
	where = where.slice(0,where.lastIndexOf('and'));
	set = set.slice(0,set.lastIndexOf(','));
	sql = sql + set + where;
	return sqlUtil.wrapByTransaction(con,function(){
		return new Promise(function(resolve,reject){
			//systemUtil.log({time:systemUtil.LOG_STRAT,desc:userDao.queryEnterprisesByEntType(limit,qParams).sql},systemUtil.SQL);
			con.query(sql,paramVal,sqlUtil.closeTranscation(con,resolve,reject));
		});
	});
}

//删除一条记录
//可以根据给定的keys参数进行匹配，要求同上
//否则根据对象中的有值的属性进行匹配
PersistObject.prototype.delete = function(con,keys){
	var hasVal;
	var sql = "delete from "+this.tableName+" where ";
	var paramVal = [];
	if(keys){
		if(typeof keys != "array" && typeof keys !="string"){
			throw new Error("keys必须是数组或用','连接的字符串");
			return;
		}
		if(typeof keys == "string"){
			keys = keys.split(",");
		}
		for(var s = 0,slen=keys.length;s<slen;s++){
			if(this[keys[s]]){
				sql += (sqlUtil.toUnderScore(keys[s])+" = ? and ");
				paramVal.push(this[keys[s]]);
			}
		}
	}else{
		for(var i in this){
			if(this[i].toString() && this[i].toString().trim() && (this[i] || this[i] ===0) && typeof this[i] != "function" && i != 'tableName'){
				sql += sqlUtil.toUnderScore(i)+" = ? and ";
				paramVal.push(this[i]);
				hasVal++;
			}
		}
		if(hasVal == 0){
			return;
		}
	}
	sql = sql.slice(0,sql.lastIndexOf('and'));
	return sqlUtil.wrapByTransaction(con,function(){
		return new Promise(function(resolve,reject){
			//systemUtil.log({time:systemUtil.LOG_STRAT,desc:userDao.queryEnterprisesByEntType(limit,qParams).sql},systemUtil.SQL);
			con.query(sql,paramVal,sqlUtil.closeTranscation(con,resolve,reject));
		});
	});
}

//查询记录，可一条或多条，支持分页和排序
//可以根据给定的keys参数进行匹配，要求同上
//否则根据对象中的有值的属性进行匹配
PersistObject.prototype.query = function(con,keys,imit){
	var hasVal;
	var sql = "select * from "+this.tableName+" where ";
	var paramVal = [];
	if(keys){
		if(typeof keys != "array" && typeof keys !="string"){
			throw new Error("keys必须是数组或用','连接的字符串");
			return;
		}
		if(typeof keys == "string"){
			keys = keys.split(",");
		}
		for(var s = 0,slen=keys.length;s<slen;s++){
			if(this[keys[s]]){
				sql += (sqlUtil.toUnderScore(keys[s])+" = ? and ");
				paramVal.push(this[keys[s]]);
			}
		}
	}else{
		for(var i in this){
			if(this[i].toString() && this[i].toString().trim() && (this[i] || this[i] ===0) && typeof this[i] != "function" && i != 'tableName'){
				sql += sqlUtil.toUnderScore(i)+" = ? and ";
				paramVal.push(this[i]);
				hasVal++;
			}
		}
		if(hasVal == 0){
			return;
		}
	}
	sql = sql.slice(0,sql.lastIndexOf('and'));
	if(limit){
		sql = sqlUtil.pageLimitForSql(sql,limit);
	}
	return sqlUtil.wrapByTransaction(con,function(){
		return new Promise(function(resolve,reject){
			//systemUtil.log({time:systemUtil.LOG_STRAT,desc:userDao.queryEnterprisesByEntType(limit,qParams).sql},systemUtil.SQL);
			con.query(sql,paramVal,sqlUtil.closeTranscation(con,resolve,reject));
		});
	});
}

module.exports = PersistObject;