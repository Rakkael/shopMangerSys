<template>
  <div id="bgc">
    <div id="loginContainer">
      <div id="icon">
        <img src="../assets/logo.png" />
      </div>
      <div class="form">
        <el-form ref="loginForm" :rules="loginRules" :model="form" class="loginContainer">
          <el-form-item prop="username">
            <el-input
              v-model="form.username"
              placeholder="请输入用户名"
              prefix-icon="el-icon-user"
              @keyup.enter.native="submit"
            ></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              v-model="form.password"
              placeholder="请输入密码"
              prefix-icon="el-icon-lock"
              show-password
              @keyup.enter.native="submit"
            ></el-input>
          </el-form-item>
          <el-form-item class="buttons">
            <el-button type="primary" @click="submit">登录</el-button>
            <el-button type="info" @click="reset">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <!-- <div class="buttons">
      <el-button type="primary" @click="submit">登录</el-button>
      <el-button type="info" @click="reset">重置</el-button>
      </div>-->
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {      
        username: 'admin',
        password: '123456'
      },

      loginRules: {
        username: [
          { required: true, message: '请输入用户名', trggier:'change'},
          { min:4, max: 16, message: '用户名最小为4个字符，最大为16个字符', trggier:'change'}
        ],
        password: [
          { required: true, message:'请输入密码', trggier:'blur' },
          { min: 3, max: 16, message:'密码为3-16个字符', trggier:'blur'}
        ]

      }
    }
  },

  methods: {

    submit(){
      // console.log(this.form.username);
      // console.log(this.form.password);
      this.$refs.loginForm.validate(valid => {
        if(!valid){
          return
        }
        this.$axios.post('http://timemeetyou.com:8889/api/private/v1/login',this.form)
        .then(res => {
          // console.log(res);
          if(res.data.meta.status == 200){
            console.log('登录成功');
            this.$message({message:"登录成功！", type: 'success'});
            window.sessionStorage.setItem('token', res.data.data.token);
            this.$router.push('home');
          }else if(res.data.meta.status == 400){
            console.log('登录失败');
            this.$message({message:"登录失败。", type:'error'});
          }
        })
        .catch(err => {
          console.error(err); 
        })
      })
    },

    clearAll(){
      this.form.username = '';
      this.form.password = '';
      this.resetSuccess();
    },

    resetSuccess(){
      this.$message('重置成功！');
    },

    reset: function () {
      if(this.form.username == '' && this.form.password ==''){
        return null;
      }
      this.$refs.loginForm.resetFields();
      this.resetSuccess();
    },

  },

  
}
</script>

<style scoped>
#bgc {
  display: flex;
  margin: 0;
  padding: 0;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: #2d4d6d;
}

#loginContainer {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  background-color: #fff;
  width: 450px;
  padding: 15px 0 0 0;
  min-height: 275px;
  height: fit-content;
  border-radius: 10px;
}
#icon {
  position: absolute;
  display: block;
  width: 170px;
  height: 170px;
  padding: 10px;
  box-sizing: border-box;
  border-radius: 50%;
  background-color: #fff;
  top: -85px;
  box-shadow: 0 2px 2px 0px rgba(0, 0, 0, 0.3);
}

#icon img {
  height: 100%;
  width: 100%;
  border-radius: 50%;
  background-color: #dfdfdf;
}

.form {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 90%;
  box-sizing: border-box;
}

.buttons {
  display: flex;
  width: 100%;
  justify-content: flex-end;
}
</style>