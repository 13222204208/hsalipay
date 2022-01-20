<template>
   <div class="app-container">
      <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
		<el-form-item label="旧密码" prop="oldPassword">
		  <el-input type="password" v-model="ruleForm.oldPassword" autocomplete="off"></el-input>
		</el-form-item>
        <el-form-item label="新密码" prop="password">
          <el-input type="password" v-model="ruleForm.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPassword">
          <el-input type="password" v-model="ruleForm.checkPassword" autocomplete="off"></el-input>
        </el-form-item>


        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
  </div>
</template>
<script>
  import { updateAdmin } from '@/api/admin'
  export default {
    data() {

      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          if (this.ruleForm.checkPassword !== '') {
            this.$refs.ruleForm.validateField('checkPassword');
          }
          callback();
        }
      };
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.ruleForm.password) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      return {
        ruleForm: {
          password: '',
          checkPassword: '',
          oldPassword: '',
        },
        rules: {
          password: [
            { required: true, validator: validatePass, trigger: 'blur' },
            { min: 6, max: 25, message: '长度在 6 到 25个字符', trigger: 'blur' }
          ],
          checkPassword: [
            { required: true, validator: validatePass2, trigger: 'blur' },
            { min: 6, max: 25, message: '长度在 6 到 25 个字符', trigger: 'blur' }
          ],
          oldPassword: [
            { required: true, message: '请输入旧密码', trigger: 'blur' },
            { min: 6, max: 25, message: '长度在 6 到 25 个字符', trigger: 'blur' }
          ],

        }
      };
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {

            updateAdmin(this.ruleForm).then(response => {
                this.$message({
                  message: '密码更新成功',
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
