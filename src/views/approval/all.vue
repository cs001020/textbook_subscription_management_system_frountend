<template>
  <div class="app-container">
    <el-select v-model="canAudit" placeholder="请选择">
      <el-option label="教师" :value="false" />
      <el-option label="审核" :value="true" />
    </el-select>
    <approval-table :un-approval-list="unApprovalList" :load="loading" :can-audit="canAudit" @audit="audit" @reapply="audit" @del="audit" />
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
      canAudit: true
    }
  },
  created() {
    this.getUnApproval()
  },
  methods: {
    getUnApproval() {
      this.loading = true
      approval.all().then(res => {
        this.unApprovalList = res.data
        this.loading = false
      })
    },
    audit(id) {
      alert(`建设中${id}`)
    }
  }
}
</script>

<style scoped>

</style>
