<template>
  <div>
    <!-- 头部 -->
    <Head></Head>
    <!-- <div class="top_bar"></div> -->
    <div class="kuang">
      <h2>创建一个新账户</h2>
      <div class="xkuang">
        <el-form :model="registerForm" :rules="registerRul" label-width="100px">
          <el-form-item lable-width="100px" label="用户名" prop="userName">
            <el-input @blur="checkUserName" v-model="registerForm.userName" placeholder="请输入一个用户名"></el-input>
          </el-form-item>
          <el-form-item lable-width="100px" label="手机号" prop="userPhone">
            <el-input
              @blur="checkUserPhone"
              v-model="registerForm.userPhone"
              placeholder="请输入你的手机号"
            ></el-input>
          </el-form-item>
          <el-form-item lable-width="100px" label="邮箱" prop="userEmail">
            <el-input v-model="registerForm.userEmail" placeholder="请输入你的邮箱"></el-input>
          </el-form-item>
          <el-form-item lable-width="100px" label="所在院校" prop="userSchool">
            <el-input v-model="registerForm.userSchool" placeholder="请输入你的所在院校"></el-input>
          </el-form-item>
          <el-form-item label-width="100px" label="性别" prop="userSex">
            <el-radio v-model="registerForm.userSex" label="0">男</el-radio>
            <el-radio v-model="registerForm.userSex" label="1">女</el-radio>
          </el-form-item>
          <el-form-item lable-width="100px" label="密码" prop="userPassword">
            <el-input
              type="password"
              v-model="registerForm.userPassword"
              placeholder="请输入一个6-16位的密码"
            ></el-input>
          </el-form-item>
          <el-form-item lable-width="100px" label="确认密码" prop="confirmPassword">
            <el-input type="password" v-model="registerForm.confirmPassword" placeholder="请再次输入密码"></el-input>
          </el-form-item>
          <el-form-item class="userRegister">
            <el-button type="primary" @click="submitForm('registerForm')">注册</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import Head from "@/components/Head.vue";
export default {
  name: "UserRegister",
  data() {
    return {
      registerForm: {
        userName: "",
        userPhone: "",
        userEmail: "",
        userSex: "",
        userPassword: "",
        userSchool: ""
      },
      registerRul: {
        userName: [
          { required: true, message: "请输入用户名", trigger: "blur" }
        ],
        userPhone: [
          { required: true, message: "请输入手机号", trigger: "blur" }
        ],
        userSchool: [
          { required: true, message: "请输入所在院校", trigger: "blur" }
        ],
        userPassword: [
          { required: true, message: "请输入密码", trigger: "blur" }
        ],
        confirmPassword: [
          { required: true, message: "请确认密码", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    userLogin() {
      this.$router.push({ path: "/userLogin" });
    },
    checkUserName() {
      // 判断是否存在相同的用户名
      this.$axios
        .post(
          "/secondhandWeb/user/isExistUserName",
          this.$qs.stringify({ userName: this.registerForm.userName })
        )
        .then(res => {
          if (res.data == 1) {
            this.$message.error("用户名已存在");
          }
        })
        .catch(e => {
          this.$message.error("服务器内部发生异常");
          console.log(e);
        });
    },
    checkUserPhone() {
      // 判断是否存在相同的手机号
      this.$axios
        .post(
          "/secondhandWeb/user/isExistUserPhone",
          this.$qs.stringify({ userPhone: this.registerForm.userPhone })
        )
        .then(res => {
          if (res.data == 1) {
            this.$message.error("该手机号已被注册");
          }
        })
        .catch(e => {
          this.$message.error("服务器内部发生异常");
          console.log(e);
        });
    },
    submitForm(formName) {
      if (this.registerForm.userName == "") {
        this.$message.error("用户名不能为空");
        return;
      }
      if (this.registerForm.userPhone == "") {
        this.$message.error("手机号不能为空");
        return;
      }
      //   else if(this.registerForm.userPhone!=/^[1][3,4,5,7,8][0-9]{9}$/){
      //       this.$message.error("请输入正确的手机号");
      //       return;
      //   }
      // else if (!/^1[345789]\d{9}$/.test(this.registerForm.userPhone)) {
      //     return callback(new Error('请输入正确的手机号'));
      //     // return callback(new Error('账号不能超过11位'))
      //     // return;
      //   }
      if (this.registerForm.userSchool == "") {
        this.$message.error("所在院校不能为空");
        return;
      }
      if (this.registerForm.userPassword == "") {
        this.$message.error("密码不能为空");
        return;
      } else if (this.registerForm.userPassword.length < 6) {
        this.$message.error("密码不能小于6位");
        return;
      } else if (this.registerForm.userPassword.length > 16) {
        this.$message.error("密码不能大于16位");
        return;
      }
      if (this.registerForm.confirmPassword == "") {
        this.$message.error("请确认密码");
        return;
      }
      if (
        this.registerForm.userPassword != "" &&
        this.registerForm.confirmPassword != this.registerForm.userPassword
      ) {
        this.$message.error("两次输入密码不一致");
        return;
      }

      //用户注册
      this.$axios
        .post(
          "/secondhandWeb/user/userRegister",
          this.$qs.stringify(this.registerForm)
        )
        .then(res => {
          if (res.data > 0) {
            this.$message.success("注册成功");
            this.$router.push({ path: "/userLogin" });
          } else {
            this.$message.error("注册失败");
          }
        })
        .catch(e => {
          this.$message.error("服务器内部发生异常");
          console.log(e);
        });
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
  margin-top: 150px;
  /* bottom: 20px; */
  height: 560px;
  width: 400px;
  border: 2px solid #dcdfe6;
  border-radius: 4px;
  position: absolute;
  left: 50%;
  transform: translate(-50%, 0%);
}
.xkuang {
  width: 340px;
}
.h2 {
  margin-bottom: 30px;
}
.userRegister {
  width: 50%;
  margin-left: 70px;
}
</style>