<template>
  <div class="myBuy">
    <div class="title">
      <span>我买到的</span>
    </div>

    <!-- 买到的商品订单列表 -->
    <div v-show="!isZero" class="BuyBody">
      <el-row class="attentItem" :span="6" v-for="(item, index) in buyList" :key="index">
        <div class="buyTop">
          <el-image @click="toUserDetail(item.sellerId)" :src="item.userImage" class="sellerImage"></el-image>
          <span @click="toUserDetail(item.sellerId)" class="sellerName">{{item.userName}}</span>
          <div class="orderState">
            <span v-if="item.orderState==0">订单已取消</span>
            <span v-else-if="item.orderState==1">等待买家付款</span>
            <span v-else-if="item.orderState==2">等待卖家发货</span>
            <span v-else-if="item.orderState==3">卖家已发货</span>
            <span v-else>交易成功</span>
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
            <el-dropdown-item
              v-if="item.orderState==1"
              @click.native="cancelOrder(item.orderId,item.goodsId)"
            >取消订单</el-dropdown-item>
            <el-dropdown-item
              v-if="item.orderState==1"
              @click.native="editAdder(item.orderId,item.adderId)"
            >修改地址</el-dropdown-item>
            <!-- <el-dropdown-item
              v-if="item.orderState==2"
              @click.native="x"
            >退款</el-dropdown-item>
            <el-dropdown-item
              v-if="item.orderState==3"
              @click.native="x"
            >退换</el-dropdown-item>-->
          </el-dropdown-menu>
        </el-dropdown>
        <!-- 常规选项 -->
        <div class="orderSubmit">
          <el-button v-if="item.orderState==0" @click="deleteOrder(item.orderId)" round>删除订单</el-button>
          <el-button
            v-if="item.orderState==1"
            @click="orderSubmit(item.orderId,item.goodsId)"
            round
          >完成支付</el-button>
          <el-button
            v-if="item.orderState==2"
            @click="editAdder(item.orderId,item.adderId)"
            round
          >修改地址</el-button>
          <el-button v-if="item.orderState==3" @click="confirmOrder(item.orderId)" round>确认收货</el-button>
          <el-button v-if="item.orderState==4" @click="deleteOrder(item.orderId)" round>删除订单</el-button>
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

    <!-- 没有订单 -->
    <div v-show="isZero" class="zero">
      <span>您还没有购买任何商品哦~</span>
    </div>

    <!-- 支付 -->
    <el-dialog :visible.sync="showPay">
      <!-- 确认订单信息 -->
      <div style="margin-bottom:30px; font-size:18px">
        <span>确认订单信息</span>
      </div>
      <hr style="background-color:rgb(200, 200, 200);border:none;height:1px" size="1px" />
      <span class="orderTitle">商品信息</span>
      <span class="orderTitle"></span>
      <span class="orderTitle">价格</span>
      <span class="orderTitle">运费</span>
      <span>总计</span>
      <br />
      <hr style="background-color:rgb(200, 200, 200);border:none;height:1px" size="1px" />
      <el-image
        :src="orderData.goodsImage"
        style="width:70px;height:70px;position:absolute;left:10%"
      ></el-image>
      <span class="orderData" style="left:25%">{{orderData.goodsName}}</span>
      <span class="orderData" style="left:49%">{{orderData.goodsPrice}}</span>
      <span class="orderData" style="left:69%">{{orderData.goodsCar}}</span>
      <span class="orderData" style="left:87%">{{orderData.orderPrice}}</span>
      <br />
      <div style="margin-bottom:60px;"></div>
      <hr style="background-color:rgb(200, 200, 200);border:none;height:1px" size="1px" />
      <el-button @click="payCancel">取 消</el-button>
      <el-button type="primary" @click="paySubmit">确认支付</el-button>
    </el-dialog>

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
        @click="toGoodsDetail(buyData.goodsId)"
        :src="buyData.goodsImage"
      ></el-image>
      <span class="goodsName">{{buyData.goodsName}}</span>
      <span style="float: right;margin-right: 10px;margin-top:25px">￥ {{buyData.orderPrice}}</span>
      <span class="goodsIntro" style="margin-left:20px">{{buyData.goodsIntroduct}}</span>
      <el-divider></el-divider>
      <div>
        <span class="one">商品价格</span>
        <span class="two">￥{{buyData.goodsPrice}}</span>
      </div>
      <br />
      <div>
        <span class="one">运费</span>
        <span class="two">￥{{buyData.goodsCar}}</span>
      </div>
      <br />
      <div>
        <span class="one" style="font-size:18px">实付款</span>
        <span class="two" style="font-size:18px;color:#ff7926">￥ {{buyData.orderPrice}}</span>
      </div>
      <div style="margin-bottom:45px;"></div>
      <hr style="background-color:rgb(200, 200, 200);border:none;height:1px" size="1px" />
      <span class="bbAdder">收货地址：{{buyData.recName}} {{buyData.recPhone}}</span>
      <span style="position:absolute;left:30px;margin-top:30px">{{buyData.recAdder}}</span>
      <div style="margin-bottom:75px;"></div>
      <hr style="background-color:rgb(200, 200, 200);border:none;height:1px" size="1px" />
      <span class="three">卖家用户名：{{buyData.userName}}</span>
      <br />
      <br />
      <span class="three">订单创建时间：{{buyData.orderCreaT}}</span>
      <br />
      <br />
      <span class="three">订单支付时间：{{buyData.orderPayT}}</span>
      <div style="margin-bottom:20px"></div>
    </el-dialog>

    <!-- 修改地址 -->
    <el-dialog :visible.sync="showEditAdder">
      <div class="adderInfo">
        <div style="margin-bottom:30px; font-size:18px">
          <span>修改收货地址</span>
        </div>
        <el-row class="adderSel" :span="6" v-for="(item,index) in adderData" :key="index">
          <el-radio-group v-model="radio">
            <div @click="adderSel(item.adderId)">
              <el-radio
                :label="item.adderId"
              >{{item.recAdder}} ({{item.recName}} 收) {{item.recPhone}}</el-radio>
            </div>
          </el-radio-group>
        </el-row>
      </div>
      <el-button @click="adderCancel">取 消</el-button>
      <el-button type="primary" @click="adderSubmit">确认修改</el-button>
      <el-button type="danger" @click="addAdder">+新增地址</el-button>
    </el-dialog>

    <!-- 新增地址 -->
    <el-dialog :visible.sync="showAddOrder">
      <div style="margin-bottom:30px; font-size:18px">
        <span>新增地址</span>
      </div>
      <el-form
        :model="addForms"
        :rules="addRules"
        ref="addForms"
        class="add-forms"
        label-width="100px"
      >
        <el-form-item label="收货人" prop="recName">
          <el-input v-model="addForms.recName"></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="recPhone">
          <el-input v-model="addForms.recPhone"></el-input>
        </el-form-item>
        <el-form-item label="详细地址" prop="recAdder">
          <el-input v-model="addForms.recAdder"></el-input>
        </el-form-item>
        <el-form-item style="float:center">
          <el-button @click="addCancel">取 消</el-button>
          <el-button type="primary" @click="addSubmit('addForms')">确认</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { resetObject } from "@/common.js";
