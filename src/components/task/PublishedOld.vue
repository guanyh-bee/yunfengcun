<template>
  <div class="published">
    <el-table
      :data="publishedData"
      style="width: 100%"
      :row-class-name="tableRowClassName"
    >
      <el-table-column prop="taskName" label="任务名称"> </el-table-column>
      <el-table-column prop="created" label="任务创建时间"> </el-table-column>
      <el-table-column prop="untilTime" label="任务截至时间"> </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.taskStatus === 0"
            size="mini"
            type="warning"
            @click="handleEdit(scope.row)"
            >查看任务进度</el-button
          >
          <el-button
            v-else
            size="mini"
            type="success"
            @click="handleEdit(scope.row)"
            >查看任务结果</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!--任务未全部完成进度-->
    <el-drawer :title="title" :visible.sync="table" direction="rtl" size="80%">
      <el-table :data="gridData">
        <el-table-column prop="info.realName" label="姓名"></el-table-column>

        <el-table-column
          v-for="(result, index) in gridData[0] ? gridData[0].taskData : {}"
          :key="index"
          :label="result.label"
        >
          <template slot-scope="scope">
            {{
              scope.row.taskData[index].value === false ||
              scope.row.taskData[index].value === true
                ? scope.row.taskData[index].value
                  ? "是"
                  : "否"
                : scope.row.taskData[index].value
            }}
          </template>
        </el-table-column>

        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="handleEditDetail(scope.$index, scope.row)"
              >Edit</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-drawer>
  </div>
</template>

<script>
import instance from "@/request/request";

export default {
  data() {
    return {
      publishedData: [],
      //抽屉开关
      table: false,
      gridData: [],
      title: "",
    };
  },

  methods: {
    //表格状态
    tableRowClassName({ row }) {
      if (row.taskStatus === 0) {
        return "warning-row";
      } else if (row.taskStatus === 1) {
        return "success-row";
      }
      return "";
    },
    getPublished() {
      instance
        .get("/task/published")
        .then((res) => {
          if (res.data.code == 200) {
            this.publishedData = res.data.data;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    handleEdit(row) {
      this.getResult(row.taskId)
        .then((res) => {
          this.title = row.taskName;
          this.table = true;
          this.gridData = res;
          for (let i = 0; i < res.length; i++) {
            this.$set(this.gridData, i, res[i]);
          }

          if (row.taskStatus === 0) {
            console.log(111);
          } else {
            this.gridData.toString();
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    handleEditDetail(index, row) {
      console.log(index, row);
    },
    getResult(id) {
      return new Promise((resolve, reject) => {
        instance
          .get("/task/getResults/" + id)
          .then((res) => {
            let srcResult = res.data.data;

            for (let i = 0; i < srcResult.length; i++) {
              let obj = JSON.parse(srcResult[i].taskData);

              srcResult[i].taskData = obj;
            }

            // this.gridData = res.data.data
            //
            //
            //
            resolve(srcResult);
          })
          .catch((err) => {
            console.log(err);
            reject();
          });
      });
    },
  },
  created() {
    this.getPublished();
  },
};
</script>

<style scoped lang="less">
.published {
  width: 80%;
  margin: 0 auto;
}
</style>
