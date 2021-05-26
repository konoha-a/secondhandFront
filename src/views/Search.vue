<template>
  <div>
    <Head></Head>

    <div v-show="isZero" class="zero">
      <span v-if="modelSelect==1">抱歉 没有找到您想要的商品~</span>
      <span v-if="modelSelect==2">抱歉 没有找到您想要的用户~</span>
      <span v-if="modelSelect==3">抱歉 没有找到该学校的用户~</span>
    </div>

    <div v-show="!isZero">
      <span class="zero" style="margin-top:60px">已为您找到以下信息：</span>
      <div class="goodsBox" v-if="modelSelect==1">
        <el-row :gutter="60">
          <el-col :span="6" v-for="(item, index) in searchList" :key="index">
            <div class="cardBox">
              <el-card :body-style="{ padding: '10px' }" shadow="hover">
                <div @click="toGoodsDetail(item.goodsId)">
                  <el-image :src="item.goodsImage" class="goodsImage"></el-image>
                  <div class="goodsName">
                    <span>{{item.goodsName}}</span>
                  </div>
                  <div class="goodsPrice">
                    <span>￥ {{item.goodsPrice}}</span>
                  </div>
                  <div class="goodsFavo">
                    <span>{{item.goodsFavorite}}人收藏</span>
                  </div>
                </div>
              </el-card>
            </div>
          </el-col>
        </el-row>
      </div>

      <div class="userBox" v-else>
        <el-row class="attentItem" :span="6" v-for="(item, index) in searchList" :key="index">
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

    </div>
  </div>
</template>

<script>
import Head from "@/components/Head.vue";
export default {
  name: "Search",
  data() {
    return {
      searchList: [],
      searchText: this.$getSessionStorage("searchText"),
      modelSelect: this.$getSessionStorage("modelSelect"),
      isZero: false
    };
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      if (this.modelSelect == "1") {
        this.$axios
          .post(
            "secondhandWeb/goods/findGoodsByName",
            this.$qs.stringify({ goodsName: this.searchText })
          )
          .then(res => {
            if (res.data == null || res.data.length <= 0) this.isZero = true;
            else this.searchList = res.data;
          })
          .catch(e => {
            this.$message.error("服务器内部发生异常");
            console.log(e);
          });
      } else if (this.modelSelect == "2") {
        this.$axios
          .post(
            "secondhandWeb/user/findUserByName",
            this.$qs.stringify({ userName: this.searchText })
          )
          .then(res => {
            if (res.data == null || res.data.length <= 0) this.isZero = true;
            else this.searchList = res.data;
          })
          .catch(e => {
            this.$message.error("服务器内部发生异常");
            console.log(e);
          });
      } else {
        this.$axios
          .post(
            "secondhandWeb/user/findUserBySchool",
            this.$qs.stringify({ userSchool: this.searchText })
          )
          .then(res => {
            if (res.data == null || res.data.length <= 0) this.isZero = true;
            else this.searchList = res.data;
          })
          .catch(e => {
            this.$message.error("服务器内部发生异常");
            console.log(e);
          });
      }
    },
    toGoodsDetail(goodsId) {
      this.$setSessionStorage("goodsId", goodsId);
      this.$router.push("/goodsDetail");
    },
    toUserDetail(userId) {
        console.log(userId);
      this.$setSessionStorage("anUserId", userId);
      this.$router.push("userDetail");
    },
  },
  components: {
    Head
  }
};
</script>

<style scoped>
.zero {
  position: absolute;
  font-size: 18px;
  margin-top: 150px;
  left: 43%;
}
.goodsBox {
  position: absolute;
  margin-left: 10%;
  margin-top: 100px;
  width: 80%;
}
.cardBox {
  border: none;
  margin-bottom: 40px;
  left: 0;
}
.el-card {
  width: 260px;
  cursor: pointer;
}
.goodsImage {
  width: 240px;
  height: 240px;
}
.goodsFavo {
  text-align: right;
  padding-right: 5px;
  margin-top: 10px;
}
.goodsName {
  text-align: left;
  padding-left: 5px;
  font-size: 20px;
  /* padding: 10px; */
}
.goodsPrice {
  font-size: 18px;
  text-align: left;
  padding-left: 5px;
  color: #ff7926;
}
.userBox {
  position: absolute;
  margin-left: 15%;
  margin-top: 100px;
  width: 70%;
  border-top: 1px rgb(221, 221, 221) solid;
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