<template>
   <div class="app-container">
      <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="帐号" prop="username">
            <el-input v-model="ruleForm.username"></el-input>
          </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="ruleForm.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPassword">
          <el-input type="password" v-model="ruleForm.checkPassword" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="ruleForm.name"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="ruleForm.phone"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
  </div>
</template>
<script>
  import { storeAdmin } from '@/api/admin'
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
          username: '',
          phone: '',
          name: ''
        },
        rules: {
          password: [
            { required: true, message: '请输入密码', validator: validatePass, trigger: 'blur' },
            { min: 6, max: 25, message: '长度在 6 到 25 个字符', trigger: 'blur' }
          ],
          checkPassword: [
            { required: true, message: '请输入密码', validator: validatePass2, trigger: 'blur' },
            { min: 6, max: 25, message: '长度在 6 到 25 个字符', trigger: 'blur' }
          ],
          name: [
            { required: true, message: '请输入姓名', trigger: 'blur' },
            { min: 2, max: 25, message: '长度在 2 到 25 个字符', trigger: 'blur' }
          ],
          username: [
            { required: true, message: '请输入帐号', trigger: 'blur' },
            { min: 6, max: 25, message: '长度在 6 到 25 个字符', trigger: 'blur' }
          ],
          phone: [
            { required: true, message: '请输入手机号', trigger: 'blur' },
          ],

        }
      };
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            console.log(this.ruleForm);
            storeAdmin(this.ruleForm).then(response => {
                this.$message({
                  message: '创建成功',
                  type: 'success'
                })
                this.$router.push({name:'AdminList'})
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
