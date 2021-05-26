<template>
  <div class="perIndex">
    <!-- 用户信息 -->
    <div class="userInfor">
      <img :src="userData.userImage" class="userImage" />
      <div class="userName">
        <span>{{userData.userName}}</span>
      </div>
      <div class="userSchool">
        <span>所在院校：{{userData.userSchool}}</span>
      </div>
      <div class="publishCount">
        <span @click="toMyGoods" style="cursor: pointer;">发布商品：{{userData.publishCount}}</span>
      </div>
      <div class="attentCount">
        <span @click="toMyAttents" style="cursor: pointer;">关注：{{userData.attentCount}}</span>
      </div>
      <div class="fansCount">
        <span @click="toMyFans" style="cursor: pointer;">粉丝：{{userData.fansCount}}</span>
      </div>
    </div>

    <div class="wuliuInfor">
      <div class="myWuTitle">
        <i class="el-icon-truck"></i>
        <span>我的物流</span>
      </div>

      <div v-show="!isZero" class="BuyBody">
        <el-row class="attentItem" :span="6" v-for="(item, index) in carList" :key="index">
          <div class="buyTop">
            <el-image
              @click="toUserDetail(item.sellerId)"
              :src="item.userImage"
              class="sellerImage"
            ></el-image>
            <span @click="toUserDetail(item.sellerId)" class="sellerName">{{item.userName}}</span>
            <div class="orderState">
              <span>卖家已发货</span>
            </div>
            <el-link
              :underline="false"
              class="toMessage"
              @click="toMessage(item.goodsId,item.sellerId)"
            >联系卖家</el-link>
          </div>
          <el-image @click="toGoodsDetail(item.goodsId)" :src="item.goodsImage" class="goodsImage"></el-image>
          <span @click="toGoodsDetail(item.goodsId)" class="goodsName">{{item.goodsName}}</span>
          <span class="orderPrice">￥ {{item.orderPrice}}</span>
          <span class="goodsIntro">{{item.goodsIntroduct}}</span>
          <!-- 更多选项 -->
          <el-dropdown class="orderSelect" trigger="click" placement="right">
            <el-button icon="el-icon-more" circle></el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="buyDetail(item.orderId)">查看详情</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <!-- 常规选项 -->
          <div class="orderSubmit">
            <el-button @click="confirmOrder(item.orderId)" round>确认收货</el-button>
          </div>
        </el-row>

        <!-- 分页 -->
        <!-- <el-pagination
        @current-change="changePage"
        :page-size="pageSize"
        layout="prev, pager, next, jumper"
        :total="total"
        style="margin-top:20px;padding-bottom: 50px;left:37%"
        ></el-pagination>-->
      </div>

      <!-- 没有物流信息 -->
      <div v-show="isZero" class="zero" style="margin-top:100px">
        <span>您没有新的物流信息哦~</span>
      </div>

      <!-- 订单详情 -->
      <el-dialog :visible.sync="showBuyDetail" width="500px">
        <el-steps :active="active" finish-status="success">
          <el-step title="拍下商品"></el-step>
          <el-step title="支付成功"></el-step>
          <el-step title="卖家发货"></el-step>
          <el-step title="确认收货"></el-step>
        </el-steps>
        <el-image
          class="goodsImage"
          @click="toGoodsDetail(carData.goodsId)"
          :src="carData.goodsImage"
        ></el-image>
        <span class="goodsName">{{carData.goodsName}}</span>
        <span style="float: right;margin-right: 10px;margin-top:25px">￥ {{carData.orderPrice}}</span>
        <span class="goodsIntro" style="margin-left:20px">{{carData.goodsIntroduct}}</span>
        <el-divider></el-divider>
        <div>
          <span class="one">商品价格</span>
          <span class="two">￥{{carData.goodsPrice}}</span>
        </div>
        <br />
        <div>
          <span class="one">运费</span>
          <span class="two">￥{{carData.goodsCar}}</span>
        </div>
        <br />
        <div>
          <span class="one" style="font-size:18px">实付款</span>
          <span class="two" style="font-size:18px;color:#ff7926">￥ {{carData.orderPrice}}</span>
        </div>
        <div style="margin-bottom:45px;"></div>
        <hr style="background-color:rgb(200, 200, 200);border:none;height:1px" size="1px" />
        <span class="bbAdder">收货地址：{{carData.recName}} {{carData.recPhone}}</span>
        <span style="position:absolute;left:30px;margin-top:30px">{{carData.recAdder}}</span>
        <div style="margin-bottom:75px;"></div>
        <hr style="background-color:rgb(200, 200, 200);border:none;height:1px" size="1px" />
        <span class="three">卖家用户名：{{carData.userName}}</span>
        <br />
        <br />
        <span class="three">订单创建时间：{{carData.orderCreaT}}</span>
        <br />
        <br />
        <span class="three">订单支付时间：{{carData.orderPayT}}</span>
        <div style="margin-bottom:20px"></div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import Head from "@/components/Head.vue";
