<template>
  <div>
    <!-- 头部 -->
    <div class="head">
      <div class="collapse-btn" @click="collapseChange">
        <i class="el-icon-menu"></i>
      </div>
      <div class="logo">后台管理</div>
      <div class="right">
        <div class="btn-fullscreen" @click="handleFullScreen">
          <el-tooltip :content="fullscreen?'取消全屏':'全屏'" placement="bottom">
            <i class="el-icon-rank"></i>
          </el-tooltip>
        </div>
        <div class="managerAvator">
          <img src="../assets/logo.gif" />
        </div>
        <el-dropdown class="managerName" @command="handleCommand" placement="bottom">
          <span class="nameLink">
            {{this.managerName}}
            <i class="el-icon-caret-bottom"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="logout">退出登录</el-dropdown-item>
            <!-- <el-dropdown-item></el-dropdown-item> -->
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>

    <!-- 左侧菜单 -->
    <div class="managerAside">
      <el-menu
        :default-active="onRoutes"
        :collapse="collapse"
        class="managerList"
        background-color="#222D32"
        text-color="#fff"
        active-text-color="#0086F1"
        router
      >
        <template v-for="item in managerPage">
          <template>
            <el-menu-item :index="item.index" :key="item.index">
              <div v-if="collapse">
                <i :class="item.icon"></i>
              </div>
              <div v-else>
                <i :class="item.icon"></i>
                {{item.title}}
              </div>
            </el-menu-item>
          </template>
        </template>
      </el-menu>
    </div>

    <div class="managerBodyBox" :class="{'content-collapse':collapse}">
      <div class="managerBody">
      <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import bus from "../bus.js";
export default {
  name: "Manager",
  data() {
    return {
      fullscreen: false,
      collapse: false,
      managerPage: [
        {
          icon: "el-icon-user-solid",
          index: "/userManage",
          title: "用户管理"
        },
        {
          icon: "el-icon-s-goods",
          index: "/goodsManage",
          title: "物品管理"
        },
        {
          icon: "el-icon-s-order",
          index: "/orderManage",
          title: "订单管理"
        }
      ]
    };
  },
  mounted() {},
  methods: {
    handleFullScreen() {
      if (this.fullscreen) {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.msExitFullScreen) {
          document.msExitFullScreen();
        }
      } else {
        let element = document.documentElement;
        if (element.requestFullscreen) {
          element.requestFullscreen();
        } else if (element.webkitRequestFullScreen) {
          element.webkitRequestFullScreen();
        } else if (element.mozRequestFullScreen) {
          element.mozRequestFullScreen();
        } else if (element.msRequestFullScreen) {
          element.msRequestFullScreen();
        }
      }
      this.fullscreen = !this.fullscreen;
    },
    collapseChange() {
      this.collapse = !this.collapse;
      bus.$emit("collapse", this.collapse);
    },
    handleCommand(command) {
      if (command == "logout") {
        this.$router.push("/managerLogin");
      }
    }
  },
  computed: {
    onRoutes() {
      return this.$route.path.replace('/','');
    }
  },
  created() {
    bus.$on("collapse", msg => {
      this.collapse = msg;
    });
    this.managerName = this.$getSessionStorage("manager").managerName;
  },
  components: {}
};
</script>

<style scoped>
.head {
  position: absolute;
  background-color: #0079d9;
  /* box-sizing: border-box; */
  border: none;
  padding: none;
  width: 100%;
  height: 50px;
  font-size: 18px;
  color: #fff;
  left: 0;
  top: 0;
}
.collapse-btn {
  float: left;
  padding: 0 26px;
  cursor: pointer;
  line-height: 50px;
}
.head .logo {
  position: relative;
  float: left;
  line-height: 50px;
  color: white;
}
.head .right {
  float: right;
  padding-right: 50px;
  display: flex;
  height: 50px;
  align-items: center;
}
.btn-fullscreen {
  margin-right: 5px;
  font-size: 24px;
  transform: rotate(45deg);
}
.managerAvator {
  margin-left: 20px;
}
.managerAvator img {
  /* display: block; */
  margin-top: 6px;
  width: 30px;
  height: 30px;
  border-radius: 50%;
}
.managerName {
  margin-left: 10px;
  color: white;
}
.nameLink {
  color: white;
  cursor: pointer;
}
.managerAside {
  display: block;
  position: absolute;
  left: 0;
  top: 50px;
  bottom: 0;
  background-color: #222d32;
}
.managerAside::-webkit-scrollbar {
  width: 0;
}
.managerList:not(.el-menu--collapse) {
  width: 200px;
}
.managerAside > ul {
  height: 100%;
}
.managerBodyBox {
  position: absolute;
  left: 200px;
  right: 0;
  top: 50px;
  bottom: 0;
  overflow-y: scroll;
  -webkit-transition: left 0.3s ease-in-out;
  transition: left 0.3s ease-in-out;
  background: #f0f0f0;
}
.managerBody{
  margin: 5px;
}
.content-collapse {
  left: 65px;
}
</style>