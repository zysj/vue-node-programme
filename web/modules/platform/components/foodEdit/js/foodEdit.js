import Vue from "vue"
import wangEditor from "wangeditor"
import tableSplit from 'web/common/components/tableDirective.js'
import FileUpload from 'web/common/components/FileUploadComponent'
import {ServerTable, ClientTable, Event} from "vue-tables-2"
import {VuePagination, VueEvent} from 'vue-pagination-2';
import comVue from 'web/modules/commonVue'

Vue.use(VuePagination);
Vue.use(ClientTable,{
	compileTemplates: true
},false);
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
		      //概述编辑器菜单配置
		      editorMenus:[
		 		 'source', '|','bold', 'underline','italic', 'strikethrough','eraser', 'forecolor','bgcolor',
		        	'|','quote', 'fontfamily', 'fontsize','head','unorderlist','orderlist','alignleft','aligncenter','alignright','|','lineheight','indent',
		       	'|', 'link', 'unlink', 'table','emotion','|','img','video','insertcode','|','undo','redo','fullscreen'
	 		],
	 		//步骤编辑器菜单配置
	 		stepEditMenus:[
	 			 'bold', 'underline','italic', 'strikethrough','eraser', 'forecolor','bgcolor',
		        	'|','quote', 'fontfamily', 'fontsize','head','unorderlist','orderlist','alignleft','aligncenter','alignright','|','lineheight','indent',
		       	'|', 'link', 'unlink', 'table','emotion','|','undo','redo','fullscreen'
	 		],
	 		//编辑器图片上传地址
	 		editorUploadImgUrl:"http://localhost:3000/upload/uploadImg",
	 		//编辑器上传图片删除地址
	 		editorDelFn:function(img){
		 		var src = $(img).attr("src");
		 		var param = src.slice(src.indexOf('/img/')+'/img/'.length-1);
		 		console.log(param);
		 		Vue.http.post("http://localhost:3000/upload/delfile",{filePath:param}).then(function(ret){
		 			console.log(ret.body);
		 			alert(ret.body);
		 		});
		 	},
		 	stepEditors:{},								//步骤编辑器父对象
		 	hasEditorNum:0,							//已生成的步骤编辑器数量
		 	steps:[],										//使用的步骤编辑器
		 	stepIndex:0,								//已生成且使用的步骤编辑器数量
		 	isMultiple:false,								//图片上传控件是否多文件上传
		 	uploadedFiles:[],							//多文件上传时已上传图片数组
		 	maxSteps:10,								//可用步骤的最大值
		 	html:'',
		 	autocomplete4Touched: false,				
		 	nameError:true,								//食物名称错误标志
		 	nerrorMsg:'LoginName is required',		//食物名称错误信息
		 	foodName:''								//食物名称变量
		}
	},
	beforeMount:function(){
		//预生成一个步骤对象
		var CreateEditor = 'editor'+this.hasEditorNum;
		this.stepEditors[CreateEditor] = {text:'',id:'step-food-'+this.hasEditorNum,CanEdit:false};
		this.steps.push(this.stepEditors[CreateEditor]);
	},
	mounted:function(){
		Vue.http.post("http://localhost:3000/users",{entType:'1'}).then(function(res){ 	
			console.log(res);
		 },function(err){});
		 var that = this;
		 //概述编辑器生成
		editor = new wangEditor('edit-food');
 		editor.config.menus = this.editorMenus;
	 	editor.config.uploadImgUrl = this.editorUploadImgUrl;
	 	editor.config.deleteUploadImgFn = this.editorDelFn;
	 	editor.create();
	 	console.log(editor);
	 	this.createStep();
	 	//编辑器对象会对当前网页有一个scroll事件，轻微影响页面展示效果
	 	$(window).off('scroll');
	},
	beforeDestroy:function(){
		editor.destroy();
		for(var i in this.stepEditors){
			this.stepEditors[i].destroy();
		}
	},
	methods:{
		show:function(){
			var that = this;
			var stepsTmp = this.steps.slice(0,this.steps.length-1);
			stepsTmp.map(function(val){
				val.text = val.$txt.html();
				//that.html += val.text;
			});
			this.html = editor.$txt.html();
			console.log(this.html);
		},
		format(){
			editor.$txt.html(this.html);
		},
		//添加步骤
		addSteps(){
			if(this.steps.length > this.maxSteps){
				return;
			}
			this.createStep();
		 	this.$forceUpdate();
		},
		//创造步骤
		createStep(){
			var CreateEditor = 'editor'+this.hasEditorNum;
			//console.log(CreateEditor);
			this.stepEditors[CreateEditor] = new wangEditor('step-food-'+this.hasEditorNum);
		 	this.stepEditors[CreateEditor].config.menus = this.stepEditMenus;
		 	this.stepEditors[CreateEditor].config.uploadImgUrl = this.editorUploadImgUrl;
		 	this.stepEditors[CreateEditor].config.deleteUploadImgFn = this.editorDelFn;
		 	this.stepEditors[CreateEditor].create();
		 	// console.log(this.stepEditors[CreateEditor]);
		 	this.steps[this.stepIndex] = $.extend({},this.stepEditors[CreateEditor],this.steps[this.stepIndex]);
		 	this.steps[this.stepIndex].CanEdit = true;
		 	this.steps.push( {text:'',id:'step-food-'+(++this.hasEditorNum),CanEdit:false});
		 	this.stepIndex++;
		 	$(window).off('scroll');
		 	// console.log(this.stepEditors);
		},
		//删除步骤
		removeStep(step,index){
			if(this.steps.length == 2){
				return;
			}
			//获取当前step对应于stepsEditors中的编号
			var findex = step.id.slice(step.id.lastIndexOf('-')+1);
			var that = this;
			//从点击的step的后一个开始，把该step后面的step的valueContainer往前移动，即获取前面step的valueContainer位置，并把container放在新的textare后面。
			//upload组件也同样把files数组赋予前一个upload组件实例，并且清除倒数第二个upload组件实例的files数组。
			//原因：1、即便循环数组的其中的一个数组元素减少了，但生成的相同的index的html元素是不会remove，只会remove最后一个html元素。
			//          2、wangeditor的destroy函数原本是只隐藏它的editContainer和valueContainer元素，因此重写了该方法。
			//          3、wangeditor由于所绑定“#step-food-index”会随着循环数组而变化，但wangeditor绑定的是对象，因此valuecontainer不会变化位置，需要进行调整。
			for(var i = index+1;i<this.steps.length-1;i++){
				(function(){
					var index = i;
					that.steps[index].$valueContainer = $("#"+that.steps[(index==0?index:index-1)].id);
					that.steps[index].$valueContainer.after(that.steps[index].$editorContainer);
					that.$refs.upload[index-1].files = that.$refs.upload[index].files;
					if(index == that.steps.length-2){
						that.$refs.upload[index].files = [];
					}
				})();
			}

			this.stepEditors['editor'+findex].destroy(true);
			this.steps.splice(index,1);
			this.stepIndex--;
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