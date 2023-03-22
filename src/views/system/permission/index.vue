<template>
  <div class="app-container">
    <!--搜索表单-->
    <el-form ref="queryForm" :model="queryParams" size="small" :inline="true">
      <el-form-item label="菜单名称" prop="menuName">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入菜单名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.state" placeholder="菜单状态" clearable>
          <el-option
            v-for="dict in permissionState"
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
      <el-col :span="1.5">
        <el-button
          type="info"
          plain
          icon="el-icon-sort"
          size="mini"
          @click="toggleExpandAll"
        >展开/折叠</el-button>
      </el-col>
    </el-row>
    <!--数据表格-->
    <el-table
      v-if="refreshTable"
      v-loading="loading"
      :data="menuList"
      row-key="id"
      :default-expand-all="isExpandAll"
      :tree-props="{children: 'children'}"
    >
      <el-table-column prop="name" label="菜单名称" :show-overflow-tooltip="true" width="160" />
      <el-table-column prop="icon" label="图标" width="100">
        <template slot-scope="scope">
          <i :class="scope.row.icon" />
          <svg-icon :icon-class="scope.row.icon" />
        </template>
      </el-table-column>
      <el-table-column prop="sortValue" label="排序" width="60" />
      <el-table-column prop="perms" label="权限标识" :show-overflow-tooltip="true" />
      <el-table-column prop="component" label="组件路径" :show-overflow-tooltip="true" />
      <el-table-column prop="status" label="状态" width="80">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.state"
            active-value="NORMAL"
            inactive-value="DISABLE"
            @change="handleStatusChange(scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime | parseTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-plus"
            @click="handleAdd(scope.row)"
          >新增</el-button>
          <el-button
            v-if="!scope.row.children"
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加或修改菜单对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="680px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="上级权限" prop="parentId">
              <TreeSelect
                v-model="form.parentId"
                :options="menuOptions"
                :normalizer="normalizer"
                :show-count="true"
                placeholder="选择上级菜单"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="权限类型" prop="type">
              <el-radio-group v-model="form.type">
                <el-radio label="DIRECTORY">目录</el-radio>
                <el-radio label="ROUT">菜单</el-radio>
                <el-radio label="BUTTON_REQUEST">按钮</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col v-if="form.type !== 'BUTTON_REQUEST'" :span="24">
            <el-form-item label="路由图标" prop="icon">
              <el-popover
                placement="bottom-start"
                width="460"
                trigger="click"
                @show="$refs['iconSelect'].reset()"
              >
                <IconSelect ref="iconSelect" @selected="selected" />
                <el-input slot="reference" v-model="form.icon" placeholder="点击选择图标" readonly>
                  <svg-icon
                    v-if="form.icon"
                    slot="prefix"
                    :icon-class="form.icon"
                    class="el-input__icon"
                    style="height: 32px;width: 16px;"
                  />
                  <i v-else slot="prefix" class="el-icon-search el-input__icon" />
                </el-input>
              </el-popover>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="权限名称" prop="name">
              <el-input v-model="form.name" placeholder="请输入权限名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="显示排序" prop="sortValue">
              <el-input-number v-model="form.sortValue" controls-position="right" :min="0" />
            </el-form-item>
          </el-col>
          <el-col v-if="form.type !== 'BUTTON_REQUEST'" :span="12">
            <el-form-item prop="path">
              <span slot="label">
                <el-tooltip content="访问的路由地址，如：`user`" placement="top">
                  <i class="el-icon-question" />
                </el-tooltip>
                路由地址
              </span>
              <el-input v-model="form.path" placeholder="请输入路由地址" />
            </el-form-item>
          </el-col>
          <el-col v-if="form.type === 'ROUT'" :span="12">
            <el-form-item prop="component">
              <span slot="label">
                <el-tooltip content="访问的组件路径，如：`system/user/index`，默认在`views`目录下" placement="top">
                  <i class="el-icon-question" />
                </el-tooltip>
                组件路径
              </span>
              <el-input v-model="form.component" placeholder="请输入组件路径" />
            </el-form-item>
          </el-col>
          <el-col v-if="form.type !== 'DIRECTORY'" :span="12">
            <el-form-item prop="perms">
              <el-input v-model="form.perms" placeholder="请输入权限标识" maxlength="100" />
              <span slot="label">
                <el-tooltip content="控制器中定义的权限字符，如：@PreAuthorize(`@ss.hasPermi('system:user:list')`)" placement="top">
                  <i class="el-icon-question" />
                </el-tooltip>
                权限字符
              </span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="state">
              <span slot="label">
                <el-tooltip content="选择停用则路由将不会出现在侧边栏，也不能被访问" placement="top">
                  <i class="el-icon-question" />
                </el-tooltip>
                权限状态
              </span>
              <el-radio-group v-model="form.state">
                <el-radio
                  v-for="dict in permissionState"
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
// import { listMenu, getMenu, delMenu, addMenu, updateMenu } from '@/api/system/menu'
import permission from '@/api/system/Permission'
import { parseTime } from '@/utils'
import TreeSelect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import IconSelect from '@/views/commons/components/IconSelect'

