<template>
 <div class="app-container">
<el-form ref="form" :model="form"  label-width="80px">

  <el-form-item label="胶囊图" prop="img_url">
      <el-upload
        name="upload"
        :action="uploadUrl()"
        list-type="picture-card"
        :limit='1'
        :class="{hide:hideUploadEdit}"
        :on-success="handleUpSuccess"
        :file-list="imgFilesList"
        :on-preview="handlePictureCardPreview"
        :on-change="handleEditChange"
        :on-remove="handleRemove">
        <i class="el-icon-plus"></i>
      </el-upload>
      <el-dialog :visible.sync="dialogVisible">
        <img width="100%" :src="dialogImageUrl" alt="">
      </el-dialog>
</el-form-item>

  <el-form-item label="链接地址" >
    <el-input v-model="form.skip_url" placeholder=" " style="width: 58rem;"></el-input>
  </el-form-item>

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
import { updateCapsuleSetting, getCapsuleSettingInfo} from '@/api/setting'
export default {
  data() {
    return {
      hideUploadEdit:false,
      form:{
        img_url:'',
        skip_url:''
      },
      option:[],
      imgFilesList:[],
      dialogImageUrl: '',
      dialogVisible: false
    }
  },

  created() {
      this.getCapsuleSetting()
  },

  methods: {

    getCapsuleSetting() {
        getCapsuleSettingInfo().then(response => {
          console.log(response.data)
          var str=process.env.VUE_APP_BASE_API;
           var  leg= str.indexOf('api');
             var url= str.substr(0,leg);
             this.imgFilesList.push({
               "url": url+response.data.img_url,
             });
          this.form = response.data
        })
    },

    handleEditChange(file, fileList) {
      this.hideUploadEdit = fileList.length >= 1
      console.log(' fileList.length: ', fileList.length)
    },

    uploadUrl() {
        var url = process.env.VUE_APP_BASE_API+"/upload/img"// 生产环境和开发环境·的判断
        return url
    },
      handleRemove(file, fileList) {
        this.hideUploadEdit = false
        console.log('删除调用',file, fileList);
      },
      handlePictureCardPreview(file) { console.log(file.url)
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
      handleUpSuccess(response){console.log(response);
          if(response.uploaded == true){
            this.form.img_url = response.url;
            console.log(this.form.img_url);
          }
      },

    onSubmit(){
      console.log(this.form);
      if(this.form.img_url == ''){
        this.$message({
          message: '请上传图片',
          type: 'error'
        })
        return false
      }
      updateCapsuleSetting(this.form).then(response => {
          this.$message({
            message: '提交成功',
            type: 'success'
          })
          this.$router.push({name:'CapsuleSettingIndex'})
        }
      );
    }
  }
}

</script>

<style>

.hide .el-upload--picture-card { display: none; }
</style>
