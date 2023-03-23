<template>
  <div class="app-container">
    <!--搜索 -->
    <el-form ref="queryForm" :model="queryParams" size="small" :inline="true" label-width="68px">
      <el-form-item label="系统模块" prop="title">
        <el-input
          v-model="queryParams.title"
          placeholder="请输入系统模块"
          clearable
          style="width: 240px;"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="操作人员" prop="operatorName">
        <el-input
          v-model="queryParams.operatorName"
          placeholder="请输入操作人员"
          clearable
          style="width: 240px;"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="类型" prop="businessType">
        <el-select
          v-model="queryParams.businessType"
          placeholder="操作类型"
          clearable
          style="width: 240px"
        >
          <el-option label="其他" value="OTHER" />
          <el-option label="新增" value="INSERT" />
          <el-option label="修改" value="UPDATE" />
          <el-option label="删除" value="DELETE" />
          <el-option label="导出" value="EXPORT" />
          <el-option label="授权" value="GRANT" />
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="操作状态"
          clearable
          style="width: 240px"
        >
          <el-option label="成功" value="SUCCESS" />
          <el-option label="失败" value="FAIL" />
        </el-select>
      </el-form-item>
      <el-form-item label="操作时间">
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
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <!--操作按钮 -->
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

    <!--表格 -->
    <el-table ref="tables" v-loading="loading" :data="list">
      <el-table-column label="日志编号" align="center" prop="id" />
      <el-table-column label="系统模块" align="center" prop="title" :show-overflow-tooltip="true" />
      <el-table-column label="操作类型" align="center" prop="businessType">
        <template slot-scope="scope">
          <el-tag :type="businessType[scope.row.businessType]">{{ scope.row.businessType }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="请求方式" align="center" prop="requestMethod">
        <template slot-scope="scope">
          {{ scope.row.requestMethod }}
        </template>
      </el-table-column>
      <el-table-column label="操作人员" align="center" prop="operatorName" width="110" :show-overflow-tooltip="true" />
      <el-table-column label="操作地址" align="center" prop="operateIp" width="130" :show-overflow-tooltip="true" />
      <el-table-column label="操作状态" align="center" prop="status">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status==='成功'?'success':'danger'">{{ scope.row.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作日期" align="center" prop="operateTime" width="160">
        <template slot-scope="scope">
          <span>{{ scope.row.operateTime |parseTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-view"
            @click="handleView(scope.row,scope.index)"
          >详细</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--分页 -->
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.page"
      :limit.sync="queryParams.size"
      @pagination="getList"
    />

    <!--操作日志详细 -->
    <el-dialog title="操作日志详细" :visible.sync="open" width="700px" append-to-body>
      <el-form ref="form" :model="form" label-width="100px" size="mini">
        <el-row>
          <el-col :span="12">
            <el-form-item label="操作模块：">{{ form.title }} / {{ form.businessType }}</el-form-item>
            <el-form-item
              label="登录信息："
            >{{ form.operatorName }} / {{ form.operateIp }} </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="请求地址：">{{ form.operateUrl }}</el-form-item>
            <el-form-item label="请求方式：">{{ form.requestMethod }}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="操作方法：">{{ form.method }}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="请求参数：">{{ form.operateParam }}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="返回参数：">{{ form.jsonResult }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="操作状态：">
              <!--              <div v-if="form.status === 0">正常</div>-->
              <!--              <div v-else-if="form.status === 1">失败</div>-->
              {{ form.status }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="操作时间：">{{ form.operateTime|parseTime }}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="异常信息：">{{ form.errorMsg }}</el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="open = false">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import api from '@/api/system/log'
import { parseTime } from '@/utils'
import pagination from '@/views/commons/components/Pagination/index.vue'
import axios from 'axios'
import { getToken, getRequestHand } from '@/utils/auth'
import { saveAs } from 'file-saver'

export default {
  name: 'OperateLog',
  components: { pagination },
  filters: {
    parseTime
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 总条数
      total: 0,
      // 表格数据
      list: [],
      // 是否显示弹出层
      open: false,
      // 日期范围
      dateRange: [],
      // 表单参数
      form: {},
      // 查询参数
      queryParams: {
        page: 1,
        size: 10,
        title: undefined,
        operatorName: undefined,
        businessType: undefined,
        status: undefined,
        beginTime: undefined,
        endTime: undefined
      },
      businessType: {
        '其他': 'info',
        '新增': 'info',
        '删除': 'danger',
        '修改': 'info',
        '导出': 'warning',
        '授权': undefined
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    /** 查询登录日志 */
    getList() {
      this.loading = true
      api.operateList(this.queryParams).then(response => {
        this.list = response.data
        this.total = response.total
        this.loading = false
      }
      )
    },
    /** 搜索按钮操作 */
    handleQuery() {
      if (this.dateRange[0]) {
        this.queryParams.beginTime = this.dateRange[0]
      }
      if (this.dateRange[1]) {
        this.queryParams.endTime = this.dateRange[1]
      }
      this.queryParams.page = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = []
      this.queryParams = {
        page: 1,
        size: 10,
        title: undefined,
        operatorName: undefined,
        businessType: undefined,
        status: undefined,
        beginTime: undefined,
        endTime: undefined
      }
      this.getList()
    },
    /** 详细按钮操作 */
    handleView(row) {
      this.open = true
      this.form = row
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
        url: process.env.VUE_APP_BASE_API + '/log/operate/export',
        headers,
        responseType: 'arraybuffer',
        data: this.queryParams
      }).then(res => {
        const blob = new Blob([res.data])
        saveAs(blob, `OperateLog_${new Date().getTime()}.xlsx`)
      })
    }
  }
}
</script>