export default {
  name: "PerIndex",
  data() {
    return {
      userData: {},
      carList: [],
      carData: [],
      user: {},
      userId: this.$getSessionStorage("user").userId,
      isZero: false,
      showBuyDetail: false,
      pageNo: 1,
      pageSize: 5,
      total: 0
    };
  },
  created() {
    this.updateUser();
    this.init();
  },
  updated() {},
  mounted() {},
  methods: {
    updateUser() {
      this.$axios
        .post(
          "secondhandWeb/user/getUserInfo",
          this.$qs.stringify({ userId: this.userId })
        )
        .then(res => {
          this.user = res.data;
          this.userData = res.data;
        })
        .catch(e => {
          this.$message.error("user服务器内部发生异常");
          console.log(e);
        });
    },
    init() {
      this.$axios
        .post(
          "/secondhandWeb/orders/getCarList",
          this.$qs.stringify({
            userId: this.userId
          })
        )
        .then(res => {
          if (res.data == null || res.data.length <= 0) this.isZero = true;
          else {
            this.isZero = false;
            this.carList = res.data;
          }
        })
        .catch(e => {
          this.$message.error("服务器内部发生异常");
          console.log(e);
        });

      // this.$axios
      // .post(
      //   "secondhandWeb/orders/getCarCount",
      //   this.$qs.stringify({ userId: this.userId })
      // )
      // .then(res => {
      //   this.total = res.data;
      // })
      // .catch(e => {
      //   this.$message.error("count服务器内部发生异常");
      //   console.log(e);
      // });
    },
    changePage(val) {
      this.pageNo = val; //改变当前页码
      this.init(); //根据新的页码选取分页数据
    },
    toMyAttents() {
      this.$router.push("myAttents");
    },
    toMyFans() {
      this.$router.push("myFans");
    },
    toMyGoods() {
      this.$router.push("myGoods");
    },
    toGoodsDetail(goodsId) {
      this.$setSessionStorage("goodsId", goodsId);
      this.$router.push("/goodsDetail");
    },
    toUserDetail(sellerId) {
      this.$setSessionStorage("anUserId", sellerId);
      this.$router.push("userDetail");
    },
    buyDetail(orderId) {
      this.showBuyDetail = true;
      this.$axios
        .post(
          "/secondhandWeb/orders/getBuyDetail",
          this.$qs.stringify({ orderId })
        )
        .then(res => {
          this.carData = res.data;
        })
        .catch(e => {
          console.log(e);
        });
    },
    toMessage(goodsId, sellerId) {
      this.$axios
        .post(
          "/secondhandWeb/message/isMessList",
          this.$qs.stringify({
            goodsId: goodsId,
            userId: this.userId,
            ortherId: sellerId
          })
        )
        .then(res => {
          if (res.data == 0) {
            this.$axios
              .post(
                "/secondhandWeb/message/addMessList",
                this.$qs.stringify({
                  goodsId: goodsId,
                  userId: this.userId,
                  ortherId: sellerId
                })
              )
              .then(res => {
                if (res.data > 0) {
                  this.$setSessionStorage("goodsId", goodsId);
                  this.$setSessionStorage("ortherId", sellerId);
                  this.$router.push("/message");
                }
              })
              .catch(e => {
                this.$message.error("服务器内部发生异常");
                console.log(e);
              });
          } else if (res.data == 1) {
            this.$axios
              .post(
                "secondhandWeb/message/showMess",
                this.$qs.stringify({
                  goodsId,
                  userId: this.userId,
                  ortherId: sellerId
                })
              )
              .then(res => {
                if (res.data > 0) {
                  this.$setSessionStorage("goodsId", goodsId);
                  this.$setSessionStorage("ortherId", sellerId);
                  this.$router.push("/message");
                }
              })
              .catch(e => {
                this.$message.error("服务器内部发生异常");
                console.log(e);
              });
          } else {
            this.$setSessionStorage("goodsId", goodsId);
            this.$setSessionStorage("ortherId", sellerId);
            this.$router.push("/message");
          }
        })
        .catch(e => {
          this.$message.error("服务器内部发生异常");
          console.log(e);
        });
    },
    confirmOrder(orderId) {
      this.$confirm(
        "确定确认收货吗？确认收货之后交易关闭，将无法进行其他操作",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          this.$axios
            .post(
              "/secondhandWeb/orders/confirmOrder",
              this.$qs.stringify({ orderId })
            )
            .then(res => {
              if (res.data > 0) {
                this.$message.success("确认收货成功");
                this.init();
              } else {
                this.$message.error("确认收货失败");
              }
            })
            .catch(e => {
              console.log(e);
            });
        })
        .catch(() => {});
    }
  },
  components: {}
};
</script>

