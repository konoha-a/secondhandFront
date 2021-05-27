<template>
  <div class="orderManage">
    <div class="container">
      <div>
        <el-input
          placeholder="请输入订单编号"
          v-model="searchParams.orderId"
          class="umSearch"
          size="small"
          style="width:180px"
        ></el-input>
        <el-button type="success" size="small" @click="search" class="search">查询</el-button>
        <el-button type="warning" size="small" @click="reSearch" class="reSet">重置</el-button>
      </div>
    </div>
    <el-table :data="orderData" border style="width:100%">
      <el-table-column prop="orderId" label="订单编号" width="100px" align="center"></el-table-column>
      <el-table-column prop="buyerId" label="买家编号" width="100px" align="center"></el-table-column>
      <el-table-column prop="sellerId" label="卖家编号" width="100px" align="center"></el-table-column>
      <el-table-column prop="goodsName" label="商品名称" width="120px" align="center"></el-table-column>
      <el-table-column prop="goodsImage" label="商品图片" width="110px" align="center">
        <template slot-scope="scope">
          <el-image style="width:80px;height:80px" :src="scope.row.goodsImage"></el-image>
        </template>
      </el-table-column>
      <el-table-column prop="goodsPrice" label="商品价格" width="80px" align="center"></el-table-column>
      <el-table-column prop="goodsCar" label="商品运费" width="80px" align="center"></el-table-column>
      <el-table-column prop="orderPrice" label="订单价格" width="80px" align="center"></el-table-column>
      <el-table-column prop="orderState" label="订单状态" width="110px" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.orderState==0">订单已取消</span>
          <span v-else-if="scope.row.orderState==1">等待买家支付</span>
          <span v-else-if="scope.row.orderState==2">等待卖家发货</span>
          <span v-else-if="scope.row.orderState==3">卖家已发货</span>
          <span v-else>交易成功</span>
        </template>
      </el-table-column>
      <el-table-column prop="recName" label="收货人" width="100px" align="center"></el-table-column>
      <el-table-column prop="recAdder" label="收货地址" width="150px" align="center"></el-table-column>
      <el-table-column prop="recPhone" label="收货人电话" width="130px" align="center"></el-table-column>
      <el-table-column prop="orderCreaT" label="订单创建时间" width="160px" align="center"></el-table-column>
      <el-table-column prop="orderPayT" label="订单支付时间" width="160px" align="center"></el-table-column>
      <el-table-column prop="orderDelT" label="订单发货时间" width="160px" align="center"></el-table-column>
      <el-table-column prop="orderConfT" label="订单确认时间" width="160px" align="center"></el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      background
      :page-size="pageSize"
      layout="prev,pager,next"
      :total="total"
      @current-change="changePage"
      style="margin-bottom:50px; margin-top:20px"
    ></el-pagination>
  </div>
</template>

<script>
import { resetObject } from "@/common.js";
export default {
  name: "OrderManage",
  data() {
    return {
      searchParams: { orderId: "" },
      orderData: [],
      pageNo: 1, //默认当前页码第1页
      pageSize: 10, //每页显示10条
      total: 0, //总条数
    };
  },
  created() {
    this.initData();
  },
  methods: {
    initData() {
      this.$axios
        .post(
          "secondhandWeb/orders/getOrderList",
          this.$qs.stringify({ pageNo: this.pageNo, pageSize: this.pageSize })
        )
        .then(res => {
          this.orderData = res.data;
        })
        .catch(e => {
          this.$message.error("服务器内部发生异常");
          console.log(e);
        });

      this.$axios
        .get("secondhandWeb/orders/getOrderCount", this.$qs.stringify())
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
      this.initData(); //根据新的页码选取分页数据
    },
    search() {
      this.$axios
        .post(
          "secondhandWeb/orders/findOrderById",
          this.$qs.stringify({ orderId: this.searchParams.orderId })
        )
        .then(res => {
          this.orderData = res.data;
        })
        .catch(e => {
          this.$message.error("服务器内部发生异常");
          console.log(e);
        });
    },
    reSearch() {
      resetObject(this.searchParams);
      this.initData();
    }
  }
};
</script>

<style scoped>
.container {
  /* position: absolute; */
  padding: 20px;
  background: #fff;
  border: 1px solid #ddd;
  /* border-radius: 5px; */
  /* width: 1000px; */
  height: 25px;
}
.umSearch {
  position: absolute;
  right: 145px;
}
.el-button.search {
  position: absolute;
  right: 80px;
}
.el-button.reSet {
  position: absolute;
  right: 15px;
}
</style>