<template>
  <div class="Categories">
    <!-- 添加按钮 -->
    <el-button type="success" plain @click="add">添加分类</el-button>
    <!-- 添加模态框 -->
    <el-dialog title="添加" :visible.sync="addVisible" width="40%">
      <el-form :model="addForm" :rules="rules" status-icon ref="addForm" label-width="80px">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级名称" prop="cat_pid">
          <el-cascader
            clearable
            :props="props"
            v-model="addForm.cat_pid"
            :options="options"></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addVisible = false">取 消</el-button>
        <el-button  type="primary" @click="addSuer">确 定</el-button>
      </span>
    </el-dialog>
    <!-- <div style="margin: 15px 15px 15px 0;">
      <el-input placeholder="请输入内容" v-model="input3" class="input-with-select" style="width:300px">
        <el-select v-model="select">
        </el-select>
        <el-button slot="append" icon="el-icon-search"></el-button>
      </el-input>
    </div> -->

    <!-- 表单 -->
    <el-table
      :data="getList"
      row-key="cat_id"
      v-loading="loading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)">
      <el-table-column label="分类名称" prop="cat_name"></el-table-column>
      <el-table-column label="是否有效" >
        <template v-slot='{ row }'>
          {{row.cat_deleted ? '否' : '是' }}
        </template>
      </el-table-column>
      <el-table-column label="排序" prop="cat_level"></el-table-column>
      <el-table-column label="操作">
        <template v-slot='{ row }'>
          <el-button type="primary" plain circle icon="el-icon-edit" @click="change(row)"></el-button>
          <el-button type="danger" plain circle icon="el-icon-delete" @click="del(row.cat_id,$event)"></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 编辑模板 -->
    <el-dialog title="温馨提示" :visible.sync="assignVisible" width="40%">
      <el-form :model="form" label-width="80px" :rules="rules" ref="form" status-icon>
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="form.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="是否有效" label-width="80px">
          <el-switch v-model="form.cat_deleted" disabled></el-switch>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="assignVisible = false">取 消</el-button>
        <el-button  type="primary" @click="changSure">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分页 -->
     <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pagenum"
        :page-sizes="[5, 10, 15, 20, 25]"
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
      loading: false, // 加载
      options: [],
      addVisible: false,
      assignVisible: false,
      getList: [],
      pagenum: 1,
      pagesize: 10,
      total: 0,
      form: {
        id: '',
        cat_name: '',
        cat_deleted: ''
      },
      addForm: {
        cat_name: '',
        cat_pid: [],
        cat_level: ''
      },
      rules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: ['blur', 'change'] }
        ]
      },
      props: { // 查看element 级联选择器
        checkStrictly: true,
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      }
    }
  },
  created () {
    this.getCateGoriesList()
  },
  methods: {
    async getCateGoriesList () { // 渲染出页面
      this.loading = true
      const { meta, data } = await this.$axios.get(`categories`, {
        params: {
          type: 3,
          pagenum: this.pagenum,
          pagesize: this.pagesize
        }
      })
      // console.log(meta, data)
      if (meta.status === 200) {
        this.getList = data.result
        this.total = data.total
        // console.log(this.getList)
        // console.log(this.total)
      } else {
        this.$message.error(meta.msg)
      }
      this.loading = false
    },
    handleSizeChange (val) {
      // console.log(`每页 ${val} 条`)
      this.pagesize = val
      this.getCateGoriesList()
    },
    handleCurrentChange (val) {
      // console.log(`当前页: ${val}`)
      this.pagenum = val
      this.getCateGoriesList()
    },
    async del (catId, e) { // 删除按钮
      // console.log(catId)
      try {
        await this.$confirm('是否删除', '提升', { type: 'warning' })
        const { meta } = await this.$axios.delete(`categories/${catId}`)
        // console.log(meta)
        if (meta.status === 200) {
          this.$message.success(meta.msg)
          if (this.total % this.pagesize === 1) {
            if (Math.ceil(this.total / this.pagesize) === this.pagenum) {
              this.pagenum--
            }
          }
          this.getCateGoriesList()
        } else {
          this.$message.error(meta.msg)
        }
      } catch {
        this.$message.info('取消删除')
      } finally {
        if (e.target.nodName === 'I') {
          e.target.parentNode.blur()
        } else {
          e.target.blur()
        }
      }
    },
    change (row) { // 修改按钮
      this.assignVisible = true
      console.log(row)
      this.form.cat_name = row.cat_name
      this.form.id = row.cat_id
      this.form.cat_deleted = !row.cat_deleted
    },
    async changSure () { // 确认修改
      try {
        await this.$refs.form.validate()
        const { meta, data } = await this.$axios.put(`categories/${this.form.id}`, this.form)
        console.log(meta, data)
        this.assignVisible = false
        this.getCateGoriesList()
      } catch {
        return false
      }
    },
    async add () { // 点击添加按钮
      this.addVisible = true
      // 发送请求，拿到二级联动的数据
      const { meta, data } = await this.$axios.get(`categories`, {
        params: {
          type: 2
        }
      })
      console.log(data)
      if (meta.status === 200) {
        this.options = data
        // console.log(this.options)
      }
    },
    async addSuer () { // 点击添加模态框确认按钮
      try {
        await this.$refs.addForm.validate()
        const { meta, data } = await this.$axios.post(`categories`, {
          cat_pid: this.addForm.cat_pid[ this.addForm.cat_pid.length - 1 ] || 0,
          cat_name: this.addForm.cat_name,
          cat_level: this.addForm.cat_pid.length
        })
        console.log(meta, data)
        if (meta.status === 201) {
          this.addVisible = false
          this.$message.success(meta.msg)
          this.$refs.addForm.resetFields() // 表单重置
          this.getCateGoriesList()
        } else {
          this.$message.error(meta.msg)
        }
      } catch {
        return false
      }
    }
  }
}
</script>

<style>

</style>
