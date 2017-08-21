/*define(['Vue'],
	function(Vue){*/
		import Vue  from "vue";
		var data ={
			msg:"bar",
		}

		var bar = Vue.component('bar',{
			template:"<div>{{msg}}</div>",
			data:function(){
				return data;
			}
		});

		module.export = bar;
	//});