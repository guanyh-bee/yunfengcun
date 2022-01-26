<template>
  <div class="login">
    <div class="login-box">
      <h2>云峰村信息采集程序</h2>
      <div class="login-form">
        <el-form
          :model="loginForm"
          :rules="rules"
          ref="loginForm"
          label-width="80px"
          class="demo-ruleForm"
        >
          <el-form-item label="用户名:" prop="username">
            <el-input v-model="loginForm.username"></el-input>
          </el-form-item>
          <el-form-item label="密码:" prop="password">
            <el-input v-model="loginForm.password" show-password></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('loginForm')"
              >登陆</el-button
            >
            <el-button @click="resetForm('loginForm')">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import instance from "@/request/request";

export default {
  data() {
    return {
      loginForm: {
        username: "",
        password: "",
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 2,
            max: 10,
            message: "长度在 2 到 10 个字符",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 20,
            message: "长度在 6 到 20 个字符",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          instance
            .post("/login", this.$qs.stringify(this.loginForm))
            .then((res) => {
              const token = res.headers.token;
              if (token && res.data.code == 200) {
                this.$message({
                  message: "登陆成功",
                  type: "success",
                });
                window.localStorage.setItem("token", token);
                let path = localStorage.getItem("toPath");
                if (path) {
                  this.$router.push(path);
                } else {
                  this.$router.push("/main");
                }
              } else {
                this.$message.error(res.data.message);
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
  },
};
</script>

<style scoped lang="less">
.login-box {
  width: 400px;
  height: 300px;
  background-color: white;
  opacity: 0.8;
  border-radius: 8px;
}
.login {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;

  background-image: url("../assets/image/img.png");
  background-size: cover;
}
h2 {
  text-align: center;
}
.login-form {
  display: flex;
  align-items: center;
  height: 70%;
  justify-content: space-around;
  margin-left: -20px;
}
.app {
}
</style>
