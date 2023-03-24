<template>
  <!-- 选择课程 -->
  <el-dialog title="选择课程" :visible.sync="visible" width="800px" top="5vh" append-to-body>
    <el-form ref="queryForm" :model="queryParams" size="small" :inline="true">
      <el-form-item label="课程名" prop="userName">
        <el-input
          v-model="queryParams.courseName"
          placeholder="请输入课程名"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="课程类型" prop="userName">
        <el-select v-model="queryParams.type" placeholder="请选择课程类型">
          <el-option label="考试" value="EXAMINATION" />
          <el-option label="考察" value="INVESTIGATE" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <!--表格-->
    <el-row>
      <el-table ref="table" v-loading="loading" :row-key="getRowKey" :data="courseList" height="260px" @row-click="clickRow" @selection-change="handleSelectionChange">
        <el-table-column type="selection" :reserve-selection="true" width="55" />
        <el-table-column label="课程名" prop="courseName" :show-overflow-tooltip="true" />
        <el-table-column label="学分" prop="credit" :show-overflow-tooltip="true" />
        <el-table-column label="总学时" prop="teachingHours" :show-overflow-tooltip="true" />
        <el-table-column label="教学周" prop="weeksTeach" :show-overflow-tooltip="true" />
        <el-table-column
          prop="type"
          label="类型"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="{row}">
            <el-tag :type="row.type ==='INVESTIGATE'?'success':'danger'">
              {{ row.type ==='INVESTIGATE'?'考察':'考试' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" align="center" prop="createTime" width="180">
          <template slot-scope="scope">
            <span>{{ scope.row.createTime | parseTime }}</span>
          </template>
        </el-table-column>
      </el-table>
      <!--分页-->
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="queryParams.page"
        :limit.sync="queryParams.size"
        @pagination="getList"
      />
    </el-row>
    <!--按钮-->
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="handleSelectCourse()">提交</el-button>
      <el-button @click="visible=false">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import openingPlan from '@/api/academic/openingPlan'
import Pagination from '@/views/commons/components/Pagination/index.vue'
import { parseTime } from '@/utils'
export default {
  components: { Pagination },
  filters: {
    parseTime
  },
  data() {
    return {
      // 表格加载
      loading: false,
      // 遮罩层
      visible: false,
      // 总条数
      total: 0,
      // 课程列表
      courseList: [],
      // 选中的课程
      course: [],
      // 查询参数
      queryParams: {
        page: 1,
        size: 10,
        courseName: undefined,
        type: undefined
      },
      id: undefined
    }
  },
  methods: {
    // 显示弹框
    show() {
      this.getList()
      this.visible = true
    },
    // 查询表数据
    getList() {
      this.loading = true
      openingPlan.courseSearch(this.queryParams).then(res => {
        this.courseList = res.data
        this.total = res.total
        this.loading = false
      })
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.queryParams = {
        page: 1,
        size: 10,
        courseName: undefined,
        type: undefined
      }
      this.handleQuery()
    },
    getRowKey(row) {
      return row.id
    },
    /* 表格行点击 */
    clickRow(row) {
      this.$refs.table.toggleRowSelection(row)
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.course = selection
    },
    /** 选定课程按钮 */
    handleSelectCourse() {
      this.visible = false
      this.$emit('ok', this.course)
    }
  }
}
</script>
