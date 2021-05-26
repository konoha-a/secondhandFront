<template>
  <div class="recAdder">
    <div class="title">
      <span>收货地址</span>
    </div>
    <div class="adderBody">
      <el-table class="adderItem" :data="adderData">
        <el-table-column prop="recName" label="收货人" width="120px" align="center"></el-table-column>
        <el-table-column prop="recPhone" label="联系电话" width="300px" align="center"></el-table-column>
        <el-table-column prop="recAdder" label="详细地址" width="400px" align="center"></el-table-column>
        <el-table-column fixed="right" width="145">
          <div slot-scope="scope">
            <el-button type="primary" size="small" @click="editItem(scope.row.adderId)">编辑</el-button>
            <el-button type="danger" size="small" @click="deleteItem(scope.row.adderId)">删除</el-button>
          </div>
        </el-table-column>
      </el-table>
      <el-button type="primary" class="addAdder" @click="addAdder" plain>+新增地址</el-button>
    </div>

    <!-- 新增地址 -->
    <el-dialog :visible.sync="showAddDialog">
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

    <!-- 编辑地址 -->
    <el-dialog :visible.sync="showEditDialog">
      <div style="margin-bottom:30px; font-size:18px">
        <span>编辑地址</span>
      </div>
      <el-form
        :model="editForms"
        :rules="editRules"
        ref="editForms"
        class="edit-forms"
        label-width="100px"
      >
        <el-form-item label="收货人" prop="recName">
          <el-input v-model="editForms.recName"></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="recPhone">
          <el-input v-model="editForms.recPhone"></el-input>
        </el-form-item>
        <el-form-item label="详细地址" prop="recAdder">
          <el-input v-model="editForms.recAdder"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="editCancel">取 消</el-button>
          <el-button type="primary" @click="editSubmit('editForms')">确认</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { resetObject } from "@/common.js";
import Head from "@/components/Head.vue";
export default {
  name: "RecAdder",
  data() {
    return {
      adderData: [],
      showAddDialog: false,
      showEditDialog: false,
      adderId: "",
      addForms: {
        userId: "",
        recName: "",
        recPhone: "",
        recAdder: ""
      },
      editForms: { userId: "", recName: "", recPhone: "", recAdder: "" },
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
      editRules: {
        recName: [
          { required: true, message: "请输入收货人姓名", trigger: "blur" }
        ],
        recPhone: [
          { required: true, message: "请输入联系方式", trigger: "blur" }
        ],
        recAdder: [
          { required: true, message: "请输入详细地址", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      this.userId = this.$getSessionStorage("user").userId;
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
            userId: this.$getSessionStorage("user").userId,
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
    deleteItem(adderId) {
      this.$confirm("确定删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$axios
            .post(
              "/secondhandWeb/adderss/deleteAdder",
              this.$qs.stringify({ adderId })
            )
            .then(res => {
              if (res == 1) {
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
    editItem(adderId) {
      this.showEditDialog = true;
      this.$axios
        .post(
          "/secondhandWeb/adderss/getAdderItem",
          this.$qs.stringify({ adderId })
        )
        .then(res => {
          this.editForms = res.data;
        })
        .catch(e => {
          console.log(e);
        });
    },
    editSubmit(formName) {
      if (this.editForms.recName == "") {
        this.$message.error("收货人不能为空");
        return;
      }
      if (this.editForms.recPhone == "") {
        this.$message.error("联系电话不能为空");
        return;
      }
      if (this.editForms.recAdder == "") {
        this.$message.error("详细地址不能为空");
        return;
      }

      this.$refs.editForms.validate(valid => {
        if (valid) {
        //   this.$message.success("字段验证通过，提交请求，成功后刷新分页");
          this.$axios
            .post(
              "/secondhandWeb/adderss/editAdder",
              this.$qs.stringify(this.editForms)
            )
            .then(res => {
              if (res > 0) {
                this.$message.error("操作失败");
              } else {
                this.$message.success("操作成功");
                //this.$emit("success"); //通知列表分页刷新
                this.showEditDialog = false;
                this.init();
              }
            })
            .catch(() => {});
        } else {
          this.$message.warning("请按照提示正确填写内容！");
          return false;
        }
      });
    },
    editCancel() {
      this.showEditDialog = false;
    }
  },
  components: {}
};
</script>

<style scoped>
.recAdder {
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
.adderBody {
  height: 100px;
  margin-top: 30px;
  border-top: 1px rgb(221, 221, 221) solid;
  /* background-color: rgba(177, 201, 247, 0.692); */
}
.adderItem {
  margin-bottom: 5px;
  margin-top: 5px;
  border-bottom: 1px rgb(221, 221, 221) solid;
}
.addAdder {
  font-size: 16px;
  width: 30%;
  border: none;
  margin-top: 20px;
}
</style>