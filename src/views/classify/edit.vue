<template>
 <div class="app-container">
<el-form ref="form" :model="form" :rules="rules" label-width="80px">
  <el-form-item label="标题" prop="title">
    <el-input v-model="form.title" style="width: 58rem;"></el-input>
  </el-form-item>
  <el-form-item label="图标" prop="icon_url">
      <el-upload
        name="upload"
        :action="uploadUrl"
        list-type="picture-card"
        :limit='1'
        :file-list="imgFilesIconList"
        :on-success="handleUpIconSuccess"
        :on-preview="handlePictureCardPreview"
        :on-remove="handleRemove">
        <i class="el-img_url-plus"></i>
      </el-upload>
      <el-dialog :visible.sync="dialogVisible">
        <img width="100%" :src="dialogImageUrl" alt="">
      </el-dialog>

  </el-form-item>
  <el-form-item label="主图" prop="img_url">
      <el-upload
        name="upload"
        :action="uploadUrl"
        list-type="picture-card"
        :limit='1'
        :file-list="imgFilesList"
        :on-success="handleUpSuccess"
        :on-preview="handlePictureCardPreview"
        :on-remove="handleRemove">
        <i class="el-img_url-plus"></i>
      </el-upload>
      <el-dialog :visible.sync="dialogVisible">
        <img width="100%" :src="dialogImageUrl" alt="">
      </el-dialog>

  </el-form-item>
  <el-form-item label="背景图" prop="bg_url">
      <el-upload
        name="upload"
        :action="uploadUrl"
        list-type="picture-card"
        :limit='1'
        :file-list="imgFilesBgList"
        :on-success="handleUpBgSuccess"
        :on-preview="handlePictureCardPreview"
        :on-remove="handleRemove">
        <i class="el-img_url-plus"></i>
      </el-upload>
      <el-dialog :visible.sync="dialogVisible">
        <img width="100%" :src="dialogImageUrl" alt="">
      </el-dialog>

  </el-form-item>
  <el-form-item label="重量单位" prop="unit">
    <el-input  v-model="form.unit" placeholder="例如 公斤 " style="width: 58rem;"></el-input>
  </el-form-item>
  <el-form-item label="排序" prop="sort">
    <el-input v-model="form.sort" style="width: 58rem;"></el-input>
  </el-form-item>

  <el-form-item label="状态" prop="status">
      <el-radio v-model="form.status" :label='1'>开启</el-radio>
      <el-radio v-model="form.status" :label='0' >关闭</el-radio>
  </el-form-item>

  <el-form-item label="跳转地址" >
    <el-input v-model="form.skip_url" style="width: 58rem;"></el-input>
  </el-form-item>

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
import { editClassify, updateClassify } from '@/api/classify'

export default {
  data() {
    const validatesort = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入排序'))
      } else {
        callback()
      }
    }
    return {
      editor:null,//编辑器实例
      form:{
        id:'',
        sort:'',
        title:'',
        unit:'',
        icon_url:'',
        img_url:'',
        skip_url:'',
        bg_url:'',
        status:1
      },
        rules: {
          sort: [
            { required:true,validator: validatesort, trigger: 'blur' }
          ],
        },
      option:[],
      imgFilesList:[],
      imgFilesIconList:[],
      imgFilesBgList:[],
      dialogImageUrl: '',
      dialogVisible: false,
      uploadUrl:process.env.VUE_APP_BASE_API+"/upload/img"
    }
  },

  created() {
    const id = this.$route.params && this.$route.params.id

    this.fetchData(id)
  },


  methods: {

    fetchData(id) {
      editClassify(id).then(response => {console.log(response)
        this.form.sort= response.data.sort;

        var str=process.env.VUE_APP_BASE_API;
         var  leg= str.indexOf('api');
           var url= str.substr(0,leg);
           this.imgFilesList.push({
             "url": url+response.data.img_url,
           });
           this.imgFilesIconList.push({
             "url": url+response.data.icon_url,
           });
           this.imgFilesBgList.push({
             "url": url+response.data.bg_url,
           });
        this.form = response.data;
      
      }).catch(err => {
        console.log(err)
      })
    },

      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePictureCardPreview(file) { console.log(file.url)
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
      handleUpSuccess(response){

          if(response.uploaded == true){
            this.form.img_url = response.url;
            console.log(this.form.img_url);
          }
      },

      handleUpIconSuccess(response){

          if(response.uploaded == true){
            this.form.icon_url = response.url;
            console.log(this.form.icon_url);
          }
      },

      handleUpBgSuccess(response){

          if(response.uploaded == true){
            this.form.bg_url = response.url;
            console.log('bg图',this.form.bg_url);
          }
      },


    onSubmit(){
      console.log(this.form);
      updateClassify(this.form.id,this.form).then(response => {
          this.$message({
            message: '更新成功',
            type: 'success'
          })
          this.$router.push({name:'ClassifyList'})
        }
      );
    }
  }
}

</script>

<style>

</style>
