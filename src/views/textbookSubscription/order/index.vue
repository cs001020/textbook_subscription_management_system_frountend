<template>
  <div class="app-container">
    <el-table
      :data="tableData"
      style="width: 100%"
      border
    >
      <el-table-column
        prop="id"
        label="订单序号"
        width="100"
      />
      <el-table-column
        prop="createTime"
        label="创建时间"
        width="180"
      >
        <template slot-scope="{row}">
          {{ row.createTime |parseTime }}
        </template>
      </el-table-column>
      <el-table-column
        prop="state"
        label="状态"
        width="180"
      >
        <template slot-scope="{row}">
          <el-tag :type="row.state |orderStateTagTypeFilter">{{ row.state |orderStateNameFilter }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button @click="showDetail(scope.row)">详情</el-button>
          <el-button type="primary" :disabled="scope.row.state!=='WAIT_GRANT'" @click="grant(scope.row.id)">发放教材</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="详情" :visible.sync="dialogTableVisible">
      <!--      <approval-table :un-approval-list="unApprovalList" :can-reapply="true" :load="loading" @reapply="audit" @del="audit" />-->
      {{ dialogData }}
    </el-dialog>
  </div>
</template>

<script>
import textbookOrder from '@/api/textbookSubscription/textbookOrder'
import { parseTime } from '@/utils'
import ApprovalTable from '@/views/commons/components/approvalTable.vue'
export default {
  // eslint-disable-next-line vue/no-unused-components
  components: { ApprovalTable },
  filters: {
    parseTime,
    orderStateNameFilter(state) {
      const map = {
        WAIT_GRANT: '代发放教材',
        GRANTED: '已发放教材'
      }
      return map[state]
    },
    orderStateTagTypeFilter(state) {
      const map = {
        WAIT_GRANT: 'warning',
        GRANTED: 'success'
      }
      return map[state]
    }
  },
  data() {
    return {
      pageParam: {
        page: 1,
        size: 10
      },
      tableData: [],
      total: undefined,
      dialogTableVisible: false,
      dialogData: undefined
    }
  },
  created() {
    this.getData()
  },
  methods: {
    getData() {
      textbookOrder.list(this.pageParam).then(res => {
        this.tableData = res.data
        this.total = res.total
      })
    },
    showDetail(id) {
      this.dialogData = id
      this.dialogTableVisible = true
    },
    grant(id) {
      textbookOrder.grant(id).then(() => {
        this.$notify({
          title: '成功',
          message: '发放申请成功',
          type: 'success'
        })
        this.getData()
      })
    }
  }
}
</script>
