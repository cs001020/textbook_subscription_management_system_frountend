<template>
  <div class="app-container">
    <h4 class="form-header h4">基本信息</h4>
    <el-form ref="form" :model="form" label-width="80px">
      <el-row>
        <el-col :span="8" :offset="2">
          <el-form-item label="用户昵称" prop="nickName">
            <el-input v-model="form.name" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="8" :offset="2">
          <el-form-item label="登录账号" prop="userName">
            <el-input v-model="form.account" disabled />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <h4 class="form-header h4">角色信息</h4>
    <el-table ref="table" v-loading="loading" :row-key="getRowKey" :data="roles" @row-click="clickRow" @selection-change="handleSelectionChange">
      <el-table-column label="序号" type="index" align="center" />
      <el-table-column type="selection" :reserve-selection="true" width="55" />
      <el-table-column label="角色编号" align="center" prop="id" />
      <el-table-column label="角色名称" align="center" prop="description" />
      <el-table-column label="权限字符" align="center" prop="name" />
      <el-table-column label="状态" align="center" width="100">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.state"
            active-value="NORMAL"
            inactive-value="DISABLE"
            disabled
          />
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime" width="180">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime |parseTime }}</span>
        </template>
      </el-table-column>
    </el-table>

    <el-form label-width="100px">
      <el-form-item style="text-align: center;margin-left:-120px;margin-top:30px;">
        <el-button type="primary" @click="submitForm()">提交</el-button>
        <el-button @click="close()">返回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { authRole, updateAuthRole } from '@/api/system/user'
import { parseTime } from '@/utils'

export default {
  name: 'AuthRole',
  filters: {
    parseTime
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中角色编号
      roleIds: [],
      // 角色信息
      roles: [],
      // 用户信息
      form: {}
    }
  },
  created() {
    const { userId } = this.$route.params
    if (userId) {
      this.loading = true
      authRole(userId).then((response) => {
        const { user, roleList } = response.data
        this.form = user
        this.roles = roleList
        this.$nextTick(() => {
          this.roles.forEach((row) => {
            if (row.flag) {
              this.$refs.table.toggleRowSelection(row)
            }
          })
        })
        this.loading = false
      })
    }
  },
  methods: {
    /** 单击选中行数据 */
    clickRow(row) {
      this.$refs.table.toggleRowSelection(row)
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.roleIds = selection.map((item) => item.id)
    },
    // 保存选中的数据编号
    getRowKey(row) {
      return row.id
    },
    /** 提交按钮 */
    submitForm() {
      const userId = this.form.id
      const roleIds = this.roleIds.join(',')
      updateAuthRole({ userId, roleIds }).then((response) => {
        this.$message({ message: '授权成功', type: 'success' })
        this.close()
      })
    },
    /** 关闭按钮 */
    close() {
      this.$store.dispatch('tagsView/delView', this.$router.currentRoute)
      this.$router.push({ path: '/system/user' })
    }
  }
}
</script>
