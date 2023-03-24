<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >
        添加开课计划
      </el-button>
    </div>
    <el-table
      v-loading="loading"
      :data="tableData"
      style="width: 100%"
    >
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-table
            :data="props.row.openingPlanDetails"
            style="width: 100%"
          >
            <el-table-column
              prop="courseName"
              label="课程名"
              width="180"
            />
            <el-table-column
              prop="credit"
              label="学分"
              width="180"
            />
            <el-table-column
              prop="teachingHours"
              label="总学时"
              width="180"
            />
            <el-table-column
              prop="weeksTeach"
              label="教学周"
              width="180"
            />
            <el-table-column
              prop="type"
              label="类型"
              width="180"
            >
              <template slot-scope="{row}">
                <el-tag :type="row.type | typeFilter">
                  {{ row.type }}
                </el-tag>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column label="序号" prop="id" type="index" />
      <el-table-column label="教师">
        <template slot-scope="{row}">
          <el-avatar size="small" :src="`https://kodo.warframe.top${row.teacher.avatar}`" />
          <span>{{ row.teacher.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="教学组">
        <template slot-scope="{row}">
          <span>{{ row.teachingGroup }}</span>
        </template>
      </el-table-column>
      <el-table-column label="学院">
        <template slot-scope="{row}">
          <span>{{ row.secondaryCollege }}</span>
        </template>
      </el-table-column>
      <el-table-column label="班级">
        <template slot-scope="{row}">
          <span>{{ row.grade }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间">
        <template slot-scope="{row}">
          <span>{{ row.createTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态">
        <template slot-scope="{row}">
          <el-tag :type="row.state | statusFilter">
            {{ row.state }}
          </el-tag>
        </template>
      </el-table-column>
    </el-table>
    <h1>//TODO 删除 编辑</h1>
  </div>
</template>

<script>
import openingPlan from '@/api/academic/openingPlan'

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        '审批完成': 'success',
        '已经选定教材，等待审批': 'warning',
        '等待教师选定教材': null
      }
      return statusMap[status]
    },
    typeFilter(status) {
      const statusMap = {
        '考察': 'success',
        '考试': 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      tableData: [],
      loading: true
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      openingPlan.list().then(res => {
        this.tableData = res.data
        this.loading = false
      })
    },
    handleCreate() {
      this.$router.push({ path: '/academic/add-plan/add' })
    }
  }
}
</script>

<style scoped>
.demo-table-expand {
  font-size: 0;
}

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
