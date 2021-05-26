<template>
  <div class="mySell">
    <div class="title">
      <span>我卖出的</span>
    </div>

    <!-- 卖出的商品订单列表 -->
    <div v-show="!isZero" class="SellBody">
      <el-row class="attentItem" :span="6" v-for="(item, index) in sellList" :key="index">
        <div class="buyTop">
          <el-image @click="toUserDetail(item.buyerId)" :src="item.userImage" class="sellerImage"></el-image>
          <span @click="toUserDetail(item.buyerId)" class="sellerName">{{item.userName}}</span>
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
            @click="toMessage(item.goodsId,item.buyerId)"
          >联系买家</el-link>
        </div>
        <el-image @click="toGoodsDetail(item.goodsId)" :src="item.goodsImage" class="goodsImage"></el-image>
        <span @click="toGoodsDetail(item.goodsId)" class="goodsName">{{item.goodsName}}</span>
        <span class="orderPrice">￥ {{item.orderPrice}}</span>
        <span class="goodsIntro">{{item.goodsIntroduct}}</span>
        <!-- 更多选项 -->
        <el-dropdown class="orderSelect" trigger="click" placement="right">
          <el-button icon="el-icon-more" circle></el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="sellDetail(item.orderId)">查看详情</el-dropdown-item>
            <el-dropdown-item v-if="item.orderState==1" @click.native="cancelOrder(item.orderId,item.goodsId)">取消订单</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <!-- 常规选项 -->
        <div class="orderSubmit">
          <el-button v-if="item.orderState==0" @click="deleteOrder(item.orderId)" round>删除订单</el-button>
          <el-button v-if="item.orderState==1" @click="editOrder(item.orderId,item.goodsId)" round>修改订单</el-button>
          <el-button v-if="item.orderState==2" @click="toDeliver(item.orderId)" round>立即发货</el-button>
          <!-- <el-button v-if="item.orderState==3" @click="confirmOrder" round>3</el-button> -->
          <el-button v-if="item.orderState==4" @click="deleteOrder(item.orderId)" round>删除订单</el-button>
        </div>
      </el-row>
    </div>

    <!-- 没有订单 -->
    <div v-show="isZero" class="zero">
      <span>您还没有卖出任何商品哦~</span>
    </div>

    <!-- 订单详情 -->
    <el-dialog :visible.sync="showSellDetail" width="500px">
      <el-steps :active="active" finish-status="success">
        <el-step title="拍下商品"></el-step>
        <el-step title="支付成功"></el-step>
        <el-step title="卖家发货"></el-step>
        <el-step title="确认收货"></el-step>
      </el-steps>
      <el-image class="goodsImage" @click="toGoodsDetail(sellData.goodsId)" :src="sellData.goodsImage"></el-image>
      <span class="goodsName">{{sellData.goodsName}}</span>
      <span style="float: right;margin-right: 10px;margin-top:25px">￥ {{sellData.orderPrice}}</span>
      <span class="goodsIntro" style="margin-left:20px">{{sellData.goodsIntroduct}}</span>
      <el-divider></el-divider>
      <div>
        <span class="one">商品价格</span>
        <span class="two">￥{{sellData.goodsPrice}}</span>
      </div>
      <br />
      <div>
        <span class="one">运费</span>
        <span class="two">￥{{sellData.goodsCar}}</span>
      </div>
      <br />
      <div>
        <span class="one" style="font-size:18px">实付款</span>
        <span class="two" style="font-size:18px;color:#ff7926">￥ {{sellData.orderPrice}}</span>
      </div>
      <div style="margin-bottom:45px;"></div>
      <hr style="background-color:rgb(200, 200, 200);border:none;height:1px" size="1px" />
      <span class="bbAdder">收货地址：{{sellData.recName}} {{sellData.recPhone}}</span>
      <span style="position:absolute;left:30px;margin-top:30px">{{sellData.recAdder}}</span>
      <div style="margin-bottom:75px;"></div>
      <hr style="background-color:rgb(200, 200, 200);border:none;height:1px" size="1px" />
      <span class="three">买家用户名：{{sellData.userName}}</span>
      <br />
      <br />
      <span class="three">订单创建时间：{{sellData.orderCreaT}}</span>
      <br />
      <br />
      <span class="three">订单支付时间：{{sellData.orderPayT}}</span>
      <div style="margin-bottom:20px"></div>
    </el-dialog>

    <!-- 修改订单 -->
    <el-dialog :visible.sync="showEditOrder">
      <div style="margin-bottom:30px; font-size:18px">
        <span>修改订单信息</span>
      </div>
      <hr style="background-color:rgb(200, 200, 200);border:none;height:1px" size="1px" />
      <span class="orderTitle">商品信息</span>
      <span class="orderTitle"></span>
      <span class="orderTitle">价格</span>
      <span class="orderTitle">运费</span>
      <span>总计</span><br>
      <hr style="background-color:rgb(200, 200, 200);border:none;height:1px" size="1px" />
      <el-image :src="orderData.goodsImage" style="width:70px;height:70px;position:absolute;left:10%"></el-image>
      <span class="orderData" style="left:25%;margin-top:25px">{{orderData.goodsName}}</span>
      <el-input class="orderData" style="left:46%;width:70px" v-model.number="orderData.goodsPrice"></el-input>
      <el-input class="orderData" style="left:65%;width:70px" v-model.number="orderData.goodsCar"></el-input>
      <span class="orderData" style="left:87%;margin-top:25px">{{orderData.goodsPrice+orderData.goodsCar}}</span><br>
      <div style="margin-bottom:60px;"></div>
      <hr style="background-color:rgb(200, 200, 200);border:none;height:1px" size="1px" />
      <el-button @click="priceCancel">取 消</el-button>
      <el-button type="primary" @click="priceSubmit">确认修改</el-button>
    </el-dialog>

    <!-- 立即发货 -->
    <el-dialog :visible.sync="showDeliver">
      <el-button @click="delCancel">取 消</el-button>
      <el-button type="primary" @click="delSubmit">确认发货</el-button>
    </el-dialog>
  </div>
