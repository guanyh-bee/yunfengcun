<template>
  <div class="new_task">
    <div>
      <el-steps :active="activeStep" align-center>
        <el-step title="步骤 1" description="任务基本信息"></el-step>
        <el-step title="步骤 2" description="选择任务选项"></el-step>
        <el-step title="步骤 3" description="选择任务对象"></el-step>
        <el-step title="步骤 4" description="选择任务截至时间"></el-step>
        <el-step title="步骤 5" description="完成,发布任务"></el-step>
      </el-steps>
      <el-divider></el-divider>
    </div>
    <div class="new_task">
      <div class="new_task_1" v-show="activeStep == 1">
        <el-form
          v-if="activeStep == 1"
          :model="taskForm"
          ref="ruleForm"
          label-width="120px"
          class="demo-ruleForm"
        >
          <el-form-item label="任务名称:" prop="taskName">
            <el-input v-model="taskForm.taskName"></el-input>
          </el-form-item>

          <el-form-item label="任务是否可分发:" prop="taskName">
            <el-switch
              v-model="taskForm.canDivide"
              active-color="#13ce66"
              inactive-color="#ff4949"
            >
            </el-switch>
          </el-form-item>

          <el-form-item>
            <el-button
              :disabled="
                !(taskForm.taskName.length > 2 && taskForm.taskName.length < 20)
              "
              type="primary"
              @click="activeStep = 2"
              >下一步
            </el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="new_task_2" v-show="activeStep == 2">
        <el-transfer
          v-model="taskForm.taskOwnItem"
          :data="itemData"
          :props="{ key: 'taskItemId', label: 'taskItemName' }"
          :titles="['所有选项', '已选择选项']"
        ></el-transfer>
        <div class="new_task_2_1">
          <el-button type="primary" @click="activeStep = 1">上一步</el-button>
          <el-button
            type="success"
            @click="activeStep = 3"
            :disabled="!taskForm.taskOwnItem.length > 0"
            >下一步</el-button
          >
        </div>
      </div>
      <div class="new_task_3" v-show="activeStep == 3">

        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="根据用户选择" name="byUser">
            <div class="new_task_3_1_1">
              <el-transfer
                  :props="{ key: 'myUserId', label: 'realName' }"
                  filterable
                  filter-placeholder="请输入姓名"
                  :titles="['所有人员', '已选择人员']"
                  v-model="taskForm.taskPerson"
                  :data="userData"
              >
              </el-transfer>
            </div>
          </el-tab-pane>
          <el-tab-pane label="根据角色选择" name="byRole">

            <div style="display: flex;width: 600px;height: 500px">
              <div style="flex: 1;border-right: gray solid 1px;padding: 10px">
                <el-checkbox-group v-model="checkList" @change = roleChange>
                  <el-checkbox v-for="role in roles" :label="role.id" :key="role.id">{{role.name}}</el-checkbox>
                </el-checkbox-group>
              </div>
              <div style="flex: 1;padding:10px">
                <el-tag v-for="person in persons" :key="person.baseInfoId">{{person.realName}}</el-tag>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
        <div class="new_task_3_1_2">
          <el-button type="primary" @click="activeStep = 2">上一步</el-button>
          <el-button
            type="success"
            @click="activeStep = 4"
            :disabled="(taskForm.type == 1 && taskForm.taskPerson<1) || (taskForm.type == 2 && taskForm.taskPerson2<1) "
            >下一步</el-button
          >
        </div>
      </div>
      <div v-if="activeStep == 4" class="new_task_3">

        <div style="margin-bottom: 20px">
          <h4>选择任务截至时间:</h4>
          <el-date-picker
              v-model="taskForm.untilTime"
              type="datetime"
              placeholder="选择日期时间"
              default-time="23:59:59"
              value-format="yyyy-MM-dd HH:mm:ss"
              align="right"
              :picker-options="pickerOptions">
          </el-date-picker>
        </div>
        <div class="new_task_4_3">
          <el-button type="primary" @click="activeStep = 3">上一步</el-button>
          <el-button type="success" :disabled="taskForm.untilTime==''" @click="activeStep = 5">下一步</el-button>
        </div>

      </div>
      <div class="new_task_3" v-show="activeStep == 5">
        <div class="new_task_4_1">
          <h2>所有步骤已经就绪,请确认以下任务信息</h2>
        </div>
        <div class="new_task_3_2">
          <el-descriptions title="任务信息">
            <el-descriptions-item label="任务名称">{{
              taskForm.taskName
            }}</el-descriptions-item>
            <el-descriptions-item label="任务是否可分发">{{
              taskForm.canDivide ? "可分发" : "不可分发"
            }}</el-descriptions-item>
            <el-descriptions-item label="任务对象">{{
             taskForm.type == 1? selectUserName.join(","):persons.map(person=>person.realName).join(",")
            }}</el-descriptions-item>
            <el-descriptions-item label="任务项"
              >{{ selectItemName.join(",") }}
            </el-descriptions-item>
            <el-descriptions-item label="任务截至时间"
            >{{ taskForm.untilTime }}
            </el-descriptions-item>
          </el-descriptions>
          <!--          {{ }}-->
        </div>
        <div class="new_task_4_3">
          <el-button type="primary" @click="activeStep = 4">上一步</el-button>
          <el-button type="success" @click="submitTask">确认发布任务</el-button>
        </div>
      </div>


      <div v-if="activeStep == 6">
        <el-result
          icon="success"
          title="发布成功"
          subTitle="你已经成功发布一个任务,请等待任务完成"
        >
        </el-result>
      </div>
    </div>
  </div>
