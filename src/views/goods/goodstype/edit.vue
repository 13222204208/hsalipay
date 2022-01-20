<template>
   <div class="app-container">
      <el-form :model="ruleForm" status-icon  ref="ruleForm" label-width="100px" class="demo-ruleForm">
		<el-form-item label="商品类型名称" >
		  <el-input  v-model="ruleForm.title" ></el-input>
		</el-form-item>
        <el-form-item label="排序" >
          <el-input  v-model="ruleForm.sort" ></el-input>
        </el-form-item>


        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">更新</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
  </div>
</template>
<script>
  import { updateGoodsType, editGoodsType } from '@/api/goodstype'
  export default {
    data() {
      return {
        ruleForm: {
          title: '',
          sort: '',
        },

      };
    },

    created() {
      const id = this.$route.params && this.$route.params.id

      this.fetchData(id)
    },

    methods: {

      fetchData(id) {
        editGoodsType(id).then(response => {console.log(response)
          this.ruleForm = response.data;
        }).catch(err => {
          console.log(err)
        })
      },

      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            console.log(this.ruleForm); 
            updateGoodsType(this.ruleForm.id, this.ruleForm).then(response => {
                this.$message({
                  message: '更新成功',
                  type: 'success'
                })
                    this.$router.go(-1);
              }
            );
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    }
  }
</script>
