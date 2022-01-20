<template>
 <div class="app-container">
<el-form ref="form" :model="form"  label-width="80px">
  <el-form-item label="标题" prop="title">
    <el-input v-model="form.title" placeholder=" " style="width: 58rem;"></el-input>
  </el-form-item>

  <el-form-item label="图标" prop="icon_url">
      <el-upload
        name="upload"
        :action="uploadUrl()"
        list-type="picture-card"
        :limit='1'
        :class="{hide:hideUploadEdit}"
        :on-success="handleUpIconSuccess"
        :on-preview="handlePictureCardPreview"
        :on-change="handleEditChange"
        :on-remove="handleRemove">
        <i class="el-icon-plus"></i>
      </el-upload>
      <el-dialog :visible.sync="dialogVisible">
        <img width="100%" :src="dialogImageUrl" alt="">
      </el-dialog>

  </el-form-item>

  <el-form-item label="主图" prop="img_url">
      <el-upload
        name="upload"
        :action="uploadUrl()"
        list-type="picture-card"
        :limit='1'
        :on-success="handleUpSuccess"
        :on-preview="handlePictureCardPreview"
        :on-remove="handleRemove">
        <i class="el-icon-plus"></i>
      </el-upload>
      <el-dialog :visible.sync="dialogVisible">
        <img width="100%" :src="dialogImageUrl" alt="">
      </el-dialog>

  </el-form-item>

  <el-form-item label="背景图" prop="bg_url">
      <el-upload
        name="upload"
        :action="uploadUrl()"
        list-type="picture-card"
        :limit='1'
        :on-success="handleBgSuccess"
        :on-preview="handlePictureCardPreview"
        :on-remove="handleRemove">
        <i class="el-icon-plus"></i>
      </el-upload>
      <el-dialog :visible.sync="dialogVisible">
        <img width="100%" :src="dialogImageUrl" alt="">
      </el-dialog>

  </el-form-item>

  <el-form-item label="重量单位" prop="unit">
    <el-input  v-model="form.unit" placeholder="例如 公斤 " style="width: 58rem;"></el-input>
  </el-form-item>

  <el-form-item label="排序" >
    <el-input v-model="form.sort" placeholder="例如 1 " style="width: 58rem;"></el-input>
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
import { storeClassify} from '@/api/classify'
export default {
  data() {
    return {
      hideUploadEdit:false,
      form:{
        title:'',
        sort:'',
        icon_url:'',
        unit:'',
        img_url:'',
        skip_url:'',
        bg_url:'',
      },
      option:[],
      dialogImageUrl: '',
      dialogVisible: false
    }
  },

  methods: {

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

      handleUpIconSuccess(response){console.log(response);
          if(response.uploaded == true){
            this.form.icon_url = response.url;
            console.log(this.form.icon_url);
          }
      },
      handleUpBgSuccess(response){console.log(response);
          if(response.uploaded == true){
            this.form.bg_url = response.url;
            console.log(this.form.bg_url);
          }
      },

    onSubmit(){
      console.log(this.form);
      if(this.form.img_url == '' || this.form.icon_url == ''){
        this.$message({
          message: '请上传图片',
          type: 'error'
        })
        return false
      }

      storeClassify(this.form).then(response => {
          this.$message({
            message: '创建成功',
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

.hide .el-upload--picture-card { display: none; }
</style>
