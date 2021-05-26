<template>
  <div class="mySet">
    <div class="title">
      <span>账号管理</span>
    </div>
    <el-form
      :model="infoForm"
      :rules="infoRules"
      ref="infoForm"
      label-width="100px"
      style="width:60%"
    >
      <div class="mySetBox">
        <el-form-item class="userImage" label="当前头像：" prop="userImage">
          <img v-if="!isManage" :src="user.userImage" class="image" />
          <el-upload
            v-else
            class="avatar-uploader"
            :show-file-list="false"
            :before-upload="beforeAvatarUpload"
            :on-change="toBase64"
          >
            <img v-if="imageUrl" :src="imageUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="用户名：" prop="userName">
          <span v-if="!isManage">{{user.userName}}</span>
          <el-input v-model="infoForm.userName" v-else></el-input>
        </el-form-item>
        <el-form-item label="手机号：" prop="userPhone">
          <span v-if="!isManage">{{user.userPhone}}</span>
          <el-input v-model="infoForm.userPhone" v-else></el-input>
        </el-form-item>
        <el-form-item label="邮箱：" prop="userEmail">
          <span v-if="!isManage">{{user.userEmail}}</span>
          <el-input v-model="infoForm.userEmail" v-else></el-input>
        </el-form-item>
        <el-form-item label="所在院校：" prop="userSchool">
          <span v-if="!isManage">{{user.userSchool}}</span>
          <el-input v-model="infoForm.userSchool" v-else></el-input>
        </el-form-item>
      </div>
    </el-form>
    <el-button class="suButton" type="primary" size="small" @click="editItem" v-if="!isManage">修改</el-button>
    <div v-else>
      <el-button class="suButton" type="success" size="small" @click="checkUserName">完成</el-button>
      <el-button class="suButton" type="info" size="small" @click="editCancel">取消</el-button>
    </div>
  </div>
</template>

<script>
import { resetObject } from "@/common.js";
import Head from "@/components/Head.vue";
export default {
  name: "MySet",
  data() {
    return {
      isManage: false,
      existName: false,
      user: {},
      userId: this.$getSessionStorage("user").userId,
      infoForm: {
        userImage:
          "https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png",
        userName: "",
        userSchool: "",
        userPhone: "",
        userEmail: ""
      },
      infoRules: {
        userName: [{ required: true, message: " ", trigger: "blur" }],
        userSchool: [{ required: true, message: " ", trigger: "blur" }],
        userPhone: [{ required: true, message: " ", trigger: "blur" }]
      },
      imageUrl: ""
    };
  },
  mounted() {
    this.infoForm = this.$getSessionStorage("user");
  },
  created() {
    this.init();
  },
  updated() {
    // this,init();
  },
  methods: {
    init() {
      this.$axios
        .post(
          "/secondhandWeb/user/getUserInfo",
          this.$qs.stringify({
            userId: this.userId
          })
        )
        .then(res => {
          this.user = res.data;
        })
        .catch(e => {
          console.log(e);
        });
    },
    checkUserName() {
      // 判断是否存在相同的用户名
      this.$axios
        .post(
          "/secondhandWeb/user/checkUserName",
          this.$qs.stringify({
            userId: this.userId,
            userName: this.infoForm.userName
          })
        )
        .then(res => {
          console.log(res.data);
          if (res.data > 0) {
            this.$message.error("用户名已存在");
          } else {
            this.checkUserPhone();
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
          "/secondhandWeb/user/checkUserPhone",
          this.$qs.stringify({
            userId: this.userId,
            userPhone: this.infoForm.userPhone
          })
        )
        .then(res => {
          if (res.data == 1) {
            this.$message.error("该手机号已被注册");
          }else{
            this.submitItem();
          }
        })
        .catch(e => {
          this.$message.error("服务器内部发生异常");
          console.log(e);
        });
    },
    editItem() {
      this.isManage = true;
      this.infoForm.userImage = this.user.userImage;
      this.infoForm.userName = this.user.userName;
      this.infoForm.userPhone = this.user.userPhone;
      this.infoForm.userEmail = this.user.userEmail;
      this.infoForm.userSchool = this.user.userSchool;
    },
    submitItem() {
      if (this.infoForm.userName == "") {
        this.$message.error("用户名不能为空");
        return;
      }
      if (this.infoForm.userPhone == "") {
        this.$message.error("手机号不能为空");
        return;
      }
      if (this.infoForm.userSchool == "") {
        this.$message.error("所在院校不能为空");
        return;
      }

      this.$refs.infoForm.validate(valid => {
        if (valid) {
          this.$axios
            .post(
              "/secondhandWeb/user/editUser",
              this.$qs.stringify(this.infoForm)
            )
            .then(res => {
              if (res.data > 0) {
                this.$message.success("操作成功");
                this.init();
              } else {
                this.$message.error("操作失败");
              }
            })
            .catch(() => {});
        } else {
          this.$message.warning("请按照提示正确填写内容！");
          return false;
        }
      });
      this.isManage = false;
    },
    editCancel() {
      this.isManage = false;
      this.infoForm = this.$getSessionStorage("user");
    },
    toBase64(file) {
      var This = this;
      var reader = new FileReader();
      reader.readAsDataURL(file.raw);
      reader.onload = function() {
        this.result; //base64编码
        This.infoForm.userImage = this.result;
        This.imageUrl = this.result;
      };
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    }
  },
  components: {}
};
</script>

<style scoped>
.mySet {
  position: absolute;
  width: 65%;
  margin-left: 200px;
}
.title {
  background-color: rgba(236, 245, 255, 0.733);
  width: 100%;
  height: 50px;
}
.title span {
  float: left;
  font-size: 20px;
  margin-left: 30px;
  color: rgb(112, 112, 112);
  line-height: 50px;
}
.mySetBox {
  position: absolute;
  margin-left: 28%;
  width: 400px;
}
.userImage {
  margin-top: 50px;
}
.userImage .image {
  float: left;
  margin-left: 70px;
  height: 90px;
  width: 90px;
  border: 1px rgb(221, 221, 221) solid;
}
.el-form-item span {
  float: left;
  margin-left: 70px;
  text-align: left;
}
.el-form-item .el-input {
  margin-left: 55px;
  width: 300px;
}
.suButton {
  position: relative;
  float: right;
  margin-right: 20px;
  margin-top: 20px;
}
.avatar-uploader {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  height: 90px;
  width: 90px;
  float: left;
  margin-left: 70px;
}
.avatar-uploader :hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 90px;
  height: 90px;
  line-height: 90px;
  text-align: center;
}
.avatar {
  width: 90px;
  height: 90px;
  display: block;
}
</style>