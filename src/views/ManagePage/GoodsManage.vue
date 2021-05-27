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
        <el-button type="warning" size="small" @click="reSet" class="reSet">重置</el-button>
      </div>
    </div>
    <el-table :data="goodsData" border style="width:100%">
      <el-table-column prop="goodsId" label="商品编号" width="100px" align="center"></el-table-column>
      <el-table-column prop="goodsName" label="商品名称" width="120px" align="center"></el-table-column>
      <el-table-column prop="goodsImage" label="商品图片" width="110px" align="center">
        <template slot-scope="scope">
          <el-image style="width:80px;height:80px" :src="scope.row.goodsImage"></el-image>
        </template>
      </el-table-column>
      <el-table-column prop="sellerId" label="卖家编号" width="100px" align="center"></el-table-column>
      <el-table-column prop="goodsOldNew" label="商品成色" width="80px" align="center"></el-table-column>
      <el-table-column prop="goodsIntroduct" label="商品介绍" width="230px" align="center"></el-table-column>
      <el-table-column prop="goodsPrice" label="价格" width="80px" align="center"></el-table-column>
      <el-table-column prop="goodsCar" label="运费" width="80px" align="center"></el-table-column>
      <el-table-column prop="goodsClass" label="类别" width="98px" align="center"></el-table-column>
      <el-table-column prop="goodsFavorite" label="收藏人数" width="80px" align="center"></el-table-column>
      <el-table-column prop="isSell" label="是否卖出" width="80px" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.isSell==0">否</span>
          <span v-else>是</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="150px">
        <div slot-scope="scope">
          <el-button type="primary" size="small" @click="editItem" disabled>编辑</el-button>
          <el-button
            type="danger"
            size="small"
            @click="removeItem(scope.row.goodsId,scope.row.sellerId,scope.row.goodsName)"
          >删除</el-button>
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
      managerId: this.$getSessionStorage("manager").managerId,
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
          "secondhandWeb/goods/getGoodsListMa",
          this.$qs.stringify({ pageNo: this.pageNo, pageSize: this.pageSize })
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
    changePage(val) {
      this.pageNo = val; //改变当前页码
      this.initData(); //根据新的页码选取分页数据
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
    reSet() {
      resetObject(this.searchParams);
      this.initData();
    },
    removeItem(goodsId, sellerId,goodsName) {
      this.$confirm("确定删除并向该用户发出商品违规信息吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$axios
            .post(
              "secondhandWeb/goods/deleteTGoods",
              this.$qs.stringify({ goodsId })
            )
            .then(res => {
              if (res.data == 1) {
                this.$message.success("删除成功");
                this.initData();
                this.addGoodsSymess(goodsId,sellerId,goodsName);
              } else {
                this.$message.error("删除失败");
              }
            })
            .catch(e => {
              this.$message.error("服务器内部发生异常");
              console.log(e);
            });
        })
        .catch(() => {});
    },
    addGoodsSymess(goodsId, sellerId,goodsName) {
      this.$axios
        .post(
          "secondhandWeb/symess/addGoodsSymess",
          this.$qs.stringify({
            managerId: this.managerId,
            userId: sellerId,
            goodsId: goodsId,
            goodsName: goodsName
          })
        )
        .then(res => {
          if(res.data>0) this.$message.success("系统消息发布成功");
          else this.$message.error("系统消息发布失败");
        })
        .catch(e => {
          this.$message.error("服务器内部发生异常");
          console.log(e);
        });
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