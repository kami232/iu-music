<template>
  <div class="login-page">
    <div class="top">
      <div class="goToBack icon-back" @click="handleBack"></div>
      <div class="logo"></div>
    </div>
    <div class="login-bg"
         :style="{backgroundImage: 'url(http://imgsrc.baidu.com/forum/w%3D580/sign=8826a9ea7d8da9774e2f86238053f872/b701828ba61ea8d33fa91edd990a304e271f585f.jpg)'}">
    </div>

    <div :class="['container', {'active': route !== 'index'}]">
      <div class="login-wrapper">
        <div v-show="route !== 'index'">
          <div class="input-box">
            <input class="input"
                   type="text"
                   placeholder="请输入手机号"
                   maxlength="11"
                   v-model="phone">
          </div>
          <div class="input-box">
            <input class="input"
                   type="password"
                   placeholder="请输入密码"
                   maxlength="16"
                   v-model="password">
          </div>
          <div class="input-box" v-show="route === 'register' || route === 'forget'">
            <input class="input"
                   type="text"
                   placeholder="请输入验证码"
                   maxlength="6"
                   v-model="code">
            <p class="btn">获取验证码</p>
          </div>
          <p class="forget" v-show="route === 'login'" @click="changeRouter('forget')">忘记密码？</p>

          <div class="submit-btn" v-show="route === 'login'" @click="checkParams">登录</div>
          <div class="submit-btn" v-show="route === 'register'" @click="checkParams">注册</div>
          <div class="submit-btn" v-show="route === 'forget'" @click="checkParams">确认</div>
        </div>
      </div>

      <div class="btn-container">

        <div class="btn-box">
          <div class="btn-con"
               v-show="route === 'index'"
               @click="changeRouter('login')">
            <i class="icon-circleRight"></i>
            <span class="text">登录</span>
          </div>
        </div>

        <div class="btn-box"
             v-show="route === 'index'"
             @click="changeRouter('register')">
          <div class="btn-con">
            <i class="icon-circleRight"></i>
            <span class="text">注册</span>
          </div>
        </div>

        <div class="btn-box" v-show="route !== 'index'" @click="changeRouter('index')">
          <div class="btn-con">
            <i class="icon-circleLeft"></i>
            <span class="text">返回</span>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
  import {mapMutations} from 'vuex';
  import {SET_USER_TOKEN, SET_USER_INFO} from 'store/mutation-types';

  import {login, forgetPwd, register} from 'api/login';

  const phoneRE = /^(13[0-9]|14[5|7]|15[0|1|2|3|4|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/;
  const pwdRE = /^[a-zA-Z]\w{5,15}$/;
  const codeRE = /^[0-9]*$/;

  export default {
    data() {
      return {
        route: 'index', // index 默认 login登录 register 注册 forget 忘了密码
        phone: null,
        password: null,
        code: null
      }
    },
    methods: {
      /**
       * 返回
       */
      handleBack() {
        this.$router.go(-1);
      },
      // 改变路由
      changeRouter(route) {
        // 重置
        this.phone = this.password = this.code = null;
        this.route = route;
      },
      // 检查参数
      checkParams() {
        if (this.route == 'index') {
          return;
        }

        if (!this.phone || this.phone.trim() == '') {
          this.$toast('手机号不许为空');
          return;
        }

        if (!phoneRE.test(this.phone)) {
          this.$toast('请输入正确的手机号');
          return;
        }

        if (!this.password || this.password.trim() == '') {
          this.$toast('密码不许为空');
          return;
        }

        if (!pwdRE.test(this.password)) {
          this.$toast('密码必须以字母开头，长度在6~16之间，只能包含字母、数字和下划线');
          return;
        }

        if (this.route == 'login') {
          this.handleLogin();
        } else {
          if (!this.code || this.code.trim() == '') {
            this.$toast('验证码不许为空');
            return;
          }

          if (!codeRE.test(this.code)) {
            this.$toast('请输入正确的验证码');
            return;
          }

          if (this.route == 'forget') {
            this.handleForget();
          } else {
            this.handleRegister();
          }
        }
      },
      // 登录
      handleLogin() {
        let pwd = this.password
        pwd = this.$rsa.encrypt(pwd);
        const data = {
          type: 100,
          phone: this.phone,
          password: pwd
        }

        login(data).then(res => {
          if (res.code == 200) {
            // 保存到本地
            localStorage.setItem('token', res.data.token);
            // 设置state
            this.setUserToken(res.data.token);
            this.setUserInfo(res.data.info);
            this.$router.push({
              path: `/user`
            });
          }
        });
      },
      handleRegister() {
        let pwd = this.password
        pwd = this.$rsa.encrypt(pwd);
        const data = {
          phone: this.phone,
          password: pwd,
          code: this.code
        }

        register(data).then(res => {
          if (res.code == 200) {
            this.phone = this.password = this.code = null;
            this.$toast(res.message);
          }
        });
      },
      // 忘记密码
      handleForget() {
        let pwd = this.password
        pwd = this.$rsa.encrypt(pwd);
        const data = {
          phone: this.phone,
          password: pwd,
          code: this.code
        }

        forgetPwd(data).then(res => {
          if (res.code == 200) {
            this.phone = this.password = this.code = null;
            this.$toast(res.message);
          }
        });
      },
      ...mapMutations({
        setUserToken: SET_USER_TOKEN,
        setUserInfo: SET_USER_INFO,
      })
    }
  }
</script>

<style scoped lang="scss" rel="stylesheet">
  @import "static/scss/variable.scss";
  @import "static/scss/mixin.scss";

  .login-page {
    position: fixed;
    z-index: 50;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    width: 100%;
    background-color: $color-background;
  }

  .top {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: .8rem;
    z-index: 999;

    .goToBack {
      display: block;
      width: .8rem;
      height: .8rem;
      font-size: $font-size-medium;
      font-family: iconfont;
      text-align: center;
      line-height: .8rem;
      color: $color-icon-default;
    }

    .logo {
      position: absolute;
      right: .3rem;
      top: .3rem;
      width: 1rem;
      height: 1rem;
      @include bg-cover('../../static/images/logo.png');
    }
  }

  .login-bg {
    position: relative;
    height: 100%;
    @include bg-coverAndCenter();
    /*filter: blur(2px) opacity(90%);*/
  }

  .container {
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    position: absolute;
    display: flex;
    flex-flow: column;
    justify-content: center;

    &.active {
      background-color: rgba(0, 0, 0, .35);
    }

    .login-wrapper {
      flex-grow: 1;
      display: flex;
      flex-flow: column;
      justify-content: center;
      align-items: center;
      width: 100%;

      .input-box {
        display: flex;
        align-items: center;
        width: 6rem;
        overflow: hidden;
        border-bottom: 1px solid $color-background;

        + .input-box {
          margin-top: .6rem;
        }

        .input {
          flex-grow: 1;
          width: 100%;
          padding: .3rem;
          font-size: $font-size-medium-x;
          background: none;
          border: none;
          outline: none;
          color: $color-text-white;
        }

        .btn {
          flex-shrink: 0;
          line-height: .6rem;
          font-size: $font-size-medium-x;
          color: $color-text-white;
        }
      }

      .submit-btn {
        margin-top: 1rem;
        width: 100%;
        height: 1rem;
        line-height: 1rem;
        border-radius: .1rem;
        text-align: center;
        font-size: $font-size-medium;
        color: $color-text-white;
        background-color: $color-text-theme;
      }

      .forget {
        font-size: $font-size-small;
        color: $color-text-white;
      }
    }


    .btn-container {
      flex-grow: 0;
      flex-shrink: 0;
      width: 100%;
      opacity: .8;
      padding-bottom: 1rem;

      .btn-box {
        display: flex;
        justify-content: flex-end;
        width: 100%;

        + .btn-box {
          margin-top: .3rem;
        }

        .btn-con {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 2rem;
          height: .8rem;
          border-top-left-radius: .8rem;
          border-bottom-left-radius: .8rem;
          font-size: $font-size-medium-x;
          color: $color-text-white;
          background-color: $color-text-theme;

          .icon-circleLeft, .icon-circleRight {
            font-size: .6rem;
            font-family: iconfont;
          }

          .text {
            margin-left: .3rem;
          }
        }
      }
    }

    input::-webkit-input-placeholder {
      color: $color-text-grey;
    }
  }
</style>