/*define(['Vue'],
	function(Vue){*/
		import Vue from "vue";
		var data ={
			msg:"hello",
		}

		var foo = Vue.component('foo',{
			template:"<div>{{msg}}</div>",
			data:function(){
				return data;
			}
		});
		module.export = foo;
	//});