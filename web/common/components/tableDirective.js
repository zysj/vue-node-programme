import Vue from 'vue'

Vue.directive('tableSplit',{
	bind:function(el,binding){
		console.log(el);
		var vta = new vtable();
		vta.initTable(el);
	},
	inserted:function(el,binding){
		console.log(el);
	}
});

var vtable = (function(factory){
	if(window.jQuery){
		return factory(window.jQuery);
	}
}(function($){
function tableSplit(config){
	this.config = $.extend({},this.default,config);
	this.data = '';
}

tableSplit.prototype.default = {
	url:'',
	param:'',
	sort:'',
	sortName:'',
	sortType:'asc',
	pageSize:10,
	pageStart:0
}

tableSplit.prototype.initTable = function(el){
	var $el = $(el);
	initThead(el);
}

function initThead(ele){
	var $el = $(ele);
	var theadTem = '<thead>';
	//var tdChild = thead.find('td');
	var cols = $el.find('colgroup col');
	var firstTd = $el.find('table>tr').first().children();
	firstTd.each(function(index,node){
		var $node = $(node);
		var taName = $node.data('title');
		var sortName = $node.data('sort');
		var width = $(cols[index]).attr('width');
		theadTem += ('<td width="'+width+'"><span>'+ taName+'</span>'+(sortName?'<span><i class="icon-sort"></i><i class="icon-caret-up icon-hide"></i><i class="icon-caret-down icon-hide"></i></span>':'')+'</td>');
		if(index == firstTd.length-1){
			theadTem += '</thead>';
			$(theadTem).insertBefore(firstTd.parent());
		}
	});
	var tdChild = $el.find('thead td');
	var iconsorts = tdChild.find('span .icon-sort');
	var iconUps =  tdChild.find('span .icon-caret-up');
	var iconDowns =  tdChild.find('span .icon-caret-down');
	tdChild.click(function(){
		var hideClass = 'icon-hide';
		var $self = $(this);
		var index = tdChild.index($self);
		var sortName = $(firstTd[index]).data('sort');
		var selfSort = $self.find('span .icon-sort');
		var selfUp = $self.find('span .icon-caret-up');
		var selfDown = $self.find('span .icon-caret-down');
		if(!selfSort.hasClass(hideClass)){
			selfSort.addClass(hideClass);
			iconsorts.not(selfSort).removeClass(hideClass);
			iconUps.not(selfUp).addClass(hideClass);
			iconDowns.not(selfDown).addClass(hideClass);
		}
		if(!selfUp.hasClass(hideClass)){
			selfUp.addClass(hideClass);
			selfDown.removeClass(hideClass);
			this.config.sort = sortName?sortName+' asc':'';
			return;
		}else{
			selfUp.removeClass(hideClass);
			selfDown.addClass(hideClass);
			this.config.sort = sortName?sortName+' desc':'';
			return;
		}
	});
}

return tableSplit;
}));
