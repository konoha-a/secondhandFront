<template>
  <div>
    <!-- 头部 -->
    <Head></Head>

    <!-- 顶栏 -->
    <div class="top_bar">
      <div class="title">个人中心</div>
      <!-- <el-input class="perSearch">
        <el-button slot="append">搜索</el-button>
      </el-input> -->
    </div>

    <!-- 主体 -->
    <div class="perBody">
      <div class="leftMenu">
        <el-col :span="5">
          <el-menu class="el-leftMenu" router>
            <template v-for="item in perPage1">
              <template>
                <el-menu-item :index="item.index" :key="item.index">{{item.title}}</el-menu-item>
              </template>
            </template>
            <el-menu-item @click="message">我的消息</el-menu-item>
            <el-menu-item @click="favorites">我的收藏</el-menu-item>
            <template v-for="item in perPage2">
              <template>
                <el-menu-item :index="item.index" :key="item.index">{{item.title}}</el-menu-item>
              </template>
            </template>
          </el-menu>
        </el-col>
      </div>
      <div class="rightCont">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import Head from "@/components/Head.vue";
export default {
  name: "PerCenter",
  data() {
    return {
      perPage1: [
        {
          index: "/perIndex",
          title: "个人首页"
        }
      ],
      perPage2: [
        {
          index: "/myBuy",
          title: "我买到的"
        },
        {
          index: "/mySell",
          title: "我卖出的"
        },
        {
          index: "/myAttents",
          title: "我的关注"
        },
        {
          index: "/myFans",
          title: "我的粉丝"
        },        
        {
          index: "/myGoods",
          title: "我的商品"
        },
        {
          index: "/recAdder",
          title: "收货地址"
        },
        {
          index: "/mySet",
          title: "账号管理"
        }
      ]
    };
  },
  methods: {
    favorites() {
      this.$router.push({ path: "/favorites" });
    },
    message() {
      this.$router.push({ path: "/message" });
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
.title {
  position: absolute;
  width: 100px;
  color: white;
  /* left: 100px; */
  /* margin-left: 100px; */
  text-align: left;
  padding-left: 100px;
  line-height: 70px;
  font-size: 25px;
}
.perSearch {
  position: absolute;
  margin: 15px;
  width: 300px;
  right: 5%;
}
.perBody {
  margin-top: 140px;
  margin-left: 7%;
  margin-right: 10%;
  /* background-color: violet; */
  /* height: 100px; */
}
.el-leftMenu {
  width: 180px;
  text-align: center;
}
</style>