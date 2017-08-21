

function pageLimit(isLimit,pageSize,pageStart,sort,sortName,sortType){
	this.pageSize = pageSize || 10;
	this.pageStart = pageStart || 0;
	this.sort =sort;
	this.sortName = sortName;
	this.sortType = sortType || "asc";
	this.isLimit = isLimit;
}

pageLimit.prototype.setPageSize = function(pageSize){
	this.pageSize = pageSize;
};

pageLimit.prototype.setPageLimit = function(pageLimit){
	this.pageLimit = pageLimit;
};

pageLimit.prototype.setSort = function(sort){
	this.sort = sort;
};

pageLimit.prototype.setSortName = function(sortName){
	this.sortName = sortName;
};

pageLimit.prototype.setSortType = function(sortType){
	this.sortType = sortType;
};

pageLimit.prototype.setIsLimit = function(isLimit){
	this.isLimit = isLimit;
};

pageLimit.prototype.getIsLimit = function(){
	return this.getIsLimit;
};

pageLimit.prototype.getSortType = function(){
	return this.sortType;
};

pageLimit.prototype.getPageSize = function(){
	return this.pageSize;
};

pageLimit.prototype.getPageStart = function(){
	return this.pageStart;
};

pageLimit.prototype.getSort = function(){
	return this.sort;
};

pageLimit.prototype.getSortName = function(){
	return this.sortName;
};

module.exports = pageLimit;