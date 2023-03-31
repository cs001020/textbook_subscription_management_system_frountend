<template>
  <el-dialog title="选择教材" :visible.sync="open" width="1000px" top="5vh">
    <!--搜索栏-->
    <el-form :model="search" size="small" :inline="true" label-width="68px">
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
          <el-option label="正常" value="NORMAL" />
          <el-option label="库存不足" value="UNDER_STOCK" />
          <el-option label="审核中" value="AUDIT" />
          <el-option label="弃用" value="DISCARD" />
        </el-select>
      </el-form-item>
      <el-form-item label="出版日期">
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
    <el-table ref="dataTable" v-loading="loading" :data="textBookList" @sort-change="handleSort" @selection-change="handleSelectionChange">
      <el-table-column
        type="selection"
        width="55"
      />
      <el-table-column label="教材名" prop="bookName" :show-overflow-tooltip="true" />
      <el-table-column label="作者" prop="author" :show-overflow-tooltip="true" />
      <el-table-column label="出版社" prop="publishingHouse" :show-overflow-tooltip="true" />
      <el-table-column label="价格" width="70px" sortable="custom" prop="price" :show-overflow-tooltip="true" />
      <el-table-column label="库存" width="70px" sortable="custom" prop="stock" :show-overflow-tooltip="true" />
      <el-table-column label="状态" width="70px" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.state | textbookStateFilter">{{ scope.row.state }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="出版日期" align="center" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          {{ parseTime(scope.row.publicationDate,'{y}-{m}-{d}') }}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" style="display: table">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-view"
            @click="$refs.textbookDetail.show(scope.row)"
          >详情</el-button>
          <el-dropdown size="mini" @command="(command) => handleCommand(command, scope.row)">
            <el-button size="mini" type="text" icon="el-icon-d-arrow-right">更多</el-button>
            <el-dropdown-menu>
              <el-dropdown-item command="showFeedback" icon="el-icon-key" class="clearfix" :disabled="scope.row.feedbackCount===0">
                查看反馈
                <el-badge class="mark" :value="scope.row.feedbackCount" />
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <!--底部按钮-->
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="handleSelect">确 定</el-button>
      <el-button @click="open = false">取 消</el-button>
    </div>
    <!--分页-->
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="search.page"
      :limit.sync="search.size"
      @pagination="getList"
    />
    <!--详细信息-->
    <TextbookDetail ref="textbookDetail" :append="true" />
    <!--教材反馈-->
    <TextbookFeedback ref="feedback" :append="true" />
  </el-dialog>
</template>

<script>
import textbook from '@/api/textbookSubscription/textbook'
import { parseTime } from '@/utils'
import TextbookFeedback from '@/views/commons/components/TextbookFeedback/index.vue'
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
  components: { Pagination, TextbookFeedback, TextbookDetail },
  filters: {
    textbookStateFilter(state) {
      return textbookState[state]
    }
  },
  data() {
    return {
      open: false,
      loading: false,
      textBookList: [],
      selected: [],
      total: 0,
      search: {
        keyWord: undefined,
        state: undefined,
        beginTime: undefined,
        endTime: undefined,
        orderByPrice: undefined,
        orderByStock: undefined,
        page: 1,
        size: 10
      },
      dateRange: []
    }
  },
  methods: {
    show() {
      this.open = true
      this.getList()
    },
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
      this.search.orderByPrice = undefined
      this.search.orderByStock = undefined
      if (prop === 'price') {
        this.search.orderByPrice = orderMap[order]
      }
      if (prop === 'stock') {
        this.search.orderByStock = orderMap[order]
      }
      this.getList()
    },
    /* 重置表单 */
    resetForm() {
      this.form = {
        bookName: undefined,
        isbn: undefined,
        author: undefined,
        binding: undefined,
        print: undefined,
        folio: undefined,
        price: undefined,
        words: undefined,
        stock: undefined,
        state: undefined,
        publishingHouse: undefined,
        pageNumber: undefined,
        publicationDate: undefined,
        imgUrl: undefined,
        description: undefined
      }
      this.fileList = []
    },
    // 更多操作触发
    handleCommand(command, row) {
      switch (command) {
        case 'showFeedback':
          this.$refs.feedback.show(row.id)
          break
        default:
          break
      }
    },
    /* 多选选中 */
    handleSelectionChange(val) {
      this.selected = val
    },
    /* 确认按钮 */
    handleSelect() {
      this.$emit('ok', this.selected)
      this.$refs.dataTable.clearSelection()
      this.open = false
    },
    parseTime
  }
}
</script>

<style>
.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both
}
</style>
