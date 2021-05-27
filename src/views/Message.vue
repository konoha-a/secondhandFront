<template>
  <div>
    <!-- 头部 -->
    <Head></Head>

    <div class="container">
      <div class="mess">
        <!-- 左侧菜单 -->
        <div class="messAside">
          <i class="el-icon-s-promotion">消息中心</i>
          <el-menu
            :default-active="onRoutes"
            class="messList"
            active-text-color="rgb(255, 126, 46)"
            text-color="rgb(80,80,80)"
            router
          >
            <el-menu-item @click="toMyMess">
              <el-badge v-show="isMyMess" is-dot>● 我的消息</el-badge>
              <el-badge v-show="!isMyMess">● 我的消息</el-badge>
            </el-menu-item>
            <el-menu-item @click="toSystemMess">
              <el-badge v-show="isSyMess" is-dot>● 系统消息</el-badge>
              <el-badge v-show="!isSyMess">● 系统消息</el-badge>
            </el-menu-item>
            <el-menu-item @click="toMessSet">● 消息设置</el-menu-item>
          </el-menu>
        </div>
      </div>
    </div>

    <router-view></router-view>
  </div>
</template>

<script>
import Head from "@/components/Head.vue";
export default {
  name: "Message",
  data() {
    return {
      isMyMess:false,
      isSyMess:false,
      userId:this.$getSessionStorage("user").userId
    };
  },
  created(){
    this.init();
  },
  methods: {
    init(){
      this.isExistRead();
      this.isExistSymess();
    },
    toMyMess() {
      this.$router.push("myMess");
    },
    toSystemMess() {
      this.$router.push("systemMess");
    },
    toMessSet() {
      this.$router.push("messSet");
    },
    isExistRead() {
      this.$axios
        .post(
          "/secondhandWeb/message/isExistRead",
          this.$qs.stringify({
            userId: this.userId
          })
        )
        .then(res => {
          if (res.data > 0) {
            this.isMyMess = true;
          } else {
            this.isMyMess=false;
          }
        })
        .catch(e => {
          this.$message.error("服务器内部发生异常");
          console.log(e);
        });
    },
    isExistSymess(){
      this.$axios
        .post(
          "/secondhandWeb/symess/isExistSymess",
          this.$qs.stringify({
            userId: this.userId
          })
        )
        .then(res => {
          if (res.data > 0) {
            this.isSyMess = true;
          } else {
            this.isSyMess = false;
          }
        })
        .catch(e => {
          this.$message.error("服务器内部发生异常");
          console.log(e);
        });
    },
  },
  components: {
    Head
  }
};
</script>

<style scoped>
.container {
  position: absolute;
  top: 48px;
  left: 0;
  right: 0%;
  background-color: rgb(252, 202, 170);
  height: 735px;
  /* box-sizing: border-box; */
}
.mess {
  position: absolute;
  margin-left: 10%;
  width: 80%;
  height: 100%;
  /* bottom: 0; */
  background-color: rgba(255, 255, 255, 0.3);
}
.messAside {
  position: absolute;
  /* margin-left: 5%; */
  height: 100%;
  width: 17%;
  background-color: rgba(255, 255, 255, 0.4);
}
.messAside > ul {
  height: 0;
}
.el-icon-s-promotion {
  margin-top: 22px;
  font-weight: bold;
  margin-bottom: 30px;
}
.messList {
  display: block;
  /* position: absolute; */
  bottom: 0;
  background-color: rgba(255, 255, 255, 0);
  font-weight: bold;
}
</style>