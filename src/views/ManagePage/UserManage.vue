<template>
  <div class="userManage">
    <div class="container">
      <div class="umSreachBox">
        <el-input
          placeholder="请输入用户名"
          v-model="searchParams.userName"
          class="umSearch"
          size="small"
          style="width:180px"
        ></el-input>
        <el-button type="success" size="small" @click="search" class="search">查询</el-button>
        <el-button type="warning" size="small" @click="reSet" class="reSet">重置</el-button>
      </div>
    </div>
    <el-table :data="userData" border style="width:100%">
      <el-table-column prop="userId" label="用户编号" width="148px" align="center"></el-table-column>
      <el-table-column prop="userName" label="用户名" width="160px" align="center"></el-table-column>
      <el-table-column prop="userImage" label="用户头像" width="200px" align="center">
        <template slot-scope="scope">
          <el-image style="width:130px" :src="scope.row.userImage"></el-image>
        </template>
      </el-table-column>
      <el-table-column prop="userSex" label="用户性别" width="150px" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.userSex==1">男</span>
          <span v-else>女</span>
        </template>
      </el-table-column>
      <el-table-column prop="userPhone" label="用户电话" width="200px" align="center"></el-table-column>
      <el-table-column prop="userEmail" label="用户邮箱" width="200px" align="center"></el-table-column>
      <el-table-column prop="userAdder" label="用户地址" width="250px" align="center"></el-table-column>
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
import {resetObject} from "@/common.js"
export default {
  name: "UserManage",
  data() {
    return {
      searchParams:{userName:""},
      // input:[],
      userData: [],
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
      .post("secondhandWeb/user/getUserList", this.$qs.stringify({pageNo:this.pageNo,pageSize:this.pageSize}))
      .then(res => {
        this.userData = res.data;
      })
      .catch(e => {
        this.$message.error("服务器内部发生异常");
        console.log(e);
      })
      
      this.$axios
      .get("secondhandWeb/user/getUserCount", this.$qs.stringify())
      .then(res => {
        this.total = res.data;
      })
      .catch(e => {
        this.$message.error("服务器内部发生异常");
        console.log(e);
      })
    },
    search(){
      this.$axios
      .post("secondhandWeb/user/findUserByName", this.$qs.stringify({userName:this.searchParams.userName}))
      .then(res => {
        this.userData = res.data;
      })
      .catch(e => {
        this.$message.error("服务器内部发生异常");
        console.log(e);
      });
    },
    reSet(){
      resetObject(this.searchParams);
      this.refresh();
    },
    refresh(){
      this.initData();
    },
    changePage(val){
      this.pageNo=val;//改变当前页码
      this.initData();//根据新的页码选取分页数据
    },
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
.umSreachBox {
  /* margin-bottom: 20px; */
  margin-right: 0;
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