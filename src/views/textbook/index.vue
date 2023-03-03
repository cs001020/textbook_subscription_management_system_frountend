<template>
  <div v-loading="loading" class="app-container">
    <div class="filter-container" style="margin: 0 10px 0 20px">
      <i v-if="mode==='select'" class="el-icon-back" @click="$emit('back')" />
      <el-input v-model="search.keyWord" placeholder="关键字" style="width: 200px;margin-right: 10px" class="filter-item" @keyup.enter.native="getList" />
      <el-select v-model="search.orderByPrice" placeholder="价格" style="width: 90px;margin-right: 10px" class="filter-item">
        <el-option
          v-for="item in order"
          :key="item.id"
          :label="item.name"
          :value="item.value"
        />
      </el-select>
      <el-select v-model="search.orderByStock" placeholder="库存" style="width: 90px;margin-right: 10px" class="filter-item">
        <el-option
          v-for="item in order"
          :key="item.id"
          :label="item.name"
          :value="item.value"
        />
      </el-select>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="getList">
        {{ $t('table.search') }}
      </el-button>
      <el-button class="filter-item" icon="el-icon-refresh" @click="handleReset">
        重置
      </el-button>
      <el-button v-if="mode==='select'" class="filter-item" type="primary" icon="el-icon-check" @click="$emit('add')">
        选定
      </el-button>
    </div>

    <el-row>
      <el-col v-for="item in textBookList" :key="item.id" :span="4">
        <el-card :body-style="{ padding: '0px' }" style="height: 320px;margin: 0 10px 20px 20px">
          <el-image
            v-if="item.imgUrl"
            style="width: 243px; height: 230px"
            fit="fill"
            :src="`https://kodo.warframe.top${item.imgUrl}`"
          />
          <div style="padding: 14px;height: 94px">
            <span>{{ item.bookName }}</span>
            <div class="bottom clearfix">
              <time class="time">{{ item.publishingHouse }} </time>
              <el-button type="text" class="button" @click="showDetail(item)">详细信息</el-button>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-pagination
      :page-size="search.size"
      :current-page="search.page"
      background
      layout="total,prev, pager, next"
      :total="total"
      @current-change="handleCurrentChange"
    />

    <!--详细信息-->
    <el-dialog title="详细信息" :visible.sync="dialogTableVisible">
      <!--评论-->
      <el-dialog
        width="30%"
        title="学生反馈"
        append-to-body
        :visible.sync="feedbackVisible"
      >
        <feedback :feedback="feedbackList" />
      </el-dialog>
      <el-form :model="dialogFormData" class="demo-form-inline">
        <el-form-item label="作者">
          <span>{{ dialogFormData.author }}</span>
        </el-form-item>
        <el-form-item label="价格">
          <span>{{ dialogFormData.price }}</span>
        </el-form-item>
        <el-form-item label="库存">
          <span>{{ dialogFormData.stock }}</span>
        </el-form-item>
        <el-form-item label="状态">
          <span>{{ dialogFormData.state }}</span>
        </el-form-item>
        <el-form-item>
          <el-badge :value="dialogFormData.feedbackCount" class="item" type="primary">
            <el-button size="small" :disabled="dialogFormData.feedbackCount===0" @click="showFeedback(dialogFormData.id)">学生反馈</el-button>
          </el-badge>
        </el-form-item>
        <el-form-item>
          <el-button v-if="mode==='select'" size="small" @click="$emit('add',dialogFormData)">添加教材</el-button>
        </el-form-item>
        <el-form-item label="太多了">
          <el-link type="danger" disabled>字段太多 自己看着来吧</el-link>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import textbook from '@/api/textbook'
import Feedback from '@/views/approval/component/feedback.vue'
import feedback from '@/api/feedback'
export default {
  components: { Feedback },
  // eslint-disable-next-line vue/require-prop-types
  props: ['mode'],
  data() {
    return {
      textBookList: [
        {
          'author': '',
          'binding': '',
          'bookName': '',
          'description': '',
          'folio': '',
          'id': 0,
          'imgUrl': '',
          'isbn': '',
          'pageNumber': {},
          'price': '',
          'print': '',
          'publicationDate': '',
          'publishingHouse': '',
          'state': '',
          'stock': 0,
          'words': ''
        }
      ],
      total: 0,
      search: {
        keyWord: '',
        orderByPrice: 'NONE',
        orderByStock: 'NONE',
        page: 1,
        size: 12
      },
      order: [{
        id: 1,
        name: '不排序',
        value: 'NONE'
      },
      {
        id: 2,
        name: '升序',
        value: 'ASC'
      },
      {
        id: 3,
        name: '降序',
        value: 'DESC'
      }],
      dialogTableVisible: false,
      dialogFormData: {
        'author': '',
        'binding': '',
        'bookName': '',
        'description': '',
        'folio': '',
        'id': 0,
        'imgUrl': '',
        'isbn': '',
        'pageNumber': {},
        'price': '',
        'print': '',
        'publicationDate': '',
        'publishingHouse': '',
        'state': '',
        'stock': 0,
        'words': ''
      },
      loading: false,
      feedbackVisible: false,
      feedbackList: []
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.loading = true
      textbook.list(this.search).then(res => {
        this.total = res.total
        this.textBookList = res.data
        this.loading = false
      })
    },
    handleCurrentChange(val) {
      this.search.page = val
      this.getList()
    },
    handleReset() {
      this.search = {
        keyWord: '',
        orderByPrice: 'NONE',
        orderByStock: 'NONE',
        page: 1,
        size: 12
      }
      this.getList()
    },
    showDetail(value) {
      this.dialogFormData = value
      this.dialogTableVisible = true
    },
    showFeedback(id) {
      feedback.get(id).then(res => {
        this.feedbackList = res.data
        this.feedbackVisible = true
      })
    }
  }
}
</script>

<style>
.time {
  font-size: 13px;
  color: #999;
}

.bottom {
  margin-top: 13px;
  line-height: 12px;
}

.button {
  padding: 0;
  float: right;
}

.image {
  width: 100%;
  display: block;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both
}
</style>