</template>

<script>
import instance from "@/request/request";

export default {
  data() {
    return {
      taskForm: {
        taskName: "",
        canDivide: false,
        taskOwnItem: [],
        taskPerson: [],
        taskPerson2:[],
        type:1,
        untilTime:''
      },
      activeStep: 1,
      itemData: [],
      userData: [],
      isCommit: false,
      activeName:'byUser',
      checkList:[],
      persons:[],
      roles:[],
      pickerOptions:{
        disabledDate:function (date){
          let now = new Date();
          return now.getTime()>=date.getTime()
        },
        shortcuts: [{
          text: '明天',
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() + 3600 * 1000 * 24);
            date.setHours(23)
            date.setSeconds(59)
            date.setMinutes(59)
            picker.$emit('pick', date);
          }
        }, {
          text: '后天',
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() + 3600 * 1000 * 48);
            date.setHours(23)
            date.setSeconds(59)
            date.setMinutes(59)
            picker.$emit('pick', date);
          }
        }, {
          text: '一周后',
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() + 3600 * 1000 * 24 * 7);
            date.setHours(23)
            date.setSeconds(59)
            date.setMinutes(59)
            picker.$emit('pick', date);
          }
        },
          {
            text: '30天后',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() + 3600 * 1000 * 24 * 30);
              date.setHours(23)
              date.setSeconds(59)
              date.setMinutes(59)
              picker.$emit('pick', date);
            }
          }
        ]
      }
    };
  },
  methods: {
    getItem() {
      instance
        .get("/task/getItem")
        .then((res) => {
          this.itemData = res.data.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getUser() {
      instance.post("/user/getUserByDeptId", []).then((res) => {
        if (res.data.data) this.userData = res.data.data;
      });
    },
    submitTask() {

      instance.post("/task/newTask", this.taskForm).then((res) => {
        if (res.data.code == 200) {
          this.activeStep = 6;
          this.taskForm = {
            taskName: "",
            canDivide: false,
            taskOwnItem: [],
            taskPerson: [],
            taskPerson2:[],
            type:1,
            untilTime:''

          };
        }
      });
    },
    handleClick(tab){
      this.activeName = tab.name
      if (tab.name == 'byUser'){
        this.taskForm.type = 1
      }else {
        this.taskForm.type = 2
      }
    },
    roleChange(value){
      instance.post("/user/getUserByRole",{roleIds:value}).then(
                res=>{
                  if (res.data.code == 200){
                    this.persons = res.data.data
                    this.taskForm.taskPerson2 = this.persons.map(person=>person.myUserId)
                  }else {
                    this.$message.error(res.data.message)
                  }
                }
            ).catch(
                err=>{
                  console.log(err);
                }
            )
    },

    getDownRole(){
      instance.get("/role/getDownRole").then(
                res=>{
                  if (res.data.code == 200){
                    this.roles = res.data.data;
                  }else {
                    this.$message.error(res.data.message)
                  }
                }
            ).catch(
                err=>{
                  console.log(err);
                }
            )
    }
  },
  computed: {
    selectUserName: function () {
      return this.taskForm.taskPerson.map((personId) => {
        return this.userData.filter((user) => user.myUserId == personId)[0]
          .realName;
      });
    },
    selectItemName: function () {
      return this.taskForm.taskOwnItem.map((itemId) => {
        return this.itemData.filter((item) => item.taskItemId == itemId)[0]
          .taskItemName;
      });
    },
  },
  created() {
    this.getItem();
    this.getUser();
    this.getDownRole();
  },
};
</script>

<style scoped lang="less">
.new_task {
  width: 95%;
  margin-left: 30px;
  padding-right: 30px;
  box-sizing: border-box;
  height: 90%;
}

///deep/ .el-transfer-panel {
//  width: 400px !important;
//}

.new_task_1 {
  width: 40%;
  box-sizing: border-box;
}

.new_task_2 {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.new_task_2_1 {
  margin-top: 20px;
}

.new_task_3 {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.new_task_3_1_2 {
  margin-top: 20px;
}
</style>
