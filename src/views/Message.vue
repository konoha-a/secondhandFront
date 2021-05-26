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
              <template v-for="item in messPage">
                <template>
                  <el-menu-item :index="item.index" :key="item.index">{{item.title}}</el-menu-item>
                </template>
              </template>
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
      messPage: [
        {
          index: "/myMess",
          title: "● 我的消息"
        },
        {
          index: "/systemMess",
          title: "● 系统消息"
        },
        {
          index: "/messSet",
          title: "● 消息设置"
        }
      ]
    };
  },
  methods: {},
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
.messAside >ul{
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