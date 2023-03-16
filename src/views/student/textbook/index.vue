<template>
  <div class="app-container">
    <el-row v-for="item in textBookList" :key="item.id">
      <el-card :key="item.id" :body-style="{ padding: '0px' }">
        <el-col :span="7">
          <el-image
            v-if="item.imgUrl"
            style="width: 243px; height: 230px"
            fit="fill"
            :src="`https://kodo.warframe.top${item.imgUrl}`"
          />
          <div style="padding: 14px;">
            <span>{{ item.bookName }}</span>
            <div class="bottom clearfix">
              <time class="time">{{ item.publishingHouse }}</time>
              <el-button size="small" @click="feedback(item.id)">反馈
              </el-button>
            </div>
          </div>
        </el-col>
        <el-col :span="17">
          <el-form label-position="left" label-width="80px">
            <el-form-item label="作者">
              <span>{{ item.author }}</span>
            </el-form-item>
            <el-form-item label="价格">
              <span>{{ item.price }}</span>
            </el-form-item>
            <el-form-item label="库存">
              <span>{{ item.stock }}</span>
            </el-form-item>
            <el-form-item label="太多了">
              <el-link type="danger" disabled>字段太多 自己看着来吧</el-link>
            </el-form-item>
          </el-form>
        </el-col>
      </el-card>
    </el-row>
  </div>
</template>

<script>
import textbook from '@/api/textbookSubscription/textbook'

export default {
  data() {
    return {
      textBookList: undefined
    }
  },
  created() {
    this.getData()
  },
  methods: {
    getData() {
      textbook.me().then(res => {
        this.textBookList = res.data
      })
    },
    feedback(id) {
      alert(`教材id:${id} building`)
    }
  }
}
</script>

<style scoped>

</style>
