var pageLimit = require("../models/pageLimit");
var fs = require("fs");
var systemUtil = require("./systemUtil");
//var Console = require("console").Console;
var page = new pageLimit();
var sort;

module.exports = {
	//包装sql语句的分页和排序
	pageLimitForSql:function(sql,limit){
		var page = new pageLimit();
		limit = limit ? global.$.extend(page,limit):page;
		sort =  (limit.getSort() && " order by "+limit.getSort())  || (limit.getSortName() && limit.SortType() && " order by "+limit.getSortName()+" "+limit.getSortType()) || "";
		sql = sql + sort;
		if(limit.getIsLimit()){
			return sql +" limit " + limit.getPageStart() +","+ limit.getPageSize();
		}
		return sql;
	},
	//包装con.query方法为promise且开启事务
	wrapByTransaction:function(con,fn){
		return new Promise(function(resolve,reject){
			systemUtil.log(systemUtil.LOG_STRAT,systemUtil.TRANSAC);
			con.beginTransaction(function(err){
				if(err){ 
					systemUtil.log(err,systemUtil.ERROR);
					systemUtil.log(systemUtil.LOG_END,systemUtil.TRANSAC);
					reject(err);
				};
				if(fn && typeof fn == "function"){
					resolve(fn());
				}
			});
		});
	},
	//关闭事务
	closeTranscation:function(con,resolve,reject){
		return function(err,result,fields){
			if(err){
				return con.rollback(function(){
					systemUtil.log(err,systemUtil.ERROR);
					systemUtil.log(systemUtil.LOG_END,systemUtil.TRANSAC);
					reject(err);
				});
			}
			return con.commit(function(err){
				if(err){
					console.log(err);
					return con.rollback(function(){
						systemUtil.log(err,systemUtil.ERROR);
						systemUtil.log(systemUtil.LOG_END,systemUtil.TRANSAC);
						reject(err);
					});
				}
				//console.log(fields);
				systemUtil.log(systemUtil.LOG_END,systemUtil.TRANSAC);
				systemUtil.log({time:systemUtil.LOG_END},systemUtil.SQL);
				resolve(result);
			});
		}
	},
	toUnderScore,
	toCamelObject
}

//把一个字符串里的驼峰属性名转换成"_"连接符的属性名
function toUnderScore(name){
	var tmp,headTmp;
	if(name){
		name = name.trim().replace(" ",'');
		var checkAmong = new RegExp(/([A-Z]{1})/g);
		while((tmp = checkAmong.exec(name)) && checkAmong.lastIndex <= name.length-1){

			headTmp = tmp.index?name.slice(0,tmp.index):"";
			name = headTmp+(tmp.index?"_":"")+tmp[1].toLowerCase()+name.slice(checkAmong.lastIndex);
		}
	}else{
		console.log("请输入要转变的字符串");
		return '';
	}
	return name;
}

//把一个对象里的"_"连接符的属性名转换成驼峰属性名
function toCamelObject(obj){
	for(var i in obj){
		var reg = new RegExp(/(\_)+/g);
		var tmp = i;
		while(true){
			var result = reg.exec(i);
			if(result){
				if(result.index == 0){
					i = i.slice(1);
				}else{
					i = i.slice(0,result.index)+i.charAt(reg.lastIndex).toUpperCase()+i.slice(reg.lastIndex+1);
				}
			}else{
				if(tmp != i){
					obj[i] = obj[tmp];
					delete obj[tmp];
				}
				break;
			}
		}
	}
	return obj;
}

//暂时不用！！！
//用于简单的sql语句筛选,根据传入的对象参数，如果参数中的属性有值而且sql语句有相关的条件查询语句，则替换#{属性名}为"?",
//如条件查询ent_type = #{entType}
function makeSql(sql){
	var qParams = [];
	var queryArr = Array.prototype.slice.call(arguments,1);
	var condition;
	var keyResult,commaResult,conResult;
	var regKey,CommaReg,conReg;
	if(query){
		regKey = new RegExp(eval("/\\s*\\#\\{([A-Za-z0-9]+)\\}\\s*/g"));
		keyResult = regKey.exec(sql);
		while(keyResult){
			for(var j = 0; j<queryArr.length;j++){
				var val = queryArr[j],bkflag=false;
				if(!val){
					continue;
				}
				if(typeof val == "Object"){
					for(var i in val){
						if(keyResult[1] == i){
							if(val[i] != null && typeof val[i] != "undefinded" && $.trim(val[i]) != ''){
								qParams.push(val[i]);
								sql = sql.slice(0,keyResult.index)+" ? "+sql.slice(regKey.lastIndex);
								bkflag = true;
								break;
							}
						}
					}
				}
				if(bkflag){
					break;
				}
				if(j==queryArr.length-1){
					condition = toUnderScore(keyResult[1]);
					CommaReg = new RegExp(eval("/\\s*\\#\\{("+keyResult[1]+")\\}\\s*\\,{1}/g"));
					conReg = new RegExp(eval("/\\s+"+condition+"\\s+=\\s*\\#\\{("+keyResult[1]+")\\}\\s*/g"));
					CommaReg.lastIndex = keyResult.index;
					conResult = conReg.exec(sql);
					console.log(conResult);
					commaResult = CommaReg.exec(sql);
					if(commaResult){
						sql = sql.slice(0,keyResult.index)+""+sql.slice(commaResult.lastIndex);
					}if(conResult){
						sql = sql.slice(0,conResult.index)+""+sql.slice(conReg.lastIndex);
					}else{
						sql = sql.slice(0,keyResult.index)+""+sql.slice(regKey.lastIndex);
					}
				}
			};
			keyResult = regKey.exec(sql);
		}
	}
	sql = sql.slice(0,sql.search('where'));
	return {
		sql:sql,
		params:qParams
	}
}