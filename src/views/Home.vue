<template>
  <div class="Home">
    <el-container>
      <el-header>
        <div class="logo"></div>
        <div class="title">
          <h1>电商后台管理系统</h1>
        </div>
        <div class="logout">
          欢迎您，xxx <a href="javascript:;" @click="logout">退出</a>
        </div>
      </el-header>
      <el-container>
        <!--侧边栏  -->
        <el-aside width="200px">
          <el-menu
              router
              unique-opened
              :default-active="defaultActive"
              class="el-menu-vertical-demo"
              background-color="#545c64"
              text-color="#fff"
              active-text-color="#ffd04b">
              <el-submenu :index="subMenu.path" v-for="subMenu in menuList" :key="subMenu.id">
                <template slot="title">
                  <i class="el-icon-location"></i>
                  <span>{{subMenu.authName}}</span>
                </template>
                <el-menu-item :index="item.path" v-for="item in subMenu.children" :key="item.id">
                    <i class="el-icon-menu"></i>
                    <span slot="title">{{item.authName}}</span>
                </el-menu-item>
              </el-submenu>
          </el-menu>
        </el-aside>
        <!-- 主体 -->
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
// import axios from 'axios'
export default {
  data () {
    return {
      menuList: []
    }
  },
  async created () {
    const { data, meta } = await this.$axios.get('menus')
    // const { data, meta } = res
    if (meta.status === 200) {
      this.menuList = data
    }
    /* this.$axios({
      url: 'menus',
      // url: 'http://localhost:8888/api/private/v1/menus',
      method: 'get'
    }).then(res => {
      // const { data, meta } = res.data
      const { data, meta } = res
      if (meta.status === 200) {
        this.menuList = data
      }
    }) */
  },
  methods: {
    async logout () {
      try {
        await this.$confirm('确定要退出登录吗？, 是否继续?', '温馨提示', {
          type: 'warning'
        })
        this.$router.push('/login')
        localStorage.removeItem('token')
        this.$message.success('退出成功')
        /* this.$message({
          type: 'success',
          message: '退出成功!'
        }) */
      } catch {
        this.$message.info('已取消退出')
        /* this.$message({
          type: 'info',
          message: '已取消删除'
        }) */
      }
    }
  },
  computed: {
    defaultActive () {
      // 让左侧边栏高亮
      return this.$route.path.slice(1).split('-')[0]
    }
  }
}
</script>

<style lang='less' scope>
  .Home{
    height: 100%;
    >.el-container{
      height: 100%;
      .el-header{
        background-color: #b3c1cd;
        display: flex;
        text-align: center;
        line-height: 60px;
        .logo{
          width: 180px;
          background: url('../assets/logo1.png') center/contain no-repeat ;
        }
        .title{
          flex: 1;
        }
        .logout{
          text-align: right;
          a{
            color: orange;
          }
        }
      }
      >.el-container{
        .el-aside{
          background-color: #545c64;
          .el-submenu {
            width: 200px;
        }
        }
        .el-main{
          background-color: #eaeef1;
        }
      }
    }
  }
</style>
