<template>
  <div>
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
  </div>
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
  name: 'Test',
  filters: {
    textbookStateFilter(state) {
      return textbookState[state]
    }
  },
  data() {
    return {
      dialogFormVisible: false,
      textbookDate: {
        'author': '钱再见 ',
        'binding': '0',
        'bookName': '行政决策新论',
        'description': '　　《行政决策新论》力争在前人已有研究的学术积累基础上，围绕国家大政方针和政府行政管理活动的新动向，结合中国的现实国情，优化编撰体系，着力将近年来行政决策中的一些新议题融入进来。 　　在体例上，《行政决策新论》立足于使用效果，在每一章节末对核心概念进行了梳理，并提供相关思考题和建议进一步阅读的材料，以便读者在初步阅读和课堂教学的基础上不断拓宽视野和拓展思考空间。 　　《行政决策新论》从知识积累的角度出发，力争为行政决策科学的发展提供可能的知识增量。 　　希望使用《行政决策新论》的本专业学生，还是从事行政决策活动的实践者，都能从中获得对行政决策的理解与实践的有益启发。',
        'feedbackCount': 0,
        'folio': '0',
        'id': 88,
        'imgUrl': '/book/fbbd6758-07b8-472b-96e2-53f94e8df8fa9787565135095.jpg',
        'isbn': '9787565135095',
        'pageNumber': 220,
        'price': '39.00',
        'print': '1-1',
        'publicationDate': 1538323200000,
        'publishingHouse': '南京师范大学出版社有限责任公司',
        'state': '弃用',
        'stock': 274,
        'words': '241.0千字'
      }
    }
  },
  methods: {
    parseTime
  }
}
</script>

<style scoped>
.title{
  font-weight: bold;
}
</style>
