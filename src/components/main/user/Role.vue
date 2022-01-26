<template>
  <div class="role-box">
    <div class="role-content">
      <div class="by-user">
        <el-table :data="userData" v-loading="loading" style="width: 100%">
          <el-table-column
            prop="account"
            label="账号"
            width="200"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="realName"
            label="姓名"
            align="center"
            width="200"
          >
          </el-table-column>
          <el-table-column
            prop="deptName"
            label="组织"
            align="center"
            width="350"
          >
          </el-table-column>
          <el-table-column label="角色" align="left">
            <template slot-scope="scope">
              <el-tag
                v-for="(item, index) in scope.row.roles"
                :key="index"
                style="margin-right: 3px"
                :type="roleType(item.name)"
                >{{ item.name }}
              </el-tag>
            </template>
          </el-table-column>

          <el-table-column align="center" width="200">
            <template slot="header" >
              <el-tooltip class="item" effect="dark" content="红色代表已冻结,账号无法登陆,绿色代表正常,操作即时生效" placement="top-start">
              <span>冻结该账号<i class="el-icon-info"></i></span>
              </el-tooltip>
            </template>
            <template slot-scope="scope">
              <el-switch
                  v-model="scope.row.enabled"
                  @change="enableAccount(scope.row.userId,scope.row.enabled)"
                  active-color="#13ce66"
                  inactive-color="#ff4949">
              </el-switch>
            </template>
          </el-table-column>



          <el-table-column label="操作" align="center" width="100">
            <template slot-scope="scope">
              <el-button size="small" type="primary" round @click="editRole(scope.row)"
                >编辑角色</el-button
              >
            </template>
          </el-table-column>
        </el-table>

        <el-dialog
          :title="'编辑 ' + currentUser.realName + ' 的角色'"
          :visible.sync="dialogFormVisible"
        >
          <el-descriptions title="用户信息">
            <el-descriptions-item label="账号">{{
              currentUser.account
            }}</el-descriptions-item>
            <el-descriptions-item label="姓名">{{
              currentUser.realName
            }}</el-descriptions-item>
            <el-descriptions-item label="组织">{{
              currentUser.deptName
            }}</el-descriptions-item>
          </el-descriptions>
          <h3>选择角色</h3>
          <el-form :model="editRoleForm">
            <el-form-item label="角色列表:">
              <el-checkbox-group v-model="editRoleForm.roleId" :min="1">
                <el-checkbox
                  v-for="role in roles"
                  :min="1"
                  :key="role.id"
                  v-model="editRoleForm.roleId"
                  :label="role.id"
                  border
                  >{{ role.name }}</el-checkbox
                >
              </el-checkbox-group>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="handleChangeRole"
              >确 定</el-button
            >
          </div>
        </el-dialog>
      </div>
    </div>
    <div class="role-page">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="page.currentPage"
        :page-sizes="[10, 20, 30, 50, 100]"
        :page-size="page.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="page.total"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import instance from "@/request/request";

export default {
  data() {
    return {
      activeIndex: "1",
      userData: [],
      roleData: [],
      currentUser: {},
      dialogFormVisible: false,
      editRoleForm: {
        userId: 0,
        roleId: [],
      },
      roles: [],
      page: {
        currentPage: 1,
        pageSize: 10,
        total: 0,
      },
      loading: false,
    };
  },
  methods: {
    //分页
    handleSizeChange(val) {
      this.page.pageSize = val;
      this.getRoleByUser();
    },
    handleCurrentChange(val) {
      this.page.currentPage = val;
      this.getRoleByUser();
    },

    //切换页面
    handleSelect(index) {
      this.activeIndex = index + "";
    },
    getRoleByUser() {
      this.loading = true;
      instance
        .get("/role/byUser/" + this.page.currentPage + "/" + this.page.pageSize)
        .then((res) => {
          if (res.data.code == 200) {
            this.userData = res.data.data.records;
            this.page.total = res.data.data.total;
          } else {
            this.$message.error(res.data.message);
          }
          this.loading = false;
        })
        .catch((err) => {
          console.log(err);
          this.loading = false;
        });
    },
    roleType(role) {
      let type = "";
      switch (role) {
        case "超级管理员":
          type = "danger";
          break;
        case "乡镇管理员":
          type = "warning";
          break;
        case "村干部":
          type = "info";
          break;
        case "社长":
          type = "success";
          break;
      }
      return type;
    },
    showInput(userId) {
      console.log(userId);
      this.selectVisible = !this.selectVisible;
    },
    editRole(row) {
      this.currentUser = row;
      this.editRoleForm.userId = row.userId;
      this.editRoleForm.roleId = row.roles.map((role) => role.id);
      this.dialogFormVisible = true;
    },
    getRoles() {
      instance
        .get("/role/roles")
        .then((res) => {
          this.roles = res.data.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    handleChangeRole() {
      instance
        .post("/role/updateRole", this.editRoleForm)
        .then((res) => {
          if (res.data.code == 200) {
            this.dialogFormVisible = false;
            this.getRoleByUser();
          } else {
            this.$message(res.data.message);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    handleEdit(row) {
      console.log(row);
    },
    enableAccount(userId,enabled){
      instance.post("/role/enable/"+userId+"/"+enabled).then(
          res=>{
            if (res.data.code == 200){
              if (enabled){
                this.$message.success("启用成功")
              }else {
                this.$message.success("冻结成功")
              }

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
  created() {
    this.getRoleByUser();
    this.getRoles();
  },
};
</script>

<style scoped lang="less">
.role-box {
  width: 90%;
  height: 100%;
  margin: 0px auto;
}
.role-content {
  height: 90%;
}
.role-page {
  height: 10%;
  display: flex;
  justify-content: right;
}
</style>
