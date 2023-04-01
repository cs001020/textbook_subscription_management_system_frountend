<template>
  <approval-table :init="approval.teachingGroupUnApproval" :submit-function="approval.teachingGroupAudit" />
</template>

<script>
import ApprovalTable from '@/views/commons/components/ApprovalTable/index.vue'
import approval from '@/api/textbookSubscription/approval'

export default {
  components: { ApprovalTable },
  computed: {
    approval() {
      return approval
    }
  }
}
</script>

<style scoped>

</style>
