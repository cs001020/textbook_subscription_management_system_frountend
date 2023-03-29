<template>
  <div class="app-container">
    <!--操作按钮-->
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleCreate"
        >添加开课计划</el-button>
      </el-col>
    </el-row>
    <!--表格-->
    <el-table
      v-loading="loading"
      :data="tableData"
      style="width: 100%"
    >
      <el-table-column label="编号" prop="id" width="120" />
      <el-table-column label="教师" width="150">
        <template slot-scope="{row}">
          <el-row>
            <span>{{ row.teacher.name }}</span>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column label="教学组" width="150" prop="teachingGroup.name" :show-overflow-tooltip="true" />
      <el-table-column label="学院" width="150" prop="secondaryCollege.name" />
      <el-table-column label="班级" width="150" prop="grade" :show-overflow-tooltip="true">
        <template slot-scope="{row}">
          <span>{{ `${row.grade.year}级${row.grade.number}班` }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="150">
        <template slot-scope="{row}">
          <span>{{ parseTime(row.createTime,'{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="150">
        <template slot-scope="{row}">
          <el-tag :type="row.state | statusFilter">
            {{ row.state | statusLabelFilter }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-view"
            @click="$refs.openPlanDetailDialog.show(scope.row)"
          >详情</el-button>
          <el-button
            v-if="scope.row.state === 'TEXTBOOKS_TO_BE_SELECT'"
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="$refs.updateOpeningPlanDialog.show(scope.row.id)"
          >修改</el-button>
          <el-button
            v-if="scope.row.state !== 'APPROVAL_COMPLETED'"
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <update-opening-plan ref="updateOpeningPlanDialog" @ok="ok" />
    <open-plan-detail ref="openPlanDetailDialog" />
  </div>
</template>

<script>
import openingPlan from '@/api/academic/openingPlan'
import { parseTime } from '@/utils'
import OpenPlanDetail from '@/views/commons/components/OpenPlanDetail'
import UpdateOpeningPlan from '@/views/academic/openingPlan/updateOpeningPlan.vue'
const statusMap = {
  TEXTBOOKS_TO_BE_SELECT: {
    label: '等待选定教材',
    type: null
  },
  WAITING_FOR_APPROVAL: {
    label: '已经选择教材,审核中',
    type: 'warning'
  },
  APPROVAL_COMPLETED: {
    label: '审核通过',
    type: 'success'
  }
}
export default {
  components: { UpdateOpeningPlan, OpenPlanDetail },
  filters: {
    statusFilter(status) {
      return statusMap[status].type
    },
    statusLabelFilter(status) {
      return statusMap[status].label
    }
  },
  data() {
    return {
      tableData: [],
      loading: true,
      open: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    /*  获取数据 */
    getList() {
      openingPlan.list().then(res => {
        this.tableData = res.data
        this.loading = false
      })
    },
    /* 导入开课计划按钮操作 */
    handleCreate() {
      this.$router.push({ path: '/academic/add-plan/add' })
    },
    /* 删除开课计划 */
    handleDelete(row) {
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        openingPlan.deleteById(row.id).then(() => {
          this.$message({ message: '删除成功', type: 'success' })
          this.getList()
        })
      })
        .catch(() => {})
    },
    /* 修改成功后 */
    ok() {
      this.$message({ message: '删除成功', type: 'success' })
      this.getList()
    },
    parseTime
  }
}
</script>

<style scoped>
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}

.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
</style>
