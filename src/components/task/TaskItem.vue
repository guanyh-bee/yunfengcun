<template>
  <div class="task_item">
    <div class="task_item_top">
      <el-row>
        <el-button
          type="primary"
          @click="addTaskItem"
          icon="el-icon-circle-plus-outline"
          >新增选项</el-button
        >
        <el-button type="warning" @click="editTaskItem" icon="el-icon-edit"
          >编辑选项</el-button
        >
        <el-popconfirm
          style="margin-left: 8px"
          title="确定要删除选中选项吗？"
          @confirm="confirmDeleteItem"
        >
          <el-button slot="reference" type="danger" icon="el-icon-delete"
            >删除选项</el-button
          >
        </el-popconfirm>
      </el-row>
    </div>
    <div class="task_item_content">
      <span style="font-weight: bold">选项列表:</span>
      <el-table
        ref="singleTable"
        :data="tableData"
        highlight-current-row
        @current-change="handleCurrentChange"
        style="width: 100%"
      >
        <el-table-column type="index" align="center" width="50">
        </el-table-column>
        <el-table-column property="taskItemName" label="名称" align="center">
        </el-table-column>
        <el-table-column label="是否需要数量" align="center">
          <template slot-scope="scope">
            <el-tag :type="scope.row.taskItemNumber ? 'success' : 'danger'"
              ><i
                :class="
                  scope.row.taskItemNumber ? 'el-icon-success' : 'el-icon-error'
                "
              ></i
            ></el-tag>
          </template>
        </el-table-column>
        <el-table-column label="单位" align="center">
          <template slot-scope="scope">
            <span></span>
            <el-tag :type="scope.row.taskItemNumber ? 'success' : 'danger'">
              {{
                scope.row.taskItemNumber ? scope.row.taskItemUnit : "不需要单位"
              }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog
      title="新增选项"
      :visible.sync="dialogFormVisible"
      center
      width="30%"
      :close-on-click-modal="false"
    >
      <el-form :model="formData" ref="addItemFormData" :rules="rules">
        <el-form-item
          label="选项名称"
          :label-width="formLabelWidth"
          prop="taskItemName"
        >
          <el-input
            maxlength="10"
            show-word-limit
            v-model="formData.taskItemName"
            placeholder="请输入名称"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="是否需要数量" :label-width="formLabelWidth">
          <el-switch
            v-model="formData.taskItemNumber"
            active-color="#13ce66"
            inactive-color="#ff4949"
          >
          </el-switch>
        </el-form-item>
        <el-form-item label="单位" :label-width="formLabelWidth">
          <el-input
            :placeholder="formData.taskItemNumber ? '请输入单位' : '单位不可用'"
            v-model="formData.taskItemUnit"
            :disabled="!formData.taskItemNumber"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleSure">{{
          commitType == "insert" ? "添加" : "修改"
        }}</el-button>
        <el-button @click="handleCancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import instance from "@/request/request";

export default {
  watch: {
    formData: {
      handler(newValue) {
        if (!newValue.taskItemNumber) {
          this.formData.taskItemUnit = "";
        }
      },
      deep: true,
    },
  },

  data() {
    return {
      tableData: [],
      formData: {
        taskItemName: "",
        taskItemNumber: false,
        taskItemUnit: "",
      },
      commitType: "insert",
      formLabelWidth: "120px",
      dialogFormVisible: false,
      currentRow: {},
      rules: {
        taskItemName: [
          { required: true, message: "请输入名称", trigger: "blur" },
          {
            min: 2,
            max: 10,
            message: "长度在 2 到 10 个字符",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    handleCurrentChange(val) {
      this.currentRow = val;
    },
    confirmDeleteItem() {
      if (this.currentRow.taskItemId == null) {
        this.$message({
          message: "请先选择需要删除的选项",
          type: "warning",
        });
      } else {
        this.formData = this.currentRow;
        instance
          .post("/task/deleteItem", this.formData)
          .then((res) => {
            if (res.data.code == 200) {
              this.$message({
                message: "删除成功",
                type: "success",
              });
              this.getItem();
              this.formData = {
                taskItemName: "",
                taskItemNumber: false,
                taskItemUnit: "",
              };
              this.currentRow = { taskItemId: null };
            } else {
              this.$message.error("出错啦!" + res.data.message);
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },

    addTaskItem() {
      this.commitType = "insert";
      this.dialogFormVisible = true;
    },
    editTaskItem() {
      this.commitType = "update";
      console.log(this.currentRow);
      if (this.currentRow == null || this.currentRow.taskItemId == null) {
        this.$message({
          message: "请先选择需要修改的选项",
          type: "warning",
        });
      } else {
        this.dialogFormVisible = true;
        this.formData = this.currentRow;
      }
    },
    handleCancel() {
      this.dialogFormVisible = false;
      this.formData = {
        taskItemName: "",
        taskItemNumber: false,
        taskItemUnit: "",
      };
    },
    handleSure() {
      this.$refs["addItemFormData"].validate((valid) => {
        if (valid) {
          if (this.commitType == "insert") {
            instance
              .post("/task/addItem", this.formData)
              .then((res) => {
                if (res.data.code == 200) {
                  this.$message({
                    message: "添加成功",
                    type: "success",
                  });
                  this.getItem();

                  this.dialogFormVisible = false;
                  this.formData = {
                    taskItemName: "",
                    taskItemNumber: false,
                    taskItemUnit: "",
                  };
                } else {
                  this.$message.error("出错啦!" + res.data.message);
                }
              })
              .catch((err) => {
                err.toString();
                this.$message.error("出错啦!");
              });
          } else {
            instance
              .post("/task/editItem", this.formData)
              .then((res) => {
                if (res.data.code == 200) {
                  this.$message({
                    message: "修改成功",
                    type: "success",
                  });
                  this.getItem();

                  this.dialogFormVisible = false;
                  this.formData = {
                    taskItemName: "",
                    taskItemNumber: false,
                    taskItemUnit: "",
                  };
                } else {
                  this.$message.error("出错啦!" + res.data.message);
                }
              })
              .catch((err) => {
                err.toString();
                this.$message.error("出错啦!");
              });
          }
        } else {
          console.log("bad submit");
        }
      });
    },
    getItem() {
      instance
        .get("/task/getItem")
        .then((res) => {
          this.tableData = res.data.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
  created() {
    this.getItem();
  },
};
</script>

<style scoped lang="less">
.task_item {
  width: 90%;
  margin: 0 auto;
  height: 95%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

.task_item_top {
  display: flex;
  width: 100%;
  height: 10%;
  align-items: center;
  flex: 1;
}

.task_item_content {
  flex: 12;
  width: 60%;
  margin-top: 20px;
}
</style>
