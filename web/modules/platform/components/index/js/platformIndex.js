import Vue from 'vue'
import slideImg from 'web/common/components/slideImgDirective.js'

var data ={
	slides:[{slideImg:'web/resources/img/salad.jpg',slideText:'图1'},
		     {slideImg:'web/resources/img/night.jpg',slideText:'图2'},
		     {slideImg:'web/resources/img/seasame.jpg',slideText:'图3'}],
	today:new Date().toDateString()
}

export default {
	data:function(){
		return data;
	},
	computed:{

	},
	methods:{

	}
}