export default {
  name: 'Menu',
  filters: {
    parseTime
  },
  dicts: ['sys_show_hide', 'sys_normal_disable'],
  components: { TreeSelect, IconSelect },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 菜单表格树数据
      menuList: [],
      // 菜单树选项
      menuOptions: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 是否展开，默认全部折叠
      isExpandAll: false,
      // 重新渲染表格状态
      refreshTable: true,
      // 查询参数
      queryParams: {
        name: undefined,
        state: undefined,
        visible: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        name: [
          { required: true, message: '菜单名称不能为空', trigger: 'blur' }
        ],
        sortValue: [
          { required: true, message: '菜单顺序不能为空', trigger: 'blur' }
        ],
        state: [
          { required: true, message: '权限状态不能为空', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '权限类型不能为空', trigger: 'blur' }
        ],
        parentId: [
          { required: true, message: '上级权限不能为空', trigger: 'blur' }
        ]
      },
      // 状态字典
      permissionState: [
        {
          label: '正常',
          value: 'NORMAL'
        },
        {
          label: '停用',
          value: 'DISABLE'
        }
      ]
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.loading = true
      permission.list(this.queryParams).then(response => {
        this.menuList = response.data
        this.loading = false
      })
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.queryParams = {
        name: undefined,
        state: undefined,
        visible: undefined
      }
      this.handleQuery()
    },
    /** 新增按钮操作 */
    handleAdd(row) {
      this.reset()
      this.getTreeSelect()
      if (row != null && row.id) {
        this.form.parentId = row.id
      } else {
        this.form.parentId = 0
      }
      this.open = true
      this.title = '添加菜单'
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      this.getTreeSelect()
      permission.getPermissionById(row.id).then(response => {
        this.form = response.data
        this.open = true
        this.title = '修改菜单'
      })
    },
    /** 展开/折叠操作 */
    toggleExpandAll() {
      this.refreshTable = false
      this.isExpandAll = !this.isExpandAll
      this.$nextTick(() => {
        this.refreshTable = true
      })
    },
    // 表单重置
    reset() {
      this.form = {
        id: undefined,
        parentId: 0,
        type: 'DIRECTORY',
        icon: undefined,
        name: undefined,
        sortValue: undefined,
        path: undefined,
        component: undefined,
        perms: undefined,
        state: 'NORMAL'
      }
    },
    /** 查询菜单下拉树结构 */
    getTreeSelect() {
      permission.list().then(response => {
        this.menuOptions = []
        const menu = { id: 0, name: '主类目', children: [] }
        menu.children = response.data
        this.menuOptions.push(menu)
      })
    },
    /** 转换菜单数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children
      }
      return {
        id: node.id,
        label: node.name,
        children: node.children
      }
    },
    // 选择图标
    selected(name) {
      this.form.icon = name
    },
    /** 提交按钮 */
    submitForm: function() {
      console.log(this.form)
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.id !== undefined) {
            permission.updatePermission(this.form).then(response => {
              this.$message({ message: '修改成功', type: 'success' })
              this.open = false
              this.getList()
            })
          } else {
            permission.addPermission(this.form).then(response => {
              this.$message({ message: '新增成功', type: 'success' })
              this.open = false
              this.getList()
            })
          }
        }
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      this.$confirm('是否确认删除名称为"' + row.name + '"的数据项？').then(function() {
        return permission.delPermission(row.id)
      }).then(() => {
        this.getList()
        this.$message({ message: '删除成功', type: 'success' })
      }).catch(() => {})
    },
    /* 修改权限状态*/
    handleStatusChange(row) {
      const text = row.state === 'NORMAL' ? '启用' : '停用'
      this.$confirm('确认要"' + text + '""' + row.name + '"权限吗？').then(function() {
        return permission.changeState({ id: row.id, state: row.state })
      }).then(() => {
        this.$message({ message: text + '成功', type: 'success' })
      }).catch(function() {
        row.state = row.state === 'NORMAL' ? 'DISABLE' : 'NORMAL'
      })
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    }
  }
}
</script>
