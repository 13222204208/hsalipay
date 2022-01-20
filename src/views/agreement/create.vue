<template>
 <div class="app-container">
  <el-form ref="form" :model="form" label-width="80px">
  <el-form-item label="所属分类" prop="type">
    <el-select v-model="form.type" placeholder="请选择回收须知" style="width: 58rem;">
      <el-option v-for='item in option' :key='item.id' :value='item.id' :label='item.title'>  			</el-option>
    </el-select>
  </el-form-item>
  <el-form-item label="标题" prop="title"  style="width: 63rem;">
    <el-input v-model="form.title"></el-input>
  </el-form-item>
    <div class="ckeditor" style="margin-left:10px; width:1000px">
      <!-- 工具栏容器 -->
      <div id="toolbar-container"></div>
      <!-- 编辑器容器 -->
      <div id="editor">

      </div>
    </div>
    <br>
  <el-form-item>
    <el-button type="primary" @click="onSubmit">立即创建</el-button>
<!--     <el-button>取消</el-button> -->
  </el-form-item>
</el-form>
    <!-- 编辑器 -->

  </div>
</template>

<script>
import CKEditor from '@ckeditor/ckeditor5-build-decoupled-document'
import '@ckeditor/ckeditor5-build-decoupled-document/build/translations/zh-cn'
import { storeAgreement , delContact , updateContact} from '@/api/agreement'
import { showClassify  } from '@/api/classify'
export default {
  data() {
    return {
      editor:null,//编辑器实例
      form:{
        type:'',
        title:'',
        content:''
      },
      option:[],
    }
  },
  mounted() {
    this.initCKEditor()
  },
  created() {
    this.getList()
  },
  methods: {
    getList(){
      showClassify().then( response=>{
        console.log('分类',response)
        this.option = response.data;

      })
    },
    initCKEditor(){
      CKEditor.create(document.querySelector("#editor"),{
        language: 'zh-cn',
        ckfinder:{
          // 后端处理上传逻辑返回json数据,包括uploaded(选项true/false)和url两个字段
          uploadUrl:process.env.VUE_APP_BASE_API+"/upload/content/img",
        }
      }).then(editor => {console.log(editor);
        const toolbarContainer = document.querySelector('#toolbar-container');
        toolbarContainer.appendChild(editor.ui.view.toolbar.element);
        // 将编辑器保存起来，用来随时获取编辑器中的内容等，执行一些操作
        this.editor = editor;
      }).catch(error => {
        console.log(error)
      });
    },
    /*获取编辑器内容*/
    getHtml(){
      console.log(this.editor.getData());
    },

    onSubmit(){
      this.form.content = this.editor.getData();//富文本内容
      console.log(this.form);
      storeAgreement(this.form).then(response => {
          this.$message({
            message: '创建成功',
            type: 'success'
          })
          this.$router.push({name:'AgreementList'})
        }
      );
    }
  }
}

</script>

<style>
.ckeditor{width: 80%; margin: 30px auto 0px; border:1px solid #ddd;}
</style>
