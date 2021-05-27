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
        <button v-if="!isAttent" class="addAttent" @click="addAttent(sellerId)">+关注</button>
        <button
          v-else
          class="addAttent"
          style="background-color: #b1b1b1d8"
          @click="cancelAttent(sellerId)"
        >已关注</button>
      </el-row>
      <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal">
        <el-menu-item index="1">TA的商品</el-menu-item>
        <!-- <el-menu-item index="2">TA的评价</el-menu-item> -->
      </el-menu>

      <div v-show="!isZero" class="indexBody">
        <el-row :gutter="95">
          <!-- <el-col :span="6" v-for="(item, index) in FGoodsData" :key="index">
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
          </el-col>-->

          <el-col :span="6" v-for="(item, index) in MyGoodsData" :key="index">
            <div class="cardTBox">
              <el-card :body-style="{ padding: '10px' }" shadow="hover">
                <div class="posiab" @click="toGoodsDetail(item.goodsId)">
                  <img v-show="item.isSell" class="bb" src="@/assets/selled.png" alt />
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

        <!-- 分页 -->
        <el-pagination
          @current-change="changePage"
          :page-size="pageSize"
          layout="prev, pager, next, jumper"
          :total="total"
          style="padding-bottom: 50px;left:37%"
        ></el-pagination>
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
      user:this.$getSessionStorage("user"),
      userId: "",
      anUserId: this.$getSessionStorage("anUserId"),
      isZero: false,
      isAttent: false,
      MyGoodsData: [],
      pageNo: 1,
      pageSize: 16,
      total: 0
    };
  },
  mounted() {},
  created() {
    this.init();
  },
  methods: {
    init() {
      this.$axios
        .post(
          "/secondhandWeb/user/getUserInfo",
          this.$qs.stringify({ userId: this.anUserId })
        )
        .then(res => {
          this.anUserData = res.data;
          this.total = this.anUserData.publishCount;
        })
        .catch(e => {
          console.log(e);
        });

      this.$axios
        .post(
          "/secondhandWeb/goods/getMyGoodsList",
          this.$qs.stringify({
            userId: this.anUserId,
            pageNo: this.pageNo,
            pageSize: this.pageSize
          })
        )
        .then(res => {
          this.MyGoodsData = res.data;
          if (this.MyGoodsData == null || this.MyGoodsData.length <= 0)
            this.isZero = true;
          else this.isZero = false;
        })
        .catch(e => {
          console.log(e);
        });

        if (this.user == null || this.user == "null") {
            this.isAttent = false;
          } else {
            this.userId=this.$getSessionStorage("user").userId;
            //判断是否关注
            this.judgAttent();
          }
    },
    judgAttent() {
      this.$axios
        .post(
          "/secondhandWeb/attention/isAttent",
          this.$qs.stringify({
            userId: this.userId,
            beAttentId: this.anUserId
          })
        )
        .then(res => {
          if (res.data > 0) {
            this.isAttent = true;
          } else {
            this.isAttent = false;
          }
        })
        .catch(e => {
          console.log(e);
        });
    },
    addAttent(sellerId) {
      if (this.user == null) {
        this.$message.error("请先登录");
        this.$router.push("/userLogin");
      }
      this.$axios
        .post(
          "/secondhandWeb/attention/addAttent",
          this.$qs.stringify({
            userId: this.userId,
            beAttentId: this.anUserId
          })
        )
        .then(res => {
          //console.log(res);
          if (res.data > 0) {
            this.$message.success("关注成功");
            this.isAttent = true;
          } else {
            this.$message.error("关注失败");
          }
        })
        .catch(e => {
          console.log(e);
        });
    },
    cancelAttent(sellerId) {
      this.$axios
        .post(
          "/secondhandWeb/attention/cancelAttent",
          this.$qs.stringify({
            userId: this.userId,
            beAttentId: this.anUserId
          })
        )
        .then(res => {
          //console.log(res);
          if (res.data > 0) {
            this.$message.success("取消关注成功");
            this.isAttent = false;
            // this.$router.push({ path: "/favorites" });
          } else {
            this.$message.error("取消关注失败");
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
.addAttent {
  cursor: pointer;
  float: right;
  margin-right: 10px;
  color: #fff;
  background-color: #ff7926b0;
  margin-top: 60px;
  width: 100px;
  line-height: 30px;
  border-radius: 2px;
  text-align: center;
  border: none;
}
</style>