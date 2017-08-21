
//"http://localhost:6060/#/"
var url = location.href;

//"http:"
var protocol = location.protocol;

//"localhost:6060"
var host = location.host;

//"localhost"
var hostname = location.hostname;

//"http://localhost:6060"
var origin = location.origin;

//such as "/"
var pathname = location.pathname;

//such as "6060"
var port = location.port;

var contextPath = pathname.substring(0,pathname.substr(1).indexOf('/')+1);

var basePath="http://localhost:8080/jd2.0";

function getBasePath(){
	return location.origin?origin:protocol+"//"+host+contextPath;
}
function getHttpPath(){
	return basePath;
}
export default {
	getBasePath:getBasePath,
	getHttpPath:getHttpPath
}
