<template>
  <el-dialog title="教材信息" :visible.sync="open" :append-to-body="append">
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
        <tr v-if="textbookDate.state" style="height: 36px">
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
          </p></td>
        </tr>
      </tbody>
    </table>
  </el-dialog>
</template>

<script>
const textbookState = {
  '正常': undefined,
  '库存不足': 'warning',
  '审核中': 'info',
  '弃用': 'danger'
}
import { parseTime } from '@/utils'
export default {
  name: 'TextbookDetail',
  filters: {
    textbookStateFilter(state) {
      return textbookState[state]
    }
  },
  props: {
    append: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      open: false,
      textbookDate: {}
    }
  },
  methods: {
    parseTime,
    show(textbookData) {
      this.textbookDate = textbookData
      this.open = true
    }
  }
}
</script>

<style scoped>
.title{
  font-weight: bold;
}
</style>
