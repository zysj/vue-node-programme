import Vue from 'vue'
import rankFlowHtml from './template/rankFlow.html'

Vue.component("rankFlow",{
	template:rankFlowHtml,
	props:["flowArray"],
	data:function(){
		return {
		};
	},
	mounted(){
		var flowobj = new flow();
		flowobj.init(this.$refs.rankWrap,this.flowArray);
	}
});

Vue.directive("flowRank",{
	bind:function(el,binding,VNode){
		//init(el,binding);
	},
	inserted:function(el,binding,VNode){
		flowobj.init(el,binding);
	},
	update:function(el,binding,VNode){
		//init(el,binding);
	},
	componentUpdated:function(el,binding,VNode){
		//init(el,binding);
	},
});

function flow(){
	this.len,				//每行子元素数量
	this.oldlen,			//每行子元素数量旧值
	this.children,		//子元素数组
	this.$el,				//挂载元素
	this.alen,			//子元素总数
	this.cwidth,			//子元素宽度，固定
	this.pwidth,			//父元素宽度，随浏览器宽度变化
	this.rows,			//总行数
	this.imgs,			//总共的图片子元素数组
	this.imgcount = 0,				//记录加载完成的子元素的变量
	this.minspace = 10,			//子元素之间的上间隔
	this.isLoad = false;			//控制首次加载时不会运行两次initFlow函数。
}
flow.prototype.init = function(el,array){
	var that = this;
	this.$el = $(el);
	this.alen = array.length;
	this.children = this.$el.children();
	this.cwidth = this.children.outerWidth();
	this.imgs = this.$el.find('img');
	if(this.imgs.length >0){
		window.onload = function(){
			that.initFlow(array);
			that.isLoad = true;
		}
		this.initFlow(array);
	}
	$(window).on("resize",function(){
		that.initFlow(array);
	});
}

flow.prototype.initFlow = function(array){
	var that = this;
	that.pwidth = that.$el.outerWidth();
	// console.log(this.$el[0].getBoundingClientRect());
	// console.log(that.pwidth+" "+that.$el.parent().width());
	that.len = 1;
	var lenTmp;
	while(true){
		var tmpWidth;
		lenTmp = that.len -1;
		tmpWidth = (that.pwidth-(lenTmp)*that.minspace)/that.len;
		if(tmpWidth<200){
			that.len = that.len-1;
			that.cwidth = (that.pwidth-(that.len-1)*that.minspace)/that.len;
			break;
		}
		that.len++;
	}
	that.rows = Math.ceil(that.alen/that.len);

	//方案1：等待所有图片加载完后再进行排列
	/*imgs.each(function(index,el){
		el.onload = function(){
			imgcount++;
			if(imgcount == imgs.length){
				children.each(function(index,el){
					var self = $(el);
					var mtop = getTop(index);
					var mleft = getLeft(index);
					self.css({
						top:mtop,
						left:mleft
					});
					if(index == children.length-1){
						$el.height(getParentHeight());
					}
				});
			}
		}
	});*/

	//方案2：先排列，后加载完图片时把同列后面的元素重新排列
	this.children.each(function(index,el){
		var self = $(el);
		var img = self.find('.rank-flow-img')[0];
		var selfRow = Math.ceil(index/that.len);
		self.width(that.cwidth);
		if(!img['complete']){
			img.onload = function(){
				if(that.imgcount == that.children.length-1){
					that.$el.height(that.getParentHeight());
				}
				that.imgcount++;
				for(var i = 1,rlen = that.rows-selfRow;i<=rlen;i++){
					var nIndex = index+i*that.len;
					var next = $(that.children[index+i*that.len]);
					var ntop = that.getTop(nIndex);
					next.css("top",ntop);
				};
			}
		}
		that.imgcount++;
		var mtop = that.getTop(index);
		var mleft = that.getLeft(index);
		self.css({top:mtop,left:mleft});
	});

	//if(that.$el.outerHeight()==0 || that.imgcount == that.children.length || that.oldlen != that.len){
	that.$el.height(that.getParentHeight());
	//}
	//that.oldlen = that.len;
}

flow.prototype.getParentHeight = function(){
	var lastCount = this.alen%this.len;
	if(lastCount == 0){
		lastCount = this.len;
	}
	var maxHeight=0;
	for(var i = this.alen-1,max = this.alen-1-lastCount;i>max;i--){
		var lheight = $(this.children[i]).outerHeight();
		var ltop = this.getTop(i);
		maxHeight = maxHeight<(ltop+lheight+this.minspace)?(ltop+lheight+this.minspace):maxHeight;
	}
	return maxHeight;
}
flow.prototype.getTop = function(index){
	var preTop = 0;
	var prev = $(this.children[index-this.len]);
	if(index <this.len){
		return this.minspace;
	}
	preTop = parseInt(prev.css('top'));
	var preHeight = prev.outerHeight();
	return preTop+preHeight+this.minspace;
}

flow.prototype.getLeft = function(index){
	var preLeft = 0;
	var prev = $(this.children[index-1]);
	var llen = index%this.len;
	//var left = (pwidth-len*cwidth)/(len+1);
	var left = this.minspace;
	if(llen == 0){
		return 0;
	}
	preLeft = parseInt(prev.css('left'));
	return preLeft+this.cwidth+left;
}