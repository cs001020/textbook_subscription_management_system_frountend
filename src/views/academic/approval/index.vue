<template>
  <div class="app-container">
    <!--搜索栏-->
    <el-form :model="search" size="small" :inline="true" label-width="68px">
      <el-form-item label="发起人" prop="userName">
        <el-input
          v-model="search.name"
          placeholder="请输入发起人"
          clearable
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="type">
        <el-select
          v-model="search.state"
          placeholder="教材状态"
          clearable
          style="width: 240px"
        >
          <el-option label="审核中" value="1" />
          <el-option label="审核通过" value="2" />
          <el-option label="审核驳回" value="3" />
        </el-select>
      </el-form-item>
      <el-form-item label="发起时间">
        <el-date-picker
          v-model="dateRange"
          style="width: 240px"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="handleResetQuery">重置</el-button>
      </el-form-item>
    </el-form>
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
        label="发起人"
        width="150"
        prop="teacher.name"
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
          <el-button v-if="row.state !=='ADOPT'" type="text" size="mini" icon="el-icon-delete" @click="handelDel(row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--分页-->
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="search.page"
      :limit.sync="search.size"
      @pagination="getList"
    />
    <!--详情-->
    <approval-detail ref="detail" />
  </div>
</template>

<script>
import approval from '@/api/textbookSubscription/approval'
import { parseTime } from '@/utils'
import ApprovalDetail from '@/views/commons/components/ApprovalDetail'
import Pagination from '@/views/commons/components/Pagination/index.vue'
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
  components: { Pagination, ApprovalDetail },
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
      dateRange: [],
      search: {
        page: 1,
        size: 10,
        name: undefined,
        state: undefined,
        beginTime: undefined,
        endTime: undefined
      },
      approvalList: [],
      total: 0
    }
  },
  created() {
    this.getList()
  },
  methods: {
    /* 获取数据 */
    getList() {
      this.load = true
      approval.list(this.search).then(res => {
        this.approvalList = res.data
        this.total = res.total
        this.load = false
      })
    },
    handleQuery() {
      if (this.dateRange[0]) {
        this.search.beginTime = this.dateRange[0]
      }
      if (this.dateRange[1]) {
        this.search.endTime = this.dateRange[1]
      }
      this.search.page = 1
      this.getList()
    },
    /** 重置按钮 */
    handleResetQuery() {
      this.reset()
      this.getList()
    },
    /* 重置搜索参数 */
    reset() {
      this.search = {
        page: 1,
        size: 10,
        name: undefined,
        state: undefined,
        beginTime: undefined,
        endTime: undefined
      }
      this.dateRange = []
    },
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
