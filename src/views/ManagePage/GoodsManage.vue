<template>
  <div class="goodsManage">
    <div class="container">
      <div>
        <el-input
          placeholder="请输入商品名称"
          v-model="searchParams.goodsName"
          class="umSearch"
          size="small"
          style="width:180px"
        ></el-input>
        <el-button type="success" size="small" @click="search" class="search">查询</el-button>
        <el-button type="warning" size="small" @click="reSearch" class="reSet">重置</el-button>
      </div>
    </div>
    <el-table :data="goodsData" border style="width:100%">
      <el-table-column prop="goodsId" label="商品编号" width="80px" align="center"></el-table-column>
      <el-table-column prop="goodsName" label="商品名称" width="140px" align="center"></el-table-column>
      <el-table-column prop="goodsImage" label="商品图片" width="140px" align="center">
        <template slot-scope="scope">
          <el-image style="width:130px" :src="scope.row.goodsImage"></el-image>
        </template>
      </el-table-column>
      <el-table-column prop="sellerId" label="卖家编号" width="100px" align="center"></el-table-column>
      <el-table-column prop="goodsOldNew" label="商品成色" width="80px" align="center"></el-table-column>
      <el-table-column prop="goodsIntroduct" label="商品介绍" width="230px" align="center"></el-table-column>
      <el-table-column prop="goodsPrice" label="价格" width="100px" align="center"></el-table-column>
      <el-table-column prop="goodsClass" label="类别" width="100px" align="center"></el-table-column>
      <el-table-column prop="goodsNum" label="商品数量" width="80px" align="center"></el-table-column>
      <el-table-column prop="goodsFavorite" label="商品收藏量" width="100px" align="center"></el-table-column>
      <el-table-column fixed="right" label="操作" width="145">
        <div slot-scope="scope">
          <el-button type="primary" size="small" @click="editItem" disabled>编辑</el-button>
          <el-button type="danger" size="small" @click="removeItem(scope.row.goodsId)">删除</el-button>
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
  </div>
</template>

<script>
import { resetObject } from "@/common.js";
export default {
  name: "GoodsManage",
  data() {
    return {
      searchParams: { goodsName: "" },
      goodsData: [],
      pageNo: 1, //默认当前页码第1页
      pageSize: 10, //每页显示10条
      total: 0 //总条数
    };
  },
  created() {
    this.initData();
  },
  methods: {
    initData() {
      this.$axios
        .post(
          "secondhandWeb/goods/getGoodsList",
          this.$qs.stringify({ pageNo: this.pageNo, pageSize:this.pageSize })
        )
        .then(res => {
          this.goodsData = res.data;
        })
        .catch(e => {
          this.$message.error("服务器内部发生异常");
          console.log(e);
        });

      this.$axios
        .get("secondhandWeb/goods/getGoodsCountMa", this.$qs.stringify())
        .then(res => {
          this.total = res.data;
        })
        .catch(e => {
          this.$message.error("服务器内部发生异常");
          console.log(e);
        });
    },
    search() {
      this.$axios
        .post(
          "secondhandWeb/goods/findGoodsByName",
          this.$qs.stringify({ goodsName: this.searchParams.goodsName })
        )
        .then(res => {
          this.goodsData = res.data;
        })
        .catch(e => {
          this.$message.error("服务器内部发生异常");
          console.log(e);
        });
    },
    reSearch() {
      // resetObject(this.searchParams);
      this.refresh();
    },
    refresh() {
      this.initData();
    },
    changePage(val) {
      this.pageNo = val; //改变当前页码
      this.initData(); //根据新的页码选取分页数据
    },
    removeItem(goodsId) {
      this.$confirm("确定删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          console.log(goodsId);
          this.$axios
            .post("secondhandWeb/goods/deleteTGoods",this.$qs.stringify({ goodsId }))
            .then(res => {
              // this.goodsData = res.data;
              if (res == 1) {
                this.$message.error("删除失败");
              }else{
                this.$message.success("删除成功");
                this.refresh();
              }
            })
            .catch(e => {
              this.$message.error("服务器内部发生异常");
              console.log(e);
            });
        })
        .catch(()=>{});
        
    }
  }
};
</script>

<style scoped>
.container {
  padding: 20px;
  background: #fff;
  border: 1px solid #ddd;
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