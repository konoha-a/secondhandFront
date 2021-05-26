<template>
  <div>
    <Head></Head>
    <div class="deBody">
      <el-row class="attentItem">
        <img :src="anUserData.userImage" class="userImage" />
        <div class="userName">
          <span>{{anUserData.userName}}</span>
        </div>
        <div class="userSchool">
          <span>所在院校：{{anUserData.userSchool}}</span>
        </div>
        <div class="publishCount">
          <span>发布商品：{{anUserData.publishCount}}</span>
        </div>
        <div class="attentCount">
          <span>关注：{{anUserData.attentCount}}</span>
        </div>
        <div class="fansCount">
          <span>粉丝：{{anUserData.fansCount}}</span>
        </div>
      </el-row>
      <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal">
        <el-menu-item index="1">TA的商品</el-menu-item>
        <!-- <el-menu-item index="2">TA的评价</el-menu-item> -->
      </el-menu>

      <div v-show="!isZero" class="indexBody">
        <el-row :gutter="95">
          <el-col :span="6" v-for="(item, index) in FGoodsData" :key="index">
            <div class="cardFBox">
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
          <el-col :span="6" v-for="(item, index) in TGoodsData" :key="index">
            <div class="cardTBox">
              <el-card :body-style="{ padding: '10px' }" shadow="hover">
                <div class="posiab" @click="toGoodsDetail(item.goodsId)">
                  <img class="bb" src="@/assets/selled.png" alt />
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

      <div v-show="isZero" class="zero">
        <span style="font-size:18px">TA还没有发布任何商品~</span>
      </div>
    </div>
  </div>
</template>

<script>
import Head from "@/components/Head.vue";
export default {
  name: "UserDetail",
  data() {
    return {
      anUserData: {},
      activeIndex: 1,
      anUserId: this.$getSessionStorage("anUserId"),
      isZero: false,
      FGoodsData: [],
      TGoodsData: []
    };
  },
  mounted() {},
  created() {
    this.init();
    this.getGoodsList();
  },
  methods: {
    init() {
      this.$axios
        .post(
          "/secondhandWeb/user/getUserInfo/" + this.anUserId,
          this.$qs.stringify({ userId: this.anUserId })
        )
        .then(res => {
          this.anUserData = res.data;
        })
        .catch(e => {
          console.log(e);
        });
    },
    getGoodsList() {
      this.$axios
        .post(
          "/secondhandWeb/goods/getFGoodsList",
          this.$qs.stringify({
            sellerId: this.anUserId
          })
        )
        .then(res => {
          this.FGoodsData = res.data;
          console.log(this.FGoodsData);
        })
        .catch(e => {
          console.log(e);
        });

      this.$axios
        .post(
          "/secondhandWeb/goods/getTGoodsList",
          this.$qs.stringify({
            sellerId: this.anUserId
          })
        )
        .then(res => {
          this.TGoodsData = res.data;
          console.log(this.TGoodsData);
        })
        .catch(e => {
          console.log(e);
        });
      setTimeout(this.judgment, 500);
    },
    judgment() {
      if (
        (this.FGoodsData == null || this.FGoodsData.length <= 0) &&
        (this.TGoodsData == null || this.TGoodsData.length <= 0)
      )
        this.isZero = true;
      else this.isZero = false;
    },
    toGoodsDetail(goodsId) {
      this.$setSessionStorage("goodsId", goodsId);
      this.$router.push("/goodsDetail");
    }
  },
  components: {
    Head
  }
};
</script>

<style scoped>
.el-table {
  margin-top: 200px;
}
.deBody {
  height: 100px;
  margin-top: 50px;
  width: 80%;
  margin-left: 10%;
}
.zero {
  height: 100px;
  margin-top: 150px;
  font-size: 18px;
}
.attentItem {
  margin-bottom: 5px;
  margin-top: 5px;
  /* border-bottom: 1px rgb(221, 221, 221) solid; */
}
.userImage {
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
.indexBody {
  width: 100%;
  margin-top: 30px;
  /* border-top: 1px rgb(221, 221, 221) solid; */
}
.cardFBox {
  border: none;
  margin-bottom: 40px;
  left: 0;
}
.cardTBox {
  border: none;
  margin-bottom: 40px;
  left: 0;
}
.el-card {
  position: relative;
  height: 300px;
  cursor: pointer;
}
.goodsImage {
  position: absolute;
  left: 10px;
  width: 210px;
  height: 210px;
}
.goodsFavo {
  position: absolute;
  float: right;
  right: 10px;
  margin-top: 260px;
  font-size: 15px;
}
.goodsName {
  position: absolute;
  width: 200px;
  margin-top: 210px;
  text-align: left;
  padding-left: 5px;
  font-size: 18px;
}
.goodsPrice {
  position: absolute;
  margin-top: 235px;
  font-size: 16px;
  text-align: left;
  padding-left: 5px;
  color: #ff7926;
}
.bb {
  position: absolute;
  width: 220px;
  float: left;
  left: 0;
  margin-top: 30px;
  z-index: 2;
}
</style>