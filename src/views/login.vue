<template>
<div class="wrap">
  <div class="login">
    <div class="welcome">准备考试</div>
    <div class="login-form">
      <div class="login-inp">
        <label for="user">用户</label>
        <input v-model="loginForm.loginId">
      </div>
            <div class="login-inp">
        <label for="user">密码</label>
        <input type="password" v-model="loginForm.password">
      </div>
      <div class="login-inp btn" @click="loginFn"><a>立即登录</a></div>
    </div>
  </div>
  </div>
</template>

<script>

// @ is an alias to /src
import { login} from "../api/api.js";

export default {
  name: 'login',
  data(){
    return {
      loginForm:{}
    }
  },
  components: {},
  mounted(){
    localStorage.clear()
  },
  methods:{
    async loginFn(){
      try{
        let data = await this.$axios.post(
          login,
          this._qs.stringify(this.loginForm)
        );
        if( data.msg=='01' ){
          
          this.$router.push({name:'chooseTest',params: {data:data.data}}) 

        }else{
          this.$toast.center('您不是答题者！');
        }
      }catch (err){
         this.$toast.center('网络异常，请稍后再试！');
      }
    }
  }
}
</script>
<style scoped>
.wrap{ padding:0 10%; height: 100%; background-image: linear-gradient(to bottom right,#68cab6, #3576ce);position: relative;}
.welcome{text-align: center;color: #fff;font-size: 24px;margin:20px 0;}
.login{width: 80%;background: rgba(255,255,255,0.2);padding: 15px 30px;border-radius: 15px;position: absolute;top: 50%;left: 50%;transform: translate(-50%,-50%);}
.login-inp{border:1px solid #fff;border-radius:10px; display: flex;margin-bottom: 12px; padding:10px 0;}
.login-inp a{display:block;width:100%;text-align:center;line-height:20px;color:#fff;font-size:16px;letter-spacing:5px;}
.login-inp label{font-size: 16px;color: #fff;width: 50px;flex:0 0 60px;line-height: 20px;text-align: center;}
.login-inp input{width: 100%;background: transparent;outline: none;color: #fff;line-height:20px;border:none; padding: 0 15px 0 0;font-size: 16px;}
.btn{margin-top: 20px;}
</style>
