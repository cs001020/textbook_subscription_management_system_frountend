<template>
  <div class="app-container">
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
            icon="el-icon-view"
            @click="$refs.textbookDetail.show(scope.row)"
          >详情</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            :disabled="scope.row.state==='审核中'"
            @click="handleUpdate(scope.row)"
          >修改</el-button>
          <el-dropdown size="mini" @command="(command) => handleCommand(command, scope.row)">
            <el-button size="mini" type="text" icon="el-icon-d-arrow-right">更多</el-button>
            <el-dropdown-menu>
              <el-dropdown-item
                command="handleDiscard"
                icon="el-icon-delete"
                :disabled="scope.row.state==='审核中' || scope.row.state==='弃用'"
              >弃用</el-dropdown-item>
              <el-dropdown-item
                command="addTextbookStock"
                icon="el-icon-key"
                :disabled="scope.row.state==='审核中' || scope.row.state==='弃用'"
              >添加库存</el-dropdown-item>
              <el-dropdown-item command="showFeedback" icon="el-icon-key" class="clearfix" :disabled="scope.row.feedbackCount===0">
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
    <!--添加或者修改教材dialog-->
    <el-dialog :title="title" :visible.sync="open">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="教材名" prop="bookName">
              <el-input v-model="form.bookName" placeholder="请输入教材名" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="ISBN" prop="isbn">
              <el-input v-model="form.isbn" placeholder="请输入ISBN码" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="作者" prop="author">
              <el-input v-model="form.author" placeholder="请输入作者" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="装订" prop="binding">
              <el-input v-model="form.binding" placeholder="请输入装订方式" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="印次" prop="print">
              <el-input v-model="form.print" placeholder="请输入印次" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="开本" prop="folio">
              <el-input v-model="form.folio" placeholder="请输入开本" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="价格" prop="price">
              <el-input v-model.number="form.price" placeholder="请输入价格" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="字数" prop="words">
              <el-input v-model="form.words" placeholder="请输入字数" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="出版社" prop="publishingHouse">
              <el-input v-model="form.publishingHouse" placeholder="请输入出版社" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="页数" prop="pageNumber">
              <el-input v-model="form.pageNumber" placeholder="请输入页数" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="库存" prop="stock">
              <el-input v-model="form.stock" placeholder="请输入库存" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="出版日期" prop="publicationDate">
              <el-date-picker
                v-model="form.publicationDate"
                type="date"
                placeholder="请选择出版日期"
              />
            </el-form-item>
          </el-col>
          <el-col v-if="form.id" :span="12">
            <el-form-item label="状态" prop="publicationDate">
              <el-radio v-model="form.state" label="NORMAL">正常</el-radio>
              <el-radio v-model="form.state" label="DISCARD">弃用</el-radio>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="简介" prop="description">
              <el-input
                v-model="form.description"
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 4}"
                placeholder="请输入教材简介"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="教材封面" prop="imgUrl">
              <el-upload
                class="upload-demo"
                :headers="requestHand"
                :action="uploadAction"
                accept="image/*"
                :on-success="handleUploadSuccess"
                :on-remove="handleFileRemove"
                :multiple="false"
                :file-list="fileList"
                list-type="picture"
              >
                <el-button size="small" :disabled="form.imgUrl!==null&&form.imgUrl!==''&&form.imgUrl!==undefined">上传教材封面</el-button>
                <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <!--详细信息-->
    <TextbookDetail ref="textbookDetail" />
    <!--教材反馈-->
    <TextbookFeedback ref="feedback" />
  </div>
</template>

<script>
import textbook from '@/api/textbookSubscription/textbook'
import { parseTime } from '@/utils'
import { getRequestHand, getToken } from '@/utils/auth'
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
      textBookList: [],
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
      dateRange: [],
      title: '',
      open: false,
      form: {},
      fileList: [],
      rules: {
        bookName: [
          { required: true, message: '教材名不能为空', trigger: 'blur' }
        ],
        isbn: [
          { required: true, message: 'isbn不能为空', trigger: 'blur' }
        ],
        author: [
          { required: true, message: '作者不能为空', trigger: 'blur' }
        ],
        price: [
          { required: true, message: '价格不能为空', trigger: 'blur' },
          { type: 'number', message: '价格必须为数字值', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '介绍不能为空', trigger: 'blur' }
        ],
        imgUrl: [
          { required: true, message: '请上传教材封面', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    requestHand() {
      const requestHand = {}
      requestHand[getRequestHand()] = getToken()
      return requestHand
    },
    uploadAction() {
      return `http://${window.location.host}${process.env.VUE_APP_BASE_API}/file/upload/img`
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
      this.dateRange = []
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
    /* 添加按钮 */
    handleAdd() {
      this.resetForm()
      this.title = '添加教材'
      this.open = true
    },
    /* 修改按钮 */
    handleUpdate(row) {
      textbook.getById(row.id).then(res => {
        this.form = res.data
        this.fileList = [{ name: 'img.jpg', url: `https://kodo.warframe.top${this.form.imgUrl}` }]
        this.title = '修改教材'
        this.open = true
      })
    },
    /* 上传成功回调 */
    handleUploadSuccess(response) {
      if (response.code === 200) {
        this.form.imgUrl = response.msg
      } else {
        this.$message.error('上传失败')
      }
    },
    /* 文件移除 */
    handleFileRemove() {
      this.form.imgUrl = undefined
    },
    submitForm() {
      this.$refs.form.validate(valid => {
        if (valid) {
          // eslint-disable-next-line no-empty
          if (this.form.id !== undefined) {
            textbook.updateTextbook(this.form).then(res => {
              this.$message({ message: '修改成功', type: 'success' })
              this.open = false
              this.getList()
            })
          } else {
            textbook.addTextbook(this.form).then(res => {
              this.$message({ message: '新增成功', type: 'success' })
              this.open = false
              this.getList()
            })
          }
        }
      })
    },
    /* 取消按钮 */
    cancel() {
      this.resetForm()
      this.open = false
    },
    // 更多操作触发
    handleCommand(command, row) {
      switch (command) {
        case 'showFeedback':
          this.$refs.feedback.show(row.id)
          break
        case 'handleDiscard':
          this.discardTextbook(row.id)
          break
        case 'addTextbookStock':
          this.addTextbookStock(row.id)
          break
        default:
          break
      }
    },
    /* 添加教库存 */
    addTextbookStock(id) {
      this.$prompt('请输入数量', '提示').then(({ value }) => {
        textbook.addStock(id, { count: value }).then(res => {
          this.dialogTableVisible = false
          this.$message({ message: '添加成功', type: 'success' })
          this.getList()
        })
      })
    },
    /* 弃用教材 */
    discardTextbook(id) {
      this.$confirm('此操作将弃用该教材, 是否继续?', '系统提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        textbook.discardTextbook(id).then(res => {
          this.getList()
          this.$message({
            type: 'success',
            message: '修改成功成功!'
          })
        })
      }).catch(() => {
      })
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