import Head from "@/components/Head.vue";
export default {
  name: "MyBuy",
  data() {
    return {
      userId: this.$getSessionStorage("user").userId,
      isZero: false,
      buyList: [],
      buyData: {},
      adderData: [],
      orderData: {},
      showPay: false,
      showBuyDetail: false,
      showEditAdder: false,
      showAddOrder: false,
      orderId: "",
      goodsId: "",
      adderId: "",
      active: 1,
      radio: 1,
      addForms: {
        userId: "",
        recName: "",
        recPhone: "",
        recAdder: ""
      },
      addRules: {
        recName: [
          { required: true, message: "请输入收货人姓名", trigger: "blur" }
        ],
        recPhone: [
          { required: true, message: "请输入联系方式", trigger: "blur" }
        ],
        recAdder: [
          { required: true, message: "请输入详细地址", trigger: "blur" }
        ]
      },
      pageNo: 1,
      pageSize: 5,
      total: 0
    };
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      this.$axios
        .post(
          "/secondhandWeb/orders/getBuyList",
          this.$qs.stringify({
            buyerId: this.userId,
            pageNo: this.pageNo,
            pageSize: this.pageSize
          })
        )
        .then(res => {
          if (res.data == null || res.data.length <= 0) this.isZero = true;
          else {
            this.isZero = false;
            this.buyList = res.data;
          }
        })
        .catch(e => {
          console.log(e);
        });

      this.$axios
        .post(
          "secondhandWeb/orders/getBuyCount",
          this.$qs.stringify({ buyerId: this.userId })
        )
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
          this.buyData = res.data;
        })
        .catch(e => {
          console.log(e);
        });
    },
    orderSubmit(orderId, goodsId) {
      this.showPay = true;
      this.orderId = orderId;
      this.goodsId = goodsId;
      this.$axios
        .post(
          "secondhandWeb/orders/getOrderData",
          this.$qs.stringify({ orderId })
        )
        .then(res => {
          this.orderData = res.data;
        })
        .catch(e => {
          this.$message.error("服务器内部发生异常");
          console.log(e);
        });
    },
    paySubmit() {
      this.$axios
        .post(
          "/secondhandWeb/orders/paySuccess",
          this.$qs.stringify({ orderId: this.orderId, goodsId: this.goodsId })
        )
        .then(res => {
          if (res.data > 0) {
            this.$message.success("支付成功");
            this.showPay = false;
          } else {
            // this.$message.error("");
            alert("商品已被他人购买！点击确认取消该订单");
            this.showPay = false;
            //取消订单
            this.$axios
              .post(
                "/secondhandWeb/orders/cancelOrder",
                this.$qs.stringify({
                  orderId: this.orderId,
                  goodsId: this.goodsId
                })
              )
              .then(res => {
                if (res.data > 0) {
                  this.$message.success("取消成功");
                  this.init();
                } else {
                  this.$message.error("取消失败");
                }
              })
              .catch(e => {
                console.log(e);
              });
          }
        })
        .catch(e => {
          console.log(e);
        });
    },
    payCancel() {
      this.$confirm("确认取消吗？请尽快完成支付，以免他人买下", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.showPay = false;
        })
        .catch(() => {});
    },
    cancelOrder(orderId, goodsId) {
      this.$confirm("确定取消订单吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$axios
            .post(
              "/secondhandWeb/orders/cancelOrder",
              this.$qs.stringify({ orderId, goodsId })
            )
            .then(res => {
              if (res.data > 0) {
                this.$message.success("取消成功");
                this.init();
              } else {
                this.$message.error("取消失败");
              }
            })
            .catch(e => {
              console.log(e);
            });
        })
        .catch(() => {});
    },
    deleteOrder(orderId) {
      this.$confirm("确定删除订单吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$axios
            .post(
              "/secondhandWeb/orders/deleteOrder",
              this.$qs.stringify({ orderId })
            )
            .then(res => {
              if (res > 0) {
                this.$message.error("删除失败");
              } else {
                this.$message.success("删除成功");
                this.init();
              }
            })
            .catch(e => {
              console.log(e);
            });
        })
        .catch(() => {});
    },
    editAdder(orderId, adderId) {
      this.orderId = orderId;
      // this.adderId = adderId;
      this.radio = adderId;
      this.showEditAdder = true;
      this.getAdderById();
    },
    getAdderById() {
      this.$axios
        .post(
          "/secondhandWeb/adderss/getAdderById",
          this.$qs.stringify({
            userId: this.userId
          })
        )
        .then(res => {
          this.adderData = res.data;
        })
        .catch(e => {
          console.log(e);
        });
    },
    adderSel(adderId) {
      this.adderId = adderId;
    },
    adderSubmit() {
      this.$axios
        .post(
          "/secondhandWeb/orders/editOrderAdder",
          this.$qs.stringify({
            orderId: this.orderId,
            adderId: this.adderId
          })
        )
        .then(res => {
          if (res.data > 0) {
            this.$message.success("修改地址成功");
            this.showEditAdder = false;
            this.init();
          } else this.$message.error("修改地址失败");
        })
        .catch(e => {
          console.log(e);
        });
    },
    adderCancel() {
      this.showEditAdder = false;
      this.init();
    },
    addAdder() {
      this.showAddOrder = true;
    },
    addSubmit(formName) {
      if (this.addForms.recName == "") {
        this.$message.error("收货人不能为空");
        return;
      }
      if (this.addForms.recPhone == "") {
        this.$message.error("联系电话不能为空");
        return;
      }
      if (this.addForms.recAdder == "") {
        this.$message.error("详细地址不能为空");
        return;
      }
      this.$axios
        .post(
          "/secondhandWeb/adderss/addAdder",
          this.$qs.stringify({
            userId: this.userId,
            recName: this.addForms.recName,
            recPhone: this.addForms.recPhone,
            recAdder: this.addForms.recAdder
          })
        )
        .then(res => {
          if (res > 0) {
            this.$message.error("添加失败");
          } else {
            this.$message.success("添加成功");
            this.showAddOrder = false;
            resetObject(this.addForms);
            this.getAdderById();
          }
        })
        .catch(e => {
          console.log(e);
        });
    },
    addCancel() {
      this.showAddOrder = false;
      resetObject(this.addForms);
      this.getAdderById();
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
.myBuy {
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
.adderSel {
  width: 700px;
  float: left;
  margin-left: 10%;
  text-align: left;
  margin-bottom: 15px;
}
.addAdder {
  border: none;
  font-size: 16px;
}
.orderTitle {
  margin-right: 16%;
}
.orderData {
  position: absolute;
  margin-top: 30px;
}
</style>