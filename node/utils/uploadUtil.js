var express = require("express");
var fs = require('fs');
var formidable = require('formidable');
var path = require('path');
var url = require('url');
var appSet = require('../Setting').appSetting;


var uploadfoldername = 'uploads';
var uploadfolderpath = path.join(__dirname,"..",uploadfoldername);
var server = appSet.host;
var port = appSet.port;
var ortherType = /[xls|pgf|doc]/ig;
var maxSize = 1000*1000*1000;

//选择返回结果格式
function resType(fields,res,result){
    console.log(result);
    if(fields && fields.isJsonRes){
        result = {'result':result};
        res.json(result);
    }else{
        res.writeHead(200, {
            'Content-type': 'text/html'
        });
        res.end(result);
    }
}

function uploadFiles(req,res,next){
    console.log(req.query,req.body);
    var reqMethod = req.method.toLowerCase();
    // ----------------------用 '/upload' 这个路由来处理文件上传----------------------
    if (req.baseUrl === '/upload/uploadImg' && (reqMethod === 'post' || reqMethod === 'options')) {
       /* // 设置允许跨域的域名称
        res.setHeader("Access-Control-Allow-Origin", "http://localhost:8011");
        res.setHeader("Access-Control-Allow-Headers", "X-Requested-With");
        res.setHeader("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");*/

        // ----- 情况1：跨域时，先发送一个options请求，此处要返回200 -----
        if (reqMethod === 'options') {
            console.log('options 请求时，返回 200');

            // 返回结果
            res.writeHead(200, {
                'Content-type': 'text/html'
            });
            res.end('options OK');
            return;
        }

        // ----- 情况2：发送post请求，上传图片 -----

        console.log('定位到 /upload 路由');

        // 使用第三方的 formidable 插件初始化一个 form 对象
        var form = new formidable.IncomingForm();

        // 处理 request
        form.parse(req, function (err, fields, files) {
            if (err) {
                return console.log('formidable, form.parse err');
            }

            console.log('formidable, form.parse ok');
            console.log(fields);
            var item;

            // 计算 files 长度
            var length = 0;
            for (item in files) {
                length++;
            }
            if (length === 0) {
                console.log("没有接收到任何上传文件");
                return;
            }
            
            for (item in files) {
                var file = files[item];
                console.log(file.name);
                // formidable 会将上传的文件存储为一个临时文件，现在获取这个文件的目录
                var tempfilepath = file.path;
                // 获取文件类型
                var type = file.type;

                // 获取文件名，并根据文件名获取扩展名
                var filename = file.name;
                var extname = filename.lastIndexOf('.') >= 0
                                ? filename.slice(filename.lastIndexOf('.'))
                                : '';
                var imgType = /\.{1}(jpg|png|jpeg|gif|bmp){1}/ig;
                if(!(extname && imgType.exec(extname))){
                	var result = "error|请上传扩展名为jpeg,png,gif,bmp,jpg其中之一的文件";
                	resType(fields,res,result);
                	return;
                }
               /* // 文件名没有扩展名时候，则从文件类型中取扩展名
                if (extname === '' && type.indexOf('/') >= 0) {
                    extname = '.' + type.split('/')[1];
                }*/
                if(file.size > maxSize){
                	var result = "error|上传的文件大小不能大于1M";
                	resType(fields,res,result);
                	return;
                }
                console.log(filename);
                // 将文件名重新赋值为一个随机数（避免文件重名）
                filename = filename.slice(0,filename.lastIndexOf(extname))+"_"+ new Date().getTime() + extname;
                // 构建将要存储的文件的路径
                var filenewpath = uploadfolderpath + '/' + filename;
                // 将临时文件保存为正式的文件
                fs.rename(tempfilepath, filenewpath, function (err) {
                    // 存储结果
                    var result = '';

                    if (err) {
                        // 发生错误
                        console.log(err);
                        console.log('fs.rename err');
                        result = 'error|save error';
                    } else {
                        // 保存成功
                        console.log('fs.rename done');
                        // 拼接图片url地址
                        result = 'http://' + server + ':' + port + '/upload/img/' + filename;
                    }

                    // 返回结果
                    /*res.writeHead(200, {
                        'Content-type': 'text/html'
                    });
                    res.end(result);*/
                    resType(fields,res,result);
                }); // fs.rename
            } // for in 
        });
    } 
}

module.exports = {
	uploadFiles:uploadFiles
}