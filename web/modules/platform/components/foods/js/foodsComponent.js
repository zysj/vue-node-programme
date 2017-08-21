import Vue from 'vue'
import rankFlow from 'web/common/components/rankFlowDirective.js'



var data ={
	foods:[{foodImg:'web/resources/img/salad.jpg',foodText:'图1xxxxxxxxxxxxxx'},
		     {foodImg:'web/resources/img/1.jpg',foodText:'图2xxxxxx'},
		     {foodImg:'web/resources/img/seasame.jpg',foodText:'图3xxxxxxxxxxxxxxxxxxxxxxxxxx'},
		     {foodImg:'web/resources/img/Koala.jpg',foodText:'图1xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'},
		     {foodImg:'web/resources/img/icelake.jpg',foodText:'图2xxxxxxxxxxxx'},
		     {foodImg:'web/resources/img/Lighthouse.jpg',foodText:'图3xxxxxxxxxxxxxxxxxx'},
		     {foodImg:'web/resources/img/Jellyfish.jpg',foodText:'图1xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'},
		     {foodImg:'web/resources/img/cookie.jpg',foodText:'图2xxxxxx'},
		     {foodImg:'web/resources/img/14.jpg',foodText:'图3xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'},
		     {foodImg:'web/resources/img/horse.jpg',foodText:'图2xxxxxxxxxxxx'},
		     {foodImg:'web/resources/img/30.jpg',foodText:'图3xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'},
		     {foodImg:'web/resources/img/14.jpg',foodText:'图1xxxxxxxxxxxxxxxxxx'},
		     {foodImg:'web/resources/img/Tulips.jpg',foodText:'图2xxxxxxxxxxxx'},
		     {foodImg:'web/resources/img/rm.png',foodText:'图3xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'},
		     {foodImg:'web/resources/img/26.jpg',foodText:'图1xxxxxx'},
		     {foodImg:'web/resources/img/default.png',foodText:'图2xxxxxx'},
		     {foodImg:'web/resources/img/Penguins.jpg',foodText:'图3xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'},
		     {foodImg:'web/resources/img/15.jpg',foodText:'图2xxxxxx'},
		     ],
}

export default {
	data:function(){
		return data;
	},
	mounted:function(){
		/*Vue.http.post("http://localhost:3000/users",{entType:'1'}).then(function(res){ 	
			console.log(res);
		 },function(err){})*/
	}
}