<template>
  <div class="app-container">
    <!-- Form -->
    <el-button type="text" @click="dialogFormVisible = true">打开嵌套表单的 Dialog</el-button>

    <el-dialog title="图书详情" :visible.sync="dialogFormVisible">
      <div>
        <table>
          <tbody>
            <tr>
              <td rowspan="8" align="center" valign="middle" width="220px">
                <img style="width: 228px; height: 264px" :src="`https://kodo.warframe.top${textbookDate.imgUrl}`">
              </td>
              <td class="tdLabel">书名：</td>
              <td colspan="3" class="tdbname">
                {{ textbookDate.bookName }}
              </td>
            </tr>
            <tr>
              <td class="tdLabel">ISBN：</td>
              <td>978-7-301-31257-5</td>
              <td class="tdLabel">条码：</td>
              <td width="80">9787301312575</td>
            </tr>
            <tr>
              <td class="tdLabel">作者：</td>
              <td>
                <a href="book.cfm?sFieldName=writer&amp;sKeyword=[英]罗杰·普赖斯（Roger Price）" target="_blank" class="a">{{ textbookDate.author }}</a>
              </td>
              <td class="tdLabel">装订：</td>
              <td />
            </tr>
            <tr>

              <td class="tdLabel">印次：</td>
              <td>2-1</td>
              <td class="tdLabel">开本：</td>
              <td>16开</td>
            </tr>
            <tr>
              <td class="tdLabel">定价：</td>
              <td>
                {{ textbookDate.price }}
              </td>
              <td class="tdLabel">字数：</td>
              <td>
                102.0千字

              </td>
            </tr>
            <tr>
              <td class="tdLabel">出版社：</td>
              <td><a href="pressdetail.cfm?iPno=301" target="_blank" class="aBM">北京大学出版社</a></td>
              <td class="tdLabel">页数：</td>
              <td>
                192页

              </td>
            </tr>
            <tr>
              <td class="tdLabel">发行编号：</td>
              <td>7301</td>
              <td class="tdLabel">每包册数：</td>
              <td />
            </tr>
            <tr>
              <td class="tdLabel">出版日期：</td>
              <td colspan="3">2021-08-19</td>
            </tr>
          </tbody>
        </table>
        <table>
          <tbody>
            <tr>
              <td colspan="5">内容简介：</td>
            </tr>
            <tr>
              <td colspan="5"><p>
                {{ textbookDate.description }}
              </p></td>
            </tr>
          </tbody>
        </table>
      </div>
      <!--      <el-container>
        <el-aside style="padding: 20px;  background: white">
          <el-descriptions class="margin-top" border>
            <el-descriptions-item>
              <el-image
              style="width: 228px; height: 272px"
              :src="`https://kodo.warframe.top${textbookDate.imgUrl}`"
              />
            </el-descriptions-item>
          </el-descriptions>
        </el-aside>
        <el-main>
          <el-descriptions class="margin-top" border>
            <el-descriptions-item label="教材名">
              {{ textbookDate.bookName }}
            </el-descriptions-item>
            <el-descriptions-item label="isbn">
              {{ textbookDate.isbn }}
            </el-descriptions-item>
            <el-descriptions-item label="作者">
              {{ textbookDate.author }}
            </el-descriptions-item>
            <el-descriptions-item label="装订">
              {{ textbookDate.binding }}
            </el-descriptions-item>
            <el-descriptions-item label="印次">
              {{ textbookDate.print }}
            </el-descriptions-item>
            <el-descriptions-item label="开本">
              {{ textbookDate.folio }}
            </el-descriptions-item>
            <el-descriptions-item label="价格">
              {{ textbookDate.price }}
            </el-descriptions-item>
            <el-descriptions-item label="字数">
              {{ textbookDate.words }}
            </el-descriptions-item>
            <el-descriptions-item label="出版社">
              {{ textbookDate.publishingHouse }}
            </el-descriptions-item>
            <el-descriptions-item label="页数">
              {{ textbookDate.pageNumber }}
            </el-descriptions-item>
            <el-descriptions-item label="出版日期">
              {{ textbookDate.publicationDate }}
            </el-descriptions-item>
            &lt;!&ndash;        <el-descriptions-item label="描述">
          {{textbookDate.description}}
        </el-descriptions-item>&ndash;&gt;
            <el-descriptions-item label="状态">
              {{ textbookDate.state }}
            </el-descriptions-item>
            <el-descriptions-item label="库存">
              {{ textbookDate.stock }}
            </el-descriptions-item>
            <el-descriptions-item label="反馈数量">
              {{ textbookDate.feedbackCount }}
            </el-descriptions-item>
          </el-descriptions>
        </el-main>
      </el-container>-->
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Test',
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
        'state': '正常',
        'stock': 274,
        'words': '241.0千字'
      }
    }
  }
}
</script>

<style scoped>

</style>
