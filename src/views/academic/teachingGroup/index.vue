<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button
        class="filter-item"
        style="margin-left: 10px"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >
        {{ $t("table.add") }}
      </el-button>
    </div>
    <el-table v-loading="loading" :data="tableData" border style="width: 100%">
      <el-table-column label="序号" type="index" />
      <el-table-column label="创建时间" width="180">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span style="margin-left: 10px">{{
            scope.row.createTime | parseTime
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="组名" width="auto">
        <template slot-scope="scope">
          <el-tag size="medium">{{ scope.row.name }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="{ row, $index }">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            {{ $t("table.edit") }}
          </el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(row, $index)"
          >
            {{ $t("table.delete") }}
          </el-button>
        </template>

      </el-table-column>
    </el-table>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="教学组名" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          {{ $t("table.cancel") }}
        </el-button>
        <el-button
          type="primary"
          @click="dialogStatus === 'create' ? createData() : updateData()"
        >
          {{ $t("table.confirm") }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import api from '@/api/academic/teachingGroup'
import { parseTime } from '@/utils'

export default {
  filters: {
    parseTime
  },
  data() {
    return {
      tableData: [
        {
          id: '2016-05-02',
          name: '王小虎',
          createTime: '上海市普陀区金沙江路 1518 弄'
        }
      ],
      loading: false,
      dialogFormVisible: false,
      form: {
        name: ''
      },
      formLabelWidth: '120px',
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      }
    }
  },
  created() {
    this.getDate()
  },
  methods: {
    getDate() {
      this.loading = true
      api.list().then((res) => {
        this.tableData = res.data
        // 伪装请求响应
        setTimeout(() => {
          this.loading = false
        }, 500)
      })
    },
    resetForm() {
      this.form = {
        name: ''
      }
    },
    handleUpdate(row) {
      this.form = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
    },
    updateData() {
      const formData = Object.assign({}, this.form)
      api.update(formData.id, formData).then(() => {
        this.getDate()
        this.dialogFormVisible = false
        this.$notify({
          title: '成功',
          message: '更新成功',
          type: 'success',
          duration: 2000
        })
      })
    },
    handleDelete(row, index) {
      this.$confirm('此操作将永久删除该数据, 是否继续?').then(function() {
        return api.delete(row.id)
      }).then(() => {
        this.getDate()
        this.$message({ message: '删除成功', type: 'success' })
      }
      )
    },
    handleCreate() {
      this.resetForm()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
    },
    createData() {
      console.log(this.form)
      api.add(this.form).then(res => {
        this.getDate()
        this.dialogFormVisible = false
        // 清空dialog内表单数据。。。。
        this.$notify({
          title: '成功',
          message: '创建成功',
          type: 'success',
          duration: 2000
        })
      })
    }
  }
}
</script>

<style scoped>
</style>
