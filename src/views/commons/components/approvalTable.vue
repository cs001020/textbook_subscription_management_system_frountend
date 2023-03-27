<template>
  <div class="app-container">
    <!--待审核-->
    <el-table
      v-loading="load"
      border
      :data="unApprovalList"
      style="width: 100%"
    >
      <el-table-column
        type="expand"
      >
        <template slot-scope="props">
          <div style="height: 200px;">
            <el-steps direction="vertical" :active="props.row | activeFilter">
              <el-step title="教学组审核" :status="props.row.teachingGroupState | approvalStateFilter" :description="props.row.teachingGroupMessage" />
              <el-step title="二级学院审核" :status="props.row.secondaryCollegeState | approvalStateFilter" :description="props.row.secondaryCollegeMessage" />
              <el-step title="教务处审核" :status="props.row.deansOfficeState | approvalStateFilter" :description="props.row.deansOfficeMessage" />
            </el-steps>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="序号"
        width="180"
        type="index"
      />
      <el-table-column
        label="创建时间"
        width="180"
      >
        <template slot-scope="{row}">
          <span>{{ row.createTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="最近修改"
        width="180"
      >
        <template slot-scope="{row}">
          <span>{{ row.updateTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态">
        <template slot-scope="{row}">
          <el-tag :type="row.state | totalStateTypeFilter">{{ row.state | totalStateNameFilter }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="{row}">
          <el-button @click="openTableDialog(row)">详情</el-button>
          <el-button v-if="canAudit" type="success" plain @click="audit(row.id)">审核</el-button>
          <span v-else style="margin-left: 5px">
            <el-button v-if="canReapply" type="warning" :disabled="row.state!=='REJECT'" plain @click="reapply(row.id)">重新申请</el-button>
            <el-button type="danger" plain @click="del(row.id)">删除</el-button>
          </span>
        </template>
      </el-table-column>
    </el-table>

    <!--开课计划-->
    <el-dialog title="开课计划" :visible.sync="dialogTableVisible">
      <el-table
        :data="gridData"
        style="width: 100%"
      >
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-table
              :data="props.row.openingPlanDetails"
            >
              <el-table-column
                prop="courseName"
                label="课程名"
                width="160"
              />
              <el-table-column
                prop="credit"
                label="学分"
                width="160"
              />
              <el-table-column
                prop="teachingHours"
                label="总学时"
                width="160"
              />
              <el-table-column
                prop="weeksTeach"
                label="教学周"
                width="160"
              />
              <el-table-column
                prop="type"
                label="类型"
                width="160"
              >
                <template slot-scope="{row}">
                  <el-tag :type="row.type | courseTypeFilter">
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
        <el-table-column label="操作">
          <template slot-scope="{row}">
            <el-button @click="openOuterVisible(row.textbookIds)">查看教材</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <!--教材列表-->
    <el-dialog title="教材列表" :visible.sync="outerVisible">
      <el-dialog
        width="30%"
        title="评论"
        :visible.sync="innerVisible"
        append-to-body
      >
        <feedback :feedback="feedbackList" />
      </el-dialog>
      <el-row v-for="item in textBookList" :key="item.id">
        <el-card :key="item.id" :body-style="{ padding: '0px' }">
          <el-col :span="7">
            <el-image
              v-if="item.imgUrl"
              style="width: 243px; height: 230px"
              fit="fill"
              :src="`https://kodo.warframe.top${item.imgUrl}`"
            />
            <div style="padding: 14px;">
              <span>{{ item.bookName }}</span>
              <div class="bottom clearfix">
                <time class="time">{{ item.publishingHouse }}</time>
                <el-badge :value="item.feedbackCount" :max="99" class="item" type="primary" style="float: right">
                  <el-button size="small" :disabled="item.feedbackCount===0" @click="showFeedback(item.id)">学生反馈</el-button>
                </el-badge>
              </div>
            </div>
          </el-col>
          <el-col :span="17">
            <el-form label-position="left" label-width="80px">
              <el-form-item label="作者">
                <span>{{ item.author }}</span>
              </el-form-item>
              <el-form-item label="价格">
                <span>{{ item.price }}</span>
              </el-form-item>
              <el-form-item label="库存">
                <span>{{ item.stock }}</span>
              </el-form-item>
              <el-form-item label="太多了">
                <el-link type="danger" disabled>字段太多 自己看着来吧</el-link>
              </el-form-item>
            </el-form>
          </el-col>
        </el-card>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import { parseTime } from '@/utils'
import openingPlan from '@/api/academic/openingPlan'
import textbook from '@/api/textbookSubscription/textbook'
import feedback from '@/api/feedback'
import Feedback from '@/views/commons/components/TextbookFeedback/index.vue'

export default {
  components: { Feedback },
  filters: {
    parseTime,
    totalStateNameFilter(state) {
      const totalStateNameMap = {
        WAIT_GROUP: '待教学组审批',
        WAIT_SECONDARY: '待二级学院审批',
        WAIT_OFFICE: '待教务处审批',
        ADOPT: '审批通过',
        REJECT: '驳回'
      }
      return totalStateNameMap[state]
    },
    totalStateTypeFilter(state) {
      const totalStateTypeMap = {
        WAIT_GROUP: 'info',
        WAIT_SECONDARY: 'info',
        WAIT_OFFICE: 'info',
        ADOPT: 'success',
        REJECT: 'danger'
      }
      return totalStateTypeMap[state]
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
      let i = 0
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
    },
    courseTypeFilter(status) {
      const statusMap = {
        '考察': 'success',
        '考试': 'danger'
      }
      return statusMap[status]
    }
  },
  // eslint-disable-next-line vue/require-prop-types
  props: ['unApprovalList', 'load', 'canAudit', 'canReapply'],
  data() {
    return {
      dialogTableVisible: false,
      gridData: [
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
      outerVisible: false,
      textBookList: [],
      innerVisible: false,
      feedbackList: [
        {
          'createTime': 0,
          'id': 0,
          'images': '/upload/3d427444fb5d4352849ef45b7276d1c5-test.jpeg',
          'message': '这书很好！！！',
          'simpleUserInfoVO': {
            'avatar': '/icons/user5-icon.png',
            'name': '学生xx'
          }
        }
      ]
    }
  },
  methods: {
    openTableDialog(row) {
      openingPlan.getPlanById(row.openingPlanId).then(res => {
        this.gridData = []
        this.gridData.push(res.data)
        this.gridData[0].textbookIds = row.textbookIds
        this.dialogTableVisible = true
      })
    },
    openOuterVisible(ids) {
      textbook.listByIds(ids).then(res => {
        this.textBookList = res.data
        this.outerVisible = true
      })
    },
    showFeedback(id) {
      feedback.get(id).then(res => {
        this.feedbackList = res.data
        this.innerVisible = true
      })
    },
    audit(id) {
      this.$emit('audit', id)
    },
    reapply(id) {
      this.$emit('reapply', id)
    },
    del(id) {
      this.$emit('del', id)
    }
  }
}
</script>

<style>
.time {
  font-size: 13px;
  color: #999;
}

.bottom {
  margin-top: 13px;
  line-height: 12px;
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