</template>

<script>
import Head from "@/components/Head.vue";
export default {
  name: "MySell",
  data() {
    return {
      userId: this.$getSessionStorage("user").userId,
      orderId:"",
      goodsId:"",
      isZero: false,
      sellList:[],
      sellData: {},
      orderData:{},
      showSellDetail:false,
      showEditOrder:false,
      showDeliver:false,
      active:1,
    };
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      this.$axios
        .post(
          "/secondhandWeb/orders/getSellList",
          this.$qs.stringify({
            sellerId: this.userId
          })
        )
        .then(res => {
          if (res.data == undefined || res.data.length <= 0) this.isZero = true;
          else {
            this.isZero = false;
            this.sellList = res.data;
          }
        })
        .catch(e => {
          console.log(e);
        });
    },
    toGoodsDetail(goodsId) {
      this.$setSessionStorage("goodsId", goodsId);
      this.$router.push("/goodsDetail");
    },
    toUserDetail(buyerId) {
      this.$setSessionStorage("anUserId", buyerId);
      this.$router.push("userDetail");
    },
    sellDetail(orderId){
      this.showSellDetail = true;
      this.$axios
        .post(
          "/secondhandWeb/orders/getSellDetail",
          this.$qs.stringify({ orderId })
        )
        .then(res => {
          console.log(res.data);
          this.sellData = res.data;
        })
        .catch(e => {
          console.log(e);
        });
    },
    editOrder(orderId,goodsId){
      this.showEditOrder=true;
      this.orderId=orderId;
      this.goodsId=goodsId;
      this.getOrderData();
    },
    getOrderData(){
        this.$axios
          .post(
            "secondhandWeb/goods/getDetailById/" + this.goodsId,
            this.$qs.stringify({ goodsId: this.goodsId })
          )
          .then(res => {
            this.orderData = res.data;          
            this.orderPrice=this.orderData.goodsPrice+this.orderData.goodsCar;
          })
          .catch(e => {
            this.$message.error("服务器内部发生异常");
            console.log(e);
          });
    },
    priceSubmit(){
      this.$axios
        .post(
          "secondhandWeb/orders/editOrderPrice",
          this.$qs.stringify({ 
            orderId:this.orderId,
            orderPrice:this.orderData.goodsPrice+this.orderData.goodsCar,
            goodsId:this.goodsId,
            goodsPrice:this.orderData.goodsPrice,
            goodsCar:this.orderData.goodsCar
          })
        )
        .then(res => {
          if(res.data > 0){
            this.$message.success("修改成功");
            this.showEditOrder=false;
            this.init();
          }
          else
            this.$message.error("修改失败");
        })
        .catch(e => {
          this.$message.error("服务器内部发生异常");
          console.log(e);
        });
    },
    priceCancel(){
      this.showEditOrder=false;      
    },
    toDeliver(orderId){
      this.orderId=orderId;
      this.showDeliver=true;
    },
    delSubmit(){
      this.$axios
        .post(
          "/secondhandWeb/orders/deliverSuccess",
          this.$qs.stringify({
            orderId:this.orderId
          })
        )
        .then(res => {
          if(res.data > 0){
            this.$message.success("发货成功");
            this.showDeliver=false;
            this.init();
          }
          else this.$message.error("发货失败");
        })
        .catch(e => {
          console.log(e);
        });
    },
    delCancel(){
      this.showDeliver=false;
    }
  },
  components: {}
};
</script>

<style scoped>
.mySell {
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
.SellBody {
  height: 100px;
  margin-top: 30px;
  margin-bottom: 10px;
}
.zero {
  height: 100px;
  margin-top: 150px;
  font-size: 18px;
}
.attentItem {
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
.orderSelect {
  position: absolute;
  right: 10px;
  margin-top: 60px;
  size: small;
}
.orderSubmit {
  position: absolute;
  right: 60px;
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
.orderTitle{
  margin-right: 16%;
}
.orderData{
  position:absolute;
  margin-top:15px
}
</style>