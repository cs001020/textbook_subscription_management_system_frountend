<template>
  <div class="app-container">
    <h4 class="form-header h4">
      教师
      <el-tooltip class="item" effect="dark" content="添加教师" placement="top-start">
        <el-button size="mini" icon="el-icon-plus" style="margin-left: 10px" circle @click="$refs.select.show()" />
      </el-tooltip>
    </h4>
    <el-form :model="form">
      <el-empty v-if="teacher===undefined" :image-size="80" description="暂未选择教师" />
      <el-descriptions v-else style="margin: 8px 10px 25px 10px">
        <el-descriptions-item label="教师名">{{ teacher.name }}</el-descriptions-item>
        <el-descriptions-item label="手机号">{{ teacher.phoneNumber }}</el-descriptions-item>
        <el-descriptions-item label="邮箱">{{ teacher.userInfo.email }}</el-descriptions-item>
        <el-descriptions-item label="性别">
          <el-tag size="small" :type="teacher.userInfo.sex===0?'danger':undefined">{{ teacher.userInfo.sex===0?'女':'男' }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="联系地址">{{ teacher.userInfo.address }}</el-descriptions-item>
      </el-descriptions>
    </el-form>
    <h4 class="form-header h4">院系班级</h4>
    <el-form :model="form">
      <el-row>
        <el-col :span="8" :offset="2">
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
        </el-col>
        <el-col :span="8" :offset="2">
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
        </el-col>
        <el-col :span="8" :offset="2">
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
        </el-col>
        <el-col :span="8" :offset="2">
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
        </el-col>
      </el-row>
    </el-form>
    <h4 class="form-header h4">
      课程
      <el-tooltip class="item" effect="dark" content="搜索课程" placement="top-start">
        <el-button size="mini" icon="el-icon-search" style="margin-left: 10px" circle @click="$refs.selectCourse.show()" />
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="添加课程" placement="top-start">
        <el-button size="mini" icon="el-icon-plus" style="margin-left: 10px" circle @click="handleCreate" />
      </el-tooltip>
    </h4>
    <el-table
      :data="form.openingPlanDetailDTOList"
      style="width: 100%"
    >
      <el-table-column
        prop="courseName"
        label="课程名"
      />
      <el-table-column
        prop="credit"
        label="学分"
      />
      <el-table-column
        prop="teachingHours"
        label="总学时"
      />
      <el-table-column
        prop="weeksTeach"
        label="教学周"
      />
      <el-table-column
        prop="type"
        label="类型"
      >
        <template slot-scope="{row}">
          <el-tag :type="row.type | typeFilter">
            {{ row.type | typeNameFilter }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.actions')" align="center" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button size="mini" plain @click="handleEdit(row)">
            编辑
          </el-button>
          <el-button size="mini" type="danger" plain @click="handleDelete(row,$index)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--按钮-->
    <el-form label-width="100px">
      <el-form-item style="text-align: center;margin-left:-120px;margin-top:30px;">
        <el-button type="primary" @click="doCreate()">确 定</el-button>
        <el-button @click="close()">返回</el-button>
      </el-form-item>
    </el-form>
    <!--添加课程dialog-->
    <el-dialog :title="title" :visible.sync="dialogFormVisible">
      <el-form ref="addCourse" :model="openingPlanDetailDTO" :rules="rules">
        <el-form-item label="课程名" prop="courseName" :label-width="formLabelWidth">
          <el-input v-model="openingPlanDetailDTO.courseName" placeholder="请输入课程名" autocomplete="off" />
        </el-form-item>
        <el-form-item label="学分" prop="credit" :label-width="formLabelWidth">
          <el-input-number v-model="openingPlanDetailDTO.credit" controls-position="right" :min="1" />
        </el-form-item>
        <el-form-item label="总课时" prop="teachingHours" :label-width="formLabelWidth">
          <el-input-number v-model="openingPlanDetailDTO.teachingHours" controls-position="right" :min="1" />
        </el-form-item>
        <el-form-item label="教学周数" prop="weeksTeach" :label-width="formLabelWidth">
          <el-input-number v-model="openingPlanDetailDTO.weeksTeach" controls-position="right" :min="1" />
        </el-form-item>
        <el-form-item label="类型" prop="type" :label-width="formLabelWidth">
          <el-select v-model="openingPlanDetailDTO.type" placeholder="请选择">
            <el-option
              label="考试"
              value="EXAMINATION"
            />
            <el-option
              label="考察"
              value="INVESTIGATE"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitOpeningPlanDetailForm">确 定</el-button>
        <el-button @click="dialogFormVisible=false">取 消</el-button>
      </div>
    </el-dialog>
    <!--选择教师dialog-->
    <select-teacher ref="select" :teacher-group-list="teachingGroup" :secondary-college-list="secondaryCollege" @ok="ok" />
    <!--选择课程dialog-->
    <select-course ref="selectCourse" @ok="courseOk" />
  </div>
</template>

<script>
import teachingGroup from '@/api/academic/teachingGroup'
import secondaryCollege from '@/api/academic/secondaryCollege'
import major from '@/api/academic/major'
import grade from '@/api/academic/grade'
import openingPlan from '@/api/academic/openingPlan'
import SelectTeacher from '@/views/academic/openingPlan/selectTeacher.vue'
import SelectCourse from '@/views/academic/openingPlan/selectCourse.vue'

export default {
  components: { SelectCourse, SelectTeacher },
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
      teacher: undefined,
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
        teacherId: undefined,
        teachingGroupId: '',
        secondaryCollegeId: '',
        majorId: '',
        gradeId: '',
        openingPlanDetailDTOList: []
      },
      title: undefined,
      dialogFormVisible: false,
      openingPlanDetailDTO: {
        'courseName': '123',
        'credit': 1,
        'teachingHours': 2,
        'type': 'EXAMINATION',
        'weeksTeach': 3
      },
      // 当前修改的课程的index
      editId: undefined,
      rules: {
        courseName: [
          { required: true, message: '请输入课程名', trigger: 'blur' }
        ],
        credit: [
          { required: true, message: '请输入学分', trigger: 'blur' },
          { type: 'number', min: 1, max: 10, message: '学分最高为10分', trigger: 'blur' }
        ],
        teachingHours: [
          { required: true, message: '请输入总课时', trigger: 'blur' },
          { type: 'number', min: 1, max: 50, message: '总课时最高为50', trigger: 'blur' }
        ],
        weeksTeach: [
          { required: true, message: '请输入教学周数', trigger: 'blur' },
          { type: 'number', min: 1, max: 20, message: '教学周数最高为20', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请选择课程类型', trigger: 'blur' }
        ]
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
    this.getTeachingGroupList()
    this.getSecondaryCollegeList()
  },
  methods: {
    getTeachingGroupList() {
      teachingGroup.list().then(res => {
        this.teachingGroup = res.data
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
    /* 创建课程 */
    handleCreate() {
      this.openingPlanDetailDTO = {
        'courseName': undefined,
        'credit': 1,
        'teachingHours': 20,
        'type': undefined,
        'weeksTeach': 10
      }
      this.title = '添加课程'
      this.dialogFormVisible = true
    },
    /* 编辑课程 */
    handleEdit(row) {
      this.title = '修改课程'
      this.openingPlanDetailDTO = { ...row }
      this.editId = this.form.openingPlanDetailDTOList.indexOf(row)
      this.dialogFormVisible = true
    },
    /* 删除课程 */
    handleDelete(row, index) {
      this.$confirm(`此操作将删除${row.courseName}课程, 是否继续?`).then(() => {
        this.form.openingPlanDetailDTOList.splice(index, 1)
      }).catch(() => {})
    },
    /* 课程表单提交 */
    submitOpeningPlanDetailForm() {
      if (this.title === '添加课程') {
        this.addOpeningPlanDetailDTO()
      } else {
        this.updateOpeningPlanDetailDTO()
      }
    },
    /* 添加课程 */
    addOpeningPlanDetailDTO() {
      this.$refs.addCourse.validate((valid) => {
        if (valid) {
          this.form.openingPlanDetailDTOList.push(this.openingPlanDetailDTO)
          this.openingPlanDetailDTO = {}
          this.dialogFormVisible = false
        } else {
          return false
        }
      })
    },
    /* 修改课程 */
    updateOpeningPlanDetailDTO() {
      this.$refs.addCourse.validate((valid) => {
        if (valid) {
          this.$set(this.form.openingPlanDetailDTOList, this.editId, { ...this.openingPlanDetailDTO })
          this.openingPlanDetailDTO = {}
          this.editId = undefined
          this.dialogFormVisible = false
        } else {
          return false
        }
      })
    },
    /* 关闭按钮 */
    close() {
      this.$confirm('当前数据将不会保存,确认关闭？').then(() => {
        this.$store.dispatch('tagsView/delView', this.$router.currentRoute)
        this.$router.push({ path: '/academic/openingPlan' })
      })
    },
    /* 选中教师 */
    ok(row) {
      this.form.teacherId = row.id
      this.teacher = row
    },
    // 选择了课程
    courseOk(courseList) {
      this.form.openingPlanDetailDTOList = this.form.openingPlanDetailDTOList.concat(courseList)
    },
    /* 最终提交按钮 */
    doCreate() {
      openingPlan.add(this.form).then(res => {
        this.$store.dispatch('tagsView/delView', this.$router.currentRoute)
        this.$router.push({ path: '/academic/openingPlan' })
        this.$notify({
          title: '成功',
          message: '添加成功',
          type: 'success',
          duration: 2000
        })
      })
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
