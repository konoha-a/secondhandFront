<template>
  <div class="submitOrder">
    <Head></Head>
    <div class="box">
      <!-- 确认收货地址 -->
      <div class="adderInfo">
        <div class="adderTitle">
          <span>确认收货地址</span>
          <el-button type="text" class="recAdder" @click="recAdder">管理地址</el-button>
        </div>
        <div class="adderSelTitle">
          <i class="el-icon-location-information"></i>
          <span>寄送至</span>
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
        <el-button type="text" class="addAdder" @click="addAdder" plain>+新增地址</el-button>

        <!-- 新增地址 -->
        <el-dialog :visible.sync="showAddDialog">
          <div style="margin-bottom:30px; font-size:18px">
            <span>新增地址</span>
          </div>
          <el-form
            :model="addForms"
            :rules="addRules"
            ref="addForms"
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

      <!-- 确认订单信息 -->
      <div class="orderInfo">
        <div class="adderTitle">
          <span>确认订单信息</span>
        </div>
        <el-table :data="orderData">
          <el-table-column width="80px" align="center">
            <template slot-scope="scope">
              <el-image
                @click="toGoodsDetail(goodsId)"
                :src="scope.row.goodsImage"
                alt
                class="goodsImage"
              ></el-image>
            </template>
          </el-table-column>
          <el-table-column label="商品信息" prop="goodsName" width="100px" align="center"></el-table-column>
          <el-table-column prop="goodsIntroduct" width="250px"></el-table-column>
          <el-table-column label="卖家" prop="userName" align="center"></el-table-column>
          <el-table-column label="价格" prop="goodsPrice" align="center"></el-table-column>
          <el-table-column label="运费" prop="goodsCar" align="center"></el-table-column>
          <el-table-column label="总计" align="center">{{orderPrice}}</el-table-column>
        </el-table>
        <button class="orderSubmit" @click="orderSubmit">提交订单</button>
      </div>

      <!-- 支付 -->
      <el-dialog :visible.sync="showPay">
        <el-button @click="payCancel">取 消</el-button>
        <el-button type="primary" @click="paySubmit(orderId)">确认支付</el-button>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { resetObject } from "@/common.js";
import Head from "@/components/Head.vue";
export default {
  name: "SubmitOrder",
  data() {
    return {
      radio: 1,
      showAddDialog: false,
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
      adderData: [],
      user: [],
      goodsDetail: {},
      orderData: [],
      goodsImage: "",
      goodsName: "",
      goodsPrice: "",
      goodsIntroduct: "",
      userName: "",
      sellerId: "",
      goodsId: this.$getSessionStorage("goodsDetail").goodsId,
      userId: this.$getSessionStorage("user").userId,
      goodsCar: "",
      orderPrice: "",
      adderId: "",
      showPay: false,
      orderId: ""
    };
  },
  mounted() {},
  created() {
    this.init();
    this.orderData.push(this.$getSessionStorage("goodsDetail"));
    this.orderPrice =
      this.$getSessionStorage("goodsDetail").goodsPrice +
      this.$getSessionStorage("goodsDetail").goodsCar;
  },
  methods: {
    init() {
      this.$setSessionStorage("adderId", null);
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
      this.$setSessionStorage("adderId", adderId);
    },
    orderSubmit() {
      if (
        this.$getSessionStorage("adderId") == null ||
        this.$getSessionStorage("adderId") == "null"
      ) {
        this.$message.error("请选择地址");
        return;
      } else {
        this.$axios
          .post(
            "/secondhandWeb/orders/addOrder",
            this.$qs.stringify({
              goodsId: this.goodsId,
              buyerId: this.userId,
              adderId: this.$getSessionStorage("adderId"),
              orderPrice: this.orderPrice,
              orderState: 1
            })
          )
          .then(res => {
            if (res.data > 0) {
              this.$message.success("提交订单成功");
              this.showPay = true;
              this.orderId = res.data;
              this.$setSessionStorage("adderId", null);
            } else this.$message.error("提交订单失败");
          })
          .catch(e => {
            console.log(e);
          });
      }
    },
    addAdder() {
      this.showAddDialog = true;
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
            this.showAddDialog = false;
            resetObject(this.addForms);
            this.init();
          }
        })
        .catch(e => {
          console.log(e);
        });
    },
    addCancel() {
      this.showAddDialog = false;
      resetObject(this.addForms);
      this.init();
    },
    recAdder() {
      this.$router.push("recAdder");
    },
    toGoodsDetail(goodsId) {
      this.$setSessionStorage("goodsId", goodsId);
      this.$router.push("/goodsDetail");
    },
    paySubmit(orderId) {
      this.$axios
        .post(
          "/secondhandWeb/orders/paySuccess",
          this.$qs.stringify({ orderId, goodsId: this.goodsId })
        )
        .then(res => {
          if (res.data > 0) {
            this.$message.success("支付成功");
            this.showPay = false;
            this.$router.push("myBuy");
          } else {
            alert("商品已被他人购买！点击确认取消该订单");
            this.showPay=false;
            //取消订单
            this.$axios
            .post(
              "/secondhandWeb/orders/cancelOrder",
              this.$qs.stringify({ orderId, goodsId:this.goodsId })
            )
            .then(res => {
              if (res.data > 0) {
                this.$message.success("取消成功");
                this.init();
                this.$router.push("myBuy");
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
          this.$router.push("myBuy");
        })
        .catch(() => {});
    }
  },
  components: {
    Head
  }
};
</script>

<style scoped>
.box {
  position: absolute;
  top: 50px;
  margin-left: 12%;
  width: 76%;
}
.adderInfo {
  margin-top: 60px;
  border-radius: 2px;
}
.adderTitle {
  height: 30px;
  border-bottom: 2px rgb(221, 221, 221) solid;
}
.adderTitle span {
  float: left;
  font-weight: bold;
  color: rgb(75, 75, 75);
  font-size: 17px;
}
.adderSelTitle {
  position: absolute;
  margin-top: 5px;
  float: left;
  margin-left: 100px;
  color: #ff7c2a;
}
.adderSel {
  width: 700px;
  float: left;
  margin-left: 200px;
  margin-top: 8px;
  text-align: left;
}
.addAdder {
  position: absolute;
  border: none;
  font-size: 16px;
  float: right;
  right: 0;
  /* margin-left: 90px; */
}
.recAdder {
  border: none;
  float: right;
  color: rgb(75, 75, 75);
}
.orderInfo {
  margin-top: 150px;
  height: 100px;
}
.orderSubmit {
  cursor: pointer;
  position: relative;
  float: right;
  width: 170px;
  height: 40px;
  color: #fff;
  display: block;
  background: rgb(255, 164, 131);
  font-size: 18px;
  line-height: 35px;
  /* border-radius: 2px; */
  margin-left: 10px;
  text-align: center;
  border-color: rgb(255, 164, 131);
}
.goodsImage {
  cursor: pointer;
  width: 60px;
  height: 60px;
}
</style>