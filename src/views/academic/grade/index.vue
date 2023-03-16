<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button
        class="filter-item"
        style="margin-left: 10px"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >
        {{ $t("table.add") }}
      </el-button>
    </div>
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column label="序号" type="index" />
      <el-table-column label="创建时间" width="180">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span style="margin-left: 10px">{{
            scope.row.createTime | parseTime
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="班级" width="auto">
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="top">
            <p>班级: {{ scope.row.name }}</p>
            <div slot="reference" class="name-wrapper">
              <el-tag size="medium">{{ scope.row.name }}</el-tag>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <!-- <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)"
            >编辑
          </el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"
            >删除
          </el-button>
        </template> -->
        <template slot-scope="{ row, $index }">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            {{ $t("table.edit") }}
          </el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(row, $index)"
          >
            {{ $t("table.delete") }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="专业" :label-width="formLabelWidth">
          <el-select v-model="form.majorId" placeholder="请选择">
            <el-option
              v-for="item in majorList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="入学年份" :label-width="formLabelWidth">
          <el-input v-model="form.year" autocomplete="off" />
        </el-form-item>
        <el-form-item label="班级序号" :label-width="formLabelWidth">
          <el-input v-model="form.number" autocomplete="off" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          {{ $t("table.cancel") }}
        </el-button>
        <el-button
          type="primary"
          @click="dialogStatus === 'create' ? createData() : updateData()"
        >
          {{ $t("table.confirm") }}
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
import grade from '@/api/grade'
import major from '@/api/major'
import { parseTime } from '@/utils'

export default {
  filters: {
    parseTime
  },
  data() {
    return {
      tableData: [
        {
          id: '2016-05-02',
          name: '王小虎',
          createTime: '上海市普陀区金沙江路 1518 弄'
        }
      ],

      dialogFormVisible: false,
      majorList: [],
      form: {
        majorId: '',
        number: '',
        year: ''
      },
      formLabelWidth: '120px',
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      }
    }
  },
  created() {
    this.getDate()
  },
  methods: {
    getDate() {
      grade.all().then((res) => {
        this.tableData = res.data
      })
    },
    resetForm() {
      this.form = {

      }
    },
    // handleEdit(index, row) {
    //   console.log(index, row);
    // },
    // handleDelete(index, row) {
    //   grade.delete(row.id).then(() => {
    //     alert("删除成功" + row.id);
    //     this.getDate();
    //   });
    // },
    handleDelete(row, index) {
      // console.log(row, index);
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning'
      })
        .then(() => {
          grade.delete(row.id).then(
            this.getDate(),
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success'
            })
          )
        })
        .catch(() => {
          this.$notify.info({
            title: '消息',
            message: '已取消',
            duration: 2000
          })
        })
      //   this.$nextTick(() => {
      //   this.$forceUpdate();
      // });
    },
    handleCreate() {
      major.all().then(res => {
        this.majorList = res.data
      })
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
    },
    createData() {
      console.log(this.form)
      grade.add(this.form).then(res => {
        this.getDate()
        this.dialogFormVisible = false
        // 清空dialog内表单数据。。。。
        this.$notify({
          title: '成功',
          message: '创建成功',
          type: 'success',
          duration: 2000
        })
      })
    },
    handleUpdate(row) {
      // console.log(row)
      major.all().then(res => {
        this.majorList = res.data
      })
      this.form = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      // this.$nextTick(() => {
      //   this.$refs["dataForm"].clearValidate();
      // });
    },
    updateData() {
      // this.$refs["dataForm"].validate((valid) => {
      //   if (valid) {
      const formData = Object.assign({}, this.form)
      formData.timestamp = +new Date(formData.timesform) // change Thu Nov 30 2023 16:41:05 GMT+0800 (CST) to 1512031311464
      grade.update(formData.id, formData).then(() => {
        this.getDate()
        this.dialogFormVisible = false
        this.$notify({
          title: '成功',
          message: '更新成功',
          type: 'success',
          duration: 2000
        })
      })
      // }
      // });
    }
  }
}
</script>

<style scoped>
</style>
