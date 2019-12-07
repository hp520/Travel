<template>
  <div class="Users">

    <!-- 分页签 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{path: '/users'}">用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 搜索内容和添加用户 -->
    <el-input placeholder="请输入内容" class="input-with-select" v-model="query">
      <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
    </el-input>

    <!-- 添加用户 -->
    <el-button type="success" plain @click="showAdd">添加用户</el-button>

    <!-- 用户详细信息 -->
    <el-table
      :data="userList"
      stripe
      style="width: 100%">
      <el-table-column
        prop="username"
        label="姓名">
      </el-table-column>
      <el-table-column
        prop="email"
        label="邮箱">
      </el-table-column>
      <el-table-column
        prop="mobile"
        label="电话">
      </el-table-column>
      <el-table-column
        label="用户状态">
        <template v-slot='{row}'>
          <!-- {{obj.row}} -->
          <!-- {{obj.$column}} -->
          <!-- {{obj.$index}} -->
          <el-switch
            v-model="row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="changeUser(row)">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column
        label="操作">
        <template v-slot='{row}'>
          <el-button type="primary" icon="el-icon-edit" circle @click="showEdit(row)"></el-button>
          <el-button type="danger" icon="el-icon-delete" circle @click="del(row.id,$event)"></el-button>
          <el-button round @click="showAssign(row)">分配角色</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <!-- total是总页数
    current-page是当前页 -->
    <el-pagination
      background
      layout="total, sizes,  prev, pager, next, jumper"
      :total="total"
      :page-sizes="[5, 10, 15, 20]"
      :current-page="pagenum"
      :page-size="pagesize"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
      >
    </el-pagination>

  <!-- 添加模态框 -->
  <el-dialog title="添加用户" :visible.sync="addVisible" width='35%'>
    <el-form :model="form" label-width="80px" :rules="rules" ref="form" status-icon>
      <el-form-item label="用户名" prop="username">
        <el-input placeholder="请输入用户名" v-model="form.username"></el-input>
      </el-form-item>
      <el-form-item label="用户密码" prop="password">
        <el-input placeholder="请输入用户密码" v-model="form.password"></el-input>
      </el-form-item>
      <el-form-item label="用户邮箱" prop="email">
        <el-input placeholder="请输入用户邮箱" v-model="form.email"></el-input>
      </el-form-item>
      <el-form-item label="手机号码" prop="mobile">
        <el-input placeholder="请输入手机号码" v-model="form.mobile"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="addVisible = false">取 消</el-button>
      <el-button type="primary" @click="add">确 定</el-button>
    </div>
  </el-dialog>

  <!-- 修改模态框 -->
  <el-dialog title="修改用户" :visible.sync="editVisible" width='35%'>
    <el-form :model="editForm" label-width="80px" :rules="rules" ref="editForm" status-icon>
      <el-form-item label="用户名" prop="username">
        <el-input placeholder="请输入用户名" v-model="editForm.username" :disabled="dis"></el-input>
      </el-form-item>
      <el-form-item label="用户邮箱" prop="email">
        <el-input placeholder="请输入用户邮箱" v-model="editForm.email"></el-input>
      </el-form-item>
      <el-form-item label="手机号码" prop="mobile">
        <el-input placeholder="请输入手机号码" v-model="editForm.mobile"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="editVisible = false">取 消</el-button>
      <el-button type="primary" @click="adit">确 定</el-button>
    </div>
  </el-dialog>

  <!-- 分配角色模态框 -->
  <el-dialog title="分配角色" :visible.sync="assignVisible" width='35%'>
    <el-form :model="assignForm" label-width="80px" :rules="rules" ref="assignForm" status-icon>
      <el-form-item label="用户名" prop="username" >
        <el-input placeholder="请输入用户名" v-model="assignForm.username" disabled></el-input>
      </el-form-item>
      <el-form-item label="分配角色" prop="rid">
        <el-select v-model="assignForm.rid" placeholder="请选择">
        <el-option
          v-for="item in roleList"
          :key="item.id"
          :label="item.roleName"
          :value="item.id">
        </el-option>
      </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="assignVisible = false">取 消</el-button>
      <el-button type="primary" @click="Assign">确 定</el-button>
    </div>
  </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      userList: [],
      roleList: [],
      query: '',
      pagenum: 1,
      pagesize: 5,
      total: 0,
      dis: true,
      // 添加的对话框
      addVisible: false,
      // 修改
      editVisible: false,
      // 分配角色
      assignVisible: false,

      // 添加模态框数据
      form: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },

      // 表单校验规则
      rules: {
        username: [
          { required: true, message: '请输入姓名', trigger: ['blur', 'change'] },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: ['blur', 'change'] }

        ],
        password: [
          { required: true, message: '请输入密码', trigger: ['blur', 'change'] },
          { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: ['blur', 'change'] }
        ],
        email: [
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ],
        mobile: [
          { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: ['blur', 'change'] }
        ],
        rid: [
          { required: true, message: '角色不能为空', trigger: ['change', 'blur'] }
        ]
      },

      // 修改模态框数据
      editForm: {
        id: '',
        email: '',
        mobile: '',
        username: ''
      },
      // 分配角色数据
      assignForm: {
        id: '',
        rid: '',
        username: ''
      }
    }
  },
  created () {
    this.getUserList()
  },
  methods: {
    async getUserList () {
      const { meta, data } = await this.$axios.get('users', {
        params: {
          query: this.query,
          pagenum: this.pagenum,
          pagesize: this.pagesize
        }
      })
      if (meta.status === 200) {
        // console.log(data)
        // data中有total和pagenum
        this.total = data.total
        this.userList = data.users
        // console.log(this.userList)
      }
    },
    // 改变用户状态
    async changeUser ({ id, mg_state: mgState }) {
      // console.log(id, mgState)
      const { meta } = await this.$axios.put(`users/${id}/state/${mgState}`)
      if (meta.status === 200) {
        this.$message.success(meta.msg)
        this.getUserList()
      } else {
        this.$message.error(meta.msg)
      }
    },

    // 删除用户
    async del (id, e) {
      try {
        await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', { type: 'warning' })
        // 发送axios
        const { meta } = await this.$axios.delete(`users/${id}`)
        if (meta.status === 200) {
          this.$message.success('删除ok了')
          if (this.total % this.pagesize === 1) {
            if (Math.ceil(this.total / this.pagesize) === this.pagenum) {
              // this.total--
              this.pagenum--
            }
            // this.pagenum = Math.ceil(this.total / this.pagesize)
          }
          this.getUserList()
        } else {
          this.$message.error(meta.msg)
        }
      } catch {
        this.$message.info('取消删除')
      } finally {
        if (e.target.nodeName === 'I') {
          e.target.parentNode.blur()
        } else {
          e.target.blur()
        }
      }
    },

    // 分页签current-change 来自element分页签事件
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
      this.pagesize = val
      this.getUserList()
    },

    // 分页签size-change 来自element分页签事件
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
      this.pagenum = val
      this.getUserList()
    },

    search () { // 搜索
      this.pagenum = 1
      this.getUserList()
    },

    // 展示添加用户模态框
    showAdd () {
      this.addVisible = true
    },

    // 添加用户模态框点击确认事件
    async add () {
      try {
        await this.$refs.form.validate()
        const { meta } = await this.$axios.post('users', this.form)
        // console.log(meta)
        if (meta.status === 201) {
          // 提示消息
          this.$message.success(meta.msg)
          // 表单重置
          this.$refs.form.resetFields()
          // 隐藏模态框
          this.addVisible = false
          // 手动渲染到最后一页
          this.total++
          this.pagenum = Math.ceil(this.total / this.pagesize)
          this.getUserList()
        }
      } catch {
        return false
      }
    },

    // 展示修改模态框
    showEdit (row) {
      this.dis = true
      if (row.username.length >= 6) {
        this.dis = false
      }
      console.log(row)
      this.editVisible = true
      this.editForm = { ...row }
    },
    // 修改模态框点击确认事件
    async adit () {
      try {
        await this.$refs.editForm.validate()
        const { meta } = await this.$axios.put(`users/${this.editForm.id}`, this.editForm)
        console.log(meta)
        if (meta.status === 200) {
          this.$message.success(meta.msg)
          this.$refs.editForm.resetFields()
          this.editVisible = false
          this.getUserList()
        } else {
          this.$message.error(meta.msg)
        }
      } catch {
        return false
      }
    },

    // 展示分配角色模态框 并且渲染下拉框
    async showAssign (row) {
      this.assignVisible = true
      // console.log(row)
      // console.log(row.username)
      this.assignForm.id = row.id
      this.assignForm.username = row.username
      // 由于row里面没有rid所以要发axios获取
      const { meta, data } = await this.$axios.get(`users/${row.id}`)
      // console.log(meta, data)
      if (meta.status === 200) {
        if (data.rid === -1) {
          this.assignForm.rid = ''
        } else {
          this.assignForm.rid = data.rid
        }
      }
      // 发送请求，获取下拉列表的角色列表
      const res = await this.$axios.get('roles')
      // console.log(res)
      if (res.meta.status === 200) {
        this.roleList = res.data
      }
    },
    // 分配角色点击确认按钮事件
    async Assign () {
      try {
        await this.$refs.assignForm.validate()
        const { id, rid } = this.assignForm
        const { meta } = await this.$axios.put(`users/${id}/role`, { rid })
        if (meta.status === 200) {
          this.$message.success(meta.msg)
          this.assignVisible = false
          this.getUserList()
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

<style lang='less' scope>
  .Users{
    .input-with-select {
      margin: 10px 10px 10px 0;
      width: 300px;
    }
  }
</style>
