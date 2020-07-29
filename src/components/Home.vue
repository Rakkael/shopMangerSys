<template>
  <el-container class="home-container">
    <el-header>
      <!-- Header content -->
      <img class="profile" src="../assets/logo.png" />
      <p>管理系统</p>
      <el-button type="primary" @click="logOut">退出</el-button>
    </el-header>

    <el-container>
      <el-aside :width="isCollapse? '64px':'200px'">
        <!-- Aside content -->
        <!-- default-active 指的是默认选择哪一项 -->
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <el-menu
          class="leftMenu"
          @open="handleOpen"
          @close="handleClose"
          text-color="white"
          background-color="#2d4d6d"
          :unique-opened="true"
          :collapse="isCollapse"
          :collapse-transition="false"
          :router="true"
          :default-active="activatePath"
        >
          <el-submenu v-bind:index="item.id+''" v-for="item in menuList" v-bind:key="item.id">
            <template slot="title">
              <!-- i指定图标项 -->
              <i :class="iconsObj[item.id]"></i>
              <!-- span指定文本 -->
              <span>{{item.authName}}</span>
            </template>
            <el-menu-item
              :index="'/' + subItem.path"
              v-for="subItem in item.children"
              :key="subItem.id"
              @click="saveNavState('/' + subItem.path)"
            >
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{subItem.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main height="100%">
        <!-- Main content -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      menuList: [],
      iconsObj:{
        '125':'el-icon-user-solid',
        '103':'el-icon-lock',
        '101':'el-icon-s-shop',
        '102':'el-icon-s-order',
        '145':'el-icon-s-data'
      },
      isCollapse: false,
      activatePath: '',    
    }
  },

  created(){
    this.getMenuList();
    // this.activatePath = window.sessionStorage.getItem('activatePath');
  },

  methods: { 
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    logOut(){
      window.sessionStorage.clear();
      this.$message({message: '退出成功！', type: 'success'});
      this.$router.push('/login');
    },
    async getMenuList() {
      const {data: res} = await this.$axios.get('menus');
      if(res.meta.status !== 200) return res.$message.error(res.meta.msg);
      this.menuList = res.data;
      console.log(res);
    },
    toggleCollapse() {
      this.isCollapse = !this.isCollapse;
    },
    saveNavState(activatePath) {
      // window.sessionStorage.setItem('activatePath', activatePath); 
      this.activatePath = activatePath;     
    }
  },
    

}
</script>

<style scoped>
.profile {
  background-color: #eaedf1;
  width: 50px;
  height: 50px;
  border-radius: 50%;
}

.home-container {
  width: 100%;
  height: 100%;
}

.el-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: white;
  background-color: #373d41;
}

.el-aside {
  background-color: #333744;
}

.el-aside .el-menu {
  border-right: 0;
}

.el-main {
  background-color: #eaedf1;
}

.toggle-button {
  background-color: #485164;
  color: white;
  height: 30px;
  font-size: 0.5em;
  text-align: center;
  line-height: 30px;
  cursor: pointer;
  letter-spacing: 0.2em;
}
</style>