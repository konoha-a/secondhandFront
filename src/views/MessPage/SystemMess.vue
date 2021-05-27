<template>
  <div>
    <div class="systemMess">
      <div class="title">系统消息</div>
      <div class="body">
        <div v-show="isZero" style="margin-top:100px">还没有系统消息哦~</div>

        <el-row
          v-show="!isZero"
          class="messItem"
          :span="6"
          v-for="(item, index) in symessList"
          :key="index"
        >
          <div v-show="item.isGoods" @click="isGoodsDetail(item.symessId)">
            <span class="messCont" style="font-weight:bold">
              <el-badge v-show="!item.isRead" is-dot>商品违规处罚通知</el-badge>
              <el-badge v-show="item.isRead">商品违规处罚通知</el-badge>
            </span>
            <br />
            <br />
            <span
              class="messCont"
              style="color:rgb(143, 143, 143);text-align:left"
            >您发布的二手商品【{{item.goodsName}}】存在违规情况，商品已被相应处理。请点击查看详情</span>
          </div>
          <div v-show="!item.isGoods" @click="symessDetail(item.symessId)">
            <span class="messCont" style="font-weight:bold">
              <el-badge v-show="!item.isRead" is-dot>系统公告</el-badge>
              <el-badge v-show="item.isRead">系统公告</el-badge>
            </span>
            <br />
            <br />
            <span class="messCont" style="color:rgb(143, 143, 143)">您有一条新的系统通知。请点击查看详情</span>
          </div>
        </el-row>
      </div>
    </div>

    <!-- 商品处罚详情 -->
    <el-dialog :visible.sync="showIsGoodsDetail" width="500px">
      <div style="font-size:20px;color:red">
        <i class="el-icon-warning"></i>
        <span>发布违禁商品信息</span>
      </div>
      <div style="margin-bottom:40px"></div>
      <div class="three">
        <span style="font-weight:bold">违规名称：</span>
        <span>{{isGoodsData.symessName}}</span>
      </div>
      <br />
      <br />
      <div class="three">
        <span style="font-weight:bold">处置时间：</span>
        <span>{{isGoodsData.symessT}}</span>
      </div>
      <br />
      <br />
      <span class="three" style="font-weight:bold">违规商品：</span>
      <div style="margin-bottom:30px"></div>
      <hr style="background-color:rgb(210, 210, 210);border:none;height:1px" size="1px" />
      <img class="goodsImage" :src="isGoodsData.goodsImage" style="margin-top: 10px;" />
      <span class="goodsName">{{isGoodsData.goodsName}}</span>
      <span style="float: right;margin-right: 10px;margin-top:25px">￥ {{isGoodsData.goodsPrice}}</span>
      <el-divider class="divider1"></el-divider>
      <div class="three">
        <span style="font-weight:bold">处置原因：</span>
        <span>{{isGoodsData.symessWhy}}</span>
      </div>
      <br />
      <br />
      <div class="three">
        <span style="font-weight:bold">处置影响：</span>
        <span>{{isGoodsData.symessImp}}</span>
      </div>
      <div style="margin-bottom:20px"></div>
    </el-dialog>

    <!-- 系统消息详情 -->
    <el-dialog :visible.sync="showSymessDetail" width="500px">
      <div style="font-size:20px;color:black">
        <span>{{symessData.symessName}}</span>
      </div>
      <el-divider class="divider2">
        <span style="color:rgb(170, 170, 170)">{{symessData.symessT}}</span>
      </el-divider>
      <div style="margin-bottom:40px"></div>
      <div class="symessCont">
        <span>{{symessData.symessCont}}</span>
      </div>

      <div style="margin-bottom:20px"></div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "SystemMess",
  data() {
    return {
      symessList: [],
      isGoodsData: {},
      symessData: {},
      userId: this.$getSessionStorage("user").userId,
      isZero: false,
      showIsGoodsDetail: false,
      showSymessDetail: false
    };
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      this.$axios
        .post(
          "/secondhandWeb/symess/getSymessList",
          this.$qs.stringify({
            userId: this.userId
          })
        )
        .then(res => {
          if (res.data == undefined || res.data.length <= 0) this.isZero = true;
          else {
            this.isZero = false;
            this.symessList = res.data;
          }
        })
        .catch(e => {
          console.log(e);
        });
    },
    isGoodsDetail(symessId) {
      this.showIsGoodsDetail = true;
      this.setReaded(symessId);
      this.$axios
        .post(
          "/secondhandWeb/symess/getIsGoodsDetail",
          this.$qs.stringify({ symessId })
        )
        .then(res => {
          this.isGoodsData = res.data;
        })
        .catch(e => {
          console.log(e);
        });
    },
    symessDetail(symessId) {
      this.showSymessDetail = true;
      this.$axios
        .post(
          "/secondhandWeb/symess/getSymessDetail",
          this.$qs.stringify({ symessId })
        )
        .then(res => {
          this.symessData = res.data;
        })
        .catch(e => {
          console.log(e);
        });
    },
    setReaded(symessId) {
      this.$axios
        .post(
          "secondhandWeb/symess/setReaded",
          this.$qs.stringify({ symessId })
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
    }
  }
};
</script>

<style scoped>
.systemMess {
  position: absolute;
  /* margin-left: 20%; */
  left: 25%;
  top: 48px;
  /* right: 0; */
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
  width: 100%;
  border-radius: 4px;
  overflow: auto;
}
.messItem {
  height: 100px;
  background-color: white;
  border-radius: 4px;
  margin-bottom: 10px;
  cursor: pointer;
}
.messCont {
  margin-top: 20px;
  position: absolute;
  left: 20px;
}
.goodsImage {
  float: left;
  margin-left: 10px;
  margin-top: 20px;
  margin-bottom: 20px;
  height: 70px;
  width: 70px;
  border: 1px rgb(221, 221, 221) solid;
}
.goodsName {
  float: left;
  margin-left: 10px;
  margin-top: 20px;
  font-size: 20px;
}
.three {
  margin-left: 10px;
  display: block;
  position: absolute;
}
.divider1 {
  margin-top: 110px;
}
.divider2 {
  margin-top: 20px;
}
.symessCont {
  text-align: left;
  text-indent: 30px;
  font-size: 16px;
  line-height: 25px;
}
</style>