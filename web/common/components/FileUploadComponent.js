import Vue from 'vue';
import FileUploadTemplate from "./template/FileUpload.html"
import FileUpload from 'vue-file-upload'
import comVue from 'web/modules/commonVue'

var types=['jpg','bmp','jpeg','png','gif'];
var fileUpload = Vue.component('upload-file',{
	template:FileUploadTemplate,
	props:['isMultiple','uploadIndex'],
	data:function(){
		return {
			url:'/node/upload/uploadImg',     //上传文件的url地址
			label:'',					     //上传按钮的文字
			max:'',					     //上传数量的最大值
			maxSize:1024*1024,	     //上传文件大小的最大值
			icon:'icon-plus',			     //上传按钮的icon的class样式
			multiple:'true',			     //是否多文件上传
			files:[],					     //已上传文件列表
			upload:{},				     //上传文件插件的对象
			autoUpload:true,		     //是否选择后自动上传文件
			filters:[],				     //上传文件过滤器数组
			requestOptions:{		     //上传文件请求附加数据
				formData:{
					isJsonRes:true
				}
			},
			isUploading:false,
			isShowBigImg:false,
			bigImgUrl:'',
			events:{						//上传文件的监听事件
				onAddFileSuccess(file){
					//console.log('onAddFileSuccess');
				},
				onProgressUpload:function(file,progress){
					//console.log(progress);
				},
		             onCompleteUpload:function(file,res,status,headers){
		             	//console.log(file);
		             	//console.log(arguments);
		             },
		             onErrorUpload:function(file,res,status,headers){

		             },
		             onSuccessUpload:function(file,res,status,headers){
		             	//console.log(file);
		             },
		             onAbortUpload:function(file,res,status,headers){

		             },
		             onAddFileFail:function(file,failFilter){

		             },
		             onBeforeUpload:function(file){
		             	//console.log('onBeforeUpload');
		             }
			}
		}
	},
	created(){
		var that = this;
		if(typeof this.isMultiple != 'undefined'){
			this.multiple = this.isMultiple;
		}

		this.events.onBeforeUpload = function(file){
			comVue.$emit('on-progress-start');
			that.isUploading = true;
		}
		this.events.onSuccessUpload = function(file,res,status,headers){
			comVue.$emit('on-progress-end');
			that.isUploading = false;
			if(res && res.result){
				var filename = res.result.slice(res.result.lastIndexOf('/'));
				that.files.push({newName:filename,newUrl:res.result,file:file});
				if(typeof that.uploadIndex != undefined){
					comVue.$emit("file-uploaded",{'files':that.files,'index':that.uploadIndex});
				}
				that.$forceUpdate();
			}else{
				console.log(res);
			}
			//console.log(that.files);
		}
	},
	mounted(){
		var that = this;

		this.filters.push({
			name:'imgType',
			fn(file){
				var type = file.name.slice(file.name.lastIndexOf('.')+1);
				var flag = types.some(function(val){return val==type});
				return flag;
		}});
		this.filters.push({
			name:'imgSize',
			fn(file){
				var flag = file.size < that.maxSize || file.size ==that.maxSize;
				return flag;
		}});
		this.upload = this.$children[0].$data;
		comVue.$on('delete-upload-file',function(data){
			//console.log(that.files);
			if(data && data.index){
				that.files.splice(index,1);
				return;
			}
			that.files = [];
		});
	},
	beforeDestroy(){
		//console.log(this.files);
	},
	components:{
		vueFileUpload:FileUpload
	},
	methods:{
		remove(file,index){
			this.files.splice(index,1);
			this.$http.post("http://localhost:3000/node/upload/delfile",{filePath:file.newName}).then(function(ret){
				console.log(ret);
			});
		},
		hideBigImg(){
			this.isShowBigImg = false;
		},
		showBigImg(file){
			this.bigImgUrl = file.newUrl;
			this.isShowBigImg = true;
		}
	}
})
