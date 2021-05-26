<template>
  <div>
    <Head></Head>

    <div class="deBody">
      <!-- 商品图片 -->
      <div class="leftImageBox">
        <el-carousel class="bigImage" height="350px">
          <el-carousel-item v-for="item in 4" :key="item">
            <img :src="goodsDetail.goodsImage" class="goodsImage" />
          </el-carousel-item>
        </el-carousel>
        <div class="goodsFavo">
          <span>{{goodsFavo}}人收藏</span>
        </div>
      </div>
      <!-- 商品信息 -->
      <el-button
        v-show="!showAttent"
        @click="deleteGoods"
        type="text"
        style="position:absolute;margin-left:13%;color:red"
      >删除商品</el-button>
      <el-button
        v-show="!showAttent"
        @click="editGoods"
        type="text"
        style="position:absolute;margin-left:18%"
      >编辑商品</el-button>
      <div class="midWordBox">
        <div class="goodsName">
          <span>{{goodsDetail.goodsName}}</span>
        </div>
        <div>
          <span class="goodsPrice">￥ {{goodsDetail.goodsPrice}}</span>
          <span style="margin-left:15px;color:rgb(180, 180, 180)">运费:￥{{goodsDetail.goodsCar}}</span>
        </div>
        <div class="oldNew">
          <span>成色：{{goodsDetail.goodsOldNew}}成新</span>
        </div>
        <div class="introduct">简介：{{goodsDetail.goodsIntroduct}}</div>
        <el-button v-if="!isSell" type="warning" class="toOrder" @click="toOrder" plain>立即购买</el-button>
        <div v-if="!isSell" class="addToFavo">
          <el-button v-if="!isFavo" type="danger" @click="addToFavo">加入收藏</el-button>
          <el-button v-else type="danger" @click="cancelFavo" plain>取消收藏</el-button>
        </div>
      </div>
      <!-- 卖家信息 -->
      <div class="rightBox">
        <div class="sellerName">
          <span
            style="cursor: pointer;"
            @click="toUserDetail(goodsDetail.sellerId)"
          >卖家：{{goodsDetail.userName}}</span>
          <button
            v-show="showAttent"
            v-if="!isAttent"
            class="addAttent"
            @click="addAttent(sellerId)"
          >+关注</button>
          <button
            v-show="showAttent"
            v-else
            class="cancelAttent"
            @click="cancelAttent(sellerId)"
          >已关注</button>
          <div v-show="!showAttent" style="width:70px"></div>
        </div>

        <div class="sellerSchool">
          <span>所在院校：{{goodsDetail.userSchool}}</span>
        </div>
        <div class="goodsMessage">
          <span>联系：</span>
          <button class="toMessage" @click="toMessage(goodsId,goodsDetail.sellerId)">点我私聊</button>
        </div>
        <div class="attentCount">
          <span>关注：{{goodsDetail.attentCount}}</span>
        </div>
        <div class="fansCount">
          <span>粉丝：{{goodsDetail.fansCount}}</span>
        </div>
      </div>
    </div>

    <!-- 编辑商品 -->
    <el-dialog :visible.sync="showEditGoods" width="500px">
      <el-form
        :model="editForms"
        :rules="editRules"
        ref="editForms"
        class="edit-forms"
        label-width="100px"
      >
        <el-form-item label="商品图片" prop="goodsImage">
          <el-upload class="avatar-uploader" :show-file-list="false" :on-change="toBase64">
            <img v-if="imageUrl" :src="imageUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="商品名称" prop="goodsName">
          <el-input v-model="editForms.goodsName"></el-input>
        </el-form-item>
        <el-form-item label="商品价格" prop="goodsPrice">
          <el-input v-model="editForms.goodsPrice"></el-input>
        </el-form-item>
        <el-form-item label="商品运费" prop="goodsCar">
          <el-input v-model="editForms.goodsCar"></el-input>
        </el-form-item>
        <el-form-item label="商品分类" prop="goodsClass">
          <el-select v-model="editForms.goodsClass" style="width:100%">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品成色" prop="goodsOldNew">
          <el-input v-model="editForms.goodsOldNew"></el-input>
        </el-form-item>
        <el-form-item label="商品介绍" prop="goodsIntroduct">
          <el-input
            type="textarea"
            :rows="4"
            v-model="editForms.goodsIntroduct"
            placeholder="说说你的使用感受，入手渠道，转手原因......"
          ></el-input>
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
import Head from "@/components/Head.vue";
export default {
  name: "GoodsDetail",
  data() {
    return {
      showAttent: true,
      showEditGoods: false,
      isFavo: false,
      isAttent: false,
      isSell: false,
      user: this.$getSessionStorage("user"),
      goodsId: this.$getSessionStorage("goodsId"),
      userId: this.$getSessionStorage("user").userId,
      sellerId: "",
      goodsDetail: {},
      goodsImage:
        "https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png",
      goodsFavo: "",
      userImage: "",
      sellerSchool: "",
      imageUrl: "",
      editForms: {
        goodsImage: "",
        goodsName: "",
        goodsPrice: "",
        goodsCar: "",
        goodsClass: "",
        goodsOldNew: "",
        goodsIntroduct: ""
      },
      editRules: {
        goodsName: [
          { required: true, message: "请输入商品名称", trigger: "blur" }
        ],
        goodsPrice: [
          { required: true, message: "请输入商品价格", trigger: "blur" }
        ],
        goodsClass: [
          { required: true, message: "请输入商品分类", trigger: "blur" }
        ]
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
  mounted() {
    // this.goodsImage = this.$getSessionStorage("goodsDetail").goodsImage;
    // this.goodsFavo = this.$getSessionStorage("goodsDetail").goodsFavorite;
    // this.goodsName = this.$getSessionStorage("goodsDetail").goodsName;
    // this.goodsPrice = this.$getSessionStorage("goodsDetail").goodsPrice;
    // this.goodsOldNew = this.$getSessionStorage("goodsDetail").goodsOldNew;
    // this.goodsIntroduct = this.$getSessionStorage("goodsDetail").goodsIntroduct;
    // this.sellerId = this.$getSessionStorage("goodsDetail").sellerId;
    // this.sellerName = this.$getSessionStorage("goodsDetail").userName;
    // this.goodsId = this.$getSessionStorage("goodsDetail").goodsId;
    // this.sellerSchool = this.$getSessionStorage("goodsDetail").userSchool;
    // this.attentCount = this.$getSessionStorage("goodsDetail").attentCount;
    // this.fansCount = this.$getSessionStorage("goodsDetail").fansCount;
    // this.userImage = this.$getSessionStorage("user").userImage;
    // this.goodsId=this.$getSessionStorage("goodsId");
    // this.user=this.$getSessionStorage("user");
    // this.userId = this.$getSessionStorage("user").userId;
    // this.goodsFavo = this.goodsDetail.goodsFavorite;
    // if (this.userId == this.goodsDetail.sellerId) this.showAttent = false;
    // console.log(this.goodsDetail.sellerId);
    // if (this.userId == this.goodsDetail.sellerId) this.showAttent = false;
  },
  created() {
    this.init();
  },
  updated() {
    // this.init();
    // this.user = this.$getSessionStorage("user");
  },
  methods: {
    init() {
      if (this.user == null) {
        this.isFavo = false;
        this.isAttent = false;
      } else {
        //获取商品详情
        this.$axios
          .post(
            "secondhandWeb/goods/getDetailById/" + this.goodsId,
            this.$qs.stringify({ goodsId: this.goodsId })
          )
          .then(res => {
            this.goodsDetail = res.data;
            this.sellerId = this.goodsDetail.sellerId;
            this.$setSessionStorage("goodsDetail", res.data);
            this.goodsFavo = this.goodsDetail.goodsFavorite;
            if (this.userId == this.sellerId) this.showAttent = false;
            if (this.goodsDetail.isSell == true) this.isSell = true;
            //判断是否加入收藏
            this.judgFavo();
            //判断是否关注
            this.judgAttent();
          })
          .catch(e => {
            this.$message.error("服务器内部发生异常");
            console.log(e);
          });
      }
    },
    judgFavo() {
      this.$axios
        .post(
          "/secondhandWeb/favorite/isFavo",
          this.$qs.stringify({
            goodsId: this.goodsId,
            userId: this.userId
          })
        )
        .then(res => {
          //console.log(res);
          if (res.data > 0) {
            this.isFavo = true;
          } else {
            this.isFavo = false;
          }
        })
        .catch(e => {
          console.log(e);
        });
    },
    judgAttent() {
      this.$axios
        .post(
          "/secondhandWeb/attention/isAttent",
          this.$qs.stringify({
            userId: this.userId,
            beAttentId: this.sellerId
          })
        )
        .then(res => {
          //console.log(res);
          if (res.data > 0) {
            this.isAttent = true;
          } else {
            this.isAttent = false;
          }
        })
        .catch(e => {
          console.log(e);
        });
    },
    addToFavo() {
      if (this.user == null) {
        this.$message.error("请先登录");
        this.$router.push("/userLogin");
      }
      if (this.showAttent == false) {
        this.$message.error("不能收藏自己的商品！");
        return;
      }
      this.$axios
        .post(
          "/secondhandWeb/favorite/addToFavo",
          this.$qs.stringify({
            goodsId: this.goodsId,
            userId: this.userId
          })
        )
        .then(res => {
          //console.log(res);
          if (res.data > 0) {
            this.$message.success("加入收藏成功");
            this.isFavo = true;
            this.goodsFavo++;
          } else {
            this.$message.error("加入收藏失败");
          }
        })
        .catch(e => {
          console.log(e);
        });
    },
    cancelFavo() {
      this.$axios
        .post(
          "/secondhandWeb/favorite/cancelFavo",
          this.$qs.stringify({
            goodsId: this.goodsId,
            userId: this.userId
          })
        )
        .then(res => {
          //console.log(res);
          if (res.data > 0) {
            this.$message.success("取消收藏成功");
            this.isFavo = false;
            this.goodsFavo--;
            // this.$router.push({ path: "/favorites" });
          } else {
            this.$message.error("取消收藏失败");
          }
        })
        .catch(e => {
          console.log(e);
        });
    },
    toMessage(goodsId, sellerId) {
      if (this.showAttent == false) {
        this.$message.error("不能与自己私聊！");
        return;
      } else {
        this.$axios
          .post(
            "/secondhandWeb/message/isMessList",
            this.$qs.stringify({
              goodsId: goodsId,
              userId: this.userId,
              ortherId: sellerId
            })
          )
          .then(res => {
            if (res.data == 0) {
              this.$axios
                .post(
                  "/secondhandWeb/message/addMessList",
                  this.$qs.stringify({
                    goodsId: goodsId,
                    userId: this.userId,
                    ortherId: sellerId
                  })
                )
                .then(res => {
                  if (res.data > 0) {
                    this.$setSessionStorage("goodsId", goodsId);
                    this.$setSessionStorage("ortherId", sellerId);
                    this.$router.push("/message");
                  }
                })
                .catch(e => {
                  this.$message.error("服务器内部发生异常");
                  console.log(e);
                });
            } else if (res.data == 1) {
              this.$axios
                .post(
                  "secondhandWeb/message/showMess",
                  this.$qs.stringify({
                    goodsId,
                    userId: this.userId,
                    ortherId: sellerId
                  })
                )
                .then(res => {
                  if (res.data > 0) {
                    this.$setSessionStorage("goodsId", goodsId);
                    this.$setSessionStorage("ortherId", sellerId);
                    this.$router.push("/message");
                  }
                })
                .catch(e => {
                  this.$message.error("服务器内部发生异常");
                  console.log(e);
                });
            } else {
              this.$setSessionStorage("goodsId", goodsId);
              this.$setSessionStorage("ortherId", sellerId);
              this.$router.push("/message");
            }
          })
          .catch(e => {
            this.$message.error("服务器内部发生异常");
            console.log(e);
          });
      }
    },
    addAttent(sellerId) {
      if (this.user == null) {
        this.$message.error("请先登录");
        this.$router.push("/userLogin");
      }
      this.$axios
        .post(
          "/secondhandWeb/attention/addAttent",
          this.$qs.stringify({
            userId: this.userId,
            beAttentId: sellerId
          })
        )
        .then(res => {
          //console.log(res);
          if (res.data > 0) {
            this.$message.success("关注成功");
            this.isAttent = true;
          } else {
            this.$message.error("关注失败");
          }
        })
        .catch(e => {
          console.log(e);
        });
    },
    cancelAttent(sellerId) {
      this.$axios
        .post(
          "/secondhandWeb/attention/cancelAttent",
          this.$qs.stringify({
            userId: this.userId,
            beAttentId: sellerId
          })
        )
        .then(res => {
          //console.log(res);
          if (res.data > 0) {
            this.$message.success("取消关注成功");
            this.isAttent = false;
            // this.$router.push({ path: "/favorites" });
          } else {
            this.$message.error("取消关注失败");
          }
        })
        .catch(e => {
          console.log(e);
        });
    },
    toOrder() {
      if (this.showAttent == false) {
        this.$message.error("不能购买自己的商品！");
        return;
      }
      this.$router.push("submitOrder");
    },
    toUserDetail(sellerId) {
      console.log(sellerId);
      this.$setSessionStorage("anUserId", sellerId);
      this.$router.push("userDetail");
    },
    editGoods() {
      this.showEditGoods = true;
      this.editForms.goodsId = this.goodsId;
      this.editForms.goodsImage = this.goodsDetail.goodsImage;
      this.editForms.goodsName = this.goodsDetail.goodsName;
      this.editForms.goodsPrice = this.goodsDetail.goodsPrice;
      this.editForms.goodsCar = this.goodsDetail.goodsCar;
      this.editForms.goodsClass = this.goodsDetail.goodsClass;
      this.editForms.goodsOldNew = this.goodsDetail.goodsOldNew;
      this.editForms.goodsIntroduct = this.goodsDetail.goodsIntroduct;
    },
    editSubmit(formName) {
      if (this.editForms.goodsName == "") {
        this.$message.error("商品名称不能为空");
        return;
      }
      if (this.editForms.goodsPrice == "") {
        this.$message.error("商品价格不能为空");
        return;
      }
      if (this.editForms.goodsClass == "") {
        this.$message.error("商品分类不能为空");
        return;
      }

      //提交修改

      this.$axios
        .post(
          "/secondhandWeb/goods/editGoods",
          this.$qs.stringify(this.editForms)
        )
        .then(res => {
          if (res.data > 0) {
            this.$message.success("操作成功");
            this.showEditGoods = false;
            this.init();
          } else {
            this.$message.error("操作失败");
          }
        })
        .catch(e => {
          console.log(e);
        });
    },
    editCancel() {
      this.showEditGoods = false;
      this.init();
    },
    deleteGoods() {
      this.$confirm("确定删除商品吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$axios
            .post(
              "/secondhandWeb/goods/deleteFGoods",
              this.$qs.stringify({ goodsId: this.goodsId })
            )
            .then(res => {
              if (res.data > 0) {
                this.$message.success("删除成功");
                this.$router.push("index");
              } else {
                this.$message.error("删除失败");
              }
            })
            .catch(e => {
              console.log(e);
            });
        })
        .catch(() => {});
    },
    toBase64(file) {
      var This = this;
      var reader = new FileReader();
      reader.readAsDataURL(file.raw);
      reader.onload = function() {
        this.result; //base64编码
        This.editForms.goodsImage = this.result;
        This.imageUrl = this.result;
      };
    }
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
.deBody {
  margin-top: 120px;
  height: 550px;
  width: 76%;
  /* width: 1150px; */
  margin-left: 12%;
  border: 1px rgb(221, 221, 221) solid;
}
.leftImageBox {
  position: absolute;
  margin-left: 4%;
  margin-top: 50px;
  height: 500px;
  width: 350px;
}
.goodsImage {
  width: 350px;
  height: 350px;
}
.goodsFavo {
  text-align: left;
  padding-left: 20px;
  margin-top: 40px;
}
.midWordBox {
  position: absolute;
  margin-top: 50px;
  margin-left: 33%;
  height: 500px;
  width: 350px;
  line-height: 50px;
  text-align: left;
}
.goodsName {
  font-size: 25px;
}
.goodsPrice {
  font-size: 20px;
  text-align: left;
  color: #ff7926;
}
.toOrder {
  position: absolute;
  margin-top: 50px;
}
.addToFavo {
  position: absolute;
  margin-left: 110px;
  margin-top: 43px;
}
.rightBox {
  position: absolute;
  height: 550px;
  width: 15%;
  background-color: #ffad7a28;
  left: 72.7%;
  border-left: 1px solid rgb(223, 223, 223);
}
.sellerName {
  margin-top: 60px;
  float: left;
  margin-left: 10px;
}
.addAttent {
  cursor: pointer;
  margin-left: 20px;
  color: #fff;
  background-color: #ff7926b0;
  width: 60px;
  line-height: 25px;
  border-radius: 2px;
  text-align: center;
  border: none;
}
.cancelAttent {
  cursor: pointer;
  margin-left: 20px;
  color: #fff;
  background-color: #b1b1b1d8;
  width: 60px;
  line-height: 25px;
  border-radius: 2px;
  text-align: center;
  border: none;
}
.sellerSchool {
  margin-top: 30px;
  float: left;
  margin-left: 10px;
}
.goodsMessage {
  float: left;
  margin-left: 10px;
  margin-top: 35px;
}
.toMessage {
  cursor: pointer;
  /* float: right; */
  margin-left: 15px;
  width: 90px;
  color: #fff;
  background-color: rgb(107, 188, 212);
  line-height: 25px;
  border-radius: 2px;
  text-align: center;
  border: none;
}
.attentCount {
  position: absolute;
  float: left;
  margin-left: 10px;
  margin-top: 206px;
}
.fansCount {
  position: absolute;
  float: left;
  margin-left: 10px;
  margin-top: 260px;
}
.messBoardBox {
  border-top: 1px rgb(221, 221, 221) solid;
  margin-left: 12%;
  margin-top: 50px;
  height: 500px;
  width: 76%;
}
.userImage {
  float: left;
  margin-left: 30px;
  margin-top: 30px;
  height: 70px;
  width: 70px;
  border-radius: 50px;
  border: 1px rgb(221, 221, 221) solid;
}
.pubMessBox {
  /* width: 100%; */
  height: 100px;
}
.pubMessText {
  float: left;
  margin-left: 40px;
  margin-top: 30px;
  width: 71%;
}
.pubButton {
  cursor: pointer;
  /* position: relative; */
  float: left;
  height: 75px;
  width: 85px;
  color: #fff;
  display: block;
  background: rgb(255, 164, 131);
  font-size: 14px;
  line-height: 35px;
  border-radius: 4px;
  margin-left: 15px;
  text-align: center;
  border: none;
  margin-top: 30px;
  font-size: 18px;
}
.messBoard {
  /* background-color: rgba(100, 148, 237, 0.486); */
  border-top: 1px rgb(221, 221, 221) solid;
  height: 100px;
  margin-top: 50px;
}
.avatar-uploader {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  height: 90px;
  width: 90px;
  float: left;
}
.avatar-uploader :hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 90px;
  height: 90px;
  line-height: 90px;
  text-align: center;
}
.avatar {
  width: 90px;
  height: 90px;
  display: block;
}
</style>