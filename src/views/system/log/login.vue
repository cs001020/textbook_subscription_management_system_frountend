<template>
  <div class="app-container">
    <el-form
      ref="queryForm"
      :model="queryParams"
      size="small"
      :inline="true"
      label-width="68px"
    >
      <el-form-item label="登录地址" prop="ip">
        <el-input
          v-model="queryParams.ip"
          placeholder="请输入登录地址"
          clearable
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="用户名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入用户名称"
          clearable
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="登录状态"
          clearable
          style="width: 240px"
        >
          <el-option label="登陆成功" value="SUCCESS" />
          <el-option label="登陆失败" value="FAIL" />
        </el-select>
      </el-form-item>
      <el-form-item label="登录时间">
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
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
        >搜索</el-button>
        <el-button
          icon="el-icon-refresh"
          size="mini"
          @click="resetQuery"
        >重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
        >导出</el-button>
      </el-col>
    </el-row>

    <el-table ref="tables" v-loading="loading" :data="list">
      <el-table-column label="访问编号" align="center" prop="id" />
      <el-table-column
        label="用户名称"
        align="center"
        prop="account"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="登录地址"
        align="center"
        prop="ip"
        width="130"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="登录地点"
        align="center"
        prop="loginLocation"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="浏览器"
        align="center"
        prop="browser"
        :show-overflow-tooltip="true"
      />
      <el-table-column label="操作系统" align="center" prop="os" />
      <el-table-column label="登录状态" align="center" prop="state">
        <template slot-scope="scope">
          <el-tag :type="scope.row.state | loginStateFilter">{{
            scope.row.state
          }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="操作信息"
        align="center"
        prop="message"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="登录日期"
        align="center"
        prop="accessTime"
        width="180"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.accessTime | parseTime }}</span>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.page"
      :limit.sync="queryParams.size"
      @pagination="getList"
    />
  </div>
</template>

<script>
import api from '@/api/system/log'
import { parseTime } from '@/utils'
import pagination from '@/components/Pagination/index.vue'
import axios from 'axios'
import { getRequestHand, getToken } from '@/utils/auth'
import { saveAs } from 'file-saver'

export default {
  name: 'Logininfor',
  components: { pagination },
  filters: {
    parseTime,
    loginStateFilter(state) {
      const map = {
        '登陆成功': undefined,
        '登陆失败': 'danger'
      }
      return map[state]
    }
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 总条数
      total: 0,
      // 表格数据
      list: [],
      // 日期范围
      dateRange: [],
      // 查询参数
      queryParams: {
        page: 1,
        size: 10,
        ip: undefined,
        name: undefined,
        status: undefined,
        beginTime: undefined,
        endTime: undefined
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    /** 查询登录日志列表 */
    getList() {
      this.loading = true
      api.loginList(this.queryParams).then((response) => {
        this.list = response.data
        this.total = response.total
        this.loading = false
      })
    },
    /** 搜索按钮操作 */
    handleQuery() {
      if (this.dateRange[0]) {
        this.queryParams.beginTime = this.dateRange[0]
      }
      if (this.dateRange[1]) {
        this.queryParams.endTime = this.dateRange[1]
      }
      this.queryParams.pageNum = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = []
      this.queryParams = {
        page: 1,
        size: 10,
        ip: undefined,
        name: undefined,
        status: undefined,
        beginTime: undefined,
        endTime: undefined
      }
      this.getList()
    },
    /** 导出按钮操作 */
    handleExport() {
      if (this.dateRange[0]) {
        this.queryParams.beginTime = this.dateRange[0]
      }
      if (this.dateRange[1]) {
        this.queryParams.endTime = this.dateRange[1]
      }
      const headers = {}
      headers[getRequestHand()] = getToken()
      axios({
        method: 'post',
        url: process.env.VUE_APP_BASE_API + '/log/login/export',
        headers,
        responseType: 'arraybuffer',
        data: this.queryParams
      }).then((res) => {
        const blob = new Blob([res.data])
        saveAs(blob, `LoginLog_${new Date().getTime()}.xlsx`)
      })
    }
  }
}
</script>

