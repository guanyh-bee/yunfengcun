<template>
  <div class="authority-box">
    <el-menu
      :default-active="activeIndex"
      class="el-menu-demo"
      mode="horizontal"
      @select="handleSelect"
    >
      <el-menu-item index="1">权限列表</el-menu-item>
      <el-menu-item index="2">角色权限</el-menu-item>
    </el-menu>
    <div class="a">
      <div v-if="activeIndex == 1" class="b">
        <el-table max-height="650" :data="authority" style="width: 100%">
          <el-table-column type="index" width="50"> </el-table-column>

          <el-table-column label="权限名称" align="center" prop="authorityName">
          </el-table-column>
          <el-table-column align="center" label="是否启用该权限">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.enable"
                @change="switchEnable(scope.row)"
                active-color="#13ce66"
                inactive-color="#ff4949"
              >
              </el-switch>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-if="activeIndex == 2" class="b">
        <el-table
          :data="
            authorityData
          "
          style="width: 100%"
        >
          <el-table-column label="角色" width="200">
            <template slot-scope="scope">
              {{scope.row.role.name}}
            </template>
          </el-table-column>
          <el-table-column label="拥有的权限" align="left" >
            <template slot-scope="scope">
              <span v-if="scope.row.authorities.length>0">
                <span v-if="scope.row.role.name =='超级管理员'">
                   <el-tag type="danger">所有权限</el-tag>
                </span>
                <span v-else>
                  <el-tag style="margin-right: 5px;margin-bottom: 5px" type="success" v-for="item in scope.row.authorities" :key="item.id">{{item.authorityName}}</el-tag></span>
              </span>
          <span v-else>
            <el-tag type="warning">暂无权限</el-tag>
          </span>

            </template>
          </el-table-column>

          <el-table-column label="操作" align="right" width="300">
            <template slot-scope="scope">
              <el-button size="mini"  :disabled="scope.row.role.name=='超级管理员'" round type="primary" @click="handleEditAuthority(scope.row)"
                >{{scope.row.role.name=='超级管理员'?'管理员拥有所有权限':'编辑该角色权限'}}</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-if="activeIndex == 1" class="c">
        <div>
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[10, 20, 50, 100, 200]"
            :page-size="size"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          >
          </el-pagination>
        </div>
      </div>

      <el-dialog :title="'编辑'+title+'的权限'" :visible.sync="dialogFormVisible">
        <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
        <el-form :model="authorityForm">
          <el-form-item  >
            <el-checkbox-group
                @change="handleCheckedChange"
                v-model="authorityForm.authorityIds"
                >
              <el-checkbox v-for="authority in allAuthority" :label="authority.id" :key="authority.id">{{authority.authorityName}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitEditAuthority">确 定</el-button>
        </div>
      </el-dialog>

    </div>
  </div>
</template>

<script>
import instance from "@/request/request";

export default {
  data() {
    return {
      activeIndex: "1",
      currentPage: 1,
      total: 0,
      size: 10,
      authority: [],
      authorityData:[],
      dialogFormVisible:false,
      authorityForm:{
        roleId:0,
        authorityIds:[]
      },
      title:'',
      checkAll: false,
      isIndeterminate: true,
      allAuthority:[]
    };
  },
  methods: {
    handleSelect(key) {
      this.activeIndex = key;
    },
    getAuthorities() {
      instance
        .get("/role/authorities/" + this.currentPage + "/" + this.size)
        .catch((err) => {
          console.log(err);
        })
        .then((res) => {
          if (res.data.code == 200) {
            this.total = res.data.data.total;
            this.authority = res.data.data.records;
          } else {
            this.$message.error(res.data.message);
          }
        });
    },
    getAllAuthority(){
      instance.get("/role/allAuthorities").then(
                res=>{
                  if (res.data.code == 200){
                    this.allAuthority = res.data.data
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
    handleSizeChange(val) {
      this.size = val;
      this.getAuthorities();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getAuthorities();
    },
    switchEnable(row) {
      instance
        .post("/role/updateAuthority/" + row.id + "/" + row.enable)
        .then((res) => {
          if (res.data.code == 200) {
            if (row.enable) {
              this.$message.success("开启成功");
            } else {
              this.$message.success("关闭成功");
            }
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    handleEditAuthority(row) {
      this.title = row.role.name
      this.dialogFormVisible = true
      this.authorityForm.roleId=row.role.id
      this.authorityForm.authorityIds = row.authorities.map(a=>a.id)
    },
    handleCheckAllChange(val) {
      this.authorityForm.authorityIds = val ? this.allAuthority.map(a=>a.id) : [];
      this.isIndeterminate = false;
    },
    handleCheckedChange(value) {

      let checkedCount = value.length;
      this.checkAll = checkedCount === this.allAuthority.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.allAuthority.length;
    },
    submitEditAuthority(){
      instance.post("/role/updateRoleAuthority",this.authorityForm).then(
                res=>{
                  if (res.data.code == 200){
                    this.$message.success("修改成功")
                    this.getRoleAuthority()
                    this.dialogFormVisible= false
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
    getRoleAuthority(){
      instance.get("/role/getAuthority").then(
          res=>{
            let data = res.data
            if (data.code == 200){
              this.authorityData = data.data;
            }
          }
      ).catch(

      )
    }
  },
  created() {
    this.getAuthorities();
    this.getRoleAuthority();
    this.getAllAuthority();
  },
};
</script>

<style scoped lang="less">
.authority-box {
  width: 90%;
  margin: 0 auto;
  height: 100%;
}
.a {
  display: flex;
  height: 90%;
  flex-direction: column;
}
.b {
  height: 95%;
}
.c {
  display: flex;
  justify-content: right;
}
</style>
