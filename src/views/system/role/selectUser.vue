<template>
  <!-- 授权用户 -->
  <el-dialog title="选择用户" :visible.sync="visible" width="800px" top="5vh" append-to-body>
    <el-form ref="queryForm" :model="queryParams" size="small" :inline="true">
      <el-form-item label="登陆账号" prop="userName">
        <el-input
          v-model="queryParams.account"
          placeholder="请输入登陆账号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="手机号码" prop="phoneNumber">
        <el-input
          v-model="queryParams.phoneNumber"
          placeholder="请输入手机号码"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-row>
      <el-table ref="table" :data="userList" height="260px" @row-click="clickRow" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" />
        <el-table-column label="登陆账号" prop="account" :show-overflow-tooltip="true" />
        <el-table-column label="用户昵称" prop="name" :show-overflow-tooltip="true" />
        <el-table-column label="手机" prop="phoneNumber" :show-overflow-tooltip="true" />
        <el-table-column label="创建时间" align="center" prop="createTime" width="180">
          <template slot-scope="scope">
            <span>{{ scope.row.createTime | parseTime }}</span>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="queryParams.page"
        :limit.sync="queryParams.size"
        @pagination="getList"
      />
    </el-row>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="handleSelectUser">确 定</el-button>
      <el-button @click="visible = false">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { unallocatedUserList, authUserSelectAll } from '@/api/system/role'
import Pagination from '@/views/commons/components/Pagination/index.vue'
import { parseTime } from '@/utils'
export default {
  components: { Pagination },
  filters: {
    parseTime
  },
  props: {
    // 角色编号
    // eslint-disable-next-line vue/require-default-prop
    roleId: {
      type: [Number, String]
    }
  },
  data() {
    return {
      // 遮罩层
      visible: false,
      // 选中数组值
      userIds: [],
      // 总条数
      total: 0,
      // 未授权用户数据
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
  methods: {
    // 显示弹框
    show() {
      this.id = this.roleId
      this.getList()
      this.visible = true
    },
    // 查询表数据
    getList() {
      unallocatedUserList(this.id, this.queryParams).then(res => {
        this.userList = res.data
        this.total = res.total
      })
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
    clickRow(row) {
      this.$refs.table.toggleRowSelection(row)
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.userIds = selection.map(item => item.id)
    },
    /** 选择授权用户操作 */
    handleSelectUser() {
      const roleId = this.id
      const userIds = this.userIds.join(',')
      if (userIds === '') {
        this.$message({ message: '请选择要分配的用户', type: 'error' })
        return
      }
      authUserSelectAll({ roleId: roleId, userIds: userIds }).then(res => {
        this.$message({ message: res.msg, type: 'success' })
        if (res.code === 200) {
          this.visible = false
          this.$emit('ok')
        }
      })
    }
  }
}
</script>
