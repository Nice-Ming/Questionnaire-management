<template>
  <div class="container">
    <div class="register">
      <div class="register-header">
        <h1>注册</h1>
      </div>
      <div class="register-result" :class="resultClassName" v-show="isShowResult">
        <p>
          <span>{{ resultText }}</span>
          <a href="javascript:;" @click="isShowResult = false">&times;</a>
        </p>
      </div>
      <div class="register-body">
        <form>
          <div class="form-group">
            <label>用户名</label>
            <input type="text" v-model="username">
          </div>
          <div class="form-group">
            <label>邮箱</label>
            <input type="text" autocomplete="email" v-model="email">
          </div>
          <div class="form-group">
            <label>密码</label>
            <input type="password" autocomplete v-model="password">
          </div>
          <div class="form-group">
            <label>确认密码</label>
            <input type="password" autocomplete v-model="password2">
          </div>
          <div class="form-group">
            <input type="button" :value="submitText || '注册'" @click="submit()">
          </div>
        </form>
      </div>
      <p class="create-account">
        <span>已有账号？</span>
        <a href="javascript:;" @click="switchToLogin()">点击登录</a>
      </p>
    </div>
  </div>
</template>

<script>
  import { register } from '../api'
  import { accountMixin } from '../public/js/mixin'

  export default {
    name: 'Register',

    mixins: [accountMixin],

    data() {
      return {
        username: '',
        email: '',
        password: '',
        password2: '',
        submitText: ''
      }
    },

    methods: {
      submit() {
        this.isShowResult = false
        if (this.submitText) {
          return
        }
        let isValidated = this.validateInfo()
        if (isValidated) {
          let data = {
            email: this.email,
            username: this.username,
            password: this.password
          }
          this.submitText = '注册中...'
          register(data).then(res => {
            if (res.code === 0) {
              if (res.data === 0 || res.data === 2) {
                this.registerSuccess()
              } else {
                this.showResult('error', '注册失败，该邮箱已注册')
              }
            } else {
              this.showResult('error', res.msg)
            }
            this.submitText = ''
          })
        }
      },

      registerSuccess() {
        this.showResult('success', '注册成功，查看邮件并激活账号')
        this.username = ''
        this.email = ''
        this.password = ''
        this.password2 = ''

        setTimeout(() => {
          this.switchToLogin()
        }, 5000);
      },

      validateInfo() {
        let username = this.username.trim()
        if (username.length < 3 || username.length > 10) {
          this.showResult('error', '用户名3~10个字符')
          return false
        }

        let emailReg = /\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/
        if (!emailReg.test(this.email)) {
          this.showResult('error', '邮箱格式不正确')
          return false
        }

        if (!this.password) {
          this.showResult('error', '请输入密码')
          return false
        }
        if (this.password !== this.password2) {
          this.showResult('error', '两次密码输入不一致')
          return false
        }

        return true
      },

      switchToLogin() {
        this.$router.push('login')
      }
    }
  }
</script>

<style lang="scss" scoped>
$name: 'register';
@import '../style/public.scss';
@import '../style/account.scss';
</style>

