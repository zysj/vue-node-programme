var express = require("express");
var fs = require('fs');
var path = require('path');
var router = express.Router();
var uploadUtil = require("../utils/uploadUtil");
var appSet = require('../Setting').appSetting;

router.use('/img/:filepath',function(req,res,next){
	var basePath = req.params.filepath;
	//读取文件并发送到页面的方式2
	var img = fs.createReadStream(path.join(__dirname,'../uploads',basePath));
	img.pipe(res);
	res.writeHead(200,{'Content-Type': 'image/*'});
	//读取文件并发送到页面的方式2
	/*fs.readFile("./node/uploads/default.png","binary",function(err, file) {
		if (err) {
		  console.log(err);
		  return;
		}else{
		    res.writeHead(200,{'Content-Type': 'image/jpeg'});
		    res.write(file,'binary');
		    res.end();
		    return;
		}
	});*/
});

router.use('/uploadImg',function(req,res,next){
    uploadUtil.uploadFiles(req,res,next);
});

router.use('/delfile',function(req,res,next){
    var basePath = path.join(__dirname,'../uploads',req.body.filePath);
    fs.unlink(basePath,function(err){
    	if(err){
    		result = "文件删除失败："+err.message;
    	}else{
    		result = "文件删除成功。";
    	}
    	res.end(result);
    });
});


module.exports = router;