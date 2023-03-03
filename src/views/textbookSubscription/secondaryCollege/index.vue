<template>
  <div class="app-container">
    <approval-table :un-approval-list="unApprovalList" :load="loading" :can-audit="true" @audit="openFormDialog" />

    <el-dialog title="审核" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="审核消息" :label-width="formLabelWidth">
          <el-input v-model="form.message" autocomplete="off" />
        </el-form-item>
        <el-form-item label="审核状态" :label-width="formLabelWidth">
          <el-select v-model="form.approvalStateEnums" placeholder="请选择">
            <el-option value="ADOPT"><el-tag type="success">通过</el-tag></el-option>
            <el-option value="REJECT"><el-tag type="danger">驳回</el-tag></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="audit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import ApprovalTable from '@/views/approval/component/approvalTable.vue'
import approval from '@/api/approval'

export default {
  components: { ApprovalTable },
  data() {
    return {
      unApprovalList: [],
      loading: false,
      dialogFormVisible: false,
      id: '',
      form: {
        message: '',
        approvalStateEnums: ''
      },
      formLabelWidth: '120px'
    }
  },
  created() {
    this.getUnApproval()
  },
  methods: {
    getUnApproval() {
      this.loading = true
      approval.secondaryCollegeUnApproval().then(res => {
        this.unApprovalList = res.data
        this.loading = false
      })
    },
    openFormDialog(id) {
      this.form = {}
      this.id = id
      this.dialogFormVisible = true
    },
    audit() {
      approval.secondaryCollegeAudit(this.id, this.form).then(res => {
        this.$notify({
          title: '成功',
          message: '这是一条成功的提示消息',
          type: 'success'
        })
        this.getUnApproval()
        this.dialogFormVisible = false
      })
    }
  }
}
</script>

<style scoped>

</style>
