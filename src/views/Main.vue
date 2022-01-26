<template>
  <div class="main">
    <el-container>
      <el-aside :width="isFold ? '210px' : '80px'">
        <el-menu
          :collapse-transition="false"
          :router="true"
          :default-active="defaultActive"
          @open="menuOpen"
          @close="menuClose"
          @select="selectMenu"
          ref="menuRef"
          @fold="isFold = !isFold"
          :collapse="isCollapse"
        >
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-user"></i>
              <span slot="title">用户管理</span>
            </template>
            <el-menu-item index="/main/user">用户列表</el-menu-item>
            <!--            <el-menu-item index="/main/role">角色权限</el-menu-item>-->
          </el-submenu>
          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-tickets"></i>
              <span slot="title">任务管理</span>
            </template>
            <el-menu-item index="/main/new_task">新建任务</el-menu-item>
            <el-menu-item index="/main/published">已发布任务</el-menu-item>
            <el-menu-item index="/main/task_item">任务选项</el-menu-item>
            <el-menu-item index="/main/myTask">我的任务</el-menu-item>
          </el-submenu>

          <el-submenu index="3">
            <template slot="title">
              <i class="el-icon-s-opportunity"></i>
              <span slot="title">角色权限</span>
            </template>
            <el-menu-item index="/main/role">角色管理</el-menu-item>
            <el-menu-item index="/main/authority">权限管理</el-menu-item>
          </el-submenu>
          <!--          <el-submenu index="3">-->
          <!--            <template slot="title">-->
          <!--              <i class="el-icon-location"></i>-->
          <!--              <span slot="title">任务管理</span>-->
          <!--            </template>-->
          <!--            <el-menu-item index="3-1">选项1</el-menu-item>-->
          <!--            <el-menu-item index="3-2">选项2</el-menu-item>-->
          <!--          </el-submenu>-->
        </el-menu>
      </el-aside>
      <el-container>
        <el-header class="header-my">
          <div class="header-left">
            <i
              class="fold-menu"
              :class="isFold ? 'el-icon-s-fold' : 'el-icon-s-unfold'"
              @click="handleFoldClick"
            ></i>
            <div class="content">
              <div>
                <el-breadcrumb separator-class="el-icon-arrow-right">
                  <el-breadcrumb-item
                    v-for="(item, index) in $store.getters.bread"
                    :to="index == 0 ? '/main' : ''"
                    :key="index"
                    >{{ item }}
                  </el-breadcrumb-item>
                </el-breadcrumb>
              </div>
            </div>
          </div>
          <div>
            <span>{{
              info ? info.roleName.toString() : "当前未登录" + ":"
            }}</span
            ><span style="font-weight: bold; font-size: 20px">{{
              info.realName ? info.realName : "当前未登录"
            }}</span
            ><span>,欢迎你</span>
          </div>
        </el-header>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import instance from "@/request/request";

export default {
  data() {
    let menuList = new Map();
    menuList.set("/main/user", "用户列表");
    menuList.set("/main/task_item", "任务选项");
    menuList.set("/main/role", "角色管理");
    menuList.set("/main/new_task", "新建任务");
    menuList.set("/main/published", "已发布任务");
    menuList.set("/main/myTask", "我的任务");
    menuList.set("/main/authority", "权限管理");
    return {
      isFold: true,
      isCollapse: false,
      defaultActive: "",
      breadcrumbItem: [{ name: "主页", path: "/main" }],
      menuList,
      info: { roleName: "", realName: "" },
    };
  },
  methods: {
    handleFoldClick() {
      this.isFold = !this.isFold;
      window.localStorage.setItem("isFold", this.isFold);
      this.isCollapse = !this.isCollapse;
      window.localStorage.setItem("isCollapse", this.isCollapse);

      if (this.isFold) {
        if (window.localStorage.getItem("menu1")) {
          if (window.localStorage.getItem("menu1") == "open") {
            this.$refs.menuRef.open(1);
          } else {
            this.$refs.menuRef.close(1);
          }
        }
        if (window.localStorage.getItem("menu2")) {
          if (window.localStorage.getItem("menu2") == "open") {
            this.$refs.menuRef.open(2);
          } else {
            this.$refs.menuRef.close(2);
          }
        }
        if (window.localStorage.getItem("menu3")) {
          if (window.localStorage.getItem("menu2") == "open") {
            this.$refs.menuRef.open(3);
          } else {
            this.$refs.menuRef.close(3);
          }
        }
      }
    },

    selectMenu(p) {
      window.localStorage.setItem("defaultActive", p);
      this.defaultActive = p;
      this.$store.commit("breadState", ["主页", this.menuList.get(p)]);

      window.localStorage.setItem(
        "bread",
        JSON.stringify(this.$store.getters.bread)
      );
    },
    menuClose(index) {
      let name = "menu" + index;

      window.localStorage.setItem(name, "close");
    },
    menuOpen(index) {
      let name = "menu" + index;

      window.localStorage.setItem(name, "open");
    },
  },
  created() {
    this.$store.commit(
      "breadState",
      JSON.parse(window.localStorage.getItem("bread"))
    );
    this.defaultActive = window.localStorage.getItem("defaultActive");
    if (
      window.localStorage.getItem("isCollapse") &&
      window.localStorage.getItem("isFold")
    ) {
      this.isCollapse =
        window.localStorage.getItem("isCollapse") == "false" ? false : true;
      this.isFold =
        window.localStorage.getItem("isFold") == "false" ? false : true;
    }

    window.localStorage.removeItem("info");

    instance
      .get("/user/info")
      .then((res) => {
        window.localStorage.setItem("info", JSON.stringify(res.data.data));
        this.info = res.data.data;
      })
      .catch((err) => {
        console.log(err);
      });
  },
  // beforeRouteUpdate(to, from, next){
  //   if (to.path === '/main'){
  //     this.breadcrumbItem=[{name:'主页',path:'/main'}]
  //     next()
  //   }
  // }

  mounted() {
    // console.log(this.$route.path);
    if (localStorage.getItem("isFold") == "true") {
      if (window.localStorage.getItem("menu1")) {
        if (window.localStorage.getItem("menu1") == "open") {
          this.$refs.menuRef.open(1);
        } else {
          this.$refs.menuRef.close(1);
        }
      }
      if (window.localStorage.getItem("menu2")) {
        if (window.localStorage.getItem("menu2") == "open") {
          this.$refs.menuRef.open(2);
        } else {
          this.$refs.menuRef.close(2);
        }
      }
      if (window.localStorage.getItem("menu3")) {
        if (window.localStorage.getItem("menu2") == "open") {
          this.$refs.menuRef.open(3);
        } else {
          this.$refs.menuRef.close(3);
        }
      }
    }
  },
  beforeRouteUpdate(to, from, next) {
    if (to.path === "/main/dashboard") {
      this.breadcrumbItem = [{ name: "主页", path: "/main" }];
      this.defaultActive = "";
    }
    next();
  },
};
</script>

<style scoped lang="less">
.main {
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  padding: 0 20px;
}

.fold-menu {
  font-size: 30px;
  cursor: pointer;
  line-height: 30px;
}

.header-my {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 0px;
}

.header-left {
  display: flex;
  align-items: center;
  line-height: 30px;
}

.content {
  margin-left: 20px;
  line-height: 30px;
}

.el-menu {
  border-right: none;

  padding: 5px;
}

.el-header {
  border-bottom: aliceblue 1px solid;
}

.el-aside {
  border-right: aliceblue 1px solid;
  height: 100%;
}

.el-container {
  height: 100%;
}

.el-main {
  height: 100%;
  padding: 5px;
}
</style>
