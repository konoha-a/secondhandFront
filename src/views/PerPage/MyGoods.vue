<template>
  <div class="myGoods">
    <div class="title">
      <span>我的商品</span>
    </div>

    <div v-show="!isZero" class="indexBody">
      <el-row :gutter="50">
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
      <span style="font-size:18px">您还没有发布任何商品~</span>
    </div>
  </div>
</template>

<script>
import Head from "@/components/Head.vue";
export default {
  name: "MyGoods",
  data() {
    return {
      isZero: false,
      userId: "",
      FGoodsData: [],
      TGoodsData: []
    };
  },
  created() {
    this.init();
    setTimeout(this.judgment,500);
  },
  methods: {
    init() {
      this.userId = this.$getSessionStorage("user").userId;
      this.$axios
        .post(
          "/secondhandWeb/goods/getFGoodsList",
          this.$qs.stringify({
            sellerId: this.userId
          })
        )
        .then(res => {
          this.FGoodsData = res.data;
        })
        .catch(e => {
          console.log(e);
        });

      this.$axios
        .post(
          "/secondhandWeb/goods/getTGoodsList",
          this.$qs.stringify({
            sellerId: this.userId
          })
        )
        .then(res => {
          this.TGoodsData = res.data;
        })
        .catch(e => {
          console.log(e);
        });
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
    },
  },
  components: {}
};
</script>

<style scoped>
.myGoods {
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
.zero {
  height: 100px;
  margin-top: 150px;
  font-size: 18px;
}
.indexBody {
  /* width: 100%; */
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
  height: 260px;
  width: 95%;
  cursor: pointer;
}
.goodsImage {
  position: absolute;
  left: 10px;
  width: 180px;
  height: 180px;
}
.goodsFavo {
  position: absolute;
  float: right;
  right: 10px;
  margin-top: 220px;
  font-size: 14px;
}
.goodsName {
  position: absolute;
  width: 200px;
  margin-top: 180px;
  text-align: left;
  padding-left: 5px;
  font-size: 16px;
}
.goodsPrice {
  position: absolute;
  margin-top: 200px;
  font-size: 15px;
  text-align: left;
  padding-left: 5px;
  color: #ff7926;
}
.bb {
  position: absolute;
  width: 200px;
  float: left;
  left: 0;
  margin-top: 20px;
  z-index: 2;
}
</style>