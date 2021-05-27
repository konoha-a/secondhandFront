<template>
  <div class="messManage">
    <div class="container">
      <div class="umSreachBox">
        <el-button type="primary" size="small" @click="addSymess" class="submit">发布系统消息</el-button>
      </div>
    </div>
    <el-table :data="symessData" border style="width:100%">
      <el-table-column prop="symessId" label="系统消息编号" width="110px" align="center"></el-table-column>
      <el-table-column prop="managerId" label="管理员编号" width="100px" align="center"></el-table-column>
      <el-table-column prop="symessName" label="消息名称" width="100px" align="center"></el-table-column>
      <el-table-column prop="symessCont" label="消息内容" width="218px" align="center"></el-table-column>
      <el-table-column prop="isGoods" label="是否面向全体用户" width="100px" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.isGoods==0">否</span>
          <span v-else>是</span>
        </template>
      </el-table-column>
      <el-table-column prop="userId" label="用户编号" width="100px" align="center"></el-table-column>
      <el-table-column prop="goodsId" label="商品编号" width="100px" align="center"></el-table-column>
      <el-table-column prop="goodsName" label="商品名称" width="120px" align="center"></el-table-column>
      <el-table-column prop="symessT" label="发布时间" width="160px" align="center"></el-table-column>
      <el-table-column prop="symessWhy" label="发布原因" width="100px" align="center"></el-table-column>
      <el-table-column prop="symessImp" label="发布影响" width="100px" align="center"></el-table-column>
      <el-table-column fixed="right" label="操作" width="150px">
        <div slot-scope="scope">
          <el-button type="primary" size="small" @click="editItem" disabled>编辑</el-button>
          <el-button type="danger" size="small" @click="removeItem(scope.row.symessId)">删除</el-button>
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

    <!-- 新增消息 -->
    <el-dialog :visible.sync="showAddSymess">
      <div style="margin-bottom:30px; font-size:18px">
        <span>发布系统消息</span>
      </div>
      <el-form
        :model="addForms"
        :rules="addRules"
        ref="addForms"
        class="add-forms"
        label-width="100px"
      >
        <el-form-item label="消息名称" prop="symessName">
          <el-input v-model="addForms.symessName"></el-input>
        </el-form-item>
        <el-form-item label="消息内容" prop="symessCont">
          <el-input type="textarea" :rows="4" v-model="addForms.symessCont"></el-input>
        </el-form-item>
        <el-form-item style="float:center">
          <el-button @click="addCancel">取 消</el-button>
          <el-button type="primary" @click="addSubmit('addForms')">发布</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { resetObject } from "@/common.js";
export default {
  name: "MessManage",
  data() {
    return {
      symessData: [],
      showAddSymess: false,
      managerId: this.$getSessionStorage("manager").managerId,
      addForms: {
        symessName: "",
        symessCont: ""
      },
      addRules: {
        symessName: [
          { required: true, message: "请输入消息名称", trigger: "blur" }
        ],
        symessCont: [
          { required: true, message: "请输入消息内容", trigger: "blur" }
        ]
      },
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
          "secondhandWeb/symess/getSymessListMa",
          this.$qs.stringify({ pageNo: this.pageNo, pageSize: this.pageSize })
        )
        .then(res => {
          this.symessData = res.data;
        })
        .catch(e => {
          this.$message.error("服务器内部发生异常");
          console.log(e);
        });

      this.$axios
        .get("secondhandWeb/symess/getSymessCount", this.$qs.stringify())
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
    addSymess() {
      this.showAddSymess = true;
    },
    addSubmit(formName) {
      if (this.addForms.symessName == "") {
        this.$message.error("消息名称不能为空");
        return;
      }
      if (this.addForms.symessCont == "") {
        this.$message.error("消息内容不能为空");
        return;
      }

      this.$axios
        .post(
          "secondhandWeb/symess/addSymess",
          this.$qs.stringify({
            managerId: this.managerId,
            symessName: this.addForms.symessName,
            symessCont: this.addForms.symessCont
          })
        )
        .then(res => {
          if (res.data > 0) {
            this.$message.success("系统消息发布成功");
            (this.showAddSymess = false), resetObject(this.addForms);
            this.initData();
          } else this.$message.error("系统消息发布失败");
        })
        .catch(e => {
          this.$message.error("服务器内部发生异常");
          console.log(e);
        });
    },
    addCancel() {
      this.showAddSymess = false;
      resetObject(this.addForms);
      this.initData();
    },
    removeItem(symessId) {
      this.$confirm("确定删除吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$axios
            .post(
              "secondhandWeb/symess/deleteSymess",
              this.$qs.stringify({ symessId })
            )
            .then(res => {
              if (res.data > 0) {
                this.$message.success("删除成功");
                this.initData();
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
.umSreachBox {
  margin-right: 0;
}
.el-button.submit {
  position: absolute;
  right: 30px;
}
</style>