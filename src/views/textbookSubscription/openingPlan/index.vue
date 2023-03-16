<template>
  <div class="app-container">
    <el-table
      v-if="!select"
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
      <el-table-column label="选择教材">
        <template slot-scope="scope">
          <el-button type="primary" :disabled="!scope.row.canAddApproval" @click="addApproval(scope.row.id)">选择教材</el-button>
        </template>
      </el-table-column>
    </el-table>
    <Select v-else :id="selectId" class="transition-box" @cancel="select = false" @submit="submit" />
  </div>
</template>

<script>
import openingPlan from '@/api/academic/openingPlan'
import Select from '@/views/commons/components/select.vue'
import approval from '@/api/textbookSubscription/approval'
export default {
  components: { Select },
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
      tableData: [
        {
          'createTime': 1676931481000,
          'id': 1,
          'openingPlanDetails': [
            {
              'courseName': 'JAVA',
              'credit': 2,
              'id': 1,
              'teachingHours': 40,
              'type': '考试',
              'weeksTeach': 20
            }
          ],
          'state': '已经选定教材，等待审批',
          'canAddApproval': true,
          'grade': '计算机科学与技术2021级1班',
          'secondaryCollege': '人工智能学院',
          'teacher': {
            'avatar': '/icons/default-icon.png',
            'id': 2,
            'name': '测试账号'
          },
          'teachingGroup': '高级语言——程序设计与实现技术教学团队'
        }
      ],
      loading: true,
      select: false,
      selectId: ''
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      openingPlan.me().then(res => {
        this.tableData = res.data
        this.loading = false
      })
    },
    addApproval(id) {
      this.select = true
      this.selectId = id
    },
    submit(val) {
      console.log(val)
      approval.submit(val).then(res => {
        this.getList()
        this.select = false
        this.$notify({
          title: '成功',
          message: '提交成功',
          type: 'success'
        })
      })
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
