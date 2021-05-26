<template>
  <div>
    <div class="status_bar">
      <div style="margin-top:5px; margin-right:5px">
        <button class="publish" @click="publish">发布闲置</button>
        <div class="favorites">
          <el-link :underline="false" @click="favorites">
            <i class="el-icon-star-on"></i>收藏夹
          </el-link>
        </div>
        <el-badge v-show="isMess" is-dot class="message">
          <div @click="message">消息</div>
        </el-badge>
        <el-badge v-show="!isMess" class="message">
          <div @click="message">消息</div>
        </el-badge>
        <el-dropdown
          v-if="!isLogin"
          class="userLogin"
          trigger="click"
          @command="handleLogin"
          placement="bottom"
        >
          <span>
            登录
            <i class="el-icon-arrow-down"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="1">用户登录</el-dropdown-item>
            <el-dropdown-item command="2">管理员登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-dropdown
          v-else
          class="userLogin"
          trigger="click"
          @command="haveLogin"
          placement="bottom"
        >
          <span>欢迎您，{{userName}}!</span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="1">个人中心</el-dropdown-item>
            <el-dropdown-item command="2">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-link :underline="false" @click="index" class="index">去首页</el-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Head",
  data() {
    return {
      isLogin: false,
      userId: this.$getSessionStorage("user").userId,
      isMess: false,
      upRead:"",
    };
  },
  created() {
    this.init();
  },
  updated() {},
  mounted() {
    // this.upRead=setInterval(this.isExistRead, 20000);
    if (
      this.$getSessionStorage("user") == null ||
      this.$getSessionStorage("user") == " "
    )
      this.isLogin = false;
    else {
      this.isLogin = true;
      this.userName = this.$getSessionStorage("user").userName;
    }
  },
  methods: {
    init() {
      if (this.userId == null || this.userId == "null") return;
      else {
        this.isExistRead();
      }
    },
    isExistRead() {
      this.$axios
        .post(
          "/secondhandWeb/message/isExistRead",
          this.$qs.stringify({
            userId: this.userId
          })
        )
        .then(res => {
          if (res.data > 0) {
            this.isMess = true;
          } else {
            this.isMess = false;
          }
        })
        .catch(e => {
          this.$message.error("服务器内部发生异常");
          console.log(e);
        });
    },
    userLogin() {
      this.$router.push({ path: "/userLogin" });
    },
    publish() {
      this.$router.push({ path: "/publish" });
    },
    favorites() {
      this.$router.push({ path: "/favorites" });
    },
    message() {
      this.$router.push({ path: "/message" });
    },
    index() {
      this.$router.push({ path: "/index" });
    },
    handleLogin(command) {
      if (command == "1") {
        this.$router.push({ path: "/userLogin" });
        this.isLogin = false;
      } else this.$router.push({ path: "/managerLogin" });
    },
    haveLogin(command) {
      if (command == "1") this.$router.push({ path: "/perCenter" });
      else {
        this.$router.push({ path: "/index" });
        this.isLogin = false;
        this.$setSessionStorage("user", null);
      }
    }
  }
};
</script>

<style>
.status_bar {
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  background-color: #fff;
  box-shadow: 0 0 15px rgb(216, 216, 216);
  height: 48px;
  width: 100%;
  padding: none;
}
.index {
  margin-top: 7px;
  width: 50px;
  position: relative;
  float: right;
}
.userLogin {
  margin-top: 7px;
  margin-left: 12px;
  /* width: 50px; */
  position: relative;
  float: right;
  cursor: pointer;
}
/* .haveLogin {
  margin-top: 7px;
  margin-left: 12px;
  position: relative;
  float: right;
  cursor: pointer;
} */
.message {
  cursor: pointer;
  margin-top: 5px;
  width: 50px;
  position: relative;
  float: right;
  margin-left: 10px;
  /* line-height: 20px; */
}
.favorites {
  margin-top: 5px;
  width: 70px;
  position: relative;
  float: right;
}
.publish {
  cursor: pointer;
  position: relative;
  float: right;
  width: 85px;
  color: #fff;
  display: block;
  background: rgb(255, 164, 131);
  font-size: 14px;
  line-height: 35px;
  border-radius: 2px;
  margin-left: 10px;
  text-align: center;
  border: none;
}
</style>