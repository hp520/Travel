<template>
  <div class="Goods">
    <el-button type="success" plain @click="add">添加商品</el-button>
    <el-table :data="gitList">
      <el-table-column type="index"  :index="indexMethod" width="50"></el-table-column>
      <el-table-column label="商品名称" prop="goods_name"></el-table-column>
      <el-table-column label="商品价格" prop="goods_price"></el-table-column>
      <el-table-column label="商品重量" prop="goods_weight"></el-table-column>
      <el-table-column label="创建时间">
        <template v-slot='{ row }'>
          <p>{{row.add_time | time}}</p>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template >
          <el-button type="primary" plain circle icon="el-icon-edit"></el-button>
          <el-button type="danger" plain circle icon="el-icon-delete" ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </div>
</template>

<script>
export default {
  data () {
    return {
      gitList: [],
      pagesize: 10,
      pagenum: 1,
      total: 0
    }
  },
  created () {
    this.gitGoodsList()
  },
  methods: {
    async gitGoodsList () {
      const { meta, data } = await this.$axios.get(`goods`, {
        params: {
          pagenum: this.pagenum,
          pagesize: this.pagesize
        }
      })
      // console.log(meta, data)
      if (meta.status === 200) {
        this.gitList = data.goods
        this.total = data.total
        console.log(this.gitList)
        console.log(this.total)
      } else {
        this.$message.error(meta.msg)
      }
    },
    handleSizeChange (val) {
      // console.log(`每页 ${val} 条`)
      this.pagesize = val
      this.gitGoodsList()
    },
    handleCurrentChange (val) {
      // console.log(`当前页: ${val}`)
      this.pagenum = val
      this.gitGoodsList()
    },
    indexMethod (index) {
      return index + 1 + (this.pagenum - 1) * this.pagesize
    },
    add () {
      this.$router.push('/goods-add')
    }
  }
}
</script>

<style>

</style>
