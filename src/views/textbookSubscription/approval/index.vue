<template>
  <div class="app-container">
    <!--表格-->
    <el-table
      v-loading="load"
      :data="approvalList"
      style="width: 100%"
    >
      <el-table-column
        label="编号"
        width="150"
        prop="id"
      />
      <el-table-column
        label="发起时间"
        width="150"
      >
        <template slot-scope="{row}">
          <span>{{ parseTime(row.createTime,'{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="最近修改"
        width="150"
      >
        <template slot-scope="{row}">
          <span>{{ parseTime(row.updateTime,'{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="当前状态">
        <template slot-scope="{row}">
          <el-tag :type="row.state | stateTagTypeMap">{{ row.state | stateLabelMap }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="text" size="mini" icon="el-icon-view" @click="$refs.detail.show(row.id)">详情</el-button>
          <el-button type="text" size="mini" icon="el-icon-reading" @click="$refs.textbook.show(row.id)">教材</el-button>
          <el-button v-if="row.state=== 'REJECT'" type="text" size="mini" icon="el-icon-edit" @click="$router.push({path:'/textbookSubscription/approval-re/textbook-select/' + row.id})">重新申请</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--详情-->
    <approval-detail ref="detail" />
    <textbook-detail-list ref="textbook" />
  </div>
</template>

<script>
import approval from '@/api/textbookSubscription/approval'
import { parseTime } from '@/utils'
import ApprovalDetail from '@/views/commons/components/ApprovalDetail'
import TextbookDetailList from '@/views/commons/components/TextbookDetailList'
const stateMap = {
  WAIT_GROUP: {
    label: '待教学组审批',
    type: 'info'
  },
  WAIT_SECONDARY: {
    label: '待二级学院审批',
    type: 'info'
  },
  WAIT_OFFICE: {
    label: '待教务处审批',
    type: 'info'
  },
  ADOPT: {
    label: '审批通过',
    type: 'success'
  },
  REJECT: {
    label: '驳回',
    type: 'danger'
  }
}
export default {
  components: { TextbookDetailList, ApprovalDetail },
  filters: {
    stateLabelMap(state) {
      return stateMap[state].label
    },
    stateTagTypeMap(state) {
      return stateMap[state].type
    }
  },
  data() {
    return {
      load: false,
      approvalList: []
    }
  },
  created() {
    this.getList()
  },
  methods: {
    /* 获取数据 */
    getList() {
      this.load = true
      approval.me().then(res => {
        this.approvalList = res.data
        this.load = false
      })
    },
    /* 删除按钮 */
    handelDel(id) {
      this.$confirm('此操作将永久删除该数据, 是否继续?', '系统提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        approval.adminDel(id).then(res => {
          this.getList()
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
      }).catch(() => {
      })
    },
    parseTime
  }
}
</script>

<style scoped>

</style>
