<template>
  <div class="Rolse">
    <!-- 分页签 -->
    <el-breadcrumb separator="/" >
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{path: '/roles'}">角色管理</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 添加角色 -->

    <el-button type="success" plain @click="add">添加角色</el-button>

    <!-- 添加角色模板 -->

    <el-dialog title="添加角色" :visible.sync="editVisible" width="40%">
      <el-form status-icon :rules="rules" label-width="80px" :model="form" ref="form">
        <el-form-item label="角色名称" prop="roleName">
          <el-input placeholder="请输入角色名称" v-model="form.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input placeholder="请输入角色描述" v-model="form.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">取 消</el-button>
        <el-button type="primary" @click="addSure">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 表格 -->
    <el-table
    style="width: 100%"
    :data="rolselist">
      <el-table-column type="expand">
        <template v-slot='{ row }'>
          <!-- el-row是行  el-col是列 -->
          <!-- 一级 -->
          <el-row v-for="l1 in row.children" :key="l1.id" class="l1">
            <el-col :span="4">
              <el-tag closable @close="delRolse(row,l1.id)">{{l1.authName}}</el-tag>
            </el-col>
            <el-col :span="20">
              <!-- 二级 -->
              <el-row v-for="l2 in l1.children" :key="l2.id" class="l2">
                <el-col :span="4">
                  <el-tag closable type="success" @close="delRolse(row,l2.id)">{{l2.authName}}</el-tag>
                </el-col>
                <el-col :span="20">
                  <!-- 三级 -->
                  <el-tag v-for="l3 in l2.children" :key="l3.id" class="l3" closable type="warning" @close="delRolse(row,l3.id)">{{l3.authName}}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column label="角色名称" prop="roleName"></el-table-column>
      <el-table-column label="描述" prop="roleDesc"></el-table-column>
      <el-table-column label="操作">
        <template v-slot='{ row }'>
          <el-button type="primary" icon="el-icon-edit" circle plain @click="changee(row)"></el-button>
          <el-button type="danger" circle icon="el-icon-delete" plain @click="dell(row.id,$event)"></el-button>
          <el-button type="success" plain @click="showAssignDialog(row)">分配权限</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 修改模态框 -->
    <el-dialog title="修改提升" :visible.sync="changeVisible" width="40%">
      <el-form status-icon :rules="rules" label-width="80px" :model="changeForm" ref="form">
        <el-form-item label="角色名称" prop="roleName">
          <el-input placeholder="请输入角色名称" v-model="changeForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input placeholder="请输入角色描述" v-model="changeForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="changeVisible = false">取 消</el-button>
        <el-button type="primary" @click="changeRolse">确 定</el-button>
      </span>
    </el-dialog>

  <!-- 分配权限模态框 -->
  <el-dialog title="温馨提示" :visible.sync="assignVisible" width="40%">
    <el-tree
      ref="tree"
      node-key="id"
      :props="defaultProps"
      :data="data"
      show-checkbox
      default-expand-all>
    </el-tree>
    <span slot="footer" class="dialog-footer">
      <el-button @click="assignVisible = false">取 消</el-button>
      <el-button @click="assignRights" type="primary">确 定</el-button>
    </span>
  </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      editVisible: false,
      changeVisible: false,
      rolselist: [],
      assignVisible: false,
      data: [],
      defaultProps: {
        children: 'children',
        label: 'authName'
      },
      roleld: '',
      form: {
        roleName: '',
        roleDesc: ''
      },
      changeForm: {
        id: '',
        roleName: '',
        roleDesc: ''
      },
      rules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: ['change', 'blur'] }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: ['change', 'blur'] }
        ]
      }
    }
  },
  created () {
    this.getRolseList()
  },
  methods: {
    async getRolseList () { // 渲染出表单
      const { meta, data } = await this.$axios.get(`roles`)
      // console.log(meta, data)
      if (meta.status === 200) {
        this.rolselist = data
        // console.log(this.rolselist)
      } else {
        this.$message.error(meta.msg)
      }
    },
    async delRolse (row, rightId) { // 删除树状图
      // console.log(row, rightId)
      const { meta, data } = await this.$axios.delete(`roles/${row.id}/rights/${rightId}`)
      // console.log(meta, data)
      // 这个data是删除完以后后台还剩下的数据
      if (meta.status === 200) {
        this.$message.success(meta.msg)
        row.children = data
      } else {
        this.$message.error(meta.msg)
      }
    },
    async showAssignDialog (row) { // 点击分配权限 弹出模态框，渲染树状图
      this.roleld = row.id
      this.assignVisible = true
      // console.log(row)
      const { data } = await this.$axios.get(`rights/tree`)
      // console.log(data)
      this.data = data
      console.log(this.data)
      const ids = []
      row.children.forEach(l1 => {
        l1.children.forEach(l2 => {
          l2.children.forEach(l3 => {
            ids.push(l3.id)
          })
        })
      })
      // console.log(ids)
      this.$refs.tree.setCheckedKeys(ids)
    },
    async assignRights () { // 点击分配权限模态框确认按钮
      // console.log(111)
      // 我需要获取到我勾选的所有的id 这里面的getCheckedKeys，getHalfCheckedKeys是element 里面的tree树状图里面的方法
      const ids = this.$refs.tree.getCheckedKeys()
      const idd = this.$refs.tree.getHalfCheckedKeys()
      console.log(ids, idd)
      const rids = [...ids, ...idd].join(',')
      // 然后根据id去发送请求
      const { meta } = await this.$axios.post(`roles/${this.roleld}/rights`, { rids })
      // console.log(meta)
      if (meta.status === 200) {
        this.assignVisible = false
        this.getRolseList()
      }
    },
    add () { // 点击添加按钮，弹出模态框
      this.editVisible = true
    },
    async addSure () { // 点击添加按钮后弹出的模态框确认按钮
      try {
        await this.$refs.form.validate()
        const { meta } = await this.$axios.post(`roles`, this.form)
        console.log(meta)
        if (meta.status === 201) {
          // 提示消息
          this.$message.success(meta.msg)
          // 表单重置
          this.$refs.form.resetFields()
          // 隐藏模态框
          this.editVisible = false
          this.getRolseList()
        }
      } catch {
        return false
      }
    },
    changee (row) {
      this.changeVisible = true
      console.log(row)
      this.changeForm = { ...row }
    },
    async changeRolse () {
      try {
        await this.$refs.form.validate()
        const { meta } = await this.$axios.put(`roles/${this.changeForm.id}`, this.changeForm)
        // console.log(meta)
        if (meta.status === 200) {
          this.changeVisible = false
          this.getRolseList()
          this.$message.success(meta.msg)
        }
      } catch {
        return false
      }
    },
    async dell (id, e) { // 删除按钮
      try {
        await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', { type: 'warning' })
        // 发送axios
        const { meta } = await this.$axios.delete(`roles/${id}`)
        if (meta.status === 200) {
          this.$message.success('删除ok了')
          this.getRolseList()
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
    }
  }

}
</script>

<style lang='less' scope>
.Rolse{
  .l1{
    margin-bottom: 30px;
    border-bottom: 1px dashed #ccc;
    .l2{
      margin-bottom: 10px;
    }
    .l3{
      margin-right:10px;
      margin-bottom: 10px;
    }
  }
}
</style>
