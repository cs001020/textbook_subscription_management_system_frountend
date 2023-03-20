<template>
  <div class="dashboard-editor-container">
    <div class=" clearfix">
      <pan-thumb :image="`https://kodo.warframe.top/${avatar}`" style="float: left">
        Your roles:
        <span v-for="item in roles" :key="item" class="pan-info-roles">{{ item }}</span>
      </pan-thumb>
      <!-- <github-corner style="position: absolute; top: 0px; border: 0; right: 0;" /> -->
      <div class="info-container">
        <span class="display_name">{{ name }}</span>
        <!-- <span style="font-size:20px;padding-top:20px;display:inline-block;">Editor's Dashboard</span> -->
      </div>
      <br>
    </div>
    <!-- <div>
      <img :src="emptyGif" class="emptyGif">
    </div> -->

    <el-container class="manual">
      <el-header class="manual-title">使用手册</el-header>
      <el-divider />
      <el-main>
        <el-table
          :data="tableData"
          stripe
          border
          style="width: 100%"
        >
          <el-table-column label="序号" type="index" />
          <el-table-column
            label="创建时间"
            width="150"
          >
            <template slot-scope="scope">
              <i class="el-icon-time" />
              <span style="margin-left: 10px">{{ scope.row.date }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="userType"
            label="用户类型"
            width="882"
          />
          <el-table-column
            prop="title"
            label="标题"
            width="90"
          >
            <template slot-scope="scope">

              <div slot="reference" class="name-wrapper">
                <el-tag size="medium">{{ scope.row.title }}</el-tag>
              </div>

            </template>
          </el-table-column>
          <el-table-column
            prop="state"
            label="状态"
            width="70"
          >
            <template slot-scope="scope">

              <div slot="reference" class="name-wrapper">
                <el-tag type="success" size="medium">{{ scope.row.state }}</el-tag>
              </div>

            </template>
          </el-table-column>
          <!-- <el-table-column
            prop="address"
            label="地址">
          </el-table-column> -->
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                type="primary"
                size="mini"
                @click="handleSelect(scope.$index, scope.row)"
              >详细
              </el-button>

            </template>
          </el-table-column>
        </el-table>
      </el-main>
    </el-container>

    <el-dialog title="详细操作" :visible.sync="dialogFormVisible">
      <el-form>
        <el-form-item>
          <el-input />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          退出
        </el-button>
      </div>
      <!-- <div slot="footer" class="dialog-footer">
    <el-button @click="dialogFormVisible = false">取 消</el-button>
    <el-button type="primary" @click="createData">确 定</el-button>
  </div> -->
    </el-dialog>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import PanThumb from '@/components/PanThumb/index.vue'

export default {
  name: 'DashboardEditor',
  components: { PanThumb },
  data() {
    return {
      tableData: [{
        date: '2023-03-02',
        userType: '学生',
        state: '正常',
        title: '使用手册'

      }, {
        date: '2023-03-04',
        userType: '教师',
        state: '正常',
        title: '使用手册'

      }, {
        date: '2023-03-01',
        userType: '教学组',
        state: '正常',
        title: '使用手册'

      }, {
        date: '2023-03-03',
        userType: '二级学院',
        state: '正常',
        title: '使用手册'

      }, {
        date: '2023-03-01',
        userType: '教务处',
        state: '正常',
        title: '使用手册'

      }],
      dialogFormVisible: false
    }
  },
  computed: {
    ...mapGetters([
      'name',
      'avatar',
      'roles'
    ])
  }
}
</script>

<style lang="scss" scoped>
  .emptyGif {
    display: block;
    width: 45%;
    margin: 0 auto;
  }

  .dashboard-editor-container {
    // background-color: #e3e3e3;
    background-color: #f3f3f4;
    min-height: 100vh;
    padding: 50px 60px 0px;
    .pan-info-roles {
      font-size: 12px;
      font-weight: 700;
      color: #333;
      display: block;
    }
    .info-container {
      position: relative;
      margin-left: 190px;
      height: 150px;
      line-height: 200px;
      .display_name {
        font-size: 48px;
        line-height: 48px;
        color: #212121;
        position: absolute;
        top: 25px;
      }
    }
    .manual {
      width: 100%;
      background-color: #fff;
      border-radius: 10px;
      // box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1)
    }
    .manual-title {
      display: block;
      padding-top: 30px;
    }
  }
</style>
