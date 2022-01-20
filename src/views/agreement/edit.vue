<template>
 <div class="app-container">
<el-form ref="form" :model="form" label-width="80px">
  <el-form-item label="标题" prop="title"  style="width: 71rem;">
    <el-input v-model="form.title"></el-input>
  </el-form-item>
    <div class="ckeditor" style="margin-left:10px;">
      <!-- 工具栏容器 -->
      <div id="toolbar-container"></div>
      <!-- 编辑器容器 -->
      <div id="editor">

      </div>
    </div>
    <br>
  <el-form-item>
    <el-button type="primary" @click="onSubmit">更新保存</el-button>
<!--     <el-button>取消</el-button> -->
  </el-form-item>
</el-form>
    <!-- 编辑器 -->

  </div>
</template>

<script>
import CKEditor from '@ckeditor/ckeditor5-build-decoupled-document'
import '@ckeditor/ckeditor5-build-decoupled-document/build/translations/zh-cn'
import { editAgreement, updateAgreement } from '@/api/agreement'
export default {
  data() {
    return {
      editor:null,//编辑器实例
      form:{
        id:null,
        content:'',
        title:''
      }
    }
  },
  created() {

    const id = this.$route.params && this.$route.params.id
    this.fetchData(id)
  },
  mounted() {
    this.initCKEditor()
  },
  methods: {
    fetchData(id) {
      editAgreement(id).then(response => {
        this.editor.setData(response.data.content);
        this.form.id = response.data.id;
        this.form.title = response.data.title;
      }).catch(err => {
        console.log(err)
      })
    },
    initCKEditor(){
      CKEditor.create(document.querySelector("#editor"),{
        language: 'zh-cn',
        ckfinder:{
          // 后端处理上传逻辑返回json数据,包括uploaded(选项true/false)和url两个字段
          uploadUrl:process.env.VUE_APP_BASE_API+"/upload/content/img",
        }
      }).then(editor => {
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

      updateAgreement(this.form.id, this.form ).then(response => {
          this.$message({
            message: '更新成功',
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
