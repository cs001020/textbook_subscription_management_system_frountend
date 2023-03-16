<template>
  <div class="app-container">
    <div v-if="!select">
      <el-button type="info" plain @click="select=true">教材库选取</el-button>
      <el-button type="info" plain @click="openFormDialog">添加新教材</el-button>
      <el-button type="success" plain @click="submit">提交申请</el-button>
      <el-button type="warning" plain @click="$emit('cancel')">取消</el-button>
      <el-row v-if="textBookList.length>0">
        <el-card v-for="textbook in textBookList" :key="textbook.bookName" class="box-card">
          <div slot="header" class="clearfix">
            <span>{{ textbook.bookName }}</span>
            <span class="time">{{ textbook.publishingHouse }}</span>
            <el-button style="float: right; padding: 3px 0" type="text" @click="textBookList.splice(textBookList.indexOf(textbook),1)">移除</el-button>
            <el-button v-if="textbook.isNew" style="float: right; padding: 3px 0;margin-right: 3px" type="text" @click="handlerEdit(textbook)">编辑</el-button>
          </div>
          <el-col :span="3">
            <el-image
              style="width: 170px; height: 200px; margin-bottom: 10px;"
              :src="`https://kodo.warframe.top/${textbook.imgUrl}`"
              fit="fill"
            />
          </el-col>
          <el-col :span="21">
            <div class="text item">
              作者：{{ textbook.author }}
            </div>
            <div class="text item">
              价格：{{ textbook.price }}
            </div>
            <div class="text item">
              库存：{{ textbook.stock }}
            </div>
            <div class="text item">
              太多了： <el-link type="danger" disabled>自己看着来</el-link>
            </div>
            <div v-if="textbook.feedbackCount" class="text item">
              <el-badge :value="textbook.feedbackCount" class="item" type="primary">
                <el-button size="small" :disabled="textbook.feedbackCount===0" @click="showFeedback(textbook.id)">学生反馈</el-button>
              </el-badge>
            </div>
          </el-col>
        </el-card>
      </el-row>

      <el-card v-else class="box-card">
        请选择教材
      </el-card>

      <el-dialog :title="formType | titleFilter" :visible.sync="dialogFormVisible" :before-close="handleFormDialogClose">
        <el-form :model="form">
          <el-form-item label="书名" :label-width="formLabelWidth">
            <el-input v-model="form.bookName" autocomplete="off" />
          </el-form-item>
          <el-form-item label="ISBN" :label-width="formLabelWidth">
            <el-input v-model="form.isbn" autocomplete="off" />
          </el-form-item>
          <el-form-item label="作者" :label-width="formLabelWidth">
            <el-input v-model="form.author" autocomplete="off" />
          </el-form-item>
          <el-form-item label="价格" :label-width="formLabelWidth">
            <el-input v-model="form.price" autocomplete="off" />
          </el-form-item>
          <el-form-item label="简介" :label-width="formLabelWidth">
            <el-input v-model="form.description" autocomplete="off" />
          </el-form-item>
          <el-form-item label="还有好多字段" :label-width="formLabelWidth">
            <el-link type="danger" disabled>123</el-link>
          </el-form-item>
          <el-form-item :label-width="formLabelWidth">
            <el-upload
              class="upload-demo"
              :headers="requestHand"
              action="http://localhost:8080/file/upload"
              accept="image/*"
              :on-success="handleUploadSuccess"
              :multiple="false"
              :file-list="fileList"
              :disabled="form.imgUrl!==null&&form.imgUrl!==''&&form.imgUrl!==undefined"
              list-type="picture"
            >
              <el-button size="small" :disabled="form.imgUrl!==null&&form.imgUrl!==''&&form.imgUrl!==undefined" type="primary">上传教材封面</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="handleFormDialogClose">取 消</el-button>
          <el-button type="primary" @click="handlerCreateNewTextBook">确 定</el-button>
        </div>
      </el-dialog>

      <el-dialog
        width="30%"
        title="学生反馈"
        :visible.sync="feedbackVisible"
      >
        <feedback :feedback="feedbackList" />
      </el-dialog>
    </div>
    <Index v-else mode="select" @back="select=false" @add="add" />
  </div>
</template>

<script>
import { getToken, getRequestHand } from '@/utils/auth'
import Feedback from '@/views/commons/components/feedback.vue'
import Index from '@/views/commons/components/textbookList.vue'
import feedback from '@/api/feedback'

export default {
  components: { Feedback, Index },
  filters: {
    titleFilter(type) {
      const i = {
        'create': '添加新教材',
        'edit': '编辑'
      }
      return i[type]
    }
  },
  // eslint-disable-next-line vue/require-prop-types
  props: ['id'],
  data() {
    return {
      textBookList: [],
      dialogFormVisible: false,
      form: {
        bookName: '',
        isbn: '',
        author: '',
        price: '',
        description: '',
        imgUrl: ''
      },
      formType: '',
      editId: '',
      fileList: [],
      formLabelWidth: '120px',
      feedbackVisible: false,
      feedbackList: [],
      select: false
    }
  },
  computed: {
    requestHand() {
      const requestHand = {}
      requestHand[getRequestHand()] = getToken()
      return requestHand
    }
  },
  created() {
  },
  methods: {
    handleUploadSuccess(response, file, fileList) {
      if (response.code === 200) {
        this.form.imgUrl = response.data.url
      } else {
        this.$message.error('上传失败')
      }
    },
    openFormDialog() {
      this.fileList = []
      this.formType = 'create'
      this.form = {}
      this.dialogFormVisible = true
    },
    handleFormDialogClose() {
      this.$confirm('当前数据将不会保存,确认关闭？')
        .then(_ => {
          // eslint-disable-next-line no-undef
          this.dialogFormVisible = false
        })
        .catch(_ => {})
    },
    handlerCreateNewTextBook() {
      if (this.formType === 'create') {
        this.form.isNew = true
        this.textBookList.push(this.form)
        this.dialogFormVisible = false
      } else {
        this.textBookList[this.editId] = { ...this.form }
        this.dialogFormVisible = false
      }
    },
    handlerEdit(textbook) {
      this.formType = 'edit'
      this.editId = this.textBookList.indexOf(textbook)
      this.fileList = []
      this.form = { ...textbook }
      this.dialogFormVisible = true
    },
    showFeedback(id) {
      feedback.get(id).then(res => {
        this.feedbackList = res.data
        this.feedbackVisible = true
      })
    },
    add(val) {
      this.textBookList.push(val)
      this.$notify({
        title: '成功',
        message: '添加成功',
        type: 'success'
      })
      this.select = false
    },
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
      this.$emit('submit', approvalInsertDTO)
    }
  }
}
</script>

<style scoped>
.time {
  font-size: 11px;
  color: #999;
  margin-left: 5px;
}
.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both
}

.box-card {
  margin-top: 10px;
}
</style>
