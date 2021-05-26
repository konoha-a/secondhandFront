<template>
  <div>
    <!-- 头部 -->
    <Head></Head>
    <!-- <div class="top_bar"></div> -->
    <div class="kuang">
      <h2>请登录您的账户</h2>
      <div class="xkuang">
        <el-form
         :model="loginForm" 
         :rules="loginRul" 
         ref="loginForm" 
         label-width="100px">
          <!-- prop和校验规则中的名字对应 -->
          <el-form-item lable-width="100px" label="用户名" prop="userName">
            <el-input v-model="loginForm.userName" placeholder="请输入用户名"></el-input>
          </el-form-item>
          <el-form-item lable-width="100px" label="密码" prop="userPassword">
            <el-input show-password v-model="loginForm.userPassword" placeholder="请输入密码"></el-input>
          </el-form-item>
          <el-form-item class="userLogin">
            <el-button type="primary" @click="submitForm('loginForm')">登录</el-button>
          </el-form-item>
          <el-button type="text" @click="userRegister" class="userRegister">没有账户？立即注册</el-button>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import Head from "@/components/Head.vue";
export default {
  name: "UserLogin",
  data() {
    return {
      loginForm: {
        userName: "",
        userPassword: ""
      },
      loginRul: {
        //校验规则
        userName: [
          { required: true, message: "请输入用户名", trigger: "blur" }
        ],
        userPassword: [
          { required: true, message: "请输入密码", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    submitForm(fromName) {
      if (this.loginForm.userName == "") {
        this.$message.error("用户名不能为空");
        return;
      }else if (this.loginForm.userPassword == "") {
        this.$message.error("密码不能为空");
        return;
      }
      //登录请求
      this.$axios
        .post("/secondhandWeb/user/userLogin", this.$qs.stringify(this.loginForm))       
        .then(res => {
          let user = res.data;
          if (user == null || user == "") {
            this.$message.error("用户名或密码不正确");
            return false;
          } else {
            this.$setSessionStorage("user", user);
            this.$router.push({ path: "/index" });
            this.$message.success("登录成功！");
            // console.log(this.$getSessionStorage("user").userId);

          }
        })
        //异常
        .catch(error => {
          console.log(error);
        });
    },
    userRegister() {
      this.$router.push({ path: "/userRegister" });
    }
  },
  components: {
    Head
  }
};
</script>

<style scoped>
.top_bar {
  position: absolute;
  top: 48px;
  left: 0;
  right: 0;
  height: 70px;
  width: 100%;
  background-color: #ffac7a;
}
.kuang {
  margin-top: 170px;
  height: 300px;
  width: 400px;
  border: 2px solid #dcdfe6;
  border-radius: 4px;
  position: absolute;
  left: 50%;
  transform: translate(-50%, 0%);
  /* margin: 50px 0 0 0; */
  /* text-align: center; */
  /* line-height: center; */
  /* align-content: center; */
}
.xkuang {
  width: 340px;
}
.h2 {
  margin-bottom: 30px;
}
.userLogin {
  width: 50%;
  margin-right: 100px;
}
.userRegister {
  float: right;
}
</style>