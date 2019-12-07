<template>
  <div class="Goods-add">
    <el-steps :active="active" finish-status="success" >
      <el-step title="步骤 1" description="基本信息"></el-step>
      <el-step title="步骤 2" description="商品图片"></el-step>
      <el-step title="步骤 3" description="商品内容"></el-step>
    </el-steps>
      <el-tabs tabPosition="left" v-model="activeTab" @tab-click="handleClick">

        <el-tab-pane label="基本信息" name="0">
          <el-form label-width="80px" :model="form"  :rules="rules" >
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="form.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="form.goods_price" ></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="form.goods_weight"  ></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="form.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类">
              <el-cascader
                :props="props"
                clearable
                v-model="form.goods_cat"
                :options="options"></el-cascader>
            </el-form-item>
            <el-form-item label="商品数量">
              <el-radio-group v-model="radio">
                <el-radio :label="1">是</el-radio>
                <el-radio :label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-form>
          <el-button @click="next" style="margin-top: 12px;">下一步</el-button>
        </el-tab-pane>

        <el-tab-pane label="商品图片" name="1">
          <el-upload
          :on-success="handleSuccess"
          :headers="headers"
          name="file"
          action="http://localhost:8888/api/private/v1/upload"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove">
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
        <el-button @click="next" style="margin-top: 12px;">下一步</el-button>
        </el-tab-pane>

        <el-tab-pane label="商品内容" name="2">
          <!-- 富文本编辑器 -->
          <quill-editor v-model="form.goods_introduce"></quill-editor>
          <el-button @click="add" style="margin-top: 12px;">添加</el-button>
        </el-tab-pane>
      </el-tabs>
  </div>
</template>

<script>
export default {
  data () {
    return {
      dialogImageUrl: '', // 用于展示图片将图片地址=这个值
      dialogVisible: false, // 用来展示图片
      active: 0,
      activeTab: '0',
      options: [],
      form: {
        goods_name: '',
        goods_cat: [], // 级联选择器
        goods_price: '',
        goods_number: '',
        goods_weight: '',
        goods_introduce: '', // 和富文本编辑器绑定
        pics: [] // 存放图片
      },
      headers: { // 上传图片时要传请求头token
        Authorization: localStorage.getItem('token')
      },
      radio: 1,
      props: { // 级联选择器
        checkStrictly: true,
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      rules: { // 表单验证不能为空
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: ['blur', 'change'] }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: ['blur', 'change'] }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: ['blur', 'change'] }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  async created () { // 获取级联选择器数据
    const { meta, data } = await this.$axios.get('categories?type=3')
    // console.log(meta, data)
    if (meta.status === 200) {
      this.options = data
      // console.log(this.options)
    }
  },
  methods: {
    next () {
      // 控制步骤
      this.active++
      // 控制tab烂和步骤同时显示
      this.activeTab = this.active + ''
    },
    handleClick (tab, event) {
      // console.log(tab, event)
      // console.log(tab.index)
      this.active = +tab.index
    },
    handleSuccess (response, file, fileList) { // 图片上传成功是自动调用
      // console.log(response, file, fileList)
      const { meta, data } = response
      // console.log(meta, data)
      if (meta.status === 200) {
        this.form.pics.push({
          'pic': data.tmp_path
        })
      } else {
        this.$message.error(meta.msg)
      }
    },
    handleRemove (file, fileList) { // 删除图片
      // console.log('file', file)
      const path = file.response.data.tmp_path
      this.form.pics = this.form.pics.filter(item => item.pic !== path)
      // console.log('fileList', fileList)
    },
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    async add () { // 添加
      const { meta, data } = await this.$axios.post(`goods`, {
        ...this.form,
        goods_cat: this.form.goods_cat.join(',')
      })
      console.log(meta, data)
      if (meta.status === 201) {
        this.$message.success(meta.msg)
        this.$router.push('/goods')
      } else {
        this.$message.error(meta.msg)
      }
    }
  }
}
</script>

<style lang='less' scoped>
// 去掉了 scoped, 就可以向下渗透, 影响到其他组件, (只要满足类名即可)
// scoped 的样式, 只能作用于当前 模板中 的内容
// scoped 的样式, 无法渗透到子组件中去的
  .quill-editor {
  background-color: #fff;

  /deep/ .ql-editor {
    min-height: 400px;
  }
}
</style>
