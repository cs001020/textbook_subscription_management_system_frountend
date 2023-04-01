<template>
  <div class="app-container">
    <!--表格-->
    <el-table
      v-loading="load"
      :data="approvalList"
      style="width: 100%"
    >
      <el-table-column
        label="编号"
        width="150"
        prop="id"
      />
      <el-table-column
        label="发起人"
        width="150"
        prop="teacher.name"
      />
      <el-table-column
        label="发起时间"
        width="150"
      >
        <template slot-scope="{row}">
          <span>{{ parseTime(row.createTime, '{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="最近修改"
        width="150"
      >
        <template slot-scope="{row}">
          <span>{{ parseTime(row.updateTime, '{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="当前状态">
        <template slot-scope="{row}">
          <el-tag :type="row.state | stateTagTypeMap">{{ row.state | stateLabelMap }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="text" size="mini" icon="el-icon-view" @click="$refs.detail.show(row.id)">详情</el-button>
          <el-button type="text" size="mini" icon="el-icon-reading" @click="$refs.textbook.show(row.id)">教材
          </el-button>
          <el-button type="text" size="mini" icon="el-icon-thumb" @click="openAuditDialog(row.id)">审核</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--审核Dialog-->
    <el-dialog title="审核" :visible.sync="open">
      <el-row>
        <el-form :model="form" :rules="rules" label-width="100px">
          <el-col :span="24">
            <el-form-item label="审核状态" prop="state">
              <el-select v-model="form.approvalStateEnums" placeholder="请选择">
                <el-option value="ADOPT" label="通过" />
                <el-option value="REJECT" label="驳回" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="审核消息" prop="message">
              <el-input
                v-model="form.message"
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 4}"
                placeholder="请输入审核消息"
              />
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="open = false">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </div>
    </el-dialog>
    <!--详情-->
    <approval-detail ref="detail" />
    <textbook-detail-list ref="textbook" />
  </div>
</template>

<script>
import { parseTime } from '@/utils'
import ApprovalDetail from '@/views/commons/components/ApprovalDetail'
import TextbookDetailList from '@/views/commons/components/TextbookDetailList'

const stateMap = {
  WAIT_GROUP: {
    label: '待教学组审批',
    type: 'info'
  },
  WAIT_SECONDARY: {
    label: '待二级学院审批',
    type: 'info'
  },
  WAIT_OFFICE: {
    label: '待教务处审批',
    type: 'info'
  },
  ADOPT: {
    label: '审批通过',
    type: 'success'
  },
  REJECT: {
    label: '驳回',
    type: 'danger'
  }
}
export default {
  components: { TextbookDetailList, ApprovalDetail },
  filters: {
    stateLabelMap(state) {
      return stateMap[state].label
    },
    stateTagTypeMap(state) {
      return stateMap[state].type
    }
  },
  props: {
    init: {
      type: Function,
      required: true
    },
    submitFunction: {
      type: Function,
      required: true
    }
  },
  data() {
    return {
      load: false,
      approvalList: [],
      open: false,
      id: undefined,
      form: {},
      rules: {
        message: [
          { required: true, message: '内容不能为空', trigger: 'blur' }
        ],
        state: [
          { required: true, message: '状态不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    /* 获取数据 */
    getList() {
      this.load = true
      this.init().then(res => {
        this.approvalList = res.data
        this.load = false
      })
    },
    /* 打开dialog */
    openAuditDialog(id) {
      this.form = {
        message: undefined,
        approvalStateEnums: undefined
      }
      this.id = id
      this.open = true
    },
    /* 提交按钮 */
    submit() {
      this.submitFunction(this.id, this.form).then(res => {
        this.open = false
        this.getList()
        this.$message({ type: 'success', message: '审核成功' })
      })
    },
    parseTime
  }
}
</script>

<style scoped>

</style>
