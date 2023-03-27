<template>
  <el-dialog title="教材反馈" :visible.sync="open">
    <el-card v-if="feedbackData.length>0" class="box-card-main-div">
      <div class="box-card cue-words-content-card">
        <div
          v-for="message in feedbackData"
          :key="message.id"
          class="cue-words-content-div-for"
        >
          <el-avatar
            class="cue-words-content-avatar"
            shape="square"
            size="medium"
            :src="`https://kodo.warframe.top/${message.simpleUserInfoVO.avatar}`"
          />
          <div class="cue-words-content-div">
            <div class="cue-words-content-name">
              {{ message.simpleUserInfoVO.name }}
            </div>
            <div class="cue-words-content-time">
              {{ message.createTime | parseTime('{y}-{m}-{d} {h}:{i}') }}
            </div>
          </div>
          <div class="cue-words-content-text">
            <div>
              {{ message.message }}
              <el-image
                style="width: 50px; height: 50px"
                :src="`https://kodo.warframe.top/${message.images}`"
                :preview-src-list="[`https://kodo.warframe.top/${message.images}`]"
              />
            </div>
          </div>
        </div>
      </div>
    </el-card>
    <el-card v-else class="box-card-main-div">
      <span>无内容</span>
    </el-card>
  </el-dialog>
</template>

<script>
import { parseTime } from '@/utils'
import feedback from '@/api/feedback'
export default {
  filters: {
    parseTime
  },
  data() {
    return {
      open: false,
      feedbackData: []
    }
  },
  methods: {
    show(textbookId) {
      feedback.getByTextbookId(textbookId).then(res => {
        this.feedbackData = res.data
        this.open = true
      })
    }
  }
}
</script>

<style scoped>
.cue-words-content-div-for {
  width: 100%;
}

.cue-words-content-name {
  font-size: 16px;
  margin-bottom: 3px;
}

.cue-words-content-time {
  font-size: 13px;
  color: #c2c7ce;
}

.cue-words-content-text {
  font: 15px play, PingFangSC-Regular, Microsoft Yahei;
  margin-top: 10px;
  margin-bottom: 20px;
  padding: 12px 25px;
  background-color: #f5f5f7;
  border-radius: 5px;
  float: left;
  margin-left: 40px;
  clear: both;
}

.cue-words-content-avatar {
  float: left;
  background-color: #e9b5fa;
  font-size: 19px;
  clear: both;
}

.cue-words-content-div {
  float: left;
  margin-left: 10px;
  margin-top: -2px;
}

.cue-words-content-card {
  width: 90%;
  margin: auto;
  margin-top: 90px;
}

.browBox ul {
  display: flex;
  flex-wrap: wrap;
  padding: 10px;
}

.browBox ul li {
  cursor: pointer;
  width: 10%;
  font-size: 20px;
  list-style: none;
  text-align: center;
}

.item span {
  border-bottom: #303133 2px solid;
  margin: 0 1px 0 1px;
  display: inline-block;
  height: 30px;
}

.box-card-main-div {
  padding-bottom: 50px;
}
</style>
