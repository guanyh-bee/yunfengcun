<template>
  <div class="published">
    <el-table
        :data="publishedData"
        style="width: 100%"
        :row-class-name="tableRowClassName"
    >
      <el-table-column prop="taskName" label="任务名称"></el-table-column>
      <el-table-column prop="created" label="任务创建时间"></el-table-column>
      <el-table-column prop="untilTime" label="任务截至时间"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
              v-if="scope.row.taskStatus === 0"
              size="mini"
              type="warning"
              @click="handleEdit(scope.row)"
          >查看任务进度
          </el-button
          >
          <el-button
              v-else
              size="mini"
              type="success"
              @click="handleEdit(scope.row)"
          >查看任务结果
          </el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!--任务未全部完成进度-->
    <el-drawer :title="title" :visible.sync="table" direction="rtl" size="90%" @closed="drawerData = false">
      <div style="margin-bottom: 10px;display: flex;justify-content: right;margin-right: 10px">
        <el-button @click="showItem">展示项</el-button>
        <el-button>导出表格</el-button>
      </div>
      <div v-if="drawerData">
        <el-table :data="gridData">
          <el-table-column prop="info.realName" label="姓名" v-if="needItem.indexOf('realName') != -1"></el-table-column>
          <el-table-column prop="info.account" label="账号" v-if="needItem.indexOf('account') != -1"></el-table-column>
          <el-table-column prop="info.addr" label="住址" v-if="needItem.indexOf('addr') != -1"></el-table-column>
          <el-table-column prop="info.deptName" label="组织名称"
                           v-if="needItem.indexOf('deptName') != -1"></el-table-column>
          <el-table-column label="性别" v-if="needItem.indexOf('gender') != -1">
            <template slot-scope="scope">
              <span>{{ scope.row.info.gender == 1 ? '男' : '女' }}</span>
            </template>
          </el-table-column>
          <el-table-column label="是否户主" v-if="needItem.indexOf('host') != -1">

            <template slot-scope="scope">
              <span>{{ scope.row.info.host ? '是' : '否' }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="info.relation" label="与户主关系"
                           v-if="needItem.indexOf('relation') != -1"></el-table-column>
          <el-table-column v-for="(data,index) in gridData[0].resultData" :key="index"
                           :label="data.taskItem.taskItemName">
            <el-table-column :label="'是否有'+data.taskItem.taskItemName">
              <template slot-scope="scope">
                {{ scope.row.resultData[index].hasItem ? '是' : '否' }}
              </template>
            </el-table-column>
            <el-table-column :label="data.taskItem.taskItemName+'数量'">
              <template slot-scope="scope">
                {{ scope.row.resultData[index].itemNum }}
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                  round
                  size="mini"
                  type="primary"
                  @click="handleEditDetail(scope.$index, scope.row)"
              >编辑
              </el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-drawer>

    <el-dialog title="选择展示项" :visible.sync="dialogFormVisible">

      <el-checkbox style="margin-bottom: 10px" border v-for="item in allItem" v-model="needItem"
                   :disabled="item.disabled" :key="item.prop" :label="item.prop">{{ item.label }}
      </el-checkbox>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
      </div>
    </el-dialog>

  </div>


</template>


<script>
import instance from "@/request/request";

export default {
  data() {
    return {
      publishedData: [],
      drawerData: false,
      dialogFormVisible: false,
      //抽屉开关
      table: false,
      gridData: [],
      title: "",
      allItem: [{'label': '姓名', 'prop': 'realName', 'disabled': true}, {
        'label': '账号',
        'prop': 'account',
        'disabled': false
      },
        {'label': '住址', 'prop': 'addr', 'disabled': false}, {'label': '组织名称', 'prop': 'deptName', 'disabled': false},
        {'label': '性别', 'prop': 'gender', 'disabled': false},
        {'label': '是否户主', 'prop': 'host', 'disabled': false}, {'label': '与户主关系', 'prop': 'relation', 'disabled': false}
      ],
      needItem:  ['realName']
    };
  },

  methods: {
    //表格状态
    tableRowClassName({row}) {
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
      this.title = row.taskName;
      this.table = true;
      this.needItem = JSON.parse(window.localStorage.getItem("showItem"))?JSON.parse(window.localStorage.getItem("showItem")):['realName']
      instance.get('/task/getResults/' + row.taskId).then(
          res => {
            if (res.data.code == 200) {
              this.gridData = res.data.data
              this.drawerData = true;
            } else {
              this.$message.error(res.data.message)
            }
          }
      ).catch(
          err => {
            console.log(err);
          }
      )

    },
    handleEditDetail(index, row) {
      console.log(index, row);
    },
    showItem() {
      this.dialogFormVisible = true
    }
  },
  created() {
    this.getPublished();
  },
  watch: {
    needItem: function (newV) {

        window.localStorage.setItem("showItem", JSON.stringify(newV))


    }
  }
};
</script>

<style scoped lang="less">
.published {
  width: 80%;
  margin: 0 auto;
}
</style>
