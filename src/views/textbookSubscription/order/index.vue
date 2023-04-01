<template>
  <div class="app-container">
    <!--表格-->
    <el-table
      :data="tableData"
      style="width: 100%"
    >
      <el-table-column
        prop="id"
        label="订单序号"
        width="120"
      />
      <el-table-column
        prop="createTime"
        label="创建时间"
        width="150"
      >
        <template slot-scope="{row}">
          {{ row.createTime |parseTime }}
        </template>
      </el-table-column>
      <el-table-column
        prop="state"
        label="状态"
        width="150"
      >
        <template slot-scope="{row}">
          <el-tag :type="row.state |orderStateTagTypeFilter">{{ row.state |orderStateNameFilter }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="text" icon="el-icon-reading" @click="showDetail(scope.row.id)">教材详情</el-button>
          <el-button v-if="scope.row.state==='WAIT_GRANT'" type="text" icon="el-icon-position" @click="grant(scope.row.id)">发放教材</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--分页-->
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="pageParam.page"
      :limit.sync="pageParam.size"
      @pagination="getData"
    />
    <!--教材详情dialog-->
    <el-dialog title="教材详情" :visible.sync="open">
      <el-card v-for="textbookDate in textbookList " :key="textbookDate.id" class="card-box">
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
              <td>{{ parseTime(textbookDate.publicationDate,'{y}-{m}-{d}') }}</td>
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
              <td>
                <el-badge :value="textbookDate.feedbackCount" class="item">
                  <el-button :disabled="textbookDate.feedbackCount===0" size="mini" @click="$refs.feedback.show(textbookDate.id)">反馈</el-button>
                </el-badge>
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
      <textbook-feedback ref="feedback" :append="true" />
    </el-dialog>
  </div>
</template>

<script>
import textbookOrder from '@/api/textbookSubscription/textbookOrder'
import { parseTime } from '@/utils'
import textbookFeedback from '@/views/commons/components/TextbookFeedback/index.vue'
import Pagination from '@/views/commons/components/Pagination/index.vue'
const textbookState = {
  '正常': undefined,
  '库存不足': 'warning',
  '审核中': 'info',
  '弃用': 'danger'
}
export default {
  components: { Pagination, textbookFeedback },
  filters: {
    parseTime,
    orderStateNameFilter(state) {
      const map = {
        WAIT_GRANT: '代发放教材',
        GRANTED: '已发放教材'
      }
      return map[state]
    },
    orderStateTagTypeFilter(state) {
      const map = {
        WAIT_GRANT: 'warning',
        GRANTED: 'success'
      }
      return map[state]
    },
    textbookStateFilter(state) {
      return textbookState[state]
    }
  },
  data() {
    return {
      pageParam: {
        page: 1,
        size: 10
      },
      tableData: [],
      total: undefined,
      open: false,
      textbookList: []
    }
  },
  created() {
    this.getData()
  },
  methods: {
    /* 获取订单数据 */
    getData() {
      textbookOrder.list(this.pageParam).then(res => {
        this.tableData = res.data
        this.total = res.total
      })
    },
    /* 教材详情按钮点击 */
    showDetail(id) {
      textbookOrder.getTextBook(id).then(res => {
        this.textbookList = res.data
        this.open = true
      })
    },
    /* 发放教材 */
    grant(id) {
      textbookOrder.grant(id).then(() => {
        this.$message({ type: 'success', message: '发放申请成功' })
        this.getData()
      })
    },
    parseTime
  }
}
</script>
