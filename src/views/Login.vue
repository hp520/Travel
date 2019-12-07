<template>
<div class="Login">
  <el-form ref="form" :model="form" label-width="80px" :rules="rules" status-icon >
    <img src="../assets/avatar.jpg" alt="">
    <el-form-item label="用户名" prop='username'>
      <el-input v-model="form.username" placeholder="请输入用户名"></el-input>
    </el-form-item>
    <el-form-item label="密码" prop="password">
      <el-input v-model="form.password" placeholder="请输入密码" type="password" @keyup.enter.native="login"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="login">登录</el-button>
      <el-button @click='reseForm'>重置</el-button>
    </el-form-item>
  </el-form>
</div>
</template>

<script>
// import axios from 'axios'
export default {
  data () {
    return {
      form: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入姓名', trigger: ['blur', 'change'] },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: ['blur', 'change'] }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: ['blur', 'change'] },
          { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  methods: {
    reseForm () {
      // 表单重置resetFields是element里面的表单方法
      this.$refs.form.resetFields()
    },
    login () {
      this.$refs.form.validate(async valid => {
        if (!valid) return
        // console.log('该发送ajax请求了')
        const { meta, data } = await this.$axios.post('login', this.form)
        if (meta.status === 200) {
          // 在这里用到token存到localStorage里面 当登录成功时res.data.data里面会有roken
          localStorage.setItem('token', data.token)
          this.$message.success(meta.msg)
          this.$router.push('/home')
        } else {
          this.$message.error(meta.msg)
        }
      })
      /*  this.$axios({
          method: 'post',
          url: 'login',
          // url: 'http://localhost:8888/api/private/v1/login',
          data: this.form
        }).then(res => {
          // 解构赋值 因为对象是无序的所以meta会匹配到res.data.meat
          // const { meta, data } = res.data 由于在index里面设置了响应，导致res就是data
          const { meta, data } = res
          // console.log(res)
          // console.log(res.data)
          // console.log(res.data.meta)
          if (meta.status === 200) {
            // 在这里用到token存到localStorage里面 当登录成功时res.data.data里面会有roken
            localStorage.setItem('token', data.token)
            this.$message.success(meta.msg)
            this.$router.push('/home')
          } else {
            this.$message.error(meta.msg)
          }
        }) */
    }
  }
}
</script>

<style lang='less'>
.Login{
  background-color: rgb(61, 60, 60);
  height: 100%;
  overflow: hidden;
  .el-form{
    background-color: #fff;
    width: 500px;
    margin: 200px auto;
    padding: 75px 50px 20px;
    position: relative;
    img{
      position: absolute;
      top: -70px;
      left: 50%;
      transform: translateX(-50%);
      border: 10px solid #fff;
      border-radius: 50%;
    }
    .el-button:nth-child(2){
      margin-left: 80px;
    }
  }
}
</style>
