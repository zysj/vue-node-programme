/*define([],
	function(){*/
		//const foo = require("./modules/practice/js/fooComponent");
		//const bar = require("./modules/practice/js/barComponent");
		export default {
			//login:resolve => require(["modules/login/login.vue"],resolve),
			register:resolve => require(["modules/register/register.vue"],resolve),
			webIndex:resolve => require(["modules/index/webIndex.vue"],resolve),
			platformheader : resolve => require(["modules/platform/common/header/platformheader.vue"],resolve), 
			platformfooter : resolve => require(["modules/platform/common/footer/platformfooter.vue"],resolve), 
			platformSpace:resolve=>require(["modules/platform/platformSpace.vue"],resolve),
			platformIndex:resolve=>require(["modules/platform/components/index/platformIndex.vue"],resolve),
			platformFoods:resolve=>require(["modules/platform/components/foods/foodsComponent.vue"],resolve),
			foodEdit:resolve=>require(["modules/platform/components/foodEdit/foodEdit.vue"],resolve),
			articleList:resolve=>require(["modules/platform/components/articles/articleComponent.vue"],resolve),
			//bar : bar
		}
	//});