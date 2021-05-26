<template>
  <div class="myAttents">
    <div class="title">
      <span>我的关注</span>
    </div>
    <div v-show="!isZero" class="attentBody">
      <el-row class="attentItem" :span="6" v-for="(item, index) in attentData" :key="index">
        <el-image @click="toUserDetail(item.beAttentId)" :src="item.userImage" class="userImage"></el-image>
        <div @click="toUserDetail(item.beAttentId)" class="userName">
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

      <!-- 分页 -->
      <el-pagination
        @current-change="changePage"
        :page-size="pageSize"
        layout="prev, pager, next, jumper"
        :total="total"
        style="margin-top:20px;padding-bottom: 50px;left:37%"
      ></el-pagination>
    </div>
    <div v-show="isZero" class="zero">
      <span>您还没有关注任何人哦~ 多浏览一些商品吧！</span>
    </div>
  </div>
</template>

<script>
import Head from "@/components/Head.vue";
export default {
  name: "MyAttents",
  data() {
    return {
      attentData: [],
      user:{},
      userId: this.$getSessionStorage("user").userId,
      beAttentId: "",
      isZero: false,
      pageNo: 1,
      pageSize: 8,
      total: 0
    };
  },
  created() {
    console.log(this.userId)
    this.updateUser();
    this.init();
  },
  methods: {
    updateUser(){
      this.$axios
        .post(
          "secondhandWeb/user/getUserInfo",
          this.$qs.stringify({ userId: this.userId })
        )
        .then(res => {
          this.user=res.data;
          this.total=this.user.attentCount;
        })
        .catch(e => {
          this.$message.error("服务器内部发生异常");
          console.log(e);
        });
    },
    init() {
      this.$axios
        .post(
          "/secondhandWeb/attention/getBeAttentList",
          this.$qs.stringify({
            userId: this.userId,
            pageNo:this.pageNo,
            pageSize:this.pageSize
          })
        )
        .then(res => {
          if (res.data == null || res.data.length <= 0) this.isZero = true;
          else {
            this.isZero = false;
            this.attentData = res.data;
          }
        })
        .catch(e => {
          console.log(e);
        });
    },
    changePage(val) {
      this.pageNo = val; //改变当前页码
      this.init(); //根据新的页码选取分页数据
    },
    toUserDetail(beAttentId) {
      this.$setSessionStorage("anUserId", beAttentId);
      this.$router.push("userDetail");
    }
  },
  components: {}
};
</script>

<style scoped>
.myAttents {
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
  /* background-color: rgba(177, 201, 247, 0.692); */
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