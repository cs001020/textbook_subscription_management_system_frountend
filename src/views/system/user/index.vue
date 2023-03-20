<template>
  <div class="app-container">
    <!-- 查询 -->
    <el-form v-show="showSearch" ref="queryForm" :model="queryParams" size="small" :inline="true" label-width="68px">
      <el-form-item label="用户名称" prop="userName">
        <el-input
          v-model="queryParams.account"
          placeholder="请输入用户昵称或账号"
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
      <el-form-item label="类型" prop="type">
        <el-select
          v-model="queryParams.type"
          placeholder="用户类型"
          clearable
          style="width: 240px"
        >
          <el-option
            v-for="dict in userType"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select
          v-model="queryParams.state"
          placeholder="用户状态"
          clearable
          style="width: 240px"
        >
          <el-option
            v-for="dict in userState"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 用户表格 -->
    <el-table v-loading="loading" :data="userList">
      <el-table-column label="用户编号" align="center" prop="id" />
      <el-table-column label="登陆账号" align="center" prop="account" :show-overflow-tooltip="true" />
      <el-table-column label="用户昵称" align="center" prop="name" :show-overflow-tooltip="true" />
      <el-table-column label="手机号码" align="center" prop="phoneNumber" width="120" />
      <el-table-column label="类型" align="center" prop="type" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <el-tag :type="scope.row.type==='TEACHER'?'warning':''">{{ scope.row.type |userTypeNameFilter }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.state"
            :disabled="scope.row.name===$store.getters.name"
            active-value="NORMAL"
            inactive-value="BAN"
            @change="handleStatusChange(scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime" width="160">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime|parseTime }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width="230"
        class-name="small-padding fixed-width"
      >
        <template v-if="scope.row.name !== $store.getters.name" slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
          >删除</el-button>
          <el-dropdown size="mini" @command="(command) => handleCommand(command, scope.row)">
            <el-button size="mini" type="text" icon="el-icon-d-arrow-right">更多</el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                command="handleResetPwd"
                icon="el-icon-key"
              >重置密码</el-dropdown-item>
              <el-dropdown-item
                command="handleAuthRole"
                icon="el-icon-circle-check"
              >分配角色</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.page"
      :limit.sync="queryParams.size"
      @pagination="getList"
    />

    <!-- 添加或修改用户配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="用户昵称" prop="name">
              <el-input v-model="form.name" placeholder="请输入用户昵称" maxlength="30" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="手机号码" prop="phoneNumber">
              <el-input v-model="form.phoneNumber" placeholder="请输入手机号码" maxlength="11" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="登陆账号" prop="account">
              <el-input v-model="form.account" placeholder="请输入用户名称" maxlength="30" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="用户密码" prop="password">
              <el-input v-model="form.password" placeholder="请输入用户密码" type="password" maxlength="20" show-password />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="状态">
              <el-radio-group v-model="form.state">
                <el-radio
                  v-for="dict in userState"
                  :key="dict.value"
                  :label="dict.value"
                >{{ dict.label }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { list, changeState, userInfo, update, deleteUser, restPwd } from '@/api/system/user'
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination/index.vue'

export default {
  name: 'User',
  components: { Pagination },
  filters: {
    parseTime,
    userTypeNameFilter(type) {
      const map = {
        'STUDENT': '学生',
        'TEACHER': '教师'
      }
      return map[type]
    }
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 用户表格数据
      userList: null,
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 表单参数
      form: {},
      // 查询参数
      queryParams: {
        page: 1,
        size: 10,
        account: undefined,
        phoneNumber: undefined,
        state: undefined,
        type: undefined
      },
      // 表单校验
      rules: {
        name: [
          { min: 2, max: 20, message: '用户昵称长度必须介于 2 和 20 之间', trigger: 'blur' }
        ],
        phoneNumber: [
          {
            pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
            message: '请输入正确的手机号码',
            trigger: 'blur'
          }
        ],
        account: [
          { required: true, message: '登陆账号不能为空', trigger: 'blur' },
          { min: 2, max: 20, message: '登陆账号长度必须介于 2 和 20 之间', trigger: 'blur' }
        ],
        password: [
          { min: 5, max: 20, message: '用户密码长度必须介于 5 和 20 之间', trigger: 'blur' }
        ]
      },
      userType: [
        {
          label: '学生',
          value: 'STUDENT'
        },
        {
          label: '教师',
          value: 'TEACHER'
        }
      ],
      userState: [
        {
          label: '正常',
          value: 'NORMAL'
        },
        {
          label: '封禁',
          value: 'BAN'
        }
      ]
    }
  },
  created() {
    this.getList()
  },
  methods: {
    /** 查询用户列表 */
    getList() {
      this.loading = true
      list(this.queryParams).then(response => {
        this.userList = response.data
        this.total = response.total
        this.loading = false
      }
      )
    },
    // 用户状态修改
    handleStatusChange(row) {
      console.log(row.state)
      const text = row.state === 'NORMAL' ? '启用' : '停用'
      this.$confirm('确认要"' + text + '""' + row.name + '"用户吗？').then(function() {
        return changeState({ id: row.id, state: row.state })
      }).then(() => {
        this.$message({ message: text + '成功', type: 'success' })
      }).catch(function() {
        row.state = row.state === 'NORMAL' ? 'BAN' : 'NORMAL'
      })
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      userInfo(row.id).then(response => {
        this.form = response.data
        this.open = true
        this.title = '修改用户'
      })
    },
    // 表单重置
    reset() {
      this.form = {}
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          update(this.form).then(response => {
            this.$message({ type: 'success', message: '修改成功' })
            this.open = false
            this.getList()
          })
        }
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const { id } = row
      this.$confirm('是否确认删除用户编号为"' + id + '"的数据项？').then(function() {
        return deleteUser(id)
      }).then(() => {
        this.getList()
        this.$message({ message: '删除成功', type: 'success' })
      }).catch(() => {})
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.page = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.queryParams = {
        page: 1,
        size: 10,
        account: undefined,
        phoneNumber: undefined,
        state: undefined,
        type: undefined
      }
      this.handleQuery()
    },
    // 更多操作触发
    handleCommand(command, row) {
      switch (command) {
        case 'handleResetPwd':
          this.handleResetPwd(row)
          break
        case 'handleAuthRole':
          this.handleAuthRole(row)
          break
        default:
          break
      }
    },
    /** 重置密码按钮操作 */
    handleResetPwd(row) {
      const { id, name } = row
      this.$prompt('请输入"' + name + '"的新密码', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        closeOnClickModal: false,
        inputPattern: /^.{5,20}$/,
        inputErrorMessage: '用户密码长度必须介于 5 和 20 之间'
      }).then(({ value }) => {
        restPwd(id, value).then(response => {
          this.$message({ message: '修改成功，新密码是：' + value, type: 'success' })
        })
      }).catch(() => {})
    },
    /** 分配角色操作 */
    handleAuthRole: function(row) {
      const { id } = row
      this.$router.push({ path: `/system/user-auth/role/${id}` })
    }
  }
}
</script>
