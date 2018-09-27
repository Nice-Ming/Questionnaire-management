<template>
  <div class="container">
    <div class="login">
      <div class="login-header">
        <h1>登录</h1>
      </div>
      <div class="login-result" :class="resultClassName" v-show="isShowResult">
        <p>
          <span>{{ resultText }}</span>
          <a href="javascript:;" @click="isShowResult = false">&times;</a>
        </p>
      </div>
      <div class="login-body">
        <form>
          <div class="form-group">
            <label>邮箱</label>
            <input type="text" autocomplete="email" v-model="email">
          </div>
          <div class="form-group">
            <label>密码</label>
            <input id="password" type="password" autocomplete v-model="password"  @keyup.enter="submit()">
          </div>
          <div class="form-group">
            <input type="button" :value="submitText || '登录'" @click="submit()">
          </div>
        </form>
      </div>
        <p class="create-account">
          <span>没有账号？</span>
          <a href="javascript:;" @click="switchToRegister()">注册一个</a>
        </p>
    </div>
  </div>
</template>

<script>
  import { login } from '../api'
  import { accountMixin } from '../public/js/mixin'
  import storage, { TOKEN_KEY, EMAIL_KEY, USERNAME_KEY } from '../public/js/storage'

  export default {
    name: 'Login',

    mixins: [accountMixin],

    data() {
      return {
        email: '',
        password: '',
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
            password: this.password
          }
          this.submitText = '登录中...'
          login(data).then(res => {
            if (res.code === 0) {
              if (res.data.result === 0) {
                this.loginSuccess(res.data)
              } else {
                this.showResult('error', '邮箱或密码错误')
                this.submitText = ''
              }
            }
          })
        }
      },

      loginSuccess(data) {
        let {token, email, username} = data
        storage.set(TOKEN_KEY, token)
        storage.set(EMAIL_KEY, email)
        storage.set(USERNAME_KEY, username)
        this.$router.push('/')
      },

      validateInfo() {
        let emailReg = /\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/
        if (!emailReg.test(this.email)) {
          this.showResult('error', '邮箱格式不正确')
          return false
        }

        if (!this.password) {
          this.showResult('error', '请输入密码')
          return false
        }

        return true
      },

      switchToRegister() {
        this.$router.push('register')
      }
    }
  }
</script>

<style lang="scss" scoped>
$name: 'login';
@import '../style/public.scss';
@import '../style/account.scss';
</style>
