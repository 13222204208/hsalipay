<template>
 <div class="app-container">
<el-form ref="form" :model="form" :rules="rules" label-width="80px">
  <el-form-item label="商品名称" prop="title">
    <el-input v-model="form.title" style="width: 58rem;"></el-input>
  </el-form-item>

  <el-form-item label="商品图" prop="img_url">
      <el-upload
        name="upload"
        :action="uploadUrl"
        list-type="picture-card"
        :limit='6'
        :file-list="imgFilesList"
        :on-success="handleUpSuccess"
        :on-preview="handlePictureCardPreview"
        :on-remove="handleRemove">
        <i class="el-icon-plus"></i>
      </el-upload>
      <el-dialog :visible.sync="dialogVisible">
        <img width="100%" :src="dialogImageUrl" alt="">
      </el-dialog>

  </el-form-item>
  <el-form-item label="所属分类" prop="goodstype">
    <el-select v-model="form.goods_type" placeholder="请选择类别" style="width: 58rem;">
      <el-option v-for='item in option' :key='item.id' :value='item.id' :label='item.title'>
       <span style="float: left">{{ item.title }}</span> 			</el-option>
    </el-select>
  </el-form-item>

  <el-form-item label="所需积分" prop="integral">
    <el-input type="number" v-model="form.integral" placeholder="例如 1 " style="width: 58rem;"></el-input>
  </el-form-item>
  <el-form-item label="市场价格" prop="price">
    <el-input type="number" v-model="form.price" placeholder="例如 1 " style="width: 58rem;"></el-input>
  </el-form-item>
  <el-form-item label="库存" prop="stock">
    <el-input type="number" v-model="form.stock" placeholder="例如 1 " style="width: 58rem;"></el-input>
  </el-form-item>
  <el-form-item label="排序" prop="title">
    <el-input type="number" v-model="form.sort" placeholder="例如 1 " style="width: 58rem;"></el-input>
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
import { editGoods, updateGoods } from '@/api/goods'
import { showGoodsType  } from '@/api/goodstype'

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
        title:'',
        sort:'',
        img_url:[],
        integral:0,
        price:0,
        stock:0,
        content:'',
        goods_type:null
      },
        rules: {
          sort: [
            { required:true,validator: validatesort, trigger: 'blur' }
          ],
        },
      option:[],
      imgFilesList:[],
      dialogImageUrl: '',
      dialogVisible: false,
      uploadUrl:process.env.VUE_APP_BASE_API+"/upload/img"
    }
  },

  created() {
    const id = this.$route.params && this.$route.params.id

    this.fetchData(id)
    this.getList()
  },
  mounted() {
    this.initCKEditor()
  },

  methods: {
    getList(){
      showGoodsType().then( response=>{
       // console.log('商品分类',response)
        this.option = response.data;

      })
    },

    fetchData(id) {
      editGoods(id).then(response => {
        //console.log('商品详情',response.data.img_url[0])
        this.form.sort= response.data.sort;
        this.editor.setData(response.data.content);
        var str=process.env.VUE_APP_BASE_API;
         var  leg= str.indexOf('api');
           var url= str.substr(0,leg);

           var imgUrl = response.data.img_url;
           for (let i = 0; i < imgUrl.length; i++) {
             this.imgFilesList.push({
               "url": url+response.data.img_url[i],
             });
           }

        this.form = response.data;
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


      handleRemove(file, fileList) {
        console.log(file);
        this.form.img_url.pop(file.response);
          console.log( '图片数组',this.form.img_url);
      },
      handlePictureCardPreview(file) { console.log(file.url)
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
      handleUpSuccess(response){
          console.log('图片上传完成',response)
          if(response.code == 0){
            this.$message({
              message: '上传失败',
              type: 'error'
            })
          }else{
            if(response.uploaded == true){
              this.form.img_url.push(response.url)
              console.log(this.form.img_url);
            }
          }

      },


    onSubmit(){
      this.form.content = this.editor.getData();//富文本内容
      console.log(this.form);
      updateGoods(this.form.id,this.form).then(response => {
          this.$message({
            message: '更新成功',
            type: 'success'
          })
          this.$router.push({name:'GoodsList'})
        }
      );
    }
  }
}

</script>

<style>
.ckeditor{width: 80%; margin: 30px auto 0px; border:1px solid #ddd;}
</style>
