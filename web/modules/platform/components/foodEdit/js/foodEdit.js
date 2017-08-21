import Vue from "vue"
import tableSplit from 'web/common/components/tableDirective.js'
import FileUpload from 'web/common/components/FileUploadComponent'
import vuetable from "vuetable-2"
import {VuePagination, VueEvent} from 'vue-pagination-2';
import comVue from 'web/modules/commonVue'
import "web/common/components/editorComponent.vue"

Vue.use(VuePagination);

var editor;

wangEditor.fn.destroy = function(isRemove){
	var self = this;
	var $valueContainer = self.$valueContainer;
	var $editorContainer = self.$editorContainer;
	var valueNodeName = self.valueNodeName;

	if (valueNodeName === 'div') {
		// div 生成的编辑器
		$valueContainer.removeAttr('contenteditable');
		$editorContainer.after($valueContainer);
		$editorContainer.hide();
	} else {
		// textarea 生成的编辑器
		if(!!isRemove){
			//console.log($valueContainer);
			//$valueContainer.show();
			$editorContainer.remove();
		}else{
			$valueContainer.show();
			$editorContainer.hide();
		}
	}
}


export default {
	data:function(){
		return {
			dataList:[{userName:'aaa',userRole:'theif'},{userName:'bbb',userRole:'wizard'}],
			columns:['id','name','age'],
			multiple:false,
		      tableData: [
			      {id:1, name:"John",age:"20"},
			      {id:2, name:"Jane",age:"24"},
			      {id:3, name:"Susan",age:"16"},
			      {id:4, name:"Chris",age:"55"},
			      {id:5, name:"Dan",age:"40"},
			      {id:1, name:"John",age:"20"},
			      {id:2, name:"Jane",age:"24"},
			      {id:3, name:"Susan",age:"16"},
			      {id:4, name:"Chris",age:"55"},
			      {id:5, name:"Dan",age:"40"},
			      {id:1, name:"John",age:"20"},
			      {id:2, name:"Jane",age:"24"},
			      {id:3, name:"Susan",age:"16"},
			      {id:4, name:"Chris",age:"55"},
			      {id:5, name:"Dan",age:"40"}
			],
		      options: {
			      	      headings:{
		      	 	      id:'Id',
		      	 	      name:'Name',
			      	 	age:'Age'
			      	},
			      	pagination:{
			      	 	chunk:10,
			      	},
		      },
		 	steps:[],										//使用的步骤编辑器
		 	stepIndex:0,								//已生成且使用的步骤编辑器数量
		 	isMultiple:false,								//图片上传控件是否多文件上传
			uploadedFiles:[],							//多文件上传时已上传图片数组
			uploads:[],
		 	maxSteps:10,								//可用步骤的最大值
		 	html:'',
		 	autocomplete4Touched: false,				
		 	nameError:true,								//食物名称错误标志
		 	nerrorMsg:'LoginName is required',		//食物名称错误信息
		 	foodName:''								//食物名称变量
		}
	},
	beforeMount:function(){
		this.addSteps();
	},
	mounted:function(){
		Vue.http.post("http://localhost:3000/users",{entType:'1'}).then(function(res){ 	
			console.log(res);
		 },function(err){});
		 console.log(this.$refs);
	},
	beforeDestroy:function(){
	},
	methods:{
		show:function(){
			var that = this;
			var stepsTmp = this.steps.slice(0,this.steps.length);
			var tmpRef = $.extend(true,{},this.$refs);
			console.log(tmpRef);
			stepsTmp.map(function(val){
				tmpRef[val.id].text = tmpRef[val.id][0].editor.getContent();
				//that.html += val.text;
			});
			this.html = tmpRef.info.editor.getContent();
			console.log(this.html,tmpRef);
		},
		format(){
		},
		//添加步骤
		addSteps(){
			if(this.steps.length > this.maxSteps){
				return;
			}
			this.steps.push({id:"editor"+this.steps.length});
			this.uploads.push({id:"upload"+this.uploads.length});
		},
		//删除步骤
		removeStep(step){
			if(this.steps.length < 2)return;
			delete this.$refs["upload"+(this.uploads.length-1)];
			delete this.$refs["editor"+(this.steps.length-1)];
			this.steps.length--;
			this.uploads.length--;
		},
		//验证食物名称格式和是否重复
		Valid(val){
			val = $.trim(val);
			var nameReg = /([a-zA-Z0-9\u4e00-\u9fa5])/g;
			if(val){
				if(val.length>0 && val.length<21){
					var result = val.match(nameReg);
					if(result && val.length == result.length){
						return this.$http.post('/checkName',{loginName:this.foodName}).then(function(ret){
							if(ret.body.length == 0){
								this.nerrorMsg="FoodName is exited";
								return this.nameError = false;
							}else{
								return this.nameError = true;
							}
						})
					}else{
						this.nerrorMsg = "FoodName only owns number,English word";
						return this.nameError = true;
					}
				}
			}else{
				this.nerrorMsg = "FoodName is required";
				return this.nameError = true;
			}
		},
	}
}