<style scoped>
.perIndex {
  position: absolute;
  width: 65%;
  margin-left: 200px;
}
.userInfor {
  position: absolute;
  width: 100%;
  height: 90px;
  background-color: rgba(236, 245, 255, 0.733);
  /* border: 1px rgb(221, 221, 221) solid; */
}
.userImage {
  float: left;
  margin-left: 50px;
  margin-top: 10px;
  height: 70px;
  width: 70px;
  border-radius: 50px;
  border: 1px rgb(221, 221, 221) solid;
  /* background-color: rgb(0, 89, 255); */
}
.userName {
  position: absolute;
  float: left;
  font-size: 35px;
  margin-left: 150px;
  margin-top: 5px;
}
.userSchool {
  position: absolute;
  float: left;
  margin-left: 150px;
  margin-top: 55px;
}
.publishCount {
  position: absolute;
  float: left;
  margin-left: 450px;
  margin-top: 55px;
}
.attentCount {
  position: absolute;
  float: left;
  margin-left: 650px;
  margin-top: 55px;
}
.fansCount {
  position: absolute;
  float: left;
  margin-left: 850px;
  margin-top: 55px;
}
.wuliuInfor {
  height: 50px;
  width: 100%;
  margin-top: 120px;
  border-top: 1px rgb(221, 221, 221) solid;
}
.myWuTitle {
  height: 50px;
  background-color: rgba(236, 245, 255, 0.733);
}
.myWuTitle i {
  float: left;
  margin-left: 30px;
  line-height: 50px;
  font-size: 25px;
  color: rgb(155, 155, 155);
}
.myWuTitle span {
  float: left;
  margin-left: 10px;
  line-height: 50px;
  font-size: 20px;
  color: rgb(155, 155, 155);
}
.BuyBody {
  height: 100px;
  margin-top: 30px;
  /* border-top: 2px rgb(221, 221, 221) solid; */
  margin-bottom: 10px;
}
.zero {
  height: 100px;
  margin-top: 150px;
  font-size: 18px;
}
.attentItem {
  /* margin-bottom: 10px; */
  /* margin-top: 10px; */
  border: 1px rgba(221, 221, 221, 0.527) solid;
  margin-bottom: 10px;
}
.buyTop {
  height: 42px;
  background-color: rgba(236, 245, 255, 0.733);
}
.sellerImage {
  position: absolute;
  cursor: pointer;
  left: 30px;
  height: 30px;
  width: 30px;
  border-radius: 40px;
  margin-top: 5px;
  border: 1px rgb(221, 221, 221) solid;
}
.sellerName {
  position: absolute;
  cursor: pointer;
  left: 70px;
  margin-top: 10px;
  font-size: 17px;
}
.toMessage {
  float: right;
  margin-right: 20px;
  margin-top: 10px;
}
.orderState {
  color: #ff7926;
  float: right;
  margin-right: 10px;
  margin-top: 10px;
}
.goodsImage {
  cursor: pointer;
  float: left;
  margin-left: 10px;
  margin-top: 20px;
  margin-bottom: 20px;
  height: 70px;
  width: 70px;
  border: 1px rgb(221, 221, 221) solid;
}
.goodsName {
  cursor: pointer;
  float: left;
  margin-left: 10px;
  margin-top: 20px;
  font-size: 20px;
}
.orderPrice {
  color: #ff7926;
  font-size: 18px;
  float: left;
  margin-left: 10px;
  margin-top: 22px;
}
.goodsIntro {
  position: absolute;
  margin-top: 55px;
  left: 90px;
  width: 65%;
  text-align: left;
  color: rgb(143, 143, 143);
}
.orderSubmit {
  position: absolute;
  right: 60px;
  margin-top: 60px;
  size: small;
}
.orderSelect {
  position: absolute;
  right: 10px;
  margin-top: 60px;
  size: small;
}
.el-divider {
  margin-top: 110px;
}
.bbAdder {
  float: left;
  font-weight: bold;
  margin-left: 10px;
  font-size: 16px;
}
.one {
  margin-left: 10px;
  display: block;
  position: absolute;
}
.two {
  right: 30px;
  position: absolute;
}
.three {
  margin-left: 10px;
  display: block;
  position: absolute;
}
</style>