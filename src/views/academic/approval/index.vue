<template>
  <div class="app-container">
    <approval-table :un-approval-list="unApprovalList" :load="loading" :can-reapply="false" @audit="audit" @reapply="audit" @del="audit" />
    <h1>//TODO 删除</h1>
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
      loading: false
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
