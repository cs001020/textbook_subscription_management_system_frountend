<template>
  <div class="app-container">
    <!--无教材-->
    <el-card v-if="textBookList.length===0" class="box-card">
      <div class="text item">
        暂无图书
      </div>
    </el-card>
    <!--教材信息-->
    <el-card v-for="textbookDate in textBookList " :key="textbookDate.id" class="card-box">
      <div slot="header" class="clearfix">
        <span>{{ textbookDate.bookName }}</span>
        <el-button
          style="float: right; padding: 3px 0"
          type="text"
          icon="el-icon-chat-dot-square"
          @click="handleFeedback(textbookDate.id)"
        >
          提交反馈
        </el-button>
      </div>
      <table>
        <tbody>
          <tr>
            <td rowspan="8">
              <el-image style="width: 228px; height: 264px" :src="`https://kodo.warframe.top${textbookDate.imgUrl}`" />
            </td>
          </tr>
          <tr>
            <td class="title">书名：</td>
            <td>
              {{ textbookDate.bookName }}
            </td>
            <td class="title">ISBN：</td>
            <td>{{ textbookDate.isbn }}</td>
          </tr>
          <tr>
            <td class="title">作者：</td>
            <td>
              {{ textbookDate.author }}
            </td>
            <td class="title">装订：</td>
            <td>{{ textbookDate.binding }}</td>
          </tr>
          <tr>
            <td class="title">印次：</td>
            <td>{{ textbookDate.print }}</td>
            <td class="title">开本：</td>
            <td>{{ textbookDate.folio }}</td>
          </tr>
          <tr>
            <td class="title">定价：</td>
            <td>
              {{ textbookDate.price }}
            </td>
            <td class="title">字数：</td>
            <td>
              {{ textbookDate.words }}
            </td>
          </tr>
          <tr>
            <td class="title">出版社：</td>
            <td>{{ textbookDate.publishingHouse }}</td>
            <td class="title">页数：</td>
            <td>
              {{ textbookDate.pageNumber }}
            </td>
          </tr>
          <tr>
            <td class="title">出版日期：</td>
            <td>{{ parseTime(textbookDate.publicationDate, '{y}-{m}-{d}') }}</td>
            <td class="title">库存：</td>
            <td>{{ textbookDate.stock }}</td>
          </tr>
          <tr style="height: 36px">
            <td class="title">
              状态:
            </td>
            <td>
              <el-tag :type="textbookDate.state | textbookStateFilter">{{ textbookDate.state }}</el-tag>
            </td>
          </tr>
        </tbody>
      </table>
      <table>
        <tbody>
          <tr>
            <td colspan="5" class="title">内容简介：</td>
          </tr>
          <tr>
            <td colspan="5"><p>
              {{ textbookDate.description }}
              <span v-if="textbookDate.description === undefined">暂无内容</span>
            </p></td>
          </tr>
        </tbody>
      </table>
    </el-card>
    <!--反馈dialog-->
    <el-dialog
      title="反馈"
      :visible.sync="open"
      width="30%"
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="内容" prop="message">
              <el-input
                v-model="form.message"
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 4}"
                placeholder="请输入教材简介"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="图片" prop="images">
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
                <el-button size="small" :disabled="form.images!==null&&form.images!==''&&form.images!==undefined">上传图片</el-button>
                <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submit">确 定</el-button>
        <el-button @click="open=false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import textbook from '@/api/textbookSubscription/textbook'
import feedback from '@/api/feedback'
import { parseTime } from '@/utils'
import { getRequestHand, getToken } from '@/utils/auth'
const textbookState = {
  '正常': undefined,
  '库存不足': 'warning',
  '审核中': 'info',
  '弃用': 'danger'
}

export default {
  filters: {
    textbookStateFilter(state) {
      return textbookState[state]
    }
  },
  data() {
    return {
      textBookList: [],
      open: false,
      form: {},
      fileList: [],
      rules: {
        message: [
          { required: true, message: '内容不能为空', trigger: 'blur' }
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
    this.getData()
  },
  methods: {
    /* 获取数据 */
    getData() {
      textbook.me().then(res => {
        this.textBookList = res.data
      })
    },
    /* 反馈按钮点击 */
    handleFeedback(id) {
      this.form = {
        'images': undefined,
        'message': undefined,
        'textbookId': id
      }
      this.open = true
    },
    /* 上传成功回调 */
    handleUploadSuccess(response) {
      if (response.code === 200) {
        this.form.images = response.msg
      } else {
        this.$message.error('上传失败')
      }
    },
    /* 文件移除 */
    handleFileRemove() {
      this.form.images = undefined
    },
    /* 表单提交按钮 */
    submit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          feedback.submitFeedback(this.form).then(res => {
            this.open = false
            this.$message({ type: 'success', message: '已收到您的反馈' })
          })
        }
      })
    },
    parseTime
  }
}
</script>

<style scoped>

</style>
