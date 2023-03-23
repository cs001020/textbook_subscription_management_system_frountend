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
    <el-table
      v-loading="loading"
      :data="tableData"
      border
      style="width: 100%"
    >
      <el-table-column label="序号" type="index" />
      <el-table-column
        label="创建时间"
        width="180"
      >
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span style="margin-left: 10px">{{ scope.row.createTime | parseTime }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="专业"
        width="auto"
      >
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
        <el-form-item label="二级学院" :label-width="formLabelWidth">
          <el-select v-model="form.secondaryCollegeId" placeholder="请选择">
            <el-option
              v-for="item in secondaryCollegeList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="专业名称" :label-width="formLabelWidth">
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
import major from '@/api/academic/major'
import secondaryCollege from '@/api/academic/secondaryCollege'
import { parseTime } from '@/utils'

export default {
  filters: {
    parseTime
  },
  data() {
    return {
      loading: false,
      tableData: [],
      dialogFormVisible: false,
      secondaryCollegeList: [],
      form: {
        secondaryCollegeId: '',
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
      major.all().then(res => {
        this.tableData = res.data
        this.loading = false
      })
    },
    resetForm() {
      this.form = {
        secondaryCollegeId: '',
        name: ''
      }
    },
    handleUpdate(row) {
      secondaryCollege.list().then(res => {
        this.secondaryCollegeList = res.data
      })
      this.form = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
    },
    updateData() {
      const formData = Object.assign({}, this.form)
      major.update(formData.id, formData).then(() => {
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
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning'
      }).then(() => {
        major.delete(row.id).then(() => {
          this.getDate()
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success'
          })
        }
        )
      })
        .catch(() => {
          this.$notify.info({
            title: '消息',
            message: '已取消',
            duration: 2000
          })
        })
    },
    handleCreate() {
      this.resetForm()
      secondaryCollege.list().then(res => {
        this.secondaryCollegeList = res.data
      })
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
    },
    createData() {
      major.add(this.form).then(res => {
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
