<template>
  <el-form ref="form" :model="user" label-width="80px">
    <el-form-item label="学号/工号  ">
      <el-input v-model.trim="user.id" />
    </el-form-item>
    <el-form-item label="用户名称">
      <el-input v-model.trim="user.name" />
    </el-form-item>
    <el-form-item label="手机号码">
      <el-input v-model.trim="user.phonenumber" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" size="mini" @click="submit">保存</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  props: {
    user: {
      type: Object,
      default: () => {
        return {
          name: '',
          email: ''
        }
      }
    }
  },
  methods: {
    submit() {
      this.$message({
        message: 'User information has been updated successfully',
        type: 'success',
        duration: 5 * 1000
      })
    }
  }
}
</script>
