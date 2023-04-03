<template>
  <el-form ref="form" :model="user" :rules="rules" label-width="80px">
    <el-form-item label="用户名称" prop="name">
      <el-input v-model.trim="user.name" />
    </el-form-item>
    <el-form-item label="手机号码" prop="phoneNumber">
      <el-input v-model.trim="user.phoneNumber" />
    </el-form-item>
    <el-form-item label="邮箱" prop="email">
      <el-input v-model.trim="user.email" />
    </el-form-item>
    <el-form-item label="性别">
      <el-radio v-model="user.sex" :label="1">男</el-radio>
      <el-radio v-model="user.sex" :label="0">女</el-radio>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" size="mini" @click="submit">保存</el-button>
      <el-button type="danger" size="mini" @click="cancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { updateProfile } from '@/api/system/user'
export default {
  props: {
    user: {
      type: Object,
      default: () => {
        return {
          name: '',
          phoneNumber: '',
          email: '',
          sex: undefined
        }
      }
    }
  },
  data() {
    return {
      rules: {
        name: [
          { required: true, message: '用户昵称不能为空', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '邮箱地址不能为空', trigger: 'blur' },
          {
            type: 'email',
            message: '请输入正确的邮箱地址',
            trigger: ['blur', 'change']
          }
        ],
        phoneNumber: [
          { required: true, message: '手机号码不能为空', trigger: 'blur' },
          {
            pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
            message: '请输入正确的手机号码',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    submit() {
      updateProfile(this.user).then(res => {
        this.$message({
          message: '修改成功',
          type: 'success'
        })
        this.$emit('ok')
      })
    },
    cancel() {
      this.$store.dispatch('tagsView/delView', this.$router.currentRoute)
      this.$router.back()
    }
  }
}
</script>
