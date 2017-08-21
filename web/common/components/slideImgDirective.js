import slideImgHtml from 'web/common/components/template/slideImg.html'
import Vue from 'vue'

Vue.component('animImgs',{
	props:['slideArray'],
	template:slideImgHtml,
	data:function(){
		return {
			slideObj:{
				slides:this.slideArray,
				interval:5000,
				fadeAway:true
			}
		}
	}
});

Vue.directive('animImg',{
	bind:function(el,binding,VNode){
		init(el,binding);
	},
	update:function(el,binding,VNode){
		init(el,binding);
	},
	inserted:function(el,binding,VNode){
		//init(el,binding);
	},
	componentUpdated:function(el,binding,VNode){
		//init(el,binding);
	},
});

function init(el,binding){
	var $el = $(el);
	var $lis = $el.find('.slide-imgs li');
	var $ul = $el.find('.slide-imgs');
	var len = binding.value.slides.length;
	if(binding.value.fadeAway){
		$ul.width("100%");
		$lis.width("100%").not(":first-child").css({opacity:"0",position:"absolute"});
		fadeAnimation(el,binding);
	}else{
		$ul.width(100*len+"%");
		$lis.each(function(index,el){
			$(el).width(100/len+"%");
		});
		slideAnimate(el,binding);
	}
}

function slideAnimate(el,binding){
	var $ul = $(el).find('.slide-imgs');
	var $slis = $(el).find('.slide-small-imgs li');
	var len = binding.value.slides.length;
	var $borderDiv = $(el).find(".img-border");
	var index = 0,timer;
	var isAnim = false;

	$slis.each(function(i){
		$(this).on("mouseover",function(){
			index = i;
			slideMove();
		});
		if(i == 0){
			$($slis[index]).find('img')[0].onload = function(){
				$borderDiv.width($($slis[i]).width());
			}
		}
	})

	function borderMove(){
		$borderDiv.width($($slis[index]).width());
		$borderDiv.css('left',$($slis[index]).offset().left-$($slis[0]).offset().left);
		//console.log($(smallch[index]).width()+" "+index);
	}

	//1、由于首次动画过渡效果不发生，因此无法监听过渡效果结束的事件，对此先
	//进行首次动画过渡效果。
	//2、index++是因为如果第二次还是原来的left值，过渡效果不会产生，
	//但isAnim变为true，因此会阻止后面动画的产生。
	setTimeout(function(){
		$ul[0].style.left = '0%';
		borderMove();
		index++;
	},0);

	function slide(){
		if(timer){
			clearTimeout(timer);
		}
		timer = setTimeout(function(){
			slideAni();
			slide();
		}, binding.value.interval);
	};

	function slideAni(ind){
		if(!isAnim){
			if(ind || ind === 0){
				index = ind;
			}
			slideMove();
		}
	}

	function slideMove(){
		isAnim = true;
		borderMove();
		$ul[0].style.left = -(100*index)+'%';
		if(index >= len-1){
			index = 0;
		}else{
			index++;
		}
		$ul.on("webkitTransitionEnd msTransitionend mozTransitionend transitionend",function(){
			isAnim = false;
			$ul.off("webkitTransitionEnd msTransitionend mozTransitionend transitionend");
		});
	}
	slide();
}

function fadeAnimation(el,binding){
	var $lis = $(el).find(".slide-imgs li");
	var $slis = $(el).find(".slide-small-imgs li");
	var $borderDiv = $(el).find(".img-border");
	var len = binding.value.slides.length;
	var isAnim = false;
	var index = 0;
	var timer;

	function fadeAction(num){
		isAnim = true;
		if(typeof num == "undefined"){
			if(index >= len-1){
				index = 0;		
			}else{
				index++;
			}
		}else{
			index = num;
		}
		borderMove();
		$lis[index].style.opacity = 1;
		$($lis[index]).siblings().css("opacity","0");
		$lis.on("webkitTransitionEnd msTransitionend mozTransitionend transitionend",function(){
			isAnim = false;
			$lis.off("webkitTransitionEnd msTransitionend mozTransitionend transitionend");
		});
	}

	$slis.each(function(i){
		$(this).on("mouseover",function(){
			fadeAction(i);
		});
		if(i == 0){
			$($slis[index]).find('img')[0].onload = function(){
				$borderDiv.width($($slis[i]).width());
			}
		}
	})

	setTimeout(function(){
		borderMove();
	},0);

	function borderMove(){
		$borderDiv.width($($slis[index]).width());
		$borderDiv.css('left',$($slis[index]).offset().left-$($slis[0]).offset().left);
	}

	function fade(){
		if(timer){
			clearTimeout(timer);
		}
		timer = setTimeout(function(){
			if(!isAnim){
				fadeAction();
			}
			fade();
		},binding.value.interval);
	};

	fade();
}