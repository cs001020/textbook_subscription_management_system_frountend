<template>
  <div class="app-container">

    <!-- 工具条 -->
    <div class="tools-div">
      <el-button type="success" icon="el-icon-plus" size="mini" @click="add()">添 加</el-button>
    </div>
    <el-table
      :data="sysMenuList"
      style="width: 100%;margin-bottom: 20px;margin-top: 10px;"
      row-key="id"
      border
      :default-expand-all="false"
      :tree-props="{children: 'children'}"
    >

      <el-table-column prop="name" label="菜单名称" width="160" />
      <el-table-column label="图标">
        <template slot-scope="scope">
          <i :class="scope.row.icon" />
          <svg-icon :icon-class="scope.row.icon" />
        </template>
      </el-table-column>
      <el-table-column prop="perms" label="权限标识" width="160" />
      <el-table-column prop="path" label="路由地址" width="120" />
      <el-table-column prop="component" label="组件路径" width="160" />
      <!--      <el-table-column label="状态" width="80">-->
      <!--        <template slot-scope="scope">-->
      <!--          <el-switch-->
      <!--            v-model="scope.row.status === 'NORMAL'"-->
      <!--            :disabled="true"-->
      <!--          />-->
      <!--        </template>-->
      <!--      </el-table-column>-->
      <el-table-column prop="createTime" label="创建时间" width="160" />
      <el-table-column label="操作" width="180" align="center" fixed="right">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.type !== 2"
            type="success"
            icon="el-icon-plus"
            size="mini"
            title="添加下级节点"
            @click="add(scope.row)"
          />
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="40%">
      <el-form ref="dataForm" :model="sysMenu" label-width="150px" size="small" style="padding-right: 40px;">
        <el-form-item v-if="sysMenu.id === ''" label="上级部门">
          <el-input v-model="sysMenu.parentName" disabled="true" />
        </el-form-item>
        <el-form-item label="菜单类型" prop="type">
          <el-radio-group v-model="sysMenu.type" :disabled="typeDisabled">
            <el-radio :label="0" :disabled="type0Disabled">目录</el-radio>
            <el-radio :label="1" :disabled="type1Disabled">菜单</el-radio>
            <el-radio :label="2" :disabled="type2Disabled">按钮</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="菜单名称" prop="name">
          <el-input v-model="sysMenu.name" />
        </el-form-item>
        <el-form-item v-if="sysMenu.type !== 2" label="图标" prop="icon">
          <el-input v-model="sysMenu.icon" />
        </el-form-item>
        <el-form-item prop="path">
          <span slot="label">
            <el-tooltip content="访问的路由地址，如：`sysUser`" placement="top">
              <i class="el-icon-question" />
            </el-tooltip>
            路由地址
          </span>
          <el-input v-model="sysMenu.path" placeholder="请输入路由地址" />
        </el-form-item>
        <el-form-item v-if="sysMenu.type !== 0" prop="component">
          <span slot="label">
            <el-tooltip content="访问的组件路径，如：`system/user/index`，默认在`views`目录下" placement="top">
              <i class="el-icon-question" />
            </el-tooltip>
            组件路径
          </span>
          <el-input v-model="sysMenu.component" placeholder="请输入组件路径" />
        </el-form-item>
        <el-form-item v-if="sysMenu.type === 2">
          <el-input v-model="sysMenu.perms" placeholder="请输入权限标识" maxlength="100" />
          <span slot="label">
            <el-tooltip
              content="控制器中定义的权限字符，如：@PreAuthorize(hasAuthority('bnt.sysRole.list'))"
              placement="top"
            >
              <i class="el-icon-question" />
            </el-tooltip>
            权限字符
          </span>
        </el-form-item>
        <el-form-item label="状态" prop="type">
          <el-radio-group v-model="sysMenu.status">
            <el-radio :label="0">正常</el-radio>
            <el-radio :label="1">停用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" icon="el-icon-refresh-right" @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" icon="el-icon-check" size="small" @click="saveOrUpdate()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import api from '@/api/system/Permission'

const defaultForm = {
  id: '',
  parentId: '',
  name: '',
  type: 0,
  path: '',
  component: '',
  perms: '',
  icon: '',
  status: 0
}
export default {
  // 定义数据
  data() {
    return {
      sysMenuList: [],
      expandKeys: [], // 需要自动展开的项

      typeDisabled: false,
      type0Disabled: false,
      type1Disabled: false,
      type2Disabled: false,
      dialogTitle: '',

      dialogVisible: false,
      sysMenu: defaultForm,
      saveBtnDisabled: false
    }
  },

  // 当页面加载时获取数据
  created() { // 页面渲染之前执行
    this.fetchData()
  },

  methods: {
    // 调用api层获取数据库中的数据
    fetchData() {
      console.log('加载列表')
      api.findNodes().then(response => {
        this.sysMenuList = response.data
        console.log(this.sysMenuList)
      })
    },

    // 弹出添加或更新的表单
    add(row) {
      this.typeDisabled = false
      this.dialogTitle = '添加下级节点'
      this.dialogVisible = true

      this.sysMenu = Object.assign({}, defaultForm)
      this.sysMenu.id = ''
      if (row) {
        this.sysMenu.parentId = row.id
        this.sysMenu.parentName = row.name
        if (row.type === 0) {
          this.sysMenu.type = 1
          this.typeDisabled = false
          this.type0Disabled = false
          this.type1Disabled = false
          this.type2Disabled = true
        } else if (row.type === 1) {
          this.sysMenu.type = 2
          this.typeDisabled = true
        }
      } else {
        this.dialogTitle = '添加目录节点'
        this.sysMenu.type = 0
        this.sysMenu.component = 'Layout'
        this.sysMenu.parentId = 0
        this.typeDisabled = true
      }
    },

    // 添加或更新
    saveOrUpdate() {
      console.log(this.sysMenu)
      if (this.sysMenu.type === 0 && this.sysMenu.parentId !== 0) {
        this.sysMenu.component = 'ParentView'
      }
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          this.saveBtnDisabled = true // 防止表单重复提交
          if (!this.sysMenu.id) {
            this.save()
          } else {
            this.update()
          }
        }
      })
    },

    // 添加
    save() {
      api.save(this.sysMenu).then(response => {
        this.$message.success(response.message || '操作成功')
        this.dialogVisible = false
        this.fetchData(this.page)
      })
    }
  }
}
</script>
