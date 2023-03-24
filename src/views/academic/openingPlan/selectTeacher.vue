<template>
  <!-- 选择教师 -->
  <el-dialog title="选择教师" :visible.sync="visible" width="800px" top="5vh" append-to-body>
    <el-dialog
      width="30%"
      title="教师详情"
      :visible.sync="innerVisible"
      append-to-body
    >
      <el-descriptions v-if="teacherDetails !== undefined">
        <el-descriptions-item label="教师名">{{ teacherDetails.name }}</el-descriptions-item>
        <el-descriptions-item label="手机号">{{ teacherDetails.phoneNumber }}</el-descriptions-item>
        <el-descriptions-item label="邮箱">{{ teacherDetails.userInfo.email }}</el-descriptions-item>
        <el-descriptions-item label="性别">
          <el-tag size="small" :type="teacherDetails.userInfo.sex===0?'danger':''">{{ teacherDetails.userInfo.sex===0?'女':'男' }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="联系地址">{{ teacherDetails.userInfo.address }}</el-descriptions-item>
      </el-descriptions>
    </el-dialog>
    <el-form ref="queryForm" :model="queryParams" size="small" :inline="true">
      <el-row>
        <el-col :span="12">
          <el-form-item label="登陆账号" prop="userName">
            <el-input
              v-model="queryParams.account"
              placeholder="请输入登陆账号"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="手机号码" prop="phoneNumber">
            <el-input
              v-model="queryParams.phoneNumber"
              placeholder="请输入手机号码"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="教学组  " prop="teachingGroup">
            <el-select v-model="queryParams.teachingGroupId" placeholder="请选择教学组">
              <el-option
                v-for="item in teacherGroupList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="二级学院" prop="secondaryCollege">
            <el-select v-model="queryParams.secondaryCollegeId" placeholder="请选择二级学院">
              <el-option
                v-for="item in secondaryCollegeList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-row>
      <el-table ref="table" v-loading="loading" :data="userList" height="260px">
        <el-table-column label="登陆账号" prop="account" :show-overflow-tooltip="true" />
        <el-table-column label="用户昵称" prop="name" :show-overflow-tooltip="true" />
        <el-table-column label="手机" prop="phoneNumber" :show-overflow-tooltip="true" />
        <el-table-column label="创建时间" align="center" prop="createTime" width="180">
          <template slot-scope="scope">
            <span>{{ scope.row.createTime | parseTime }}</span>
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="100"
        >
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="showDetails(scope.row)">查看</el-button>
            <el-button type="text" size="small" @click="handleSelectUser(scope.row)">选定</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="queryParams.page"
        :limit.sync="queryParams.size"
        @pagination="getList"
      />
    </el-row>
    <div slot="footer" class="dialog-footer">
      <el-button @click="visible=false">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { teacher } from '@/api/system/user'
import Pagination from '@/views/commons/components/Pagination/index.vue'
import { parseTime } from '@/utils'
export default {
  components: { Pagination },
  filters: {
    parseTime
  },
  // eslint-disable-next-line vue/require-prop-types
  props: ['teacherGroupList', 'secondaryCollegeList'],
  data() {
    return {
      // 表格加载
      loading: false,
      // 遮罩层
      visible: false,
      // 内部dialog（用户详情）
      innerVisible: false,
      // 教师信息(用于内部dialog)
      teacherDetails: undefined,
      // 总条数
      total: 0,
      // 用户列表
      userList: [],
      // 查询参数
      queryParams: {
        page: 1,
        size: 10,
        account: undefined,
        phoneNumber: undefined,
        teachingGroupId: undefined,
        secondaryCollegeId: undefined
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
      teacher(this.queryParams).then(res => {
        this.userList = res.data
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
        account: undefined,
        phoneNumber: undefined,
        teachingGroupId: undefined,
        secondaryCollegeId: undefined
      }
      this.handleQuery()
    },
    showDetails(row) {
      this.teacherDetails = row
      this.innerVisible = true
    },
    /** 选定用户按钮 */
    handleSelectUser(row) {
      this.visible = false
      this.$emit('ok', row)
    }
  }
}
</script>
