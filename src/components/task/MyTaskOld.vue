<template>
  <div class="my_task">
    <el-table :data="tableData" style="width: 100%">
      <el-table-column label="序号" type="index"> </el-table-column>
      <el-table-column label="任务名称" align="center" prop="taskName">
      </el-table-column>
      <el-table-column
        label="任务创建时间"
        align="center"
        prop="taskCreatedTime"
      >
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button
            size="middle"
            type="success"
            @click="handleEdit(scope.$index, scope.row)"
            >去完成任务</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      title="任务详情"
      :visible.sync="dialogFormVisible"
      center
      width="30%"
    >
      <el-form :model="taskResult" ref="taskResultForm">
        <template v-for="item in currentRow.items">
          <el-form-item
            :label="'是否有' + item.taskItemName"
            :key="item.taskItemId + item.taskItemName"
          >
            <el-switch
              v-model="taskResult.commitData[item.taskItemId + '_attr1']"
              active-color="#13ce66"
              inactive-color="#ff4949"
            >
            </el-switch>
          </el-form-item>

          <el-form-item
            :label="item.taskItemName + '数量'"
            :key="item.taskItemId + item.taskItemNumber"
            :rules="
              item.taskItemNumber &&
              taskResult.commitData[item.taskItemId + '_attr1']
                ? [{ required: true, message: '请输入数量', trigger: 'blur' }]
                : null
            "
            :prop="'commitData.' + item.taskItemId + '_attr2'"
          >
            <el-input
              :disabled="
                !item.taskItemNumber ||
                !taskResult.commitData[item.taskItemId + '_attr1']
              "
              v-model.number="taskResult.commitData[item.taskItemId + '_attr2']"
            >
              <template slot="append">{{ item.taskItemUnit }}</template>
            </el-input>
          </el-form-item>

          <el-divider
            :key="item.taskItemId + item.taskItemNumber.created"
          ></el-divider>
        </template>

        <!--          <el-form-item  v-for="item in currentRow.items"   :key="item.taskItemId">-->
        <!--              -->

        <!--          </el-form-item>-->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmTask">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import instance from "@/request/request";

export default {
  data() {
    return {
      tableData: [],
      dialogFormVisible: false,
      taskResult: {
        taskResultId: null,
        commitData: {},
      },
      currentRow: {},
    };
  },
  methods: {
    handleEdit(index, row) {
      index.toString();
      this.currentRow = row;
      this.initData();
      this.dialogFormVisible = true;
    },
    getTask() {
      instance
        .get("/task/myTask")
        .then((res) => {
          this.tableData = res.data.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    initData() {
      this.taskResult.taskResultId = this.currentRow.taskResultId;
      for (let i = 0; i < this.currentRow.items.length; i++) {
        let item = this.currentRow.items[i];
        this.$set(
          this.taskResult.commitData,
          item.taskItemId + "_attr1",
          false
        );
        this.$set(this.taskResult.commitData, item.taskItemId + "_attr2", 0);
      }
    },
    confirmTask() {
      this.$refs["taskResultForm"].validate((valid) => {
        if (valid) {
          instance
            .post("/task/commitMyTask", this.taskResult)
            .catch((err) => {
              console.log(err);
            })
            .then((res) => {
              if (res.data.code == 200) {
                this.$message({
                  message: "提交成功",
                  type: "success",
                });
                this.dialogFormVisible = false;
                this.getTask();
              } else {
                this.$message.error(res.data.message);
              }
            });
        } else {
          console.log("error submit!!");
          console.log(this.taskResult.commitData);
          return false;
        }
      });
    },
  },
  created() {
    this.getTask();
  },
};
</script>

<style scoped lang="less">
.my_task {
  width: 80%;
  margin: 0 auto;
}
</style>
