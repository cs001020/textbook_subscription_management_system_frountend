<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>个人信息</span>
    </div>
    <div>
      <div class="text-center">
        <userAvatar />
      </div>
      <ul class="list-group list-group-striped">
        <li class="list-group-item">
          学号/工号：
          <div class="pull-right">{{ user.account }}</div>
        </li>
        <li class="list-group-item">
          用户昵称：
          <div class="pull-right">{{ user.name }}</div>
        </li>
        <li class="list-group-item">
          手机号码：
          <div class="pull-right">{{ user.phoneNumber }}</div>
        </li>
        <li class="list-group-item">
          二级学院：
          <div class="pull-right">{{ user.secondaryCollege }}</div>
        </li>
        <li class="list-group-item">
          创建时间：
          <div class="pull-right">{{ parseTime(user.createTime,'{y}-{m}-{d}') }}</div>
        </li>
      </ul>
    </div>
  </el-card>
</template>

<script>
import UserAvatar from './UserAvatar'
import { parseTime } from '@/utils'

export default {
  components: { UserAvatar },
  props: {
    user: {
      type: Object,
      default: () => {
        return {
          name: '',
          role: ''
        }
      }
    }
  },
  methods: {
    parseTime
  }
}
</script>

<style lang="scss" scoped>
.box-center {
  margin: 0 auto;
  display: table;
}

.text-muted {
  color: #777;
}

.user-profile {
  .user-name {
    font-weight: bold;
  }

  .box-center {
    padding-top: 10px;
  }

  .user-role {
    padding-top: 10px;
    font-weight: 400;
    font-size: 14px;
  }

  .box-social {
    padding-top: 30px;

    .el-table {
      border-top: 1px solid #dfe6ec;
    }
  }

  .user-follow {
    padding-top: 20px;
  }
}

.user-bio {
  margin-top: 20px;
  color: #606266;

  span {
    padding-left: 4px;
  }

  .user-bio-section {
    font-size: 14px;
    padding: 15px 0;

    .user-bio-section-header {
      // border-bottom: 1px solid #dfe6ec;
      padding-bottom: 10px;
      margin-bottom: 10px;
      font-weight: bold;
    }
  }
  .user-line {
    display: block;
    height: 10px;
  }
}
</style>
