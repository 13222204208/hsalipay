<template>
 <div class="app-container">
<el-form ref="form" :model="form" :rules="rules" label-width="80px">

  <el-form-item label="所属分类" prop="classify_id">
    <el-select v-model="form.classify_id" placeholder="请选择分类" style="width: 58rem;">
      <el-option v-for='item in option' :key='item.id' :value='item.id' :label='item.title'>  			</el-option>
    </el-select>
  </el-form-item>

  <el-form-item label="重量" prop="weight">
    <el-input v-model="form.weight" placeholder="例如 10-20"  style="width: 58rem;"></el-input>
  </el-form-item>

  <el-form-item label="预计收益" prop="price">
    <el-input  v-model="form.price" placeholder="例如 20~30 " style="width: 58rem;"></el-input>
  </el-form-item>

  <el-form-item label="备注" prop="remark">
    <el-input  v-model="form.remark" style="width: 58rem;"></el-input>
  </el-form-item>

  <el-form-item label="排序" prop="title">
    <el-input type="number" v-model="form.sort" placeholder="例如 1 " style="width: 58rem;"></el-input>
  </el-form-item>


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
import { storeIncome} from '@/api/income'
import { showClassify  } from '@/api/classify'
export default {
  data() {
    return {
      form:{
        weight:'',
        sort:'',
        remark:'',
        classify_id:'',
        price:0,
      },
      rules: {
         weight: [
             { required: true, message: '请输入重量范围', trigger: 'blur' },
             { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
          ],
          classify_id: [
              { required: true, message: '请选择分类', trigger: 'blur' },
              { min: 1, max: 1, message: '请选择分类', trigger: 'blur' }
           ],
          price: [
              { required: true, message: '请填写预计收益', trigger: 'blur' },
              { min: 1, max: 10, message: '长度在 1 到 10', trigger: 'blur' }
           ],
          },
      option:[],
      dialogImageUrl: '',
      dialogVisible: false
    }
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

    onSubmit(){
      console.log(this.form);
      if(this.form.img_url == ''){
        this.$message({
          message: '请上传图片',
          type: 'error'
        })
        return false
      }

      storeIncome(this.form).then(response => {
          this.$message({
            message: '创建成功',
            type: 'success'
          })
          this.$router.push({name:'IncomeList'})
        }
      );
    }
  }
}

</script>

<style>
.ckeditor{width: 80%; margin: 30px auto 0px; border:1px solid #ddd;}
</style>
