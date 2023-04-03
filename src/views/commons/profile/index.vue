<template>

  <div class="app-container">
    <div v-if="user">
      <el-row :gutter="20">

        <el-col :span="6" :xs="24">
          <user-card :user="user" />
        </el-col>

        <el-col :span="12" :xs="24">
          <el-card>
            <el-tabs v-model="activeTab">
              <el-tab-pane label="基本资料" name="account">
                <account :user="userFrom" @ok="getUser" />
              </el-tab-pane>
              <el-tab-pane label="修改密码" name="activity">
                <activity />
              </el-tab-pane>
            </el-tabs>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { getProfile } from '@/api/system/user'
import UserCard from './components/UserCard'
import Activity from './components/Activity'
import Account from './components/Account'

export default {
  name: 'Profile',
  components: { UserCard, Activity, Account },
  data() {
    return {
      user: {},
      userFrom: {},
      activeTab: 'account'
    }
  },
  created() {
    this.getUser()
  },
  methods: {
    getUser() {
      getProfile().then(res => {
        this.user = res.data
        this.userFrom = { ...res.data }
      })
    }
  }
}
</script>
