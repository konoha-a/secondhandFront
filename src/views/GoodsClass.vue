<template>
  <div>
    <Head></Head>
    <div class="top_bar">
      <div class="logo">{{this.classTitle}}</div>
      <el-input class="faSearch" v-model="searchText">
        <el-button slot="append" @click="searchSubmit(searchText)">搜索</el-button>
      </el-input>
    </div>
    <div class="indexBody">
      <el-row :gutter="60">
        <el-col :span="6" v-for="(item, index) in goodsData" :key="index">
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
    <el-pagination
      @current-change="changePage"
      :page-size="pageSize"
      layout="prev, pager, next, jumper"
      :total="total"
      style="margin-bottom:100px; margin-top:20px"
    ></el-pagination>
  </div>
</template>

<script>
import Head from "@/components/Head.vue";
export default {
  name: "GoodsClass",
  data() {
    return {
      goodsData: [],
      classTitle: "",
      pageNo: 1,
      pageSize: 20,
      total: 0,
      searchText:"",
    };
  },
  created() {
    this.goodsData = this.$getSessionStorage("goodsClass");
    this.className();
    this.init();
  },
  mounted() {},
  methods: {
    init() {
      this.$axios
        .post(
          "/secondhandWeb/goods/getClassCount",
          this.$qs.stringify({ index: this.$getSessionStorage("classTitle") })
        )
        .then(res => {
          this.total = res.data;
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
      this.$setSessionStorage("goodsId", goodsId);
      this.$router.push("/goodsDetail");
    },
    className() {
      if (this.$getSessionStorage("classTitle") == 1) this.classTitle = "书籍";
      if (this.$getSessionStorage("classTitle") == 2)
        this.classTitle = "学习用品";
      if (this.$getSessionStorage("classTitle") == 3) this.classTitle = "食品";
      if (this.$getSessionStorage("classTitle") == 4)
        this.classTitle = "电子产品";
      if (this.$getSessionStorage("classTitle") == 5)
        this.classTitle = "体育用品";
      if (this.$getSessionStorage("classTitle") == 6)
        this.classTitle = "生活用品";
    },
    searchSubmit(searchText){
      this.$axios
        .post(
          "/secondhandWeb/goods/getClassCount",
          this.$qs.stringify(this.goodsData)
        )
        .then(res => {
          this.total = res.data;
        })
        //异常
        .catch(error => {
          this.$message.error("服务器内部发生异常");
          console.log(error);
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
.logo {
  position: absolute;
  width: 140px;
  color: white;
  text-align: left;
  padding-left: 13%;
  line-height: 70px;
  font-size: 25px;
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