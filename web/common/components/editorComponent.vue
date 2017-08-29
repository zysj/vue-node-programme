<template>
  <div :class="wrapperClass">
      <textarea type="text/plain" class="editorClass" :id="contentId" style="width:100%;height:400px;"></textarea>
  </div>
</template>
<script>
import Vue from 'vue'
import umeditorConfig from '../configs/umeditorConfig.js'
import umeditor from 'resources/lib/umeditor/umeditor.js'
import 'resources/lib/umeditor/lang/zh-cn/zh-cn.js'

export default Vue.component('vueEditor',{
    props:['wrapperClass','editorClass','editConfig','bindId'],
    data(){
        return {
            config:{
                autoHeightEnabled:false,
                initialFrameHeight : "200"      //初始化编辑器高度
            },
            editor:null,
            contentId:"content"
        }
    },
    created(){
        this.config = $.extend(this.config,umeditorConfig,this.editConfig);
        if(this.bindId === undefined || this.bindId == null)this.bindId = "";
        this.contentId += this.bindId;
    },
    beforeMount(){
    },
    mounted(){
        this.editor || (this.editor = UM.getEditor(this.contentId,this.config));
    },
    destroy(){
        this.editor.destroy();
    }
})
</script>
<style lang="stylus" scoped>
.editor-init{
    width:100%;
    height:400px;
}
</style>


