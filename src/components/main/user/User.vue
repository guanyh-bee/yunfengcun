<template>
  <div class="user-main" v-loading="allLoading" v-if="!allLoading">
    <div class="user-main-left">
      <div class="user-main-left-content">
        <el-tree
            :data="deptData"
            node-key="id"
            :props="defaultProps"
            @node-click="handleNodeClick"
            :expand-on-click-node="false"
            default-expand-all
            @node-drop="handleDrop"
            draggable
            :allow-drop="allowDrop"
            :allow-drag="allowDrag"
        >
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <span>{{ node.label }}</span>
            <span>
              <el-dropdown v-if="data.canEdit == 1">
                <span class="el-dropdown-link">
                  <i class="el-icon-more el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">

                  <el-dropdown-item @click.native=append(node)>
                    <span>新增</span>
                  </el-dropdown-item>

                  <el-dropdown-item @click.native=remove(node)>
                     <span>删除</span>
                  </el-dropdown-item>

                  <el-dropdown-item @click.native=updateName(data)>
                     <span>修改</span>
                  </el-dropdown-item>

                  <el-dropdown-item @click.native=setPrincipal(data)>
                     <span>设置负责人</span>
                  </el-dropdown-item>

                </el-dropdown-menu>
              </el-dropdown>

            </span>
          </span>
        </el-tree>
        <!--添加部门对话框-->
        <el-dialog
            width="30%"
            title="新增部门"
            lock-scroll
            :visible.sync="dialogFormVisible"

        >
          <div v-if="addDeptType == 'village'">
            <el-form :model="addVillageForm" ref="addTownShipForm" :rules="deptRule">
              <el-form-item label="村名称" prop="deptName">
                <el-input
                    v-model="addVillageForm.deptName"
                    autocomplete="off"
                ></el-input>
              </el-form-item>
              <el-form-item label="村序号" prop="townshipOrder">
                <el-input
                    v-model="addVillageForm.villageOrder"
                    autocomplete="off"
                ></el-input>
              </el-form-item>
              <el-form-item label="描述" prop="description">
                <el-input
                    type="textarea"
                    v-model="addVillageForm.description"
                    autocomplete="off"
                ></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button type="primary" @click="submitAddTownship('addTownShipForm')"
              >立即创建
              </el-button
              >
              <el-button @click="dialogFormVisible = false">取 消</el-button>
            </div>
          </div>
          <div v-if="addDeptType == 'society'">
            <el-form :model="addSocietyForm" ref="addSocietyForm" :rules="deptRule">
              <el-form-item label="社名称" prop="deptName">
                <el-input
                    v-model="addSocietyForm.deptName"
                    autocomplete="off"
                ></el-input>
              </el-form-item>
              <el-form-item label="社序号" prop="societyOrder">
                <el-input
                    v-model="addSocietyForm.societyOrder"
                    autocomplete="off"
                ></el-input>
              </el-form-item>
              <el-form-item label="描述" prop="description">
                <el-input
                    type="textarea"
                    v-model="addSocietyForm.description"
                    autocomplete="off"
                ></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button type="primary" @click="submitAddSociety('addSocietyForm')"
              >立即创建
              </el-button
              >
              <el-button @click="dialogFormVisible = false">取 消</el-button>
            </div>
          </div>
          <div v-if="addDeptType == 'household'">
            <el-form :model="addHouseholdForm" ref="addHouseholdForm" :rules="deptRule" label-position="right"
                     label-width="100px">
              <el-form-item label="户名称" prop="deptName">
                <el-input
                    v-model="addHouseholdForm.deptName"
                    autocomplete="off"
                ></el-input>
              </el-form-item>
              <el-form-item label="户序号" prop="householdOrder">
                <el-input
                    v-model="addHouseholdForm.householdOrder"
                    autocomplete="off"
                ></el-input>
              </el-form-item>
              <el-form-item label="户籍" prop="householdAddr">
                <el-input
                    v-model="addHouseholdForm.householdAddr"
                    autocomplete="off"
                ></el-input>
              </el-form-item>

              <el-form-item label="收入来源" prop="takeInSource">
                <el-select
                    v-model="addHouseholdForm.takeInSource"
                    allow-create
                    filterable
                    default-first-option
                    placeholder="请选择或输入收入来源">
                  <el-option
                      v-for="item in takeInSourceOptions"
                      :key="item.id"
                      :label="item.label"
                      :value="item.label">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="低保户" prop="diBao">
                <el-switch
                    v-model="addHouseholdForm.diBao"
                    active-color="#13ce66"
                    inactive-color="#ff4949">
                </el-switch>
              </el-form-item>
              <el-form-item label="立档建卡" prop="liDangJianKa">
                <el-switch
                    v-model="addHouseholdForm.liDangJianKa"
                    active-color="#13ce66"
                    inactive-color="#ff4949">
                </el-switch>
              </el-form-item>
              <el-form-item label="五保户" prop="wuBao">
                <el-switch
                    v-model="addHouseholdForm.wuBao"
                    active-color="#13ce66"
                    inactive-color="#ff4949">
                </el-switch>
              </el-form-item>

              <el-form-item label="脱贫不稳定户" prop="tuoPinBuWenDing">
                <el-switch
                    v-model="addHouseholdForm.tuoPinBuWenDing"
                    active-color="#13ce66"
                    inactive-color="#ff4949">
                </el-switch>
              </el-form-item>

              <el-form-item label="不稳定类型" prop="tuoPinBuWenDingType" v-if="addHouseholdForm.tuoPinBuWenDing">
                <el-select
                    v-model="addHouseholdForm.tuoPinBuWenDingType"
                    filterable
                    default-first-option
                    placeholder="请选择不稳定类型">
                  <el-option
                      v-for="item in tuoPinBuWenDingOptions"
                      :key="item.id"
                      :label="item.label"
                      :value="item.label">
                  </el-option>
                </el-select>
              </el-form-item>

            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button type="primary" @click="submitAddHousehold('addHouseholdForm')"
              >立即创建
              </el-button
              >
              <el-button @click="dialogFormVisible = false">取 消</el-button>
            </div>
          </div>


        </el-dialog>

        <!--修改部门对话框-->
        <el-dialog
            width="30%"
            title="修改部门"
            :visible.sync="dialogUpdateVisible"
            lock-scroll
        >
          <!--          修改乡镇-->
          <div v-if="updateDeptType=='township'">
            <el-form :model="updateTownshipForm" ref="updateTownshipForm" :rules="deptRule">
              <el-form-item label="乡镇名称" prop="deptName">
                <el-input
                    v-model="updateTownshipForm.deptName"
                    autocomplete="off"
                ></el-input>
              </el-form-item>
              <el-form-item label="描述" prop="townshipInfoSub.description">
                <el-input
                    type="textarea"
                    v-model="updateTownshipForm.townshipInfoSub.description"
                    autocomplete="off"
                ></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button type="primary" @click="submitUpdateDept('updateTownshipForm')"
              >立即修改
              </el-button
              >
              <el-button @click="dialogUpdateVisible = false">取 消</el-button>
            </div>
          </div>
          <!--          修改村-->
          <div v-if="updateDeptType=='village'">
            <el-form :model="updateVillageForm" ref="updateVillageForm" :rules="deptRule">
              <el-form-item label="村名称" prop="deptName">
                <el-input
                    v-model="updateVillageForm.deptName"
                    autocomplete="off"
                ></el-input>
              </el-form-item>
              <el-form-item label="村序号" prop="villageInfoSub.villageOrder">
                <el-input
                    v-model="updateVillageForm.villageInfoSub.villageOrder"
                    autocomplete="off"
                ></el-input>
              </el-form-item>
              <el-form-item label="描述" prop="villageInfoSub.description">
                <el-input
                    type="textarea"
                    v-model="updateVillageForm.villageInfoSub.description"
                    autocomplete="off"
                ></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button type="primary" @click="submitUpdateDept('updateVillageForm')"
              >立即修改
              </el-button
              >
              <el-button @click="dialogUpdateVisible = false">取 消</el-button>
            </div>
          </div>
          <!--          修改社-->
          <div v-if="updateDeptType=='society'">
            <el-form :model="updateSocietyForm" ref="updateSocietyForm" :rules="deptRule">
              <el-form-item label="社名称" prop="deptName">
                <el-input
                    v-model="updateSocietyForm.deptName"
                    autocomplete="off"
                ></el-input>
              </el-form-item>

              <el-form-item label="社序号" prop="societyInfoSub.societyOrder">
                <el-input
                    v-model="updateSocietyForm.societyInfoSub.societyOrder"
                    autocomplete="off"
                ></el-input>
              </el-form-item>

              <el-form-item label="描述" prop="societyInfoSub.description">
                <el-input
                    v-model="updateSocietyForm.societyInfoSub.description"
                    autocomplete="off"
                ></el-input>
              </el-form-item>

            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button type="primary" @click="submitUpdateDept('updateSocietyForm')"
              >立即修改
              </el-button
              >
              <el-button @click="dialogUpdateVisible = false">取 消</el-button>
            </div>
          </div>
          <!--          修改户-->
          <div v-if="updateDeptType=='household'">
            <el-form :model="updateHouseholdForm" ref="updateHouseholdForm" :rules="deptRule">
              <el-form-item label="户名称" prop="deptName">
                <el-input
                    v-model="updateHouseholdForm.deptName"
                    autocomplete="off"
                ></el-input>
              </el-form-item>


              <el-form-item label="户序号" prop="householdInfoSub.householdOrder">
                <el-input
                    v-model="updateHouseholdForm.householdInfoSub.householdOrder"
                    autocomplete="off"
                ></el-input>
              </el-form-item>
              <el-form-item label="户籍" prop="householdInfoSub.householdAddr">
                <el-input
                    v-model="updateHouseholdForm.householdInfoSub.householdAddr"
                    autocomplete="off"
                ></el-input>
              </el-form-item>

              <el-form-item label="收入来源" prop="householdInfoSub.takeInSource">
                <el-select
                    v-model="updateHouseholdForm.householdInfoSub.takeInSource"
                    allow-create
                    filterable
                    default-first-option
                    placeholder="请选择或输入收入来源">
                  <el-option
                      v-for="item in takeInSourceOptions"
                      :key="item.id"
                      :label="item.label"
                      :value="item.label">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="低保户" prop="diBao">
                <el-switch
                    v-model="updateHouseholdForm.householdInfoSub.diBao"
                    active-color="#13ce66"
                    inactive-color="#ff4949">
                </el-switch>
              </el-form-item>
              <el-form-item label="立档建卡" prop="liDangJianKa">
                <el-switch
                    v-model="updateHouseholdForm.householdInfoSub.liDangJianKa"
                    active-color="#13ce66"
                    inactive-color="#ff4949">
                </el-switch>
              </el-form-item>
              <el-form-item label="五保户" prop="wuBao">
                <el-switch
                    v-model="updateHouseholdForm.householdInfoSub.wuBao"
                    active-color="#13ce66"
                    inactive-color="#ff4949">
                </el-switch>
              </el-form-item>

              <el-form-item label="脱贫不稳定户" prop="tuoPinBuWenDing">
                <el-switch
                    v-model="updateHouseholdForm.householdInfoSub.tuoPinBuWenDing"
                    active-color="#13ce66"
                    inactive-color="#ff4949">
                </el-switch>
              </el-form-item>

              <el-form-item label="不稳定类型" prop="tuoPinBuWenDingType"
                            v-if="updateHouseholdForm.householdInfoSub.tuoPinBuWenDing">
                <el-select
                    v-model="updateHouseholdForm.householdInfoSub.tuoPinBuWenDingType"
                    filterable
                    default-first-option
                    placeholder="请选择不稳定类型">
                  <el-option
                      v-for="item in tuoPinBuWenDingOptions"
                      :key="item.id"
                      :label="item.label"
                      :value="item.label">
                  </el-option>
                </el-select>
              </el-form-item>


            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button type="primary" @click="submitUpdateDept('updateHouseholdForm')"
              >立即修改
              </el-button
              >
              <el-button @click="dialogUpdateVisible = false">取 消</el-button>
            </div>
          </div>

        </el-dialog>

        <!-- 设置部门负责人对话框-->
        <el-dialog
            width="50%"
            title="设置部门负责人"
            :visible.sync="dialogSetPrincipalVisible"
        >


          <div class="set-principal-dialog">
            <div class="set-principal-dialog-left">
              <el-form :model="setPrincipalForm">
                <el-form-item prop="deptName">
                  <el-select
                      style="width: 90%"
                      v-model="setPrincipalForm.userIds"
                      multiple
                      filterable
                      remote
                      reserve-keyword
                      collapse-tags
                      placeholder="请输入姓名或账号以搜索..."
                      @change="change"
                      :remote-method="remoteMethod"
                      :loading="loading">
                    <el-option

                        v-for="item in options"
                        :disabled="item.disabled"
                        :key="item.userId"
                        :label="item.realName+'-'+item.account"
                        :value="item.userId">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-form>

            </div>
            <div class="set-principal-dialog-right">

              <div class="set-principal-dialog-right-top">
                <h3>已选择人员:</h3>
                <el-tag v-for="name in selectNames" :key="name" type="info">{{ name }}</el-tag>
              </div>
              <div class="set-principal-dialog-right-bottom">
                <h3>已有人员:</h3>
                <el-tag v-for="info in selectedNames" closable @close="closeTag(info.myUserId)" :key="info.baseInfoId"
                        type="success">{{ info.realName }}
                </el-tag>
              </div>


            </div>
          </div>


          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="submitPrincipalDept" :disabled="selectNames.length<1"
            >确定
            </el-button
            >
            <el-button @click="dialogSetPrincipalVisible = false">取 消</el-button>
          </div>
        </el-dialog>


      </div>
    </div>
    <div class="user-main-right">
      <div class="user-tool" v-if="deptData[0].canEdit == 1">
        <div>
          <el-button type="success" @click="addUserPanel = !addUserPanel"
          >添加用户<i class="el-icon-circle-plus el-icon--right"></i
          ></el-button>
          <el-button type="primary"
          >批量导入<i class="el-icon-upload el-icon--right"></i
          ></el-button>
        </div>

      </div>
      <el-divider></el-divider>

      <div class="user-content">



        <div v-if="addUserPanel">

          <div style="margin-left: 4%;margin-right: 4%;" v-if="showDeptInfo">
            <div v-if="currentNode.level == 0 || currentNode.level == null">
              <el-descriptions title="乡镇信息:" :column="1" border>

                <el-descriptions-item label="乡镇名" :label-style="{'white-space':'nowrap'}">{{ currentNode.label }}
                </el-descriptions-item>
                <el-descriptions-item label="描述" :label-style="{'white-space':'nowrap'}">{{ townshipInfo.description }}
                </el-descriptions-item>
              </el-descriptions>
            </div>
            <div v-else-if="currentNode.level == 1">
              <el-descriptions title="村信息:" border>
                <el-descriptions-item label="村名">{{ currentNode.label }}</el-descriptions-item>
                <el-descriptions-item label="村序号">{{ villageInfo.villageOrder }}</el-descriptions-item>
                <el-descriptions-item label="描述">{{ villageInfo.description }}</el-descriptions-item>
              </el-descriptions>
            </div>
            <div v-else-if="currentNode.level == 2">
              <el-descriptions title="社信息:" border>
                <el-descriptions-item label="社名">{{ currentNode.label }}</el-descriptions-item>
                <el-descriptions-item label="社序号">{{ societyInfo.societyOrder }}</el-descriptions-item>
                <el-descriptions-item label="描述">{{ societyInfo.description }}</el-descriptions-item>
              </el-descriptions>
            </div>
            <div v-else-if="currentNode.level == 3">
              <el-descriptions title="户信息:" border>
                <el-descriptions-item label="户名">{{ currentNode.label }}</el-descriptions-item>
                <el-descriptions-item label="户号">{{ householdInfo.householdOrder }}</el-descriptions-item>
                <el-descriptions-item label="户籍地址">{{ householdInfo.householdAddr }}</el-descriptions-item>
                <el-descriptions-item label="家庭主要收入来源">{{ householdInfo.takeInSource }}</el-descriptions-item>
                <el-descriptions-item label="低保户">{{ householdInfo.diBao ? '是' : '否' }}</el-descriptions-item>
                <el-descriptions-item label="立档建卡户">{{ householdInfo.liDangJianKa ? '是' : '否' }}</el-descriptions-item>
                <el-descriptions-item label="五保户">{{ householdInfo.wuBao ? '是' : '否' }}</el-descriptions-item>
                <el-descriptions-item label="脱贫不稳定户">{{ householdInfo.tuoPinBuWenDing ? '是' : '否' }}</el-descriptions-item>
                <el-descriptions-item v-if="householdInfo.tuoPinBuWenDing" label="脱贫不稳定类型">
                  {{ householdInfo.tuoPinBuWenDingType }}
                </el-descriptions-item>


              </el-descriptions>
            </div>
          </div>

          <el-table
              max-height="750px"
              :data="
              tableData.filter(
                (data) =>
                  !search ||
                  data.realName.toLowerCase().includes(search.toLowerCase())
              )
            "
              style="width: 95%; margin: 0 auto"
          >
            <el-table-column label="账号" prop="account"></el-table-column>
            <el-table-column label="姓名" prop="realName"></el-table-column>
            <el-table-column label="性别">
              <template slot-scope="scope">
                {{ scope.row.gender == 0 ? "女" : "男" }}
              </template>
            </el-table-column>

            <el-table-column label="与户主关系">
              <template slot-scope="scope">
                {{ scope.row.relation }}
                <i
                    v-if="scope.row.host"
                    class="el-icon-s-custom"
                    style="color: wheat"
                ></i>
              </template>
            </el-table-column>

            <el-table-column label="手机" prop="phone"></el-table-column>
            <el-table-column label="地址" prop="addr"></el-table-column>
            <el-table-column label="组织" prop="deptName"></el-table-column>

            <el-table-column align="right">
              eslint-disable
              <!--   eslint-disable       -->
              <template slot="header" slot-scope="scope">
                <el-input
                    v-model="search"
                    size="mini"
                    placeholder="输入姓名搜索"/>
              </template>
              <!--   eslint-disable       -->
              <template slot-scope="scope">
                <el-button
                    size="mini"
                    round
                    @click="handleEdit(scope.$index, scope.row)">编辑
                </el-button>
                <el-button
                    v-if="deptData[0].canEdit == 1"
                    size="mini"
                    type="danger"
                    round
                    @click="handleDelete(scope.$index, scope.row)">删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div v-else class="add-user">
          <el-form :model="addUserForm" :rules="rules" ref="addUserForm" label-width="120px" class="demo-ruleForm">
            <h4>基础信息</h4>
            <el-form-item label="账号" prop="username">
              <el-input v-model="addUserForm.username"></el-input>
            </el-form-item>

            <el-form-item label="真实姓名" prop="realName">
              <el-input v-model="addUserForm.realName"></el-input>
            </el-form-item>

            <el-form-item label="组织架构" prop="dept">
              <el-cascader
                  v-model="addUserForm.dept"
                  :options="deptData"
                  :props="{ expandTrigger: 'hover',
                   checkStrictly: true,
                   value:'id',

                   }"
              ></el-cascader>
            </el-form-item>


            <el-form-item label="手机" prop="phone">
              <el-input v-model="addUserForm.phone"></el-input>
            </el-form-item>

            <el-form-item label="性别" prop="gender">
              <el-switch
                  v-model="addUserForm.gender"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                  active-text="男"
                  inactive-text="女">
              </el-switch>
            </el-form-item>

            <el-form-item label="住址" prop="addr">
              <el-input v-model="addUserForm.addr"></el-input>
            </el-form-item>

            <el-form-item label="是否户主" prop="isHost">
              <el-switch
                  v-model="addUserForm.isHost"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                  active-text="是"
                  inactive-text="否">
              </el-switch>
            </el-form-item>
            <el-form-item label="与户主关系" prop="relation">
              <el-input :disabled="addUserForm.isHost" v-model="addUserForm.relation"></el-input>
            </el-form-item>


            <el-form-item label="身份证号" prop="idCardNum"
                          :rules="[
      { required: true, message: '请输入身份证号码', trigger: 'blur' },
     {
            pattern:
/^[1-9]\d{5}(18|19|20|(3\d))\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/,
            message: '请输入正确的身份证号码',
            }
    ]"
            >
              <el-input  v-model="addUserForm.idCardNum"></el-input>
            </el-form-item>

            <el-form-item label="民族" prop="nation"
                          :rules="[
      { required: true, message: '请选择民族', trigger: 'blur' }]"
            >
              <el-select v-model="addUserForm.nation" filterable placeholder="请选择民族">
                <el-option
                    v-for="item in nations"
                    :key="item.nationId"
                    :label="item.nationName"
                    :value="item.nationName">
                </el-option>
              </el-select>
            </el-form-item>

            <el-divider></el-divider>
            <h4>特别身份信息</h4>
            <el-form-item label="是否低保" prop="specialIdentity.isDiBao">
              <el-switch
                  v-model="addUserForm.specialIdentity.isDiBao"
                  active-color="#13ce66"
                  inactive-color="#ff4949">
              </el-switch>
            </el-form-item>
            <el-form-item label="低保金额" prop="specialIdentity.diBaoMoney" v-if="addUserForm.specialIdentity.isDiBao">
              <el-input  v-model="addUserForm.specialIdentity.diBaoMoney"></el-input>
            </el-form-item>
            <el-form-item label="是否五保" prop="specialIdentity.isWuBao">
              <el-switch
                  v-model="addUserForm.specialIdentity.isWuBao"
                  active-color="#13ce66"
                  inactive-color="#ff4949">
              </el-switch>

            </el-form-item>
            <el-form-item label="五保金额" prop="specialIdentity.wuBaoMoney" v-if="addUserForm.specialIdentity.isWuBao">
              <el-input  v-model="addUserForm.specialIdentity.wuBaoMoney"></el-input>
            </el-form-item>
            <el-form-item label="是否残疾" prop="specialIdentity.isCanJi">
              <el-switch
                  v-model="addUserForm.specialIdentity.isCanJi"
                  active-color="#13ce66"
                  inactive-color="#ff4949">
              </el-switch>
            </el-form-item>
            <el-form-item label="残疾等级" prop="specialIdentity.isCanJi" v-if="addUserForm.specialIdentity.isCanJi">
              <el-select v-model="addUserForm.specialIdentity.canJiLevel" placeholder="请选择">
                <el-option label="一级" value="一级"> </el-option>
                <el-option label="二级" value="二级"> </el-option>
                <el-option label="三级" value="三级"> </el-option>
                <el-option label="四级" value="四级"> </el-option>
                <el-option label="五级" value="五级"> </el-option>
                <el-option label="六级" value="六级"> </el-option>
                <el-option label="七级" value="七级"> </el-option>
                <el-option label="八级" value="八级"> </el-option>
                <el-option label="九级" value="九级"> </el-option>
                <el-option label="十级" value="十级"></el-option>
              </el-select>

            </el-form-item>
            <el-form-item label="残疾补贴" prop="specialIdentity.isCanJi" v-if="addUserForm.specialIdentity.isCanJi">
              <el-input  v-model="addUserForm.specialIdentity.canJiMoney"></el-input>
            </el-form-item>
            <el-form-item label="是否党员" prop="specialIdentity.isDangYuan">
              <el-switch
                  v-model="addUserForm.specialIdentity.isDangYuan"
                  active-color="#13ce66"
                  inactive-color="#ff4949">
              </el-switch>
            </el-form-item>
            <el-form-item label="是否退伍军人" prop="specialIdentity.isTuiWuJunRen">
              <el-switch
                  v-model="addUserForm.specialIdentity.isTuiWuJunRen"
                  active-color="#13ce66"
                  inactive-color="#ff4949">
              </el-switch>
            </el-form-item>

            <el-divider></el-divider>

            <h4>工作情况信息</h4>
            <el-form-item label="工作类型" prop="nation">
              <el-select
                  v-model="addUserForm.workCircumstances.workType"
                  filterable
                  allow-create
                  default-first-option
                  placeholder="请选择或输入工作类型">
                <el-option
                    v-for="item in workType"
                    :key="item.id"
                    :label="item.label"
                    :value="item.label">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="工作区域" prop="nation">
              <el-select
                  v-model="addUserForm.workCircumstances.workArea"
                  filterable
                  allow-create
                  default-first-option
                  placeholder="请选择或输入工作区域">
                <el-option
                    v-for="item in workArea"
                    :key="item.id"
                    :label="item.label"
                    :value="item.label">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="工作地点" prop="nation" >
              <el-input placeholder="请输入单位地址或学校名称"  v-model="addUserForm.workCircumstances.workAddr"></el-input>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="submitForm('addUserForm')">立即创建</el-button>
              <el-button @click="resetForm('addUserForm')">重置</el-button>
            </el-form-item>


          </el-form>
        </div>

      </div>


    </div>
  </div>
