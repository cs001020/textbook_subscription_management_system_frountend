<template>
  <div class="app-container">
    <!--搜索栏-->
    <el-form ref="queryForm" :model="queryParams" size="small" :inline="true">
      <el-form-item label="登陆账号" prop="userName">
        <el-input
          v-model="queryParams.account"
          placeholder="请输入登陆账号"
          clearable
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="手机号码" prop="phoneNumber">
        <el-input
          v-model="queryParams.phoneNumber"
          placeholder="请输入手机号码"
          clearable
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <!--操作按钮-->
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="openSelectUser"
        >添加用户</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-circle-close"
          size="mini"
          :disabled="multiple"
          @click="cancelAuthUserAll"
        >批量取消授权</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-close"
          size="mini"
          @click="handleClose"
        >关闭</el-button>
      </el-col>
    </el-row>
    <!--表格-->
    <el-table v-loading="loading" :data="userList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="登陆账号" prop="account" :show-overflow-tooltip="true" />
      <el-table-column label="用户昵称" prop="name" :show-overflow-tooltip="true" />
      <el-table-column label="手机" prop="phoneNumber" :show-overflow-tooltip="true" />
      <el-table-column label="状态" align="center" prop="status">
        <template slot-scope="scope">
          <el-tag :type="scope.row.state==='NORMAL'?'':'danger'">{{ scope.row.state==='NORMAL'?'正常':'禁用' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime" width="180">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime | parseTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-circle-close"
            @click="cancelAuthUser(scope.row)"
          >取消授权</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--分页插件-->
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.page"
      :limit.sync="queryParams.size"
      @pagination="getList"
    />
    <select-user ref="select" :role-id="id" @ok="handleQuery" />
  </div>
</template>

<script>
import { allocatedUserList, authUserCancelAll } from '@/api/system/role'
import { parseTime } from '@/utils'
import selectUser from './selectUser'
import Pagination from '@/views/commons/components/Pagination/index.vue'

export default {
  name: 'AuthUser',
  components: { Pagination, selectUser },
  filters: {
    parseTime
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中用户组
      userIds: [],
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      // 用户表格数据
      userList: [],
      // 查询参数
      queryParams: {
        page: 1,
        size: 10,
        account: undefined,
        phoneNumber: undefined
      },
      id: undefined
    }
  },
  created() {
    const roleId = this.$route.params.roleId
    if (roleId) {
      this.id = roleId
      this.getList()
    }
  },
  methods: {
    /** 查询授权用户列表 */
    getList() {
      this.loading = true
      allocatedUserList(this.id, this.queryParams).then(response => {
        this.userList = response.data
        this.total = response.total
        this.loading = false
      }
      )
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.queryParams = {
        page: 1,
        size: 10,
        account: undefined,
        phoneNumber: undefined
      }
      this.handleQuery()
    },
    /** 打开授权用户表弹窗 */
    openSelectUser() {
      this.$refs.select.show()
    },
    /** 取消授权按钮操作 */
    cancelAuthUser(row) {
      const roleId = this.id
      console.log({ userIds: row.id, roleId: roleId })
      this.$confirm('确认要取消该用户"' + row.name + '"角色吗？').then(function() {
        return authUserCancelAll({ userIds: row.id, roleId: roleId })
      }).then(() => {
        this.getList()
        this.$message({ message: '取消授权成功', type: 'success' })
      }).catch(() => {})
    },
    /** 批量取消授权按钮操作 */
    cancelAuthUserAll(row) {
      const roleId = this.id
      const userIds = this.userIds.join(',')
      if (userIds === '') {
        this.$message({ message: '请选择要取消授权的用户', type: 'error' })
        return
      }
      this.$confirm('是否取消选中用户授权数据项？').then(function() {
        return authUserCancelAll({ roleId: roleId, userIds: userIds })
      }).then(() => {
        this.getList()
        this.$message({ message: '取消授权成功', type: 'success' })
      }).catch(() => {})
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.userIds = selection.map(item => item.id)
      this.multiple = !selection.length
    },
    // 返回按钮
    handleClose() {
      this.$store.dispatch('tagsView/delView', this.$router.currentRoute)
      this.$router.push({ path: '/system/role' })
    }
  }
}
</script>
