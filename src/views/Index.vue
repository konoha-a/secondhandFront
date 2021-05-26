<template>
  <div>
    <!-- 头部 -->
    <Head></Head>

    <!-- 搜索框 -->
    <div class="top_bar">
      <el-input v-model="searchText" placeholder="请输入内容">
        <el-select v-model="modelSelect" slot="prepend" placeholder="请选择" style="width:80px">
          <el-option label="商品" value="1"></el-option>
          <el-option label="用户" value="2"></el-option>
          <el-option label="学校" value="3"></el-option>
        </el-select>
        <el-button
          slot="append"
          icon="el-icon-search"
          @click="searchSubmit(modelSelect,searchText)"
        ></el-button>
      </el-input>
    </div>

    <!-- 中间 -->
    <div class="meddin">
      <!-- 左侧菜单 -->
      <div class="leftMenuBox">
        <el-col>
          <el-menu class="leftMenu" @open="handleOpen" @close="handleClose" @select="toGoodsClass">
            <el-menu-item index="1" @click="goodsClass">
              <i class="el-icon-notebook-1"></i>
              <span slot="title">书籍</span>
              <i class="el-icon-arrow-right"></i>
            </el-menu-item>
            <el-menu-item index="2">
              <i class="el-icon-paperclip"></i>
              <span slot="title">学习用品</span>
              <i class="el-icon-arrow-right"></i>
            </el-menu-item>
            <el-menu-item index="3">
              <i class="el-icon-sugar"></i>
              <span slot="title">食品</span>
              <i class="el-icon-arrow-right"></i>
            </el-menu-item>
            <el-menu-item index="4">
              <i class="el-icon-mobile-phone"></i>
              <span slot="title">电子产品</span>
              <i class="el-icon-arrow-right"></i>
            </el-menu-item>
            <el-menu-item index="5">
              <i class="el-icon-basketball"></i>
              <span slot="title">体育用品</span>
              <i class="el-icon-arrow-right"></i>
            </el-menu-item>
            <el-menu-item index="6">
              <i class="el-icon-office-building"></i>
              <span slot="title">生活用品</span>
              <i class="el-icon-arrow-right"></i>
            </el-menu-item>
          </el-menu>
        </el-col>
      </div>

      <!-- 右侧轮播图 -->
      <div class="lunzhuan">
        <el-carousel height="490px">
          <el-carousel-item v-for="item in 4" :key="item">
            <img src="../assets/qq.png" width="100%" height="100%" />
          </el-carousel-item>
        </el-carousel>
      </div>
    </div>

    <!-- 菜单 -->
    <div class="caidan">
      <el-menu
        :default-active="activeIndex2"
        class="el-menu-caidan"
        mode="horizontal"
        background-color="#FFAC7A"
        text-color="#fff"
        active-text-color="rgb(160, 80, 35)"
      >
        <el-menu-item index="1">猜你喜欢</el-menu-item>
        <!-- <el-menu-item index="2">更多人看</el-menu-item> -->
      </el-menu>
    </div>

    <!-- 主体 -->
    <div class="indexBody">
      <el-row :gutter="60">
        <el-col :span="6" v-for="(item, index) in goodsList" :key="index">
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

    <!-- 分页 -->
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
  name: "Index",
  data() {
    return {
      activeName: "",
      searchText: "",
      select: "",
      activeIndex2: "1",
      modelSelect: "1",
      pageNo: 1,
      pageSize: 20,
      total: 0,
      goodsList: [],
      goodsId: ""
    };
  },
  created() {
    this.init();    
  },
  methods: {
    init() {
      this.$axios
        .post(
          "secondhandWeb/goods/getGoodsList",
          this.$qs.stringify({ pageNo: this.pageNo, pageSize: this.pageSize })
        )
        .then(res => {
          this.goodsList = res.data;          
        })
        .catch(e => {
          this.$message.error("服务器内部发生异常");
          console.log(e);
        });

      this.$axios
        .get("secondhandWeb/goods/getGoodsCount", this.$qs.stringify())
        .then(res => {
          this.total = res.data;
        })
        .catch(e => {
          this.$message.error("服务器内部发生异常");
          console.log(e);
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
    toGoodsClass(index) {
      this.$setSessionStorage("classTitle", index);
      this.$router.push("/goodsClass");
    },
    searchSubmit(modelSelect, searchText) {
      this.$setSessionStorage("modelSelect", modelSelect);
      this.$setSessionStorage("searchText", searchText);
      this.$router.push("search");
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
  height: 70px;
  width: 100%;
  background-color: #ffac7a;
  left: 0;
  right: 0;
}
.el-input {
  margin: 15px;
  width: 40%;
}
.meddin {
  position: absolute;
  left: 10%;
  right: 10%;
  height: 500px;
  top: 116px;
}
.leftMenuBox {
  position: absolute;
  width: 23%;
  height: 100%;
  border: #ffac7a 2px solid;
  /* background-color: blue; */
}
.leftMenuBox > ul {
  height: 0;
}
.leftMenu {
  position: absolute;
  width: 100%;
  text-align: left;
}
.el-menu-item {
  border-bottom: 1px rgba(228, 227, 227, 0.541) solid;
  font-size: 16px;
}
.el-icon-arrow-right {
  float: right;
  line-height: 56px;
}
.lunzhuan {
  position: absolute;
  margin-top: 13px;
  width: 75%;
  right: 0;
}
.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
}
.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}
.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
.caidan {
  position: absolute;
  top: 640px;
  left: 0;
  right: 0;
}
.indexBody {
  margin-left: 10%;
  margin-top: 720px;
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