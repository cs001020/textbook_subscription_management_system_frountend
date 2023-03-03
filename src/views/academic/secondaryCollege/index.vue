<template>
  <div class="app-container">
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
        label="姓名"
        width="180"
      >
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="top">
            <p>姓名: {{ scope.row.name }}</p>
            <div slot="reference" class="name-wrapper">
              <el-tag size="medium">{{ scope.row.name }}</el-tag>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="handleEdit(scope.$index, scope.row)"
          >编辑
          </el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"
          >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import api from '@/api/secondaryCollege'
import { parseTime } from '@/utils'

export default {
  filters: {
    parseTime
  },
  data() {
    return {
      tableData: [],
      loading: false
    }
  },
  created() {
    this.getDate()
  },
  methods: {
    getDate() {
      this.loading = true
      api.list().then(res => {
        this.tableData = res.data
        // 伪装请求响应
        setTimeout(() => {
          this.loading = false
        }, 500)
      })
    },
    handleEdit(index, row) {
      console.log(index, row)
    },
    handleDelete(index, row) {
      api.delete(row.id).then(() => {
        alert('删除成功' + row.id)
        this.getDate()
      })
    }
  }
}
</script>

<style scoped>

</style>
