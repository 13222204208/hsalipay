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
    <el-input  v-model="form.price" placeholder="例如 1 " style="width: 58rem;"></el-input>
  </el-form-item>

  <el-form-item label="备注" prop="remark">
    <el-input  v-model="form.remark" placeholder=" " style="width: 58rem;"></el-input>
  </el-form-item>

  <el-form-item label="排序" prop="title">
    <el-input type="number" v-model="form.sort" placeholder="例如 1 " style="width: 58rem;"></el-input>
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
import { editIncome, updateIncome } from '@/api/income'
import { showClassify  } from '@/api/classify'

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

    }
  },

  created() {
    const id = this.$route.params && this.$route.params.id

    this.fetchData(id)
    this.getList()
  },


  methods: {
    getList(){
      showClassify().then( response=>{
       // console.log('商品分类',response)
        this.option = response.data;

      })
    },

    fetchData(id) {
      editIncome(id).then(response => {
        console.log('商品详情',response.data)

        this.form = response.data;
        console.log(this.form)
      }).catch(err => {
        console.log(err)
      })
    },





    onSubmit(){
      console.log(this.form);
      updateIncome(this.form.id,this.form).then(response => {
        console.log('返回信息',response);
          this.$message({
            message: '更新成功',
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
