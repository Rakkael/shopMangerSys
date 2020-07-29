<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home', name: '' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 修改用户对话框 -->
    <el-dialog
      title="修改用户"
      :visible.sync="editDiaglogVisiable"
      width="50%"
      @close="editDiaglogClosed"
    >
      <el-form
        ref="editFormRef"
        :model="editForm"
        :rules="editFormRules"
        label-width="70px"
        label-position="left"
      >
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 按钮区域 -->
      <span slot="footer">
        <el-button @click=" editDiaglogVisiable = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo()">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 添加用户对话框 -->
    <el-dialog title="添加用户" width="50%" :visible.sync="dialogVisiable" @close="clearDialog">
      <!-- 表单区域 -->
      <el-form ref="addFormRef" :model="userData" label-width="70px" label-position="left">
        <!-- 表单姓名 -->
        <!-- 这个prop是el-form绑定的model.username的字段，不能乱填 -->
        <el-form-item
          prop="username"
          label="姓名"
          :rules="[
              { required: true, message:'姓名不能为空' },
              { type: 'string', message:'姓名只能是字符'}
            ]"
        >
          <el-input v-model="userData.username"></el-input>
        </el-form-item>
        <!-- 表单密码 -->
        <el-form-item
          label="密码"
          prop="password"
          :rules="[
              { required: true, message:'密码不能为空' }
            ]"
        >
          <el-input type="password" v-model="userData.password"></el-input>
        </el-form-item>
        <!-- 表单邮箱 -->
        <el-form-item label="邮箱" prop="email" :rules="emailRules">
          <el-input v-model="userData.email"></el-input>
        </el-form-item>
        <!-- 表单手机 -->
        <el-form-item label="手机" prop="mobile" :rules="phoneRules">
          <el-input type="phone" v-model.number="userData.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 按钮区域 -->
      <span slot="footer">
        <el-button @click="dialogVisiable = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <el-card>
      <!-- card body -->
      <!-- 卡片头部 -->
      <el-row :gutter="50">
        <el-col :span="12">
          <el-input
            placeholder="请输入内容"
            v-model.trim="queryData.query"
            :clearable="true"
            @clear="getUserList()"
            @keyup.enter.native="serachUser()"
          >
            <el-button slot="append" @click="serachUser()">搜索</el-button>
          </el-input>
        </el-col>
        <el-button type="primary" @click="dialogVisiable = true">添加用户</el-button>
      </el-row>

      <el-table :data="userList" border :stripe="true">
        <el-table-column label="#" type="index" width="50"></el-table-column>
        <el-table-column label="姓名" prop="username" width="100"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态">
          <template v-slot="scope">
            <el-switch v-model="scope.row.mg_state" @change="userStateChanged(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="data">
            <el-tooltip
              effect="dark"
              content="编辑"
              placement="top"
              :enterable="false"
              :open-delay="200"
            >
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="showEditDialog(data.row.id)"
              ></el-button>
            </el-tooltip>
            <el-tooltip
              content="删除"
              placement="top"
              effect="dark"
              :enterable="false"
              :open-delay="200"
            >
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="removeUserById(data.row.id)"
              ></el-button>
            </el-tooltip>
            <el-tooltip
              content="设置"
              placement="top"
              effect="dark"
              :enterable="false"
              :open-delay="200"
            >
              <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pagenum"
        :page-sizes="[1, 5, 10]"
        :page-size="queryData.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalpage"
      ></el-pagination>
    </el-card>
  </div>
</template>


<script>
// 防抖函数 声明即执行
const myDelay = (() => {
  let timer = 0;
  return (callback, ms)=>{
    clearTimeout(timer);
    timer = setTimeout(callback, ms);
  }
})();
// 截流函数
const throttle = (()=>{
  let flag = true;
  return (callback, delay)=>{
    if(!flag){
      return;
    }else{
      flag = false;
      setTimeout(()=>{
      callback();

        flag = true;
      }, delay);
    }
  }
})();
export default {
    data(){
      // 检查邮箱规则
      var checkEmail = function checkEmail(rule,value,callback){
        const valEmail =  /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/ ;
        if(valEmail.test(value)){
          callback();
        }
        callback(new Error("email不符合规则。"));
      };
      // 检查手机号规则
      var checkPhone = (rule, value, callback) =>{
        const valPhone = /^1[0-9]{10}$/;
        if(valPhone.test(value)){
          return callback();
        } else {
          callback(new Error('phone不符合规则'));
        }
      };
      return {
        // get 请求的数据
        queryData: {
          // query 就是搜索内容
          query:'',
          pagenum: 1,
          pagesize: 5
        },
        userData: {
          username:'',
          password:'',
          mobile:'',
          email:''
        },
        userList: [],
        totalpage: 0,
        pagenum: 0,
        dialogVisiable: false,
        editDiaglogVisiable: false,
        emailRules: [
          { validator: checkEmail, trigger:'blur'}
        ],
        phoneRules: [
          { validator: checkPhone, trigger: 'blur'}
        ],
        editForm:{},
        editFormRules: {
          email: [
            {required: true, message: '邮箱不能为空', trigger: 'blur'},
            {validator: checkEmail, trigger: 'blur'}
          ],
          mobile: [
            {required: true, message: '电话不能为空', trigger: 'blur'},
            {validator: checkPhone, trigger: 'blur'}
          ]
        }

      }
    },
    computed: {
      checkIfChanged(){
        return this.queryData.query;
      }
    },
    watch: {
      checkIfChanged(){
        // setTimeout 第一个参数必须为一个函数，而不是调用函数
        // setTimeout(this.serachUser, 1000);
        throttle(this.serachUser, 1000);
      }
    },
    created() {
      this.getUserList();
    },
    methods:{
      async showEditDialog(id){ 
        const {data: res} = await this.$axios.get(`users/${id}`);
        if(res.meta.status !== 200){
          return this.$message.error('查询用户失败');
        }
        this.editForm = res.data;
        this.editDiaglogVisiable = true;
      },

      addUser(){
        this.$refs.addFormRef.validate((valid)=>{
          if(valid){
            this.$axios({
              method:'post',
              url: 'users',
              data: {
                username: this.userData.username,
                password: this.userData.password,
                email: this.userData.email,
                mobile: this.userData.mobile
              }
            })
            .then((res) => {
              if(res.data.meta.status == 201){
                this.$message({
                  message: '创建用户成功！',
                  type: 'success'
                });
                this.dialogVisiable = false;
                // 创建完毕 重置表单
                this.$refs.addFormRef.resetFields();
              }
            })
          }
        })
      },
      editDiaglogClosed(){
        this.$refs.editFormRef.resetFields();
        this.editForm = {};
      },

      clearDialog(){
        this.$refs.addFormRef.resetFields();
      },

      handleSizeChange(newSize){
        this.queryData.pagesize = newSize;
        this.getUserList();
      },
      handleCurrentChange(currentPage){
        this.queryData.pagenum = currentPage;
        this.getUserList();
      },
      // 修改用户信息
      editUserInfo(){
        this.$refs.editFormRef.validate(async valid => {
          if(!valid) return
          const {data: res} = await this.$axios.put(`users/${this.editForm.id}`, {email:this.editForm.email, mobile:this.editForm.mobile})
          if(res.meta.status !==200){
            return this.$message.error('修改用户失败');
          }
          this.editDiaglogVisiable = false;
          this.getUserList();
          this.$message.success('更新用户信息成功'); 
        })
      },

      userStateChanged(userInfo){
        console.log('newstate',userInfo);
        this.$axios.put(`users/${userInfo.id}/state/${userInfo.mg_state}`)
        .then(res => {

          if(res.data.meta.status == 200){            
            this.$message({
              message: '设置用户状态成功！',
              type: 'success',
              showClose: true,
            });
          }
        })
        .catch(err => {
          console.error(err); 
        })
      },
      serachUser(){
        this.getUserList();
      },
      async getUserList(){
        const {data: res} = await this.$axios.get('users', {params: this.queryData});
        // console.log('userlist',res.data);
        if(res.meta.status !== 200){
          return this.$message.error("用户列表请求失败！"); // element-ui中的全局组件
        } else {
          this.userList = res.data.users;
          this.totalpage = res.data.total;
          this.pagenum = res.data.pagenum;
        }
      },
      async removeUserById(id){
        console.log(id);
        const confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err=>{return err})
        if(confirmResult !== 'confirm'){
          this.$message.info('删除被撤消');
        } else {
          this.$message.success('删除成功');
          const {data: res} = await this.$axios.delete(`users/${id}`);
          if(res.meta.status !== 200){
            return this.$message.error('删除失败');
          } else {
            this.$message.success('删除成功');
            this.getUserList();
          }
        }

      },


      printToConsole(stuff){
        console.log(stuff);
      }
    }
}
</script>

<style scoped>
</style>