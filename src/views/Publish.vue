<template>
  <div>
    <Head></Head>

    <div class="addBody">
      <el-form ref="addForm" :model="addForm" :rules="addRul">
        <!-- 添加照片 -->
        <el-form-item class="addPicBox" prop="goodsImage">
          <div class="addPic">
            <el-upload
              action="https://jsonplaceholder.typicode.com/posts/"
              list-type="picture-card"
              :on-preview="handlePictureCardPreview"
              :on-remove="handleRemove"
              :on-change="toBase64"
              :on-exceed="handleExceed"
              :limit="8"
            >
              <i class="el-icon-plus"></i>
            </el-upload>
            <el-dialog :visible.sync="dialogVisible">
              <img width="100%" :src="dialogImageUrl" alt />
            </el-dialog>
          </div>
        </el-form-item>
        <!-- 文字信息 -->
        <div class="wordInt">
          <el-form-item label="商品名称" prop="goodsName" label-width="80px">
            <el-input v-model="addForm.goodsName"></el-input>
          </el-form-item>
          <el-form-item label="商品介绍" prop="goodsIntroduct" label-width="80px">
            <el-input
              type="textarea"
              :rows="4"
              v-model="addForm.goodsIntroduct"
              placeholder="说说你的使用感受，入手渠道，转手原因......"
            ></el-input>
          </el-form-item>
          <el-form-item label="分类" prop="goodsClass" label-width="80px">
            <el-select v-model="addForm.goodsClass" placeholder="请选择商品分类">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="成色" prop="goodsOldNew" label-width="80px">
            <el-input v-model="addForm.goodsOldNew" placeholder="默认10成新"></el-input>
          </el-form-item>
          <el-form-item label="价格" prop="goodsPrice" label-width="80px">
            <el-input v-model="addForm.goodsPrice"></el-input>
          </el-form-item>
          <el-form-item label="运费" prop="goodsCar" label-width="80px">
            <el-input v-model="addForm.goodsCar"></el-input>
          </el-form-item>
          <el-form-item label-width="80px">
            <el-button type="primary" @click="submitForm('addForm')">发布商品</el-button>
            <el-button @click="reSet">重置</el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
  </div>
</template>
  
<script>
import { resetObject } from "@/common.js";
import Head from "@/components/Head.vue";
export default {
  name: "Publish",
  data() {
    return {
      userId: this.$getSessionStorage("user").userId,
      value1: [],
      dialogImageUrl: "",
      dialogVisible: false,
      addParams: "",
      addForm: {
        goodsName: "",
        goodsIntroduct: "",
        goodsClass: "",
        goodsOldNew: "",
        goodsPrice: "",
        goodsImage: "",
        goodsCar: ""
      },
      addRul: {
        goodsName: [
          { required: true, message: "请输入商品名称", trigger: "blur" }
        ],
        goodsClass: [
          { required: true, message: "请说明商品分类", trigger: "blur" }
        ],
        goodsPrice: [
          { required: true, message: "请输入商品价格", trigger: "blur" }
        ]
        // goodsPrice:[Required,Float2]
      },
      options: [
        {
          value: "书籍",
          label: "书籍"
        },
        {
          value: "学习用品",
          label: "学习用品"
        },
        {
          value: "食品",
          label: "食品"
        },
        {
          value: "电子产品",
          label: "电子产品"
        },
        {
          value: "体育用品",
          label: "体育用品"
        },
        {
          value: "生活用品",
          label: "生活用品"
        }
      ]
    };
  },
  methods: {    
    submitForm(formName) {
      if (this.addForm.goodsName == "") {
        this.$message.error("商品名称不能为空");
        return;
      }
      if (this.addForm.goodsClass == "") {
        this.$message.error("商品分类不能为空");
        return;
      }
      if (this.addForm.goodsPrice == "") {
        this.$message.error("商品价格不能为空");
        return;
      }

      //发布商品
      this.$axios
        .post(
          "/secondhandWeb/goods/addGoods",
          this.$qs.stringify({
            sellerId: this.userId,
            goodsName: this.addForm.goodsName,
            goodsImage: this.addForm.goodsImage,
            goodsOldNew: this.addForm.goodsOldNew,
            goodsIntroduct: this.addForm.goodsIntroduct,
            goodsPrice: this.addForm.goodsPrice,
            goodsClass: this.addForm.goodsClass,
            goodsCar: this.addForm.goodsCar
          })
        )
        .then(res => {
          if (res.data > 0) {
            // this.$message.success("发布成功");
            alert("发布成功，点击确认跳转页面");
            this.$axios
              .post(
                "secondhandWeb/goods/getDetailById/" + res.data,
                this.$qs.stringify({ goodsId: res.data })
              )
              .then(res => {
                this.$setSessionStorage("goodsDetail", res.data);
                this.$router.push("/goodsDetail");
              })
              .catch(e => {
                this.$message.error("服务器内部发生异常");
                console.log(e);
              });
          } else {
            this.$message.error("发布失败");
          }
        })
        .catch(e => {
          this.$message.error("服务器内部发生异常");
          console.log(e);
        });
    },
    reSet() {
      resetObject(this.addForm);
      location.reload();
    },
    toBase64(file) {
      var This = this;
      var reader = new FileReader();
      reader.readAsDataURL(file.raw);
      reader.onload = function() {
        this.result; //base64编码
        This.addForm.goodsImage=this.result;
        This.dialogImageUrl = this.result;
      };
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handleExceed(files, fileList) {
        this.$message.warning(`最多选择 8 个文件`);
      },
  },
  created() {
  },
  components: {
    Head
  }
};
</script>

<style scoped>
.top_bar {
  position: absolute;
  top: 48px;
  left: 0;
  right: 0;
  height: 70px;
  width: 100%;
  background-color: #ffac7a;
}
.addBody {
  position: absolute;
  margin-top: 170px;
  /* margin-left: 45%; */
  /* float: left; */
  height: 530px;
  width: 99%;
  border: 1px #dcdfe6;
  /* background-color: violet; */
}
.addPicBox {
  /* display:inline-block; */
  /* margin-top: 30px; */
  position: absolute;
  /* margin-left: 5%; */
  /* float: left; */
  left: 10%;
  height: 480px;
  width: 32%;
  /* width: 480px; */
  border: 1px solid #dcdfe6;
  border-radius: 4px;
}
.addPic {
  /* margin-top: 10px; */
  /* position: absolute; */
  height: 460px;
  width: 480px;
  text-align: left;
  /* left: 0; */
  /* margin-left: 10px; */
}
.wordInt {
  /* position: relative; */
  margin-left: 48%;
  float: left;
  width: 40%;
  /* margin-top: 30px; */
}
.el-select {
  display: inherit;
}
</style>