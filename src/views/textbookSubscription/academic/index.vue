<template>
  <approval-table :init="approval.academicAffairsOfficeUnApproval" :submit-function="approval.academicAffairsOfficeAudit" />
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
