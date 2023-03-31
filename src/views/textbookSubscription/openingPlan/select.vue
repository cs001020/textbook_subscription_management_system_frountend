<template>
  <div class="app-container">
    <h4 class="form-header h4">
      当前课程
    </h4>
    <el-table
      :data="course"
      style="width: 100%"
    >
      <el-table-column
        prop="courseName"
        label="课程名"
      />
      <el-table-column
        prop="credit"
        label="学分"
      />
      <el-table-column
        prop="teachingHours"
        label="总学时"
      />
      <el-table-column
        prop="weeksTeach"
        label="教学周"
      />
      <el-table-column
        prop="type"
        label="类型"
      >
        <template slot-scope="{row}">
          <el-tag :type="row.type | typeFilter">
            {{ row.type | typeNameFilter }}
          </el-tag>
        </template>
      </el-table-column>
    </el-table>
    <h4 class="form-header h4">
      教材
      <el-tooltip class="item" effect="dark" content="搜索教材" placement="top-start">
        <el-button size="mini" icon="el-icon-search" style="margin-left: 10px" circle @click="$refs.selectTextbook.show()" />
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="添加教材" placement="top-start">
        <el-button size="mini" icon="el-icon-plus" style="margin-left: 10px" circle @click="handleCreate" />
      </el-tooltip>
    </h4>
    <!--表格-->
    <el-table ref="dataTable" :data="textBookList">
      <el-table-column label="教材名" prop="bookName" :show-overflow-tooltip="true" width="150" />
      <el-table-column label="作者" prop="author" :show-overflow-tooltip="true" width="150" />
      <el-table-column label="出版社" prop="publishingHouse" :show-overflow-tooltip="true" width="150" />
      <el-table-column label="价格" prop="price" :show-overflow-tooltip="true" width="100" />
      <el-table-column label="库存" prop="stock" :show-overflow-tooltip="true" width="100" />
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
            v-if="scope.row.id===undefined"
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
          >删除</el-button>
          <el-button
            v-if="scope.row.feedbackCount!==undefined&&scope.row.feedbackCount!==0"
            size="mini"
            type="text"
            icon="el-icon-chat-line-square"
            @click="$refs.feedback.show(scope.row.id)"
          >反馈</el-button>
        </template>
      </el-table-column>
    </el-table>
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
    <textbook-feedback ref="feedback" />
    <!--选择教材 -->
    <select-textbook ref="selectTextbook" @ok="ok" />
    <!--底部按钮-->
    <el-form label-width="100px">
      <el-form-item style="text-align: center;margin-left:-120px;margin-top:30px;">
        <el-button type="primary" @click="submit()">确 定</el-button>
        <el-button @click="close()">返回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getToken, getRequestHand } from '@/utils/auth'
import { parseTime } from '@/utils'
import openingPlan from '@/api/academic/openingPlan'
import textbook from '@/api/textbookSubscription/textbook'
import TextbookDetail from '@/views/commons/components/TextbookDetail/index.vue'
import TextbookFeedback from '@/views/commons/components/TextbookFeedback/index.vue'
import SelectTextbook from '@/views/textbookSubscription/openingPlan/selectTextbook.vue'
import approval from '@/api/textbookSubscription/approval'
const textbookState = {
  '正常': undefined,
  '库存不足': 'warning',
  '审核中': 'info',
  '弃用': 'danger'
}

export default {
  components: { TextbookFeedback, SelectTextbook, TextbookDetail },
  filters: {
    typeFilter(status) {
      const statusMap = {
        INVESTIGATE: 'success',
        EXAMINATION: 'danger'
      }
      return statusMap[status]
    },
    typeNameFilter(status) {
      const statusMap = {
        INVESTIGATE: '考察',
        EXAMINATION: '考试'
      }
      return statusMap[status]
    },
    textbookStateFilter(state) {
      return textbookState[state]
    }
  },
  data() {
    var validateBookName = async(rule, value, callback) => {
      if (value === '' || value === undefined) {
        callback(new Error('教材名不能为空'))
      } else {
        const res = await textbook.checkbookName(value)
        if (res.data === 'UN_UNIQUE') {
          callback(new Error('教材名已存在'))
        }
        callback()
      }
    }
    return {
      id: undefined,
      course: [],
      textBookList: [],
      open: false,
      title: undefined,
      editId: undefined,
      form: {},
      fileList: [],
      rules: {
        bookName: [
          { validator: validateBookName, trigger: 'blur' }
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
    this.id = this.$route.params.openingPlanId
    this.getCourseByOpeningPlanId()
  },
  methods: {
    /* 获取课程 */
    getCourseByOpeningPlanId() {
      openingPlan.getCourseByOpeningPlanId(this.id).then(res => {
        this.course = res.data
      })
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
    /* 添加教材按钮 */
    handleCreate() {
      this.resetForm()
      this.title = '添加教材'
      this.open = true
    },
    /* 修改教材按钮 */
    handleUpdate(row) {
      this.resetForm()
      this.title = '修改教材'
      this.editId = this.textBookList.indexOf(row)
      this.form = { ...row }
      this.fileList = [{ name: 'img.jpg', url: `https://kodo.warframe.top${this.form.imgUrl}` }]
      this.open = true
    },
    /* 删除教材按钮 */
    handleDelete(row) {
      this.textBookList.splice(this.textBookList.indexOf(row), 1)
    },
    /* 提交表单 */
    submitForm() {
      this.$refs.form.validate(valid => {
        if (valid) {
          if (this.title === '添加教材') {
            this.form.isNew = true
            this.textBookList.push(this.form)
            this.open = false
          } else {
            this.$set(this.textBookList, this.editId, { ...this.form })
            this.editId = undefined
            this.open = false
          }
        }
      })
    },
    /* 表单取消按钮 */
    cancel() {
      this.$confirm('当前数据将不会保存,确认关闭？').then(() => {
        this.resetForm()
        this.open = false
      })
    },
    /* 图片上传成功回调 */
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
    /* 选择完教材 */
    ok(data) {
      this.textBookList = this.textBookList.concat(data)
    },
    /* 关闭按钮 */
    close() {
      this.$confirm('当前数据将不会保存,确认关闭？').then(() => {
        this.$store.dispatch('tagsView/delView', this.$router.currentRoute)
        this.$router.push({ path: '/textbookSubscription/openingPlan' })
      })
    },
    /* 确认按钮按钮 */
    submit() {
      const approvalInsertDTO = {
        'openingPlanId': 0,
        'textBookIds': [],
        'textbookDTOList': []
      }
      approvalInsertDTO.openingPlanId = this.id
      this.textBookList.forEach(textbook => {
        if (textbook.isNew) {
          approvalInsertDTO.textbookDTOList.push(textbook)
        } else {
          approvalInsertDTO.textBookIds.push(textbook.id)
        }
      })
      approval.submit(approvalInsertDTO).then(res => {
        this.$store.dispatch('tagsView/delView', this.$router.currentRoute)
        this.$router.push({ path: '/textbookSubscription/openingPlan' })
        this.$message({ type: 'success', message: '申请成功' })
      })
    },
    parseTime
  }
}
</script>