</template>

<script>
import instance from "@/request/request.js";

export default {
  data() {
    return {
      allLoading: true,
      search: "",
      defaultProps: {
        children: "children",
        label: "label",
        value: "id",
      },
      deptData: [],
      tableData: [],
      ids: [],
      addUserPanel: true,
      addUserForm: {
        username: "",
        realName: "",
        phone: "",
        gender: true,
        addr: "",
        isHost: false,
        relation: this.isHost ? "户主" : "",
        dept: [],
        idCardNum:'',
        nation:'',
        jvZhuQingKuang:'',
        specialIdentity:{
          isDiBao:false,
          isWuBao:false,
          isCanJi:false,
          isDangYuan:false,
          isTuiWuJunRen:false,
          diBaoMoney:0.00,
          wuBaoMoney:0.00,
          canJiLevel:"一级",
          canJiMoney:0.00,
        },
        workCircumstances:{
          workType:'',
          workArea:'',
          workAddr:''
        }
      },
      rules: {
        username: [
          {required: true, message: "请输入账号", trigger: "blur"},
          {
            min: 5,
            max: 20,
            message: "长度在 5 到 20 个字符",
            trigger: "blur",
          },
        ],

        realName: [
          {required: true, message: "请输入姓名", trigger: "blur"},
          {
            min: 2,
            max: 10,
            message: "长度在 2 到 10 个字符",
            trigger: "blur",
          },
        ],
        dept: [{required: true, message: "请选择部门", trigger: "change"}],
        phone: [
          {required: true, message: "请输入手机", trigger: "blur"},
          {
            pattern: /^1[34578]\d{9}$/,
            message: "目前只支持中国大陆的手机号码",
          },
        ],
        addr: [
          {required: true, message: "请输入住址", trigger: "blur"},
          {
            min: 2,
            max: 30,
            message: "长度在 2 到 30 个字符",
            trigger: "blur",
          },
        ],
        relation: [{required: true, message: "请输入关系", trigger: "blur"}],
      },
      deptRule: {
        deptName: [
          {required: true, message: "请输入部门名称", trigger: "blur"},
          {
            min: 2,
            max: 20,
            message: "长度在 2 到 20 个字符",
            trigger: "blur",
          },
        ],
        townshipOrder: [
          {required: true, message: "请输入部门名称", trigger: "blur"},
          {
            min: 1,
            max: 30,
            message: "长度在 1 到 30 个字符",
            trigger: "blur",
          },
        ],
        'villageInfoSub.villageOrder': [
          {required: true, message: "请输入部门名称", trigger: "blur"},
          {
            min: 1,
            max: 30,
            message: "长度在 1 到 30 个字符",
            trigger: "blur",
          },
        ],

        'householdInfoSub.householdOrder': [
          {required: true, message: "请输入部门名称", trigger: "blur"},
          {
            min: 1,
            max: 30,
            message: "长度在 1 到 30 个字符",
            trigger: "blur",
          },
        ],
        'householdInfoSub.householdAddr': [
          {required: true, message: "请输入部门名称", trigger: "blur"},
          {
            min: 1,
            max: 30,
            message: "长度在 1 到 30 个字符",
            trigger: "blur",
          },
        ],

        'societyInfoSub.societyOrder': [
          {required: true, message: "请输入部门名称", trigger: "blur"},
          {
            min: 1,
            max: 30,
            message: "长度在 1 到 30 个字符",
            trigger: "blur",
          },
        ],

        societyOrder: [
          {required: true, message: "请输入部门名称", trigger: "blur"},
          {
            min: 1,
            max: 30,
            message: "长度在 1 到 30 个字符",
            trigger: "blur",
          },
        ],
        householdOrder: [
          {required: true, message: "请输入部门名称", trigger: "blur"},
          {
            min: 1,
            max: 30,
            message: "长度在 1 到 30 个字符",
            trigger: "blur",
          },
        ],
        householdAddr: [
          {required: true, message: "请输入部门名称", trigger: "blur"},
          {
            min: 1,
            max: 30,
            message: "长度在 1 到 30 个字符",
            trigger: "blur",
          },
        ],
        takeInSource: [
          {required: true, message: "请选择或输入部门名称", trigger: "blur"},
        ],
      },
      dialogFormVisible: false,
      dialogUpdateVisible: false,
      dialogSetPrincipalVisible: false,
      addVillageForm: {
        deptName: "",
        deptParentId: 0,
        villageOrder: '',
        description: '',
        type: 'village'
      },
      addSocietyForm: {
        deptName: "",
        deptParentId: 0,
        societyOrder: '',
        description: '',
        type: 'society'
      },
      addHouseholdForm: {
        deptName: "",
        deptParentId: 0,
        householdOrder: '',
        householdAddr: '',
        takeInSource: '',
        diBao: false,
        liDangJianKa: false,
        wuBao: false,
        tuoPinBuWenDing: false,
        tuoPinBuWenDingType: '',
        type: 'household'
      },
      takeInSourceOptions: [],
      tuoPinBuWenDingOptions: [],
      updateTownshipForm: {
        deptId: 0,
        deptName: '',
        townshipInfoSub: {
          id: 0,
          description: '',
          deptId: 0
        },
        type: 'township'
      },
      updateVillageForm: {
        deptId: 0,
        deptName: '',
        villageInfoSub: {
          id: 0,
          description: '',
          villageOrder: '',
          deptId: 0
        },
        type: 'village'
      },
      updateSocietyForm: {
        deptId: 0,
        deptName: '',
        societyInfoSub: {
          id: 0,
          description: '',
          societyOrder: '',
          deptId: 0
        },
        type: 'society'
      },
      updateHouseholdForm: {
        deptId: 0,
        deptName: '',
        householdInfoSub: {
          id: 0,
          deptId: 0,
          householdOrder: '',
          householdAddr: '',
          takeInSource: '',
          diBao: false,
          liDangJianKa: false,
          wuBao: false,
          tuoPinBuWenDing: false,
          tuoPinBuWenDingType: '',
        },
        type: 'household'
      },
      setPrincipalForm: {
        deptId: 0,
        userIds: []
      },
      options: [],
      loading: false,
      selectNames: [],
      selectedNames: [],
      currentNode: {
        id: null,
        label: null,
        level: null
      },
      townshipInfo: {},
      villageInfo: {},
      societyInfo: {},
      householdInfo: {},
      addDeptType: '',
      showDeptInfo: false,
      updateDeptType: '',
      nations:[],
      workArea:[],
      workType:[]

    };
  },
  watch: {
    "addUserForm.isHost": {
      handler(newName, oldName) {
        if (newName) {
          this.addUserForm.relation = "户主";
        }
        if (oldName) {
          this.addUserForm.relation = "";
        }
      },
      deep: true,
    },
    "addHouseholdForm.tuoPinBuWenDing": {
      handler(newName) {
        if (!newName) {
          this.addHouseholdForm.tuoPinBuWenDingType = "";
        }

      },
      deep: true,
    },
    "updateHouseholdForm.householdInfo.tuoPinBuWenDing": {
      handler(newName) {
        if (!newName) {
          this.updateHouseholdForm.householdInfo.tuoPinBuWenDingType = "";
        }

      },
      deep: true,
      // immediate: true,
    }
  },
  methods: {
    handleEdit() {
    },
    handleDelete() {
    },
    handleNodeClick(node) {
      this.showDeptInfo = false
      this.$set(this.currentNode, "id", node.id);
      this.$set(this.currentNode, "label", node.label);
      this.$set(this.currentNode, "level", node.deptLevel);
      this.getCurrentDeptInfo(node)
      this.ids = [];
      this.ids.push(node.id);
      this.getUserByDeptId();
    },
    //获取当前组织信息
    getCurrentDeptInfo(node) {
      switch (node.deptLevel) {
        case 0:
          this.getTownShipInfo(node.id)
          break;
        case 1:
          this.getVillageInfo(node.id)
          break;
        case 2:
          this.getSocietyInfo(node.id)
          break;
        case 3:
          this.getHouseholdInfo(node.id)
          break;
      }
    },
    //获取民族信息
    getNations(){
      instance.get("/getNations").then(
                res=>{
                  if (res.data.code == 200){
                    this.nations = res.data.data;
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
    //获取工作类型
    getWorkType(){
      instance.get("/getWorkTypes").then(
                res=>{
                  if (res.data.code == 200){
                    this.workType = res.data.data
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

    //获取工作区域
    getWorkArea(){
      instance.get("/getWorkAreas").then(
                res=>{
                  if (res.data.code == 200){
                    this.workArea = res.data.data
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

    //获取初始组织信息
    getInitInfo(){
      instance.get("/dept/getTownshipInfo/999999999").then(
                res=>{
                  if (res.data.code == 200){
                    this.townshipInfo = res.data.data
                    this.showDeptInfo = true
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

    getTownShipInfo(id) {
      instance.get("/dept/getTownshipInfo/" + id).then(
          res => {
            if (res.data.code == 200) {
              this.townshipInfo = res.data.data
              this.showDeptInfo = true
              let _info = JSON.stringify(this.townshipInfo);
              this.updateTownshipForm.townshipInfoSub = JSON.parse(_info);
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
    getVillageInfo(id) {
      instance.get("/dept/getVillageInfo/" + id).then(
          res => {
            if (res.data.code == 200) {
              this.villageInfo = res.data.data;
              this.showDeptInfo = true
              let _info = JSON.stringify(this.villageInfo);
              this.updateVillageForm.villageInfoSub = JSON.parse(_info)
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
    getSocietyInfo(id) {
      instance.get("/dept/getSocietyInfo/" + id).then(
          res => {
            if (res.data.code == 200) {
              this.societyInfo = res.data.data;
              this.showDeptInfo = true
             let  _info = JSON.stringify(this.societyInfo);
              this.updateSocietyForm.societyInfoSub = JSON.parse(_info)
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
    getHouseholdInfo(id) {
      instance.get("/dept/getHouseholdInfo/" + id).then(
          res => {
            if (res.data.code == 200) {
              this.householdInfo = res.data.data;
              this.showDeptInfo = true
              let _info = JSON.stringify(this.householdInfo)
              this.updateHouseholdForm.householdInfoSub = JSON.parse(_info)

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

    getTakeInSourceOptions() {
      instance.get("/getTakeInSourceTypes").then(
          res => {
            if (res.data.code == 200) {
              this.takeInSourceOptions = res.data.data
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
    getTuoPinBuWenDingOptions() {
      instance.get("/getTuoPinBuWenDingTypes").then(
          res => {
            if (res.data.code == 200) {
              this.tuoPinBuWenDingOptions = res.data.data
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

    //添加用户
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          instance
              .post("user/addUser", this.addUserForm)
              .then((res) => {
                if (res.data.code == 200) {
                  this.$message.success("添加成功");
                  this.addUserPanel = !this.addUserPanel;
                  this.getUserByDeptId();
                }
              })
              .catch((err) => {
                console.log(err);
              });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    getUserByDeptId() {
      instance.post("/user/getUserByDeptId", this.ids).then((res) => {
        if (res.data.data) this.tableData = res.data.data;
      });
    },
    //添加部门对话框
    append(data) {
      if (data.data.deptLevel == 3) {
        this.$message.warning("无法添加更下级组织")
      } else {
        if (data.data.deptLevel == 0) {
          this.addVillageForm.deptParentId = data.data.id;
          this.addDeptType = 'village'
        } else if (data.data.deptLevel == 1) {
          this.addSocietyForm.deptParentId = data.data.id;
          this.addDeptType = 'society'
        } else if (data.data.deptLevel == 2) {
          this.addHouseholdForm.deptParentId = data.data.id;
          this.addDeptType = 'household'
        }
        this.dialogFormVisible = true;
      }

    },
    //新增村
    submitAddTownship(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          instance
              .post("dept/addDept", this.addVillageForm)
              .catch((err) => {
                console.log(err);
              })
              .then((res) => {
                if (res.data.code == 200) {
                  this.dialogFormVisible = false;
                  this.$message({
                    message: "添加成功",
                    type: "success",
                  });
                  this.addVillageForm.deptParentId = 0;
                  this.addVillageForm.deptName = "";
                  this.addVillageForm.description = "";
                  this.getTree();

                } else {
                  this.$message.error(res.data.message);
                }
              });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //新增社
    submitAddSociety(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          instance
              .post("dept/addDept", this.addSocietyForm)
              .catch((err) => {
                console.log(err);
              })
              .then((res) => {
                if (res.data.code == 200) {
                  this.dialogFormVisible = false;
                  this.$message({
                    message: "添加成功",
                    type: "success",
                  });
                  this.addSocietyForm.deptParentId = 0;
                  this.addSocietyForm.deptName = "";
                  this.addSocietyForm.description = "";
                  this.getTree();

                } else {
                  this.$message.error(res.data.message);
                }
              });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //新增户
    submitAddHousehold(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          instance
              .post("dept/addDept", this.addHouseholdForm)
              .catch((err) => {
                console.log(err);
              })
              .then((res) => {
                if (res.data.code == 200) {
                  this.dialogFormVisible = false;
                  this.$message({
                    message: "添加成功",
                    type: "success",
                  });
                  this.addHouseholdForm = {
                    deptName: "",
                    deptParentId: 0,
                    householdOrder: '',
                    householdAddr: '',
                    takeInSource: '',
                    diBao: false,
                    liDangJianKa: false,
                    wuBao: false,
                    tuoPinBuWenDing: false,
                    tuoPinBuWenDingType: '',
                    type: 'household'
                  }

                  this.getTree();

                } else {
                  this.$message.error(res.data.message);
                }
              });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },

    //修改部门
    submitUpdateDept(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          switch (this.updateDeptType) {
            case "township":
              instance.post("/dept/updateNameAndInfo", this.updateTownshipForm).then(
                  res => {
                    if (res.data.code == 200) {
                      this.$message.success("修改成功")
                      this.dialogUpdateVisible = false;
                      this.getTree()
                      this.getTownShipInfo(this.updateTownshipForm.deptId)
                    } else {
                      this.$message.error(res.data.message)
                    }
                  }
              ).catch(
                  err => {
                    console.log(err);
                  }
              )
              break;
            case "village":
              instance.post("/dept/updateNameAndInfo", this.updateVillageForm).then(
                  res => {
                    if (res.data.code == 200) {
                      this.$message.success("修改成功")
                      this.dialogUpdateVisible = false;
                      this.getTree()
                      this.getVillageInfo(this.updateVillageForm.deptId)
                    } else {
                      this.$message.error(res.data.message)
                    }
                  }
              ).catch(
                  err => {
                    console.log(err);
                  }
              )
              break;
            case "society":
              instance.post("/dept/updateNameAndInfo", this.updateSocietyForm).then(
                  res => {
                    if (res.data.code == 200) {
                      this.$message.success("修改成功")
                      this.dialogUpdateVisible = false;
                      this.getTree()
                      this.getSocietyInfo(this.updateSocietyForm.deptId)
                    } else {
                      this.$message.error(res.data.message)
                    }
                  }
              ).catch(
                  err => {
                    console.log(err);
                  }
              )
              break;
            case "household":
              instance.post("/dept/updateNameAndInfo", this.updateHouseholdForm).then(
                  res => {
                    if (res.data.code == 200) {
                      this.$message.success("修改成功")
                      this.dialogUpdateVisible = false;
                      this.getTree()
                      this.getHouseholdInfo(this.updateHouseholdForm.deptId)
                    } else {
                      this.$message.error(res.data.message)
                    }
                  }
              ).catch(
                  err => {
                    console.log(err);
                  }
              )
              break;
          }


        } else {
          console.log("error submit!!");
          return false;
        }

      })
    },
    //删除部门
    remove(node) {
      instance
          .get("/dept/deleteDept/" + node.data.id)
          .then((res) => {
            if (res.data.code == 200) {
              this.$message({
                message: "删除成功",
                type: "success",
              });
              this.getTree();
            } else {
              this.$message.error(res.data.message);
            }
          })
          .catch((err) => {
            console.log(err);
          });
    },
    //获取部门树
    getTree() {
      instance
          .get("/dept/getTree")
          .then((res) => {
            this.deptData = res.data.data;
            console.log(this.deptData)
            this.currentNode.level = this.deptData[0].deptLevel
            this.currentNode.label = this.deptData[0].label
            this.currentNode.id = this.deptData[0].id
            this.allLoading = false
          })
          .catch((err) => {
            console.log(err);
          });
    },

    handleDrop(draggingNode, dropNode, dropType) {
      let deptId = draggingNode.data.id;
      let newParentId = dropNode.data.id;
      if (dropType == "inner") {
        instance
            .get("/dept/updateDept/" + deptId + "/" + newParentId + "/" + 1)
            .catch((err) => {
              console.log(err);
            })
            .then((res) => {
              if (res.data.code == 200) {
                this.getTree();
              }
            });
      } else if (
          draggingNode.data.deptLevel == 2 &&
          dropNode.data.deptLevel == 2
      ) {
        instance
            .get("/dept/updateDept/" + deptId + "/" + newParentId + "/" + 2)
            .catch((err) => {
              console.log(err);
            })
            .then((res) => {
              if (res.data.code == 200) {
                this.getTree();
              }
            });
      } else if (
          draggingNode.data.deptLevel == 3 &&
          dropNode.data.deptLevel == 3
      ) {
        instance
            .get("/dept/updateDept/" + deptId + "/" + newParentId + "/" + 2)
            .catch((err) => {
              console.log(err);
            })
            .then((res) => {
              if (res.data.code == 200) {
                this.getTree();
              }
            });
      }
    },
    allowDrop(draggingNode, dropNode, type) {
      if (draggingNode.data.deptLevel == 2) {
        if (dropNode.data.deptLevel == 1) {
          return type == "inner";
        }
        if (dropNode.data.deptLevel == 2) {
          return type === "prev" || type === "next";
        }
        return false;
      }

      if (draggingNode.data.deptLevel == 1) {
        if (dropNode.data.deptLevel == 1) {
          return type == "prev" || type == "next";
        }
      }

      if (draggingNode.data.deptLevel == 3) {
        if (dropNode.data.deptLevel == 2) {
          return type == "inner";
        }
        if (dropNode.data.deptLevel == 3) {
          return type == "prev" || type == "next";
        }

        return false;
      }

      return false;
    },
    allowDrag(draggingNode) {
      if (draggingNode.data.deptLevel == 0) {
        return false;
      } else {
        return true;
      }
    },
    //设置部门负责人对话框
    setPrincipal(data) {
      this.dialogSetPrincipalVisible = true
      this.setPrincipalForm.deptId = data.id
      this.getPrincipal()
      this.setPrincipalForm.userIds = []
      this.options = []
    },
    //获取部门负责人
    getPrincipal() {
      instance.post("/dept/getPrincipal/" + this.setPrincipalForm.deptId).then(
          res => {
            if (res.data.code == 200) {
              this.selectedNames = res.data.data
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
    //移除部门负责人
    closeTag(id) {
      instance.post("/dept/removePrincipal/" + this.setPrincipalForm.deptId + "/" + id).then(
          res => {
            if (res.data.code == 200) {
              this.$message.success("移除成功")
              this.getPrincipal()
              this.options = []
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
    //修改部门对话框
    updateName(data) {
      switch (data.deptLevel) {

        case 0:
          this.updateTownshipForm.deptId = data.id;
          this.updateTownshipForm.deptName = data.label;
          this.getTownShipInfo(data.id);

          this.updateDeptType = 'township'
          break;
        case 1:
          this.updateVillageForm.deptId = data.id;
          this.updateVillageForm.deptName = data.label;
          this.getVillageInfo(data.id);
          this.updateDeptType = 'village'
          break;
        case 2:
          this.updateSocietyForm.deptId = data.id;
          this.updateSocietyForm.deptName = data.label;
          this.getSocietyInfo(data.id);
          this.updateDeptType = 'society'
          break;
        case 3:
          this.updateHouseholdForm.deptId = data.id;
          this.updateHouseholdForm.deptName = data.label;
          this.getHouseholdInfo(data.id);
          this.updateDeptType = 'household'
          break;
      }
      this.dialogUpdateVisible = true

    },
    //搜索用户
    remoteMethod(key) {
      this.loading = true
      instance.get("/user/search/" + this.setPrincipalForm.deptId + '/' + key).then(
          res => {
            if (res.data.code == 200) {
              this.options = res.data.data

            } else {
              this.$message.error(res.data.message)
            }
            this.loading = false
          }
      ).catch(
          err => {
            console.log(err);
            this.loading = false
          }
      )
    },
    //部门树节点发生变化
    change(val) {
      instance.post("/user/getNameById", {userIds: val}).then(
          res => {
            if (res.data.code == 200) {
              this.selectNames = res.data.data
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
    //设置部门负责人
    submitPrincipalDept() {
      instance.post("/dept/setPrincipal", this.setPrincipalForm).then(
          res => {
            if (res.data.code == 200) {
              this.getPrincipal();
              this.dialogSetPrincipalVisible = false
              this.selectNames = []
              this.$message.success("设置成功")
            } else {
              this.$message.error(res.data.message)
            }
          }
      ).catch(
          err => {
            console.log(err);
          }
      )
    }
  },
  created() {
    this.getTree();
    this.getUserByDeptId();
    this.getTakeInSourceOptions()
    this.getTuoPinBuWenDingOptions()
    this.getInitInfo()
    this.getNations()
    this.getWorkArea()
    this.getWorkType()
  },
};
</script>

<style scoped lang="less">
.user-main {
  display: flex;
  //border: aliceblue 2px solid;
  box-sizing: border-box;
  border-radius: 10px;
}

.user-main-left {
  flex: 1;
  margin-left: 5px;
  //border-right: aliceblue 1px solid;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  padding: 5px;
  margin-top: 10px;
}

.user-main-right {
  flex: 5;
  margin-left: 5px;
  border-radius: 10px;
  padding-bottom: 10px;
  display: flex;
  flex-direction: column;

}

.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}

.user-tool {
  flex: 2;
  display: flex;
  align-items: center;
  margin-left: 5%;
}

.user-content {
  flex: 18;
}

.add-user {
  width: 40%;
  margin-top: 10px;
  margin-left: 20px;

}

.set-principal-dialog {
  display: flex;
  height: 300px;
}

.set-principal-dialog-left {
  flex: 5;
  margin-right: 20px;
  border-right: gray solid 1px;
}

.set-principal-dialog-right {
  flex: 5;
  display: flex;
  flex-direction: column;
}

.set-principal-dialog-right-bottom {
  flex: 5;
}

.set-principal-dialog-right-top {
  flex: 5;
}

.dialog-footer {
  display: flex;
  justify-content: center;
}
</style>
