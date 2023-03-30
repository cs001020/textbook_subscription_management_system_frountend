<template>
  <el-dialog v-if="data" :visible.sync="open" title="详情">
    <el-card class="card-box">
      <div slot="header" class="clearfix">
        <span>发起人</span>
      </div>
      <div class="text item">
        <el-descriptions>
          <el-descriptions-item label="教师名">{{ data.openingPlan.teacher.name }}</el-descriptions-item>
          <el-descriptions-item label="手机号">{{ data.openingPlan.teacher.phoneNumber }}</el-descriptions-item>
          <el-descriptions-item label="邮箱">{{ data.openingPlan.teacher.userInfo.email }}</el-descriptions-item>
          <el-descriptions-item label="性别">
            <el-tag size="small" :type="data.openingPlan.teacher.userInfo.sex===0?'danger':undefined">
              {{ data.openingPlan.teacher.userInfo.sex === 0 ? '女' : '男' }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="联系地址">{{ data.openingPlan.teacher.userInfo.address }}</el-descriptions-item>
        </el-descriptions>
      </div>
    </el-card>
    <el-card class="card-box">
      <div slot="header" class="clearfix">
        <span>开课计划院系班级</span>
      </div>
      <div class="text item">
        <el-descriptions :column="2">
          <el-descriptions-item label="教学组">{{ data.openingPlan.teachingGroup.name }}</el-descriptions-item>
          <el-descriptions-item label="二级学院">{{ data.openingPlan.secondaryCollege.name }}</el-descriptions-item>
          <el-descriptions-item label="专业">{{ data.openingPlan.major.name }}</el-descriptions-item>
          <el-descriptions-item label="班级">{{
            `${data.openingPlan.grade.year}级${data.openingPlan.grade.number}班`
          }}
          </el-descriptions-item>
        </el-descriptions>
      </div>
    </el-card>
    <el-card class="card-box">
      <div slot="header" class="clearfix">
        <span>课程信息</span>
      </div>
      <div class="text item">
        <el-table
          :data="data.openingPlan.openingPlanDetails"
          style="width: 100%"
        >
          <el-table-column
            prop="courseName"
            label="课程名"
          />
          <el-table-column
            prop="credit"
            label="学分"
          />
          <el-table-column
            prop="teachingHours"
            label="总学时"
          />
          <el-table-column
            prop="weeksTeach"
            label="教学周"
          />
          <el-table-column
            prop="type"
            label="类型"
          >
            <template slot-scope="{row}">
              <el-tag :type="row.type | typeFilter">
                {{ row.type | typeNameFilter }}
              </el-tag>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
    <el-card class="card-box">
      <div slot="header" class="clearfix">
        <span>审批流程</span>
      </div>
      <div class="text item">
        <el-steps :active="data.approval | activeFilter">
          <el-step title="发起人" :description="data.openingPlan.teacher.name+'(发起)'" status="success" />
          <el-step
            title="教学组审核"
            :status="data.approval.teachingGroupState | approvalStateFilter"
            :description="data.approval.teachingGroupMessage"
          />
          <el-step
            title="二级学院审核"
            :status="data.approval.secondaryCollegeState | approvalStateFilter"
            :description="data.approval.secondaryCollegeMessage"
          />
          <el-step
            title="教务处审核"
            :status="data.approval.deansOfficeState | approvalStateFilter"
            :description="data.approval.deansOfficeMessage"
          />
        </el-steps>
      </div>
    </el-card>
  </el-dialog>
</template>
<script>
import approval from '@/api/textbookSubscription/approval'

export default {
  filters: {
    typeFilter(status) {
      const statusMap = {
        INVESTIGATE: 'success',
        EXAMINATION: 'danger'
      }
      return statusMap[status]
    },
    typeNameFilter(status) {
      const statusMap = {
        INVESTIGATE: '考察',
        EXAMINATION: '考试'
      }
      return statusMap[status]
    },
    approvalStateFilter(state) {
      const approvalStatMap = {
        UNAPPROVED: 'wait',
        ADOPT: 'success',
        REJECT: 'error'
      }
      return approvalStatMap[state]
    },
    activeFilter(data) {
      let i = 1
      if (data.teachingGroupState !== 'UNAPPROVED') {
        i++
      }
      if (data.secondaryCollegeState !== 'UNAPPROVED') {
        i++
      }
      if (data.deansOfficeState !== 'UNAPPROVED') {
        i++
      }
      return i
    }
  },
  data() {
    return {
      open: false,
      data: undefined
    }
  },
  methods: {
    show(id) {
      approval.getDetails(id).then(res => {
        this.data = res.data
        this.open = true
      })
    }
  }
}
</script>
<style scoped>
.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both
}
</style>
