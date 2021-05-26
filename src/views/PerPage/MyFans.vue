<template>
  <div class="myFans">
    <div class="title">
      <span>我的粉丝</span>
    </div>
    
    <div v-show="!isZero" class="attentBody">
      <el-row class="attentItem" :span="6" v-for="(item, index) in fansData" :key="index">
        <el-image @click="toUserDetail(item.userId)" :src="item.userImage" class="userImage"></el-image>
        <div @click="toUserDetail(item.userId)" class="userName">
          <span>{{item.userName}}</span>
        </div>
        <div class="userSchool">
          <span>所在院校：{{item.userSchool}}</span>
        </div>
        <div class="publishCount">
          <span>发布商品：{{item.publishCount}}</span>
        </div>
        <div class="attentCount">
          <span>关注：{{item.attentCount}}</span>
        </div>
        <div class="fansCount">
          <span>粉丝：{{item.fansCount}}</span>
        </div>
      </el-row>
    </div>
    <div v-show="isZero" class="zero">
      <span>目前没有人关注您哦~ 多发布一些商品吧！</span>
    </div>
  </div>
</template>

<script>
import Head from "@/components/Head.vue";
export default {
  name: "MyFans",
  data() {
    return {
      fansData: [],
      userId: "",
      isZero: false
    };
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      this.userId = this.$getSessionStorage("user").userId;
      this.$axios
        .post(
          "/secondhandWeb/attention/getFansList",
          this.$qs.stringify({
            userId: this.userId
          })
        )
        .then(res => {
          if (res.data == undefined || res.data.length <= 0) this.isZero = true;
          else{
            this.isZero=false;
            this.fansData = res.data;
          }
        })
        .catch(e => {
          console.log(e);
        });
    },
    toUserDetail(userId) {
      this.$setSessionStorage("anUserId", userId);
      this.$router.push("userDetail");
    }
  },
  components: {}
};
</script>

<style scoped>
.myFans {
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
.attentBody {
  height: 100px;
  margin-top: 30px;
  border-top: 1px rgb(221, 221, 221) solid;
}
.zero {
  height: 100px;
  margin-top: 150px;
  font-size: 18px;
}
.attentItem {
  margin-bottom: 5px;
  margin-top: 5px;
  border-bottom: 1px rgb(221, 221, 221) solid;
}
.userImage {
  cursor: pointer;
  float: left;
  margin-left: 50px;
  margin-top: 10px;
  height: 70px;
  width: 70px;
  border-radius: 50px;
  border: 1px rgb(221, 221, 221) solid;
  margin-bottom: 15px;
  margin-top: 15px;
  /* background-color: rgb(0, 89, 255); */
}
.userName {
  cursor: pointer;
  position: absolute;
  float: left;
  font-size: 30px;
  margin-left: 150px;
  margin-top: 15px;
}
.userSchool {
  position: absolute;
  float: left;
  margin-left: 150px;
  margin-top: 60px;
}
.publishCount {
  position: absolute;
  float: left;
  margin-left: 450px;
  margin-top: 60px;
}
.attentCount {
  position: absolute;
  float: left;
  margin-left: 650px;
  margin-top: 60px;
}
.fansCount {
  position: absolute;
  float: left;
  margin-left: 850px;
  margin-top: 60px;
}
</style>