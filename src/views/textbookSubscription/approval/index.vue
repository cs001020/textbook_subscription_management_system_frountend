<template>
  <div class="app-container">
    <approval-table :un-approval-list="unApprovalList" :can-reapply="true" :load="loading" @reapply="audit" @del="audit" />
  </div>
</template>

<script>
import ApprovalTable from '@/views/commons/components/approvalTable.vue'
import approval from '@/api/textbookSubscription/approval'

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
      approval.me().then(res => {
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
