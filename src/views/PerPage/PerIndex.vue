<template>
  <div class="perIndex">
    <!-- 用户信息 -->
    <div class="userInfor">
      <el-image :src="userImage" class="userImage"></el-image>
      <div class="userName">
        <span>{{userName}}</span>
      </div>
      <div class="userSchool">
        <span>所在院校：{{userSchool}}</span>
      </div>
      <div class="publishCount">
        <span @click="toMyGoods" style="cursor: pointer;">发布商品：{{publishCount}}</span>
      </div>
      <div class="attentCount">
        <span @click="toMyAttents" style="cursor: pointer;">关注：{{attentCount}}</span>
      </div>
      <div class="fansCount">
        <span @click="toMyFans" style="cursor: pointer;">粉丝：{{fansCount}}</span>
      </div>
    </div>

    <div class="wuliuInfor">
      <div class="myWuTitle">
        <i class="el-icon-truck"></i>
        <span>我的物流</span>
      </div>
    </div>
  </div>
</template>

<script>
import Head from "@/components/Head.vue";
export default {
  name: "PerIndex",
  data() {
    return {
      userData:[],
      userImage:
        "https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png",
      userName: "",
      userSchool: "",
      attentCount: "",
      fansCount: "",
      userId: "",
      publishCount: ""
    };
  },
  created() {
    this.init();
  },
  updated() {},
  mounted() {},
  methods: {
    init() {
      this.userId = this.$getSessionStorage("user").userId;
      /*this.$axios
        .post(
          "/secondhandWeb/user/updateUser",
          this.$qs.stringify({
            userId: this.userId
          })
        )
        .then(res => {
          this.$setSessionStorage("user", res.data);
          if (this.$getSessionStorage("user").userImage == null)
            this.userImage ="https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png";
          else this.userImage = this.$getSessionStorage("user").userImage;
          this.userName = this.$getSessionStorage("user").userName;
          this.userSchool = this.$getSessionStorage("user").userSchool;
          this.attentCount = this.$getSessionStorage("user").attentCount;
          this.fansCount = this.$getSessionStorage("user").fansCount;
          this.publishCount = this.$getSessionStorage("user").publishCount;
        })
        .catch(e => {
          console.log(e);
        });*/
      this.$axios
        .post(
          "/secondhandWeb/user/getUserInfo/"+this.userId,
          this.$qs.stringify({
            userId: this.userId
          })
        )
        .then(res => {
          this.$setSessionStorage("userData",res.data);
          if (this.$getSessionStorage("userData").userImage == null)
            this.userImage ="https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png";
          else this.userImage = this.$getSessionStorage("userData").userImage;
          this.userName=this.$getSessionStorage("userData").userName;
          this.userSchool = this.$getSessionStorage("userData").userSchool;
          this.attentCount = this.$getSessionStorage("userData").attentCount;
          this.fansCount = this.$getSessionStorage("userData").fansCount;
          this.publishCount = this.$getSessionStorage("userData").publishCount;
        })
        .catch(e => {
          console.log(e);
        });
    },
    toMyAttents() {
      this.$router.push("myAttents");
    },
    toMyFans() {
      this.$router.push("myFans");
    },
    toMyGoods() {
      this.$router.push("myGoods");
    }
  },
  components: {}
};
</script>

<style scoped>
.perIndex {
  position: absolute;
  width: 65%;
  margin-left: 200px;
}
.userInfor {
  position: absolute;
  width: 100%;
  height: 90px;
  background-color: rgba(236, 245, 255, 0.733);
  /* border: 1px rgb(221, 221, 221) solid; */
}
.userImage {
  float: left;
  margin-left: 50px;
  margin-top: 10px;
  height: 70px;
  width: 70px;
  border-radius: 50px;
  border: 1px rgb(221, 221, 221) solid;
  /* background-color: rgb(0, 89, 255); */
}
.userName {
  position: absolute;
  float: left;
  font-size: 35px;
  margin-left: 150px;
  margin-top: 5px;
}
.userSchool {
  position: absolute;
  float: left;
  margin-left: 150px;
  margin-top: 55px;
}
.publishCount {
  position: absolute;
  float: left;
  margin-left: 450px;
  margin-top: 55px;
}
.attentCount {
  position: absolute;
  float: left;
  margin-left: 650px;
  margin-top: 55px;
}
.fansCount {
  position: absolute;
  float: left;
  margin-left: 850px;
  margin-top: 55px;
}
.wuliuInfor {
  height: 50px;
  width: 100%;
  margin-top: 120px;
  border-top: 1px rgb(221, 221, 221) solid;
}
.myWuTitle {
  height: 50px;
  background-color: rgba(236, 245, 255, 0.733);
}
.myWuTitle i {
  float: left;
  margin-left: 30px;
  line-height: 50px;
  font-size: 25px;
  color: rgb(155, 155, 155);
}
.myWuTitle span {
  float: left;
  margin-left: 10px;
  line-height: 50px;
  font-size: 20px;
  color: rgb(155, 155, 155);
}
</style>