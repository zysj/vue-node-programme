var pool = require("../runPool");
var express = require("express");
var pageLimit = require("../models/pageLimit");
var userService = require("../services/userService");
var fs = require('fs');
var router = express.Router();
var page = new pageLimit(true);
var systemUtil = require("../utils/systemUtil");
var sqlUtil = require("../utils/sqlUtil");
var validUtil = require("../utils/validUtil");
var path = require('path');
var PersistObject = require("../models/PersistObject");
var uuid = require('node-uuid');

//跳转到vue的index.html页面
router.get('/', function(req, res, next) {
	var indexObj ={};
      res.render('../../index.ejs', indexObj);
});

//检查是否登录
router.get('/isLogin',function(req,res,next){
	if(req.session && req.session.user){
		res.json(req.session.user);
	}else{
		res.end(null);
	}
});

//用户登录
router.post('/login',function(req,res,next){
	var user = req.body;
	var result="";
	if(validUtil.loginValid(user.loginName,'loginName') && validUtil.loginValid(user.password,'password')){
		pool.getConnection(function(err,con){
			if(err){
				systemUtil.log(err,systemUtil.ERROR);
			}
			sqlUtil.wrapByTransaction(con,userService.userLogin(con,user)).then(function(ret){
				ret.map(function(val){
					return sqlUtil.toCamelObject(val);
				})
				con.release();
				//systemUtil.log({desc:"/checkName",time:systemUtil.LOG_END},systemUtil.PATH);
				if(ret && ret.length == 0){
					result = {type:'error',msg:'user is not exited'};
				}else if(ret.length > 1){
					result = {type:'error',msg:'user is abnormal because more than one user'};
				}else{
					result = {type:'success',msg:'登陆成功',user:ret[0]};
				};
				res.json(result);
			});
		});
	}else{
		result = {type:'error',msg:'either loginName or password is wrong'};
		res.json(result);
	}
});

//检查注册的loginName是否重复
router.post('/checkName',function(req,res,next){
	pool.getConnection(function(err,con){
		if(err){
			systemUtil.log(err,systemUtil.ERROR);
		}
		sqlUtil.wrapByTransaction(con,userService.queryRepeatName(con,req.body)).then(function(ret){
			con.release();
			systemUtil.log({desc:"/checkName",time:systemUtil.LOG_END},systemUtil.PATH);
			res.json(ret);
		});
	})
});

//用户注册
router.post("/regis", function(req,res,next){
	var resMsg ='';
	if(req.body){
		var tmp = req.body;
		if(validUtil.loginValid(tmp.loginName,'loginName') && validUtil.loginValid(tmp.password,'password')){
			pool.getConnection(function(err,con){
				if(err){
					systemUtil.log(err,systemUtil.ERROR);
					return;
				}
				sqlUtil.wrapByTransaction(con,userService.queryRepeatName(con,{loginName:tmp.loginName})).then(function(ret){
					systemUtil.log({desc:"/regis",time:systemUtil.LOG_END},systemUtil.PATH);
					if(ret && ret.length == 0){
						tmp.id = uuid.v1();
						var user = new PersistObject(tmp,'pub_user');
						return user.insert(con);
					}else{
						return resMsg = {type:'error',msg:'loginName is exited'};
					}
				}).then(function(ret){
					if(ret && ret.type == 'error'){
						return ret;
					}else{
						con.release();
						systemUtil.log({desc:"/regis",time:systemUtil.LOG_END},systemUtil.PATH);
						req.session.user = tmp;
						if(ret.affectedRows == 1 && !ret.warningCount){
							resMsg = {type:"success",msg:"注册成功",user:tmp};
						}else{
							resMsg = {type:'error',msg:"注册失败"};
						}
						res.json(resMsg);
					}
				});
			})
		}
	}
});

//用户修改
router.use("/updateUser",function(req,res,next){
	if(req.body){
		var tmp = req.body;
		console.log(tmp);
		var resMsg = '';
		pool.getConnection(function(err,con){
			if(err){
				systemUtil.log(err,systemUtil.ERROR);
				return;
			}
			tmp.id = '14470e30-03e3-11e7-aa02-45cc535a3fc3';
			var user = new PersistObject(tmp,'pub_user');
			user.update(con,"id").then(function(ret){
				console.log(ret);
				con.release();
				systemUtil.log({desc:"/updateUser",time:systemUtil.LOG_END},systemUtil.PATH);
				req.session.user = tmp;
				if(ret.affectedRows == 1 && !ret.warningCount){
					resMsg = {type:"success",msg:"修改成功",user:tmp};
				}else{
					resMsg = {type:'error',msg:"修改失败"};
				}
				res.json(resMsg);
			});
		});
	}
});

//删除用户
router.use("/deleteUser",function(req,res,next){
	if(req.body){
		var tmp = req.body;
		console.log(tmp);
		var resMsg = '';
		pool.getConnection(function(err,con){
			if(err){
				systemUtil.log(err,systemUtil.ERROR);
				return;
			}
			//tmp.id = '14470e30-03e3-11e7-aa02-45cc535a3fc3';
			var user = new PersistObject(tmp,'pub_user');
			user.delete(con).then(function(ret){
				console.log(ret);
				con.release();
				systemUtil.log({desc:"/deleteUser",time:systemUtil.LOG_END},systemUtil.PATH);
				if(ret.affectedRows == 1 && !ret.warningCount){
					resMsg = {type:"success",msg:"删除成功",user:ret};
				}else{
					resMsg = {type:'error',msg:"删除失败"};
				}
				res.json(resMsg);
			});
		});
	}
});

//查询用户
router.use("/queryUser",function(req,res,next){
	if(req.body){
		var tmp = req.body;
		var resMsg = '';
		pool.getConnection(function(err,con){
			if(err){
				systemUtil.log(err,systemUtil.ERROR);
				return;
			}
			tmp.id = 'd1c706e0-03f2-11e7-8b01-270c821118d2';
			var user = new PersistObject(tmp,'pub_user');
			user.query(con,'id').then(function(ret){
				console.log(ret);
				con.release();
				systemUtil.log({desc:"/queryUser",time:systemUtil.LOG_END},systemUtil.PATH);
				if(!ret.warningCount){
					ret = ret.map(function(val){
						return sqlUtil.toCamelObject(val);
					});
					resMsg = {type:"success",msg:"查询成功",user:ret};
				}else{
					resMsg = {type:'error',msg:"查询失败"};
				}
				res.json(resMsg);
			});
		});
	}
});

//用户登出
router.use("/logout",function(req,res,next){
	var user = req.body;
	if(req.session.user){
		if(req.session.user.loginName == user.loginName && req.session.user.password == user.password){
			req.session.user = null;
		}else{
			return res.json({msg:'退出失败',type:'error'});
		}
	}
	if(res.locals.user){
		if(res.locals.user.loginName == user.loginName && res.locals.user.password == user.password){
			res.locals.user = null;
		}else{
			return res.json({msg:'退出失败',type:'error'});
		}
	}
	res.json(null);
});


router.use('/users',function(req,res,next){
	systemUtil.log({desc:"/users",time:systemUtil.LOG_START},systemUtil.PATH);
	console.log(req.body);
	pool.getConnection(function(err,con){
		if(err){
			systemUtil.log(err,systemUtil.ERROR);
		}
		sqlUtil.wrapByTransaction(con,userService.selectUsers(con,page,req.body)).then(function(ret){
			con.release();
			systemUtil.log({desc:"/users",time:systemUtil.LOG_END},systemUtil.PATH);
			res.json(ret);
		});
	})
});


module.exports = router;