<template>
  <div>
    <div class="myMess">
      <div class="title">我的消息</div>
      <div class="body">
        <div class="left">
          <div class="lastMess">最近消息</div>
          <div class="lastBody">
            <el-menu class="lastMessList" active-text-color="#2C3E50">
              <el-menu-item
                v-for="(item,index) in messPage"
                :key="index"
                @click="messRight(item.goodsId,item.ortherId)"
              >
                <el-image :src="item.goodsImage" class="goodsImage1"></el-image>
                <el-badge v-show="!item.isRead" is-dot class="userName">{{item.userName}}</el-badge>
                <el-badge v-show="item.isRead" class="userName">{{item.userName}}</el-badge>
                <i class="el-icon-close" @click="closeMess(item.goodsId,userId,item.ortherId)"></i>
              </el-menu-item>
            </el-menu>
          </div>
        </div>

        <div class="right" v-if="!isZero">
          <!-- 商品信息 -->
          <div class="goodsInfo">
            <el-image
              class="goodsImage2"
              :src="messGoods.goodsImage"
              @click="toGoodsDetail(messGoods.goodsId)"
            ></el-image>
            <span class="goodsName">{{messGoods.goodsName}}</span>
            <span class="goodsPrice">￥ {{this.totalPrice}}</span>
            <span class="goodsCar">含运费{{messGoods.goodsCar}}元</span>
            <el-button v-show="showAttent" type="danger" class="toOrder" @click="toOrder">立即购买</el-button>
          </div>

          <!-- 聊天记录 -->
          <div class="messDetail">
            <div v-for="(item,deIndex) in messDetail" :key="deIndex">
              <span class="sendT">{{item.sendT}}</span>
              <div v-show="!item.isSender" style="height: 45px;">
                <el-image class="ortherImage" :src="ortherInfo.userImage"></el-image>
                <span class="ortherCont">{{item.meContent}}</span>
              </div>
              <div v-show="item.isSender" style="height: 45px;">
                <el-image class="userImage" :src="userImage"></el-image>
                <span class="userCont">{{item.meContent}}</span>
              </div>
            </div>
          </div>

          <!-- 输入框 -->
          <div class="messText">
            <textarea class="textarea" rows="7" cols="20" v-model="messText"></textarea>
            <!-- <el-input type="textarea" clear="textarea" rows="6" v-model="messText"></el-input> -->
            <button
              class="addMessCont"
              @click="addMessCont(messGoods.goodsId,userId,ortherId,messText)"
            >发送</button>
          </div>
        </div>

        <div v-if="isZero" style="position:absolute;font-size:18px; margin-top:250px;left:450px">您还没有收到消息哦~</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "MyMess",
  data() {
    return {
      messPage: [],
      messDetail: [],
      isZero: false,
      messGoods: {},
      ortherInfo: {},
      totalPrice: 0,
      // isClick: false,
      messText: "",
      userId: this.$getSessionStorage("user").userId,
      userImage: this.$getSessionStorage("user").userImage,
      iSender: false,
      ortherId: "",
      showAttent: true,
      upMessDetail: null,
      upMessList:null,
      deIndex:0,
      index:0,
    };
  },
  created() {
    this.init();
    // this.upMessList=setInterval(()=>{
    //   this.init;
    //   this.index+=1;
    // },1000*3);
    // this.upMessDetail = setInterval(() => {
    //   this.getMessDetail;
    //   this.deIndex+=1;      
    // }, 1000*3);
  },
  mounted() {
    
  },
  beforeDestroy() {
    clearInterval(this.upMessDetail);
  },
  updated() {},
  methods: {
    init() {
      this.$axios
        .post(
          "/secondhandWeb/message/getMessList",
          this.$qs.stringify({
            userId: this.userId
          })
        )
        .then(res => {
          if (res.data == undefined || res.data.length <= 0) this.isZero = true;
          else {
            this.isZero = false;
            this.messPage = res.data;
            this.getMessDetail();
            this.getDetailById(this.$getSessionStorage("goodsId"));
          }
        })
        .catch(e => {
          console.log(e);
        });
    },
    messRight(goodsId, ortherId) {
      this.$setSessionStorage("goodsId", goodsId);
      this.$setSessionStorage("ortherId", ortherId);
      // this.isClick = true;
      //获取右边的商品详情
      this.getDetailById(goodsId);
      //标记已读
      this.setReaded(goodsId, ortherId);
      //获取详细聊天记录
      this.getMessDetail();
      //获取对方用户信息
      this.getUserInfo(ortherId);
    },
    getDetailById(goodsId) {
      this.$axios
        .post(
          "secondhandWeb/goods/getDetailById/" + goodsId,
          this.$qs.stringify({ goodsId })
        )
        .then(res => {
          this.messGoods = res.data;
          this.totalPrice = this.messGoods.goodsPrice + this.messGoods.goodsCar;
          this.$setSessionStorage("goodsDetail", res.data);
          if (res.data.sellerId == this.userId) this.showAttent = false;
          else this.showAttent = true;
        })
        .catch(e => {
          this.$message.error("服务器内部发生异常");
          console.log(e);
        });
    },
    setReaded(goodsId, ortherId) {
      this.$axios
        .post(
          "secondhandWeb/message/setReaded",
          this.$qs.stringify({ goodsId, userId: this.userId, ortherId })
        )
        .then(res => {
          if (res.data > 0) {
            this.init();
          }
        })
        .catch(e => {
          this.$message.error("服务器内部发生异常");
          console.log(e);
        });
    },
    getMessDetail() {
      this.$axios
        .post(
          "secondhandWeb/message/getMessDetail",
          this.$qs.stringify({
            goodsId: this.$getSessionStorage("goodsId"),
            userId: this.userId,
            ortherId: this.$getSessionStorage("ortherId")
          })
        )
        .then(res => {
          this.messDetail = res.data;
        })
        .catch(e => {
          this.$message.error("服务器内部发生异常");
          console.log(e);
        });
    },
    getUserInfo(ortherId) {
      this.$axios
        .post(
          "secondhandWeb/user/getUserInfo/" + ortherId,
          this.$qs.stringify({ ortherId })
        )
        .then(res => {
          this.ortherInfo = res.data;
          this.ortherId = res.data.userId;
        })
        .catch(e => {
          this.$message.error("服务器内部发生异常");
          console.log(e);
        });
    },
    toOrder() {
      this.$router.push("submitOrder");
      this.beforeDestroy();
    },
    toGoodsDetail(goodsId) {
      this.$setSessionStorage("goodsId", goodsId);
      this.$router.push("/goodsDetail");
      this.beforeDestroy();
    },
    closeMess(goodsId, userId, ortherId) {
      this.$axios
        .post(
          "secondhandWeb/message/closeMess",
          this.$qs.stringify({ goodsId, userId, ortherId })
        )
        .then(res => {
          if (res.data > 0) {
            this.init();
          }
        })
        .catch(e => {
          this.$message.error("服务器内部发生异常");
          console.log(e);
        });
    },
    addMessCont(goodsId, userId, ortherId, messText) {
      if (messText == null || messText == "") {
        this.$message.error("发送内容不能为空，请重新输入");
        return;
      } else {
        this.$axios
          .post(
            "/secondhandWeb/message/addMessCont",
            this.$qs.stringify({
              goodsId: goodsId,
              userId: userId,
              ortherId: ortherId,
              meContent: messText
            })
          )
          .then(res => {
            if (res.data > 0) {
              this.messText = "";
              this.messRight(this.$getSessionStorage("goodsId"), this.ortherId);
            }
          })
          .catch(e => {
            this.$message.error("服务器内部发生异常");
            console.log(e);
          });
      }
    }
  },
  destroyed() {
    clearInterval(this.upMessDetail);
    clearInterval(this.upMessList);
  },
  components: {
  }
};
</script>

<style scoped>
.myMess {
  position: absolute;
  /* margin-left: 20%; */
  left: 25%;
  top: 48px;
  bottom: 0;
  width: 60%;
}
.title {
  margin-top: 12px;
  height: 45px;
  background-color: white;
  border-radius: 4px;
  line-height: 45px;
  text-align: left;
  padding-left: 20px;
}
.body {
  margin-top: 15px;
  height: 640px;
  background-color: white;
  border-radius: 4px;
}
.left {
  position: absolute;
  width: 210px;
  height: 90%;
  background-color: rgb(255, 255, 255, 0);
  margin-left: 0;
}
.lastMess {
  height: 65px;
  /* background-color: rgb(255, 255, 255, 0); */
  /* font-size: 13px; */
  text-align: left;
  padding-left: 20px;
  line-height: 60px;
  border-bottom: 1px solid rgb(224, 224, 224);
  border-right: 1px solid rgb(224, 224, 224);
}
.lastBody {
  /* position: absolute; */
  height: 85%;
  border-right: 1px solid rgb(224, 224, 224);
  overflow: auto;
}
.lastBody > ul {
  height: 0;
}
.lastMessList {
  text-align: left;
}
.el-menu-item {
  border-bottom: 1px solid rgb(224, 224, 224);
}
.el-menu-item:hover .el-icon-close {
  display: inline;
}
.goodsImage1 {
  width: 40px;
  /* border-radius: 50px; */
}
.userName {
  margin-left: 10px;
  font-size: 16px;
  line-height: 20px;
}
.el-icon-close {
  display: none;
  position: absolute;
  line-height: 57px;
  right: 0;
  /* color: rgb(115, 160, 206); */
}
.right {
  width: 77%;
  height: 100%;
  margin-left: 210px;
}
.goodsInfo {
  /* line-height: 20px; */
  height: 65px;
  border-bottom: 1px solid rgb(224, 224, 224);
}
.goodsImage1 {
  width: 40px;
  height: 40px;
  /* border-radius: 50px; */
}
.goodsImage2 {
  cursor: pointer;
  position: absolute;
  left: 230px;
  /* margin-left: 10px; */
  margin-top: 7px;
  margin-bottom: 7px;
  width: 50px;
  height: 50px;
}
.goodsName {
  position: absolute;
  left: 300px;
  font-size: 18px;
  margin-top: 5px;
}
.goodsPrice {
  position: absolute;
  left: 300px;
  margin-top: 30px;
  font-size: 18px;
  color: #ff7926;
}
.goodsCar {
  position: absolute;
  left: 360px;
  margin-top: 33px;
  font-size: 14px;
  color: rgb(165, 165, 165);
}
.toOrder {
  position: absolute;
  margin-top: 13px;
  right: 20px;
}
.messDetail {
  position: absolute;
  margin-top: 10px;
  height: 380px;
  overflow: auto;
  width: 76%;
  margin-left: 1%;
}
.messText {
  position: absolute;
  margin-top: 390px;
  width: 77%;
  border-top: 1px solid rgb(224, 224, 224);
}
.textarea {
  border: none;
  resize: none;
  width: 98%;
  /* background-color: burlywood; */
  outline: none;
  font-size: 16px;
}
.addMessCont {
  cursor: pointer;
  position: relative;
  float: right;
  right: 5px;
  width: 90px;
  color: #fff;
  display: block;
  background: rgb(255, 164, 131);
  font-size: 14px;
  line-height: 30px;
  border-radius: 2px;
  text-align: center;
  border: none;
}
.sendT {
  color: rgb(184, 184, 184);
  font-size: 14px;
}
.userImage {
  position: absolute;
  height: 40px;
  width: 40px;
  right: 0;
  border-radius: 40px;
  border: 1px solid rgb(224, 224, 224);
}
.ortherImage {
  position: absolute;
  left: 0;
  width: 40px;
  height: 40px;
  border-radius: 40px;
  border: 1px solid rgb(224, 224, 224);
}
.ortherCont {
  position: absolute;
  border: 2px solid rgb(224, 224, 224);
  border-radius: 5px;
  padding: 5px 10px 5px 10px;
  left: 50px;
  margin-top: 3px;
}
.userCont {
  position: absolute;
  border: 2px solid rgb(224, 224, 224);
  border-radius: 5px;
  padding: 5px 10px 5px 10px;
  right: 50px;
  margin-top: 3px;
}
</style>