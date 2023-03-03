<template>
  <div class="app-container">

    <el-form :model="form">
      <el-form-item label="教师" :label-width="formLabelWidth">
        <el-select v-model="form.teacherId" placeholder="请选择">
          <el-option
            v-for="item in teacher"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >
            <el-avatar :src="`https://kodo.warframe.top/${item.avatar}`" />
            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.name }}</span>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="教学组" :label-width="formLabelWidth">
        <el-select v-model="form.teachingGroupId" placeholder="请选择">
          <el-option
            v-for="item in teachingGroup"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="二级学院" :label-width="formLabelWidth">
        <el-select v-model="form.secondaryCollegeId" placeholder="请选择">
          <el-option
            v-for="item in secondaryCollege"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="专业" :label-width="formLabelWidth">
        <el-select v-model="form.majorId" :disabled="majorDisable" placeholder="请选择">
          <el-option
            v-for="item in major"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="班级" :label-width="formLabelWidth">
        <el-select v-model="form.gradeId" :disabled="gradeDisable" placeholder="请选择">
          <el-option
            v-for="item in grade"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label-width="formLabelWidth" label="课程">
        <el-table
          :data="form.openingPlanDetailDTOList"
          style="width: 100%"
        >
          <el-table-column
            prop="courseName"
            label="课程名"
            width="180"
          />
          <el-table-column
            prop="credit"
            label="学分"
            width="180"
          />
          <el-table-column
            prop="teachingHours"
            label="总学时"
            width="180"
          />
          <el-table-column
            prop="weeksTeach"
            label="教学周"
            width="180"
          />
          <el-table-column
            prop="type"
            label="类型"
            width="180"
          >
            <template slot-scope="{row}">
              <el-tag :type="row.type | typeFilter">
                {{ row.type | typeNameFilter }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column :label="$t('table.actions')" align="center" width="230" class-name="small-padding fixed-width">
            <template slot-scope="{row,$index}">
              <el-button size="mini" type="danger" @click="handleDelete(row,$index)">
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item :label-width="formLabelWidth">
        <el-button plain @click="handleCreate">添加课程</el-button>
      </el-form-item>
      <el-form-item :label-width="formLabelWidth">
        <el-button type="primary" @click="doCreate()">确 定</el-button>
      </el-form-item>
    </el-form>

    <el-dialog title="添加课程" :visible.sync="dialogFormVisible" append-to-body>
      <el-form :model="openingPlanDetailDTO">
        <el-form-item label="课程名" :label-width="formLabelWidth">
          <el-input v-model="openingPlanDetailDTO.courseName" autocomplete="off" />
        </el-form-item>
        <el-form-item label="学分" :label-width="formLabelWidth">
          <el-input v-model="openingPlanDetailDTO.credit" autocomplete="off" />
        </el-form-item>
        <el-form-item label="总课时" :label-width="formLabelWidth">
          <el-input v-model="openingPlanDetailDTO.teachingHours" autocomplete="off" />
        </el-form-item>
        <el-form-item label="教学周数" :label-width="formLabelWidth">
          <el-input v-model="openingPlanDetailDTO.weeksTeach" autocomplete="off" />
        </el-form-item>
        <el-form-item label="类型" :label-width="formLabelWidth">
          <el-select v-model="openingPlanDetailDTO.type" placeholder="请选择">
            <el-option
              label="考试"
              value="EXAMINATION"
            >
              <el-tag type="danger">
                考试
              </el-tag>
            </el-option>
            <el-option
              label="考察"
              value="INVESTIGATE"
            >
              <el-tag type="success">
                考察
              </el-tag>
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOpeningPlanDetailDTO">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import teachingGroup from '@/api/teachingGroup'
import secondaryCollege from '@/api/secondaryCollege'
import major from '@/api/major'
import grade from '@/api/grade'
import openingPlan from '@/api/openingPlan'
import { teacher } from '@/api/user'

export default {
  filters: {
    typeFilter(status) {
      const statusMap = {
        INVESTIGATE: 'success',
        EXAMINATION: 'danger'
      }
      return statusMap[status]
    },
    typeNameFilter(status) {
      const statusMap = {
        INVESTIGATE: '考察',
        EXAMINATION: '考试'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      teacher: [{
        'name': '封禁账号',
        'id': 3,
        'avatar': '/icons/default-icon.png'
      }],
      teachingGroup: [
        {
          'id': '1',
          'name': '机械制造系列课程教学团队'
        },
        {
          'id': '2',
          'name': '电气类专业主要技术基础课程教学团队'
        }
      ],
      secondaryCollege: [
        {
          'id': '1',
          'name': '人工智能学院'
        },
        {
          'id': '2',
          'name': '外国语与海外教育学院'
        }],
      major: [],
      grade: [],
      form: {
        teacherId: '',
        teachingGroupId: '',
        secondaryCollegeId: '',
        majorId: '',
        gradeId: '',
        openingPlanDetailDTOList: []
      },
      dialogFormVisible: false,
      openingPlanDetailDTO: {
        'courseName': '123',
        'credit': 1,
        'teachingHours': 2,
        'type': 'EXAMINATION',
        'weeksTeach': 3
      },
      statusMap: {
        '考察': 'success',
        '考试': 'danger'
      },
      formLabelWidth: '120px'
    }
  },
  computed: {
    majorDisable() {
      return this.major.length <= 0
    },
    gradeDisable() {
      return this.grade.length <= 0
    }
  },
  watch: {
    form: {
      handler(newVal) {
        if (newVal.secondaryCollegeId) {
          this.getMajorList()
        }
        if (newVal.majorId) {
          this.getGradeList()
        }
      },
      deep: true
    }
  },
  created() {
    this.getTeach()
    this.getTeachingGroupList()
    this.getSecondaryCollegeList()
  },
  methods: {
    getTeachingGroupList() {
      teachingGroup.list().then(res => {
        this.teachingGroup = res.data
      })
    },
    getTeach() {
      teacher().then(res => {
        this.teacher = res.data
      })
    },
    getSecondaryCollegeList() {
      secondaryCollege.list().then(res => {
        this.secondaryCollege = res.data
      })
    },
    getMajorList() {
      major.list(this.form.secondaryCollegeId).then(res => {
        this.major = res.data
      })
    },
    getGradeList() {
      grade.list(this.form.majorId).then(res => {
        this.grade = res.data
      })
    },
    handleCreate() {
      this.openingPlanDetailDTO = {}
      this.dialogFormVisible = true
    },
    doCreate() {
      openingPlan.add(this.form).then(res => {
        this.form = {}
        this.getTeach()
        this.getTeachingGroupList()
        this.getSecondaryCollegeList()
        this.$notify({
          title: '成功',
          message: '导入成功',
          type: 'success',
          duration: 2000
        })
        this.$emit('complete')
      })
    },
    addOpeningPlanDetailDTO() {
      this.form.openingPlanDetailDTOList.push(this.openingPlanDetailDTO)
      this.openingPlanDetailDTO = {}
      this.dialogFormVisible = false
    },
    handleDelete(row, index) {
      this.form.openingPlanDetailDTOList.splice(index, 1)
    }
  }
}
</script>

<style scoped>
.demo-table-expand {
  font-size: 0;
}

.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}

.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
</style>
