<template>
  <div class="my_task">
    <el-table :data="tableData"
              :row-class-name="tableRowClassName"
              style="width: 100%">
      <el-table-column label="序号" type="index"></el-table-column>
      <el-table-column label="任务名称" align="center" prop="taskName">
      </el-table-column>
      <el-table-column
          label="任务创建时间"
          align="center"
          prop="taskCreatedTime"
      >
      </el-table-column>
      <el-table-column
          label="任务截至时间"
          align="center"
      >
        <template slot-scope="scope">

          <el-tooltip  v-if="scope.row.warning" class="item" effect="dark" content="仅剩不到一天到期!" placement="bottom">
            <span >{{scope.row.taskUntilTime}} <i class="el-icon-warning"></i></span>
          </el-tooltip>


          <span v-else>{{scope.row.taskUntilTime}}</span>



        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button
              round
              size="middle"
              :type="scope.row.expired?'danger':'primary'"
              :disabled="scope.row.expired"
              @click="handleEdit(scope.row)"
          >{{ scope.row.expired ? '任务已过期' : '去完成任务' }}
          </el-button
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
        <template v-for="(item,index) in currentRow.items">

          <div :key="item.taskItemId+index">
            <el-form-item
                :label="'是否有' + item.taskItemName"
            >
              <el-switch
                  v-model="taskResult.commitData[index].hasItem"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                  @change="handleNo(index)"
              >
              </el-switch>
            </el-form-item>

            <el-form-item
                :label="item.taskItemName + '数量'"
                :prop="'commitData['+index+'].itemNum'"
                :rules="taskResult.commitData[index].hasItem? [
            { required: true, message: '请输入数量', trigger: 'blur' }
          ]:[]"
                v-if="item.taskItemNumber"
            >
              <el-input :disabled="!taskResult.commitData[index].hasItem" type="number" :min="0"
                        v-model.number="taskResult.commitData[index].itemNum"

              >
                <template slot="append">{{ item.taskItemUnit }}</template>
              </el-input>
            </el-form-item>
            <el-divider></el-divider>
          </div>
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
        commitData: [],
      },
      currentRow: {},
    };
  },
  methods: {
    tableRowClassName({row}){
    if (row.expried){
      return 'danger-row'
    }else if (row.warning){
      return 'warning-row'
    }
    },
    handleEdit(row) {
      this.currentRow = row;
      this.initData()
      this.dialogFormVisible = true;
      console.log(row)
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
      this.taskResult.commitData = []
      for (let i = 0; i < this.currentRow.items.length; i++) {
        this.taskResult.commitData.push(
            {
              hasItem: false,
              itemNum: null,
              taskItemId: this.currentRow.items[i].taskItemId,
              taskResultId: this.currentRow.taskResultId
            }
        )
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
    handleNo(value) {

      if (!this.taskResult.commitData[value].hasItem) {
        this.taskResult.commitData[value].itemNum = null
      }
    }
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
