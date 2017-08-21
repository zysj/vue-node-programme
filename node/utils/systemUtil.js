
//logInfo方法中的常量
const METHOD ="mehtod";
const PATH = "path";
const ERROR = "error";
const SQL = "sql";
const TRANSAC = "transac";
const LOG_STRAT = "start";
const LOG_END = "end"
var IS_LOG = true;	//控制是否执行日志输出和打印

module.exports = {
	log:logInfo,
	setLog:function(){
		IS_LOG = true;
	},
	setUnLog:function(){
		IS_LOG = false;
	},
	METHOD:METHOD,
	PATH:PATH,
	ERROR:ERROR,
	SQL:SQL,
	TRANSAC:TRANSAC,
	LOG_STRAT:LOG_STRAT,
	LOG_END:LOG_END,
}


//打印日志，输出到"./node/log/stdout.log"文件
//类型包括：错误、sql语句调用、事务调用、路径进出
function logInfo(logobj,type){
	if (type == ERROR) {
		console.log(logobj);
	}
	if(!IS_LOG){
		return;
	}
	try{
	var writeData;
	var now = new Date().toLocaleString();
	fs.readFile("./node/log/stdout.log",function(err,data){
		//console.log(data && data.toString());
		writeData = data && data.toString();
		switch(type){
			case ERROR:
				if(logobj){
					writeData =  ($.trim(writeData)?" \r\n":"")+"[ERROR] "+now +" "+logobj.toString();
					fs.appendFile("./node/log/stdout.log",writeData,function(err){err && console.log(err)});
				}
				break;
			case METHOD:
				if(logobj && logobj.time == LOG_STRAT){
					writeData = ($.trim(writeData)?" \r\n":"") + "[DEBUG] " + now + " 调用方法[" + logobj.desc+"]开始";
					fs.appendFile("./node/log/stdout.log",writeData,function(err){err && console.log(err)});
					break;
				}
				if(logobj && logobj.time == LOG_END){
					writeData = ($.trim(writeData)?" \r\n":"") + "[DEBUG] " + now + " 调用方法[" + logobj.desc+"]结束";
					fs.appendFile("./node/log/stdout.log",writeData,function(err){err && console.log(err)});
				}
				break;
			case PATH:
				if(logobj && logobj.time == LOG_STRAT){
					writeData =  ($.trim(writeData)?" \r\n":"")+"[DEBUG] "+now +" 开始进入路径["+logobj.desc+"]";
					fs.appendFile("./node/log/stdout.log",writeData,function(err){err && console.log(err)});
					break;
				}
				if(logobj && logobj.time == LOG_END){
					writeData =  ($.trim(writeData)?" \r\n":"")+"[DEBUG] "+now +" 退出路径["+logobj.desc+"]";
					fs.appendFile("./node/log/stdout.log",writeData,function(err){err && console.log(err)});
				}
				break;
			case SQL:
				if(logobj && logobj.time == LOG_STRAT){
					console.log(logobj.desc);
					writeData =  ($.trim(writeData)?" \r\n":"")+"[DEBUG] "+now +" 开始调用sql语句: "+logobj.desc;
					fs.appendFile("./node/log/stdout.log",writeData,function(err){err && console.log(err)});
					break;
				}
				if(logobj && logobj.time == LOG_END){
					writeData =  ($.trim(writeData)?" \r\n":"")+"[DEBUG] "+now +" 结束调用sql";
					fs.appendFile("./node/log/stdout.log",writeData,function(err){err && console.log(err)});
				}
				break;
			case TRANSAC:
				if(logobj  == LOG_STRAT){
					writeData =  ($.trim(writeData)?" \r\n":"")+"[DEBUG] "+now +" 开始事务";
					fs.appendFile("./node/log/stdout.log",writeData,function(err){err && console.log(err)});
					break;
				}
				if(logobj == LOG_END){
					writeData =  ($.trim(writeData)?" \r\n":"")+"[DEBUG] "+now +" 结束事务";
					fs.appendFile("./node/log/stdout.log",writeData,function(err){err && console.log(err)});
				}
				break;
		}
	});
	}catch(error){
		logInfo(error,ERROR);
	}
}