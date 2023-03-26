<template>
  <div class="app-container">
    <!--搜索栏-->
    <el-form ref="queryForm" :model="search" size="small" :inline="true" label-width="68px">
      <el-form-item label="关键字" prop="userName">
        <el-input
          v-model="search.keyWord"
          placeholder="请输入关键字"
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
          <el-option label="123" value="12" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="handleResetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <!--操作按钮-->
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
        >新增</el-button>
      </el-col>
    </el-row>
    <!--表格-->
    <el-table ref="dataTable" v-loading="loading" :data="textBookList" @sort-change="handleSort">
      <el-table-column label="教材编号" prop="id" width="120" />
      <el-table-column label="教材名" prop="bookName" :show-overflow-tooltip="true" width="150" />
      <el-table-column label="作者" prop="author" :show-overflow-tooltip="true" width="150" />
      <el-table-column label="出版社" prop="publishingHouse" :show-overflow-tooltip="true" width="150" />
      <el-table-column label="价格" sortable="custom" prop="price" :show-overflow-tooltip="true" width="100" />
      <el-table-column label="库存" sortable="custom" prop="stock" :show-overflow-tooltip="true" width="100" />
      <el-table-column label="状态" align="center" width="100">
        <template slot-scope="scope">
          <el-tag :type="scope.row.state | textbookStateFilter">{{ scope.row.state }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="出版日期" align="center" width="150">
        <template slot-scope="scope">
          {{ parseTime(scope.row.publicationDate,'{y}-{m}-{d}') }}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="$refs.textbookDetail.show(scope.row)"
          >详情</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
          >弃用</el-button>
          <el-dropdown size="mini" @command="(command) => handleCommand(command, scope.row)">
            <el-button size="mini" type="text" icon="el-icon-d-arrow-right">更多</el-button>
            <el-dropdown-menu>
              <el-dropdown-item
                command="handleResetPwd"
                icon="el-icon-key"
              >添加库存</el-dropdown-item>
              <el-dropdown-item icon="el-icon-key" class="clearfix" :disabled="scope.row.feedbackCount===0">
                查看反馈
                <el-badge class="mark" :value="scope.row.feedbackCount" />
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
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

    <!--详细信息-->
    <el-dialog title="详细信息" :visible.sync="dialogTableVisible">
      <!--评论-->
      <!--      <el-dialog
        width="30%"
        title="学生反馈"
        append-to-body
        :visible.sync="feedbackVisible"
      >
        <feedback :feedback="feedbackList" />
      </el-dialog>
      <el-form :model="dialogFormData" class="demo-form-inline">
        <el-form-item label="作者">
          <span>{{ dialogFormData.author }}</span>
        </el-form-item>
        <el-form-item label="价格">
          <span>{{ dialogFormData.price }}</span>
        </el-form-item>
        <el-form-item label="库存">
          <span>{{ dialogFormData.stock }}</span>
        </el-form-item>
        <el-form-item label="状态">
          <span>{{ dialogFormData.state }}</span>
        </el-form-item>
        <el-form-item>
          <el-badge :value="dialogFormData.feedbackCount" class="item" type="primary">
            <el-button size="small" :disabled="dialogFormData.feedbackCount===0" @click="showFeedback(dialogFormData.id)">学生反馈</el-button>
          </el-badge>
        </el-form-item>
        <el-form-item>
          <el-button size="small" @click="add(dialogFormData.id)">添加库存</el-button>
        </el-form-item>
        <el-form-item label="太多了">
          <el-link type="danger" disabled>字段太多 自己看着来吧</el-link>
        </el-form-item>
      </el-form>-->
    </el-dialog>
    <!--详细信息-->
    <TextbookDetail ref="textbookDetail" />
  </div>
</template>

<script>
import textbook from '@/api/textbookSubscription/textbook'
import feedback from '@/api/feedback'
import { parseTime } from '@/utils'
import Feedback from '@/views/commons/components/feedback.vue'
import TextbookDetail from '@/views/commons/components/TextbookDetail'
import Pagination from '@/views/commons/components/Pagination/index.vue'

const textbookState = {
  '正常': undefined,
  '库存不足': 'warning',
  '审核中': 'info',
  '弃用': 'danger'
}
const orderMap = {
  descending: 'DESC',
  ascending: 'ASC'
}
export default {
  // eslint-disable-next-line vue/no-unused-components
  components: { Pagination, Feedback, TextbookDetail },
  filters: {
    textbookStateFilter(state) {
      return textbookState[state]
    }
  },
  data() {
    return {
      textBookList: [],
      total: 0,
      search: {
        keyWord: undefined,
        orderByPrice: undefined,
        orderByStock: undefined,
        page: 1,
        size: 10
      },
      dialogTableVisible: false,
      dialogFormData: undefined,
      loading: false,
      feedbackVisible: false,
      feedbackList: []
    }
  },
  created() {
    this.getList()
  },
  methods: {
    /* 获取数据 */
    getList() {
      this.loading = true
      textbook.list(this.search).then(res => {
        this.total = res.total
        this.textBookList = res.data
        this.loading = false
      })
    },
    /** 搜索按钮操作 */
    handleQuery() {
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
        keyWord: undefined,
        orderByPrice: undefined,
        orderByStock: undefined,
        page: 1,
        size: 10
      }
      this.$refs.dataTable.clearSort()
    },
    /* 表格排序 */
    handleSort({ prop, order }) {
      if (prop === 'price') {
        this.search.orderByPrice = orderMap[order]
      }
      if (prop === 'stock') {
        this.search.orderByStock = orderMap[order]
      }
      this.getList()
    },
    showFeedback(id) {
      feedback.get(id).then(res => {
        this.feedbackList = res.data
        this.feedbackVisible = true
      })
    },
    add(id) {
      this.$prompt('请输入数量', '提示').then(({ value }) => {
        textbook.addStock(id, { count: value }).then(res => {
          this.dialogTableVisible = false
          this.$message({ message: '添加成功', type: 'success' })
          this.getList()
        })
      })
    },
    parseTime
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

.button {
  padding: 0;
  float: right;
}

.image {
  width: 100%;
  display: block;
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
