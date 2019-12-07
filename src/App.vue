<template>
  <div id="app">
      <router-view></router-view>
    </div>
</template>

<style lang='less'>
* {
  margin: 0;
  padding: 0;
  list-style: none;
}
html,body,#app{
  height: 100%;
}
#app{
  .el-breadcrumb {
      height: 40px;
      line-height: 40px;
      background-color: #ccc;
      padding-left: 20px;
    }
}
</style>
