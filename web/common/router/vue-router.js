//import Vue from 'vue'
//import VueRouter from 'vue-router'
import routerConfig  from "./router-config" ;
const routes=[
	{
		path:"/",name:'index',
		component:routerConfig.webIndex,
	},
	{path:"/platform",name:'platform',components:
		{default:routerConfig.platformSpace,
		 header:routerConfig.platformheader,
		 //footer:routerConfig.platformfooter,
		},
		 children:[{
		 	path:"/",
			name:"platform-index",
			component:routerConfig.platformIndex
		 },
		 {
			path:"login",name:'login',
			component:routerConfig.login,
		},
		{
			path:"register",name:'register',
			component:routerConfig.register,
		},
		 {
		 	path:"foods",
			name:"foods",
			component:routerConfig.platformFoods
		 },
		 {
		 	path:"foodEdit",
			name:"foodEdit",
			component:routerConfig.foodEdit
		 },
		 {
		 	path:"article-list",
			name:"article-list",
			component:routerConfig.articleList
		 }
		 ]
	},
	//{path:"/work",component:''},
	//{path:"/bar",component:routerConfig.bar}	
];
export default  routes;


