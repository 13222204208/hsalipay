<template>
  <div class="app-container">
      <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="150px" class="demo-ruleForm">

    <el-form-item label="小程序appid：" prop="appid">
      <el-input v-model="ruleForm.appid"></el-input>
    </el-form-item>

    <el-form-item label="小程序appsecret：" prop="appsecret">
      <el-input v-model="ruleForm.appsecret"></el-input>
    </el-form-item>

    <el-form-item label="小程序支付商户号：" prop="merchant">
      <el-input v-model="ruleForm.merchant"></el-input>
    </el-form-item>

    <el-form-item label="小程序支付秘钥：" prop="certpem">
      <el-input v-model="ruleForm.certpem"></el-input>
    </el-form-item>

    <el-form-item label="积分兑换比例：" prop="scale">
      <el-input type="text" oninput="value=value.replace(/[^\d]/g,'')" placeholder="请输入1-100的数字比例 1 代表 一积分一块钱, 100代表 100积分一块钱 " v-model="ruleForm.scale"></el-input>
    </el-form-item>

    <el-form-item label="提现最小金额：" prop="scale">
      <el-input type="text" oninput="value=value.replace(/[^\d]/g,'')" placeholder="请输入额度 " v-model="ruleForm.min_money"></el-input>
    </el-form-item>
    <el-form-item label="提现最大金额：" prop="scale">
      <el-input type="text" oninput="value=value.replace(/[^\d]/g,'')" placeholder="请输入额度 " v-model="ruleForm.max_money"></el-input>
    </el-form-item>

    <el-form-item label="腾讯地图key：" prop="mapkey">
      <el-input v-model="ruleForm.mapkey"></el-input>
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="submitForm('ruleForm')">保存设置</el-button>
    </el-form-item>

  </el-form>
  </div>
</template>

<script>
  import { updateMinappSetting, getMinappSettingInfo } from '@/api/setting'
  export default {
    data() {

      return {
        ruleForm: {
          appid: '',
          appsecret: '',
          certpem:'',
          merchant: '',
          mapkey: '',
          scale:'',
          min_money:'',
          max_money:''

        },
        rules: {
          appid: [
            { required: true, message: '请输入appid', trigger: 'blur' },
            { min: 2, max: 25, message: '长度在 2 到 25 个字符', trigger: 'blur' }
          ],
          appsecret: [
            { required: true, message: '请输入appsecret', trigger: 'blur' },
            { min: 6, max: 255, message: '长度在 6 到 255 个字符', trigger: 'blur' }
          ],
          merchant: [
            { required: true, message: '请输入商户号', trigger: 'blur' },
            { min: 6, max: 255, message: '长度在 6 到 25 个字符', trigger: 'blur' }
          ],

        }
      };
    },
    created() {
      this.getMinappSetting()
    },
    methods: {
      getMinappSetting(){
        getMinappSettingInfo().then(response => {
          //console.log(response.data)
          this.ruleForm.appid = response.data.appid;
          this.ruleForm.appsecret = response.data.appsecret;
          this.ruleForm.merchant = response.data.merchant;
          this.ruleForm.mapkey = response.data.mapkey;
          this.ruleForm.certpem = response.data.certpem;
          this.ruleForm.scale = response.data.scale;
          this.ruleForm.min_money = response.data.min_money;
          this.ruleForm.max_money = response.data.max_money;
        })
      },

      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            updateMinappSetting(this.ruleForm).then(response => {
                this.$message({
                  message: '保存成功',
                  type: 'success'
                })
                this.$router.push({name:'MinappSettingIndex'})
              }
            );
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },

    }
  }
</script>
