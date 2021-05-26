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
      <el-table-column prop="goodsId" label="商品编号" width="100px" align="center"></el-table-column>
      <el-table-column prop="goodsName" label="商品名称" width="140px" align="center"></el-table-column>
      <el-table-column prop="goodsImage" label="商品图片" width="140px" align="center">
        <template slot-scope="scope">
          <el-image style="width:130px" :src="scope.row.goodsImage"></el-image>
        </template>
      </el-table-column>
      <el-table-column prop="goodsPrice" label="商品价格" width="100px" align="center"></el-table-column>
      <el-table-column prop="orderState" label="订单状态" width="130px" align="center"></el-table-column>
      <el-table-column prop="orderPrice" label="订单价格" width="150px" align="center"></el-table-column>
      <el-table-column prop="buyerId" label="买家编号" width="140px" align="center"></el-table-column>
      <el-table-column prop="sellerId" label="卖家编号" width="140px" align="center"></el-table-column>
      <el-table-column fixed="right" label="操作" width="145">
        <div slot-scope="scope">
          <el-button type="primary" size="small" @click="editItem(scope.row.orderId)">编辑</el-button>
          <el-button type="danger" size="small" @click="removeItem" disabled>删除</el-button>
        </div>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      :page-size="pageSize"
      layout="prev,pager,next"
      :total="total"
      @current-change="changePage"
      style="margin-bottom:50px; margin-top:20px"
    ></el-pagination>
    <!-- <Edit :showEditDialog="showEditDialog" @close="showEditDialog=false" @success="refresh()"/> -->
    <el-dialog
      @opened="openDialog"
      :width="dialogWidth"
      :title="title"
      :visible.sync="showEditDialog"
      :show-close="false"
      :close-on-click-modal="false"
    >
      <el-form
        :model="editForms"
        :rules="rules"
        ref="editForms"
        class="edit-forms"
        label-position="left"
        :label-width="labelWidth"
      >
      <el-form-item label="原价" prop="bookformerprice">
        <el-input v-model="editForms.bookformerprice"></el-input>
      </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
      <el-button @click="$emit('close')">取 消</el-button>
      <el-button type="primary" @click="submit">确认</el-button>
    </div>
    </el-dialog>
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
      editOrderId: null,
      showEditDialog: false,
      editForms:{
        bookformerprice:"",
      }
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
          this.$qs.stringify({ pageNo: this.pageNo,pageSize:this.pageSize })
        )
        .then(res => {
          this.orderData = res.data;
          // console.log(res.data[0]);
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
      this.refresh();
    },
    refresh() {
      this.initData();
    },
    
    editItem(orderId) {

      this.editOrderId = orderId;
      this.showEditDialog=true;
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