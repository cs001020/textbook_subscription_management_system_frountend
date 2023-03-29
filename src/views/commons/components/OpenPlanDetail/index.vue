<template>
  <el-dialog title="开课计划详情" :visible.sync="open" width="800px" top="5vh" append-to-body>
    <table v-if="open" cellspacing="10">
      <tr>
        <td class="title">教师：</td>
        <td colspan="3">
          <el-avatar
            shape="square"
            size="medium"
            :src="`https://kodo.warframe.top${openPlan.teacher.avatar}`"
          />
          <span>{{ openPlan.teacher.name }}</span>
        </td>
      </tr>
      <tr>
        <td class="title">教学组：</td>
        <td>{{ openPlan.teachingGroup.name }}</td>
        <td class="title">二级学院：</td>
        <td>{{ openPlan.secondaryCollege.name }}</td>
      </tr>
      <tr>
        <td class="title">班级：</td>
        <td>{{ `${openPlan.grade.year}级${openPlan.grade.number}班` }}</td>
        <td class="title">当前状态：</td>
        <td>
          <el-tag :type="openPlan.state | stateFilter">
            {{ openPlan.state |statusLabelFilter }}
          </el-tag>
        </td>
      </tr>
    </table>
    <table v-if="open" cellspacing="10">
      <tr>
        <td class="title" colspan="4">课程：</td>
      </tr>
      <tr>
        <el-table
          :data="openPlan.openingPlanDetails"
        >
          <el-table-column
            prop="courseName"
            label="课程名"
            width="150"
          />
          <el-table-column
            prop="credit"
            label="学分"
            width="150"
          />
          <el-table-column
            prop="teachingHours"
            label="总学时"
            width="150"
          />
          <el-table-column
            prop="weeksTeach"
            label="教学周"
            width="150"
          />
          <el-table-column
            prop="type"
            label="类型"
          >
            <template slot-scope="scope">
              <el-tag :type="scope.row.type|typeFilter">{{ scope.row.type |typeLabelFilter }}</el-tag>
            </template>
          </el-table-column>
        </el-table>
      </tr>
    </table>
  </el-dialog>
</template>

<script>
import { parseTime } from '@/utils'

const typeMap = {
  EXAMINATION: {
    label: '考试',
    type: 'danger'
  },
  INVESTIGATE: {
    label: '考察',
    type: null
  }
}
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
  filters: {
    typeFilter(type) {
      return typeMap[type].type
    },
    typeLabelFilter(type) {
      return typeMap[type].label
    },
    stateFilter(state) {
      return statusMap[state].type
    },
    statusLabelFilter(status) {
      return statusMap[status].label
    }
  },
  data() {
    return {
      openPlan: undefined,
      open: false
    }
  },
  methods: {
    parseTime,
    show(data) {
      this.openPlan = data
      this.open = true
    }
  }
}
</script>

<style scoped>
.title {
  font-weight: bold;
}
</style>
