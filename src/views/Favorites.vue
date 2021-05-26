<template>
  <div>
    <!-- 头部 -->
    <Head></Head>

    <!-- 顶栏 -->
    <div class="top_bar">
      <div class="logo">收藏的商品</div>
      <el-input class="faSearch">
        <el-button slot="append">搜索</el-button>
      </el-input>
    </div>

    <!-- 主体 -->
    <div class="indexBody">
      <el-row :gutter="60">
        <el-col :span="6" v-for="(item, index) in favoData" :key="index"><div class="cardBox">
          <el-card :body-style="{ padding: '10px' }" shadow="hover">
            <div @click="toGoodsDetail(item.goodsId)">
              <el-image :src="item.goodsImage" class="goodsImage"></el-image>
            <div class="goodsName">
              <span>{{item.goodsName}}</span>
            </div>
            <div class="goodsPrice">
              <span>￥{{item.goodsPrice}}</span>
            </div>
            <div class="goodsFavo">
              <span class="goodsFavo">{{item.goodsFavorite}}人收藏</span>
            </div></div>
          </el-card></div>
        </el-col>
      </el-row>
    </div>
    <el-pagination
      @current-change="changePage"
      :page-size="pageSize"
      layout="prev, pager, next, jumper"
      :total="total"
      style="margin-bottom:100px; margin-top:20px">
    </el-pagination>
  </div>
</template>

<script>
import Head from "@/components/Head.vue";
export default {
  name: "Favorites",
  data() {
    return {
      favoData: [],
      goodsName: "",
      goodsFavorite: "",
      goodsPrice: "",
      goodsImage: "",
      goodsId:"",
      pageNo: 1,
      pageSize:20,
      total:0,
    };
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      var id = this.$getSessionStorage("user").userId;
      this.$axios
        .post(
          "/secondhandWeb/favorite/getFavoListById/" + id,
          this.$qs.stringify({ userId: this.$getSessionStorage("user").userId ,pageNo:this.pageNo,pageSize:this.pageSize})
        )
        .then(res => {
          this.favoData = res.data;
          // console.log(this.favoData);
        })
        //异常
        .catch(error => {
          this.$message.error("服务器内部发生异常");
          console.log(error);
        });

        this.$axios
        .post(
          "/secondhandWeb/favorite/getFavoCount",
          this.$qs.stringify({ userId: this.$getSessionStorage("user").userId })
        )
        .then(res => {
          this.total = res.data;
          // console.log(this.favoData);
        })
        //异常
        .catch(error => {
          this.$message.error("服务器内部发生异常");
          console.log(error);
        });
    },
    changePage(val) {
      this.pageNo = val; //改变当前页码
      this.init(); //根据新的页码选取分页数据
    },
    toGoodsDetail(goodsId) {
      this.$setSessionStorage("goodsId",goodsId);
      this.$router.push("/goodsDetail");
    },
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
.logo {
  position: absolute;
  width: 140px;
  color: white;
  /* left: 100px; */
  /* margin-left: 100px; */
  text-align: left;
  padding-left: 13%;
  line-height: 70px;
  font-size: 25px;
}
.faLink {
  line-height: 75px;
  width: 1000px;
}
.faGoods {
  font-size: 18px;
  right: 150px;
}
.faUsers {
  font-size: 18px;
  right: 100px;
}
.faSearch {
  position: absolute;
  margin: 15px;
  width: 300px;
  right: 5%;
}
.indexBody {
  margin-left: 10%;
  margin-top: 140px;
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
</style>