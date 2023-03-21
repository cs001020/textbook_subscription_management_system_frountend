<template>
  <div class="app-container">
    <!--搜索栏-->
    <el-form ref="queryForm" :model="queryParams" size="small" :inline="true">
      <el-form-item label="角色名称" prop="roleName">
        <el-input
          v-model="queryParams.description"
          placeholder="请输入角色名称"
          clearable
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="权限字符" prop="roleKey">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入权限字符"
          clearable
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select
          v-model="queryParams.state"
          placeholder="角色状态"
          clearable
          style="width: 240px"
        >
          <el-option
            v-for="dict in roleStateType"
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
    <!--操作按钮-->
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
        >新增</el-button>
      </el-col>
    </el-row>
    <!--表格-->
    <el-table v-loading="loading" :data="roleList">
      <el-table-column label="角色编号" prop="id" width="120" />
      <el-table-column label="角色名称" prop="description" :show-overflow-tooltip="true" width="150" />
      <el-table-column label="权限字符" prop="name" :show-overflow-tooltip="true" width="150" />
      <el-table-column label="显示顺序" prop="sortValue" :show-overflow-tooltip="true" width="150" />
      <el-table-column label="状态" align="center" width="100">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.state"
            active-value="NORMAL"
            inactive-value="DISABLE"
            @change="handleStatusChange(scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime" width="180">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime |parseTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template v-if="scope.row.roleId !== 1" slot-scope="scope">
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
          <el-button
            size="mini"
            type="text"
            icon="el-icon-user"
            @click="handleAuthUser(scope.row)"
          >分配用户</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--分页-->
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.page"
      :limit.sync="queryParams.size"
      @pagination="getList"
    />

    <!-- 添加或修改角色配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="角色名称" prop="description">
          <el-input v-model="form.description" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item prop="name">
          <span slot="label">
            <el-tooltip content="控制器中定义的权限字符，如：@PreAuthorize(`@ss.hasRole('admin')`)" placement="top">
              <i class="el-icon-question" />
            </el-tooltip>
            权限字符
          </span>
          <el-input v-model="form.name" placeholder="请输入权限字符" />
        </el-form-item>
        <el-form-item label="角色顺序" prop="sortValue">
          <el-input-number v-model="form.sortValue" controls-position="right" :min="0" />
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.state">
            <el-radio
              v-for="dict in roleStateType"
              :key="dict.value"
              :label="dict.value"
            >{{ dict.label }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="菜单权限">
          <el-checkbox v-model="menuExpand" @change="handleCheckedTreeExpand($event, 'menu')">展开/折叠</el-checkbox>
          <el-checkbox v-model="menuNodeAll" @change="handleCheckedTreeNodeAll($event, 'menu')">全选/全不选</el-checkbox>
          <el-checkbox v-model="menuCheckStrictly" @change="handleCheckedTreeConnect($event, 'menu')">父子联动</el-checkbox>
          <el-tree
            ref="menu"
            class="tree-border"
            :data="menuOptions"
            show-checkbox
            node-key="id"
            :check-strictly="!menuCheckStrictly"
            empty-text="加载中，请稍候"
            :props="defaultProps"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { list, changeState, getRoleInfo, updateRole, addRole, delRole } from '@/api/system/role'
import permission from '@/api/system/Permission'
import Pagination from '@/components/Pagination/index.vue'
import { parseTime } from '@/utils'

export default {
  name: 'Role',
  components: { Pagination },
  filters: {
    parseTime
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 总条数
      total: 0,
      // 角色表格数据
      roleList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      menuExpand: false,
      menuNodeAll: false,
      menuCheckStrictly: false,
      // 菜单列表
      menuOptions: [],
      // 查询参数
      queryParams: {
        page: 1,
        size: 10,
        description: undefined,
        name: undefined,
        state: undefined
      },
      // 表单参数
      form: {},
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      // 表单校验
      rules: {
        description: [
          { required: true, message: '角色名称不能为空', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '权限字符不能为空', trigger: 'blur' }
        ],
        sortValue: [
          { required: true, message: '角色顺序不能为空', trigger: 'blur' }
        ]
      },
      // 角色状态
      roleStateType: [
        {
          value: 'NORMAL',
          label: '正常'
        },
        {
          value: 'DISABLE',
          label: '停用'
        }
      ]
    }
  },
  created() {
    this.getList()
  },
  methods: {
    /** 查询角色列表 */
    getList() {
      this.loading = true
      list(this.queryParams).then(response => {
        this.roleList = response.data
        this.total = response.total
        this.loading = false
      }
      )
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.page = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.queryParams = { size: this.queryParams.size }
      this.handleQuery()
    },
    // 角色状态修改
    handleStatusChange(row) {
      const { id, state, description } = row
      const text = state === 'NORMAL' ? '启用' : '停用'
      this.$confirm(`确认要"${text}""${description}"角色吗？`).then(function() {
        return changeState(id, state)
      }).then(() => {
        this.$message({ message: `${text}成功`, type: 'success' })
      }).catch(function() {
        row.state = row.state === 'NORMAL' ? 'DISABLE' : 'NORMAL'
      })
    },
    // 表单重置
    reset() {
      if (this.$refs.menu !== undefined) {
        this.$refs.menu.setCheckedKeys([])
      }
      this.menuExpand = false
      this.menuNodeAll = false
      this.menuCheckStrictly = true
      this.form = {
        id: undefined,
        description: undefined,
        name: undefined,
        sortValue: 0,
        state: 'NORMAL',
        permissionIds: []
      }
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      const { id } = row
      getRoleInfo(id).then(response => {
        this.form = response.data.role
        this.menuOptions = response.data.permissionList
        this.getClickPermission(this.menuOptions).forEach((v) => {
          this.$nextTick(() => {
            this.$refs.menu.setChecked(v, true, false)
          })
        })
        this.open = true
        this.title = '修改角色'
      })
    },
    // 树权限（展开/折叠）
    handleCheckedTreeExpand(value, type) {
      if (type === 'menu') {
        const treeList = this.menuOptions
        for (let i = 0; i < treeList.length; i++) {
          this.$refs.menu.store.nodesMap[treeList[i].id].expanded = value
        }
      } else if (type === 'dept') {
        const treeList = this.deptOptions
        for (let i = 0; i < treeList.length; i++) {
          this.$refs.dept.store.nodesMap[treeList[i].id].expanded = value
        }
      }
    },
    // 树权限（全选/全不选）
    handleCheckedTreeNodeAll(value, type) {
      if (type === 'menu') {
        this.$refs.menu.setCheckedNodes(value ? this.menuOptions : [])
      } else if (type === 'dept') {
        this.$refs.dept.setCheckedNodes(value ? this.deptOptions : [])
      }
    },
    // 树权限（父子联动）
    handleCheckedTreeConnect(value, type) {
      if (type === 'menu') {
        this.menuCheckStrictly = !!value
      } else if (type === 'dept') {
        this.deptCheckStrictly = !!value
      }
    },
    // 递归获取已选中的权限
    getClickPermission(permissionList) {
      const res = []
      permissionList.forEach((permission) => {
        if (permission.children) {
          res.push(...this.getClickPermission(permission.children))
        }
        if (permission.flag) {
          res.push(permission.id)
        }
      })
      return res
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.id !== undefined) {
            this.form.permissionIds = this.getMenuAllCheckedKeys()
            console.log(this.form)
            updateRole(this.form).then(response => {
              this.$message({ message: '修改成功', type: 'success' })
              this.open = false
              this.getList()
            })
          } else {
            this.form.permissionIds = this.getMenuAllCheckedKeys()
            addRole(this.form).then(response => {
              this.$message({ message: '新增成功', type: 'success' })
              this.open = false
              this.getList()
            })
          }
        }
      })
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    },
    // 所有菜单节点数据
    getMenuAllCheckedKeys() {
      // 目前被选中的菜单节点
      const checkedKeys = this.$refs.menu.getCheckedKeys()
      // 半选中的菜单节点
      const halfCheckedKeys = this.$refs.menu.getHalfCheckedKeys()
      checkedKeys.unshift.apply(checkedKeys, halfCheckedKeys)
      return checkedKeys
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset()
      this.getMenuTreeSelect()
      this.open = true
      this.title = '添加角色'
    },
    /** 查询菜单树结构 */
    getMenuTreeSelect() {
      permission.findNodes().then(response => {
        this.menuOptions = response.data
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const { id } = row
      this.$confirm('是否确认删除角色编号为"' + id + '"的数据项？').then(function() {
        // eslint-disable-next-line no-undef
        return delRole(id)
      }).then(() => {
        this.getList()
        this.$message({ message: '删除成功', type: 'success' })
      }).catch(() => {})
    },
    /** 分配用户操作 */
    handleAuthUser: function(row) {
      const { id } = row
      this.$router.push('/system/role-auth/user/' + id)
    }
  }
}
</script>
