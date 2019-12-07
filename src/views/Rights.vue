<template>
  <div class="rights">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 表单 -->
    <el-table :data="rightsList" highlight-current-row>
      <el-table-column type="index"></el-table-column>
      <el-table-column label="权限管理" prop="authName"></el-table-column>
      <el-table-column label="路径" prop="path"></el-table-column>
      <el-table-column label="层级" prop="level">
        <template v-slot='{ row }'>
          <p v-if="row.level === '0'">一级</p>
          <p v-if="row.level === '1'">二级</p>
          <p v-if="row.level === '2'">三级</p>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data () {
    return {
      rightsList: []
    }
  },
  async created () {
    const { data, meta } = await this.$axios.get('rights/list')
    // console.log(data, meta)
    if (meta.status === 200) {
      this.rightsList = data
      // console.log(this.rightsList)
    } else {
      this.$message.error(meta.msg)
    }
  }
}
</script>

<style>

</style>
