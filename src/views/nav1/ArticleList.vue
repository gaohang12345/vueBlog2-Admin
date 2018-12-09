<template>
  <section>
    <!--工具条-->
    <el-col :span="24"
            class="toolbar"
            style="padding-bottom: 0px;">
      <el-form :inline="true"
               :model="filters">
        <el-form-item>
          <el-input v-model="filters.name"
                    placeholder="文章名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary"
                     v-on:click="getUsers">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary"
                     @click="handleAdd">新增</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <!--列表-->
    <el-table :data="users"
              highlight-current-row
              v-loading="listLoading"
              @selection-change="selsChange"
              style="width: 100%;">
      <el-table-column type="selection"
                       width="55">
      </el-table-column>
      <el-table-column type="index"
                       width="60">
      </el-table-column>
      <el-table-column prop="name"
                       label="文章标题"
                       width="120"
                       sortable>
      </el-table-column>
      <el-table-column prop="age"
                       label="文章描述"
                       width="120"
                       sortable>
      </el-table-column>
      <el-table-column prop="sex"
                       label="文章类型"
                       width="120"
                       :formatter="formatSex"
                       sortable>
      </el-table-column>
      <el-table-column prop="sex"
                       label="文章状态"
                       width="120"
                       :formatter="formatSex"
                       sortable>
      </el-table-column>
      <el-table-column prop="birth"
                       label="发布日期"
                       width="120"
                       sortable>
      </el-table-column>
      <el-table-column prop="addr"
                       label="缩略图"
                       min-width="180"
                       sortable>
      </el-table-column>
      <el-table-column label="操作"
                       width="150">
        <template slot-scope="scope">
          <el-button size="small"
                     @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button type="danger"
                     size="small"
                     @click="handleDel(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--工具条-->
    <el-col :span="24"
            class="toolbar">
      <el-button type="danger"
                 @click="batchRemove"
                 :disabled="this.sels.length===0">批量删除</el-button>
      <el-pagination layout="prev, pager, next"
                     @current-change="handleCurrentChange"
                     :page-size="20"
                     :total="total"
                     style="float:right;">
      </el-pagination>
    </el-col>

    <!--编辑界面-->
    <el-dialog title="编辑"
               v-model="editFormVisible"
               :close-on-click-modal="false"
               width="90%">
      <el-form :model="editForm"
               label-width="80px"
               :rules="editFormRules"
               ref="editForm">
        <el-form-item label="文章标题"
                      prop="name">
          <el-input v-model="editForm.name"
                    auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="文章描述">
          <el-input-number v-model="editForm.age"
                           :min="0"
                           :max="200"></el-input-number>
        </el-form-item>
        <el-form-item label="文章类型">
          <el-radio-group v-model="editForm.sex">
            <el-radio class="radio"
                      :label="1">男</el-radio>
            <el-radio class="radio"
                      :label="0">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="缩略图">
          <el-date-picker type="date"
                          placeholder="选择日期"
                          v-model="editForm.birth"></el-date-picker>
        </el-form-item>
        <div class="edit_container">
          <!--  新增时输入 -->
          <quill-editor v-model="editForm.content"
                        ref="myQuillEditor"
                        :options="editForm.editorOption"
                        @blur="onEditorBlur($event)"
                        @focus="onEditorFocus($event)"
                        @change="onEditorChange($event)">
          </quill-editor>
          <!-- 从数据库读取展示 -->
          <div v-html="editForm.str"
               class="ql-editor">
            {{editForm.str}}
          </div>
        </div>
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click.native="editFormVisible = false">取消</el-button>
        <el-button type="primary"
                   @click.native="editSubmit"
                   :loading="editLoading">提交</el-button>
      </div>
    </el-dialog>

    <!--新增界面-->
    <el-dialog title="新增"
               v-model="addFormVisible"
               :close-on-click-modal="false"
               width="90%">
      <el-form :model="addForm"
               label-width="80px"
               :rules="addFormRules"
               ref="addForm">
        <el-form-item label="文章标题"
                      prop="name">
          <el-input v-model="addForm.name"
                    auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="文章描述">
          <el-input-number v-model="addForm.age"
                           :min="0"
                           :max="200"></el-input-number>
        </el-form-item>
        <el-form-item label="文章类型">
          <el-radio-group v-model="addForm.sex">
            <el-radio class="radio"
                      :label="1">男</el-radio>
            <el-radio class="radio"
                      :label="0">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="缩略图">
          <el-date-picker type="date"
                          placeholder="选择日期"
                          v-model="addForm.birth"></el-date-picker>
        </el-form-item>
        <div class="edit_container">
          <!--  新增时输入 -->
          <quill-editor v-model="addForm.content"
                        ref="myQuillEditor"
                        :options="addForm.editorOption"
                        @blur="onEditorBlur($event)"
                        @focus="onEditorFocus($event)"
                        @change="onEditorChange($event)">
          </quill-editor>
          <!-- 从数据库读取展示 -->
          <div v-html="addForm.str"
               class="ql-editor">
            {{addForm.str}}
          </div>
        </div>
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click.native="addFormVisible = false">取消</el-button>
        <el-button type="primary"
                   @click.native="addSubmit"
                   :loading="addLoading">提交</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
import util from '../../common/js/util'
//import NProgress from 'nprogress'
import { getUserListPage, removeUser, batchRemoveUser, editUser, addUser } from '../../api/api';

// 引入vue编辑器
import { quillEditor } from "vue-quill-editor";
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css';

export default {
  components: {
    quillEditor
  },
  data () {
    return {
      filters: {
        name: ''
      },
      users: [],
      total: 0,
      page: 1,
      listLoading: false,
      sels: [],//列表选中列

      editFormVisible: false,//编辑界面是否显示
      editLoading: false,
      editFormRules: {
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ]
      },
      //编辑界面数据
      editForm: {
        id: 0,
        name: '',
        sex: -1,
        age: 0,
        birth: '',
        addr: '',
        content: ``,
        str: '',
        editorOption: {}
      },

      addFormVisible: false,//新增界面是否显示
      addLoading: false,
      addFormRules: {
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ]
      },
      //新增界面数据
      addForm: {
        name: '',
        sex: -1,
        age: 0,
        birth: '',
        addr: '',
        content: ``,
        str: '',
        editorOption: {}
      }

    }
  },
  methods: {
    //性别显示转换
    formatSex: function (row, column) {
      return row.sex == 1 ? '男' : row.sex == 0 ? '女' : '未知';
    },
    handleCurrentChange (val) {
      this.page = val;
      this.getUsers();
    },
    //获取用户列表
    getUsers () {
      let para = {
        page: this.page,
        name: this.filters.name
      };
      this.listLoading = true;
      //NProgress.start();
      getUserListPage(para).then((res) => {
        this.total = res.data.total;
        this.users = res.data.users;
        this.listLoading = false;
        //NProgress.done();
      });
    },
    //删除
    handleDel: function (index, row) {
      this.$confirm('确认删除该记录吗?', '提示', {
        type: 'warning'
      }).then(() => {
        this.listLoading = true;
        //NProgress.start();
        let para = { id: row.id };
        removeUser(para).then((res) => {
          this.listLoading = false;
          //NProgress.done();
          this.$message({
            message: '删除成功',
            type: 'success'
          });
          this.getUsers();
        });
      }).catch(() => {

      });
    },
    //显示编辑界面
    handleEdit: function (index, row) {
      this.editFormVisible = true;
      this.editForm = Object.assign({}, row);
    },
    //显示新增界面
    handleAdd: function () {
      this.addFormVisible = true;
      this.addForm = {
        name: '',
        sex: -1,
        age: 0,
        birth: '',
        addr: ''
      };
    },
    //编辑
    editSubmit: function () {
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          this.$confirm('确认提交吗？', '提示', {}).then(() => {
            this.editLoading = true;
            //NProgress.start();
            let para = Object.assign({}, this.editForm);
            para.birth = (!para.birth || para.birth == '') ? '' : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd');
            editUser(para).then((res) => {
              this.editLoading = false;
              //NProgress.done();
              this.$message({
                message: '提交成功',
                type: 'success'
              });
              this.$refs['editForm'].resetFields();
              this.editFormVisible = false;
              this.getUsers();
            });
          });
        }
      });
    },
    //新增
    addSubmit: function () {
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          this.$confirm('确认提交吗？', '提示', {}).then(() => {
            this.addLoading = true;
            //NProgress.start();
            let para = Object.assign({}, this.addForm);
            para.birth = (!para.birth || para.birth == '') ? '' : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd');
            addUser(para).then((res) => {
              this.addLoading = false;
              //NProgress.done();
              this.$message({
                message: '提交成功',
                type: 'success'
              });
              this.$refs['addForm'].resetFields();
              this.addFormVisible = false;
              this.getUsers();
            });
          });
        }
      });
    },
    selsChange: function (sels) {
      this.sels = sels;
    },
    //批量删除
    batchRemove: function () {
      var ids = this.sels.map(item => item.id).toString();
      this.$confirm('确认删除选中记录吗？', '提示', {
        type: 'warning'
      }).then(() => {
        this.listLoading = true;
        //NProgress.start();
        let para = { ids: ids };
        batchRemoveUser(para).then((res) => {
          this.listLoading = false;
          //NProgress.done();
          this.$message({
            message: '删除成功',
            type: 'success'
          });
          this.getUsers();
        });
      }).catch(() => {

      });
    },
    onEditorReady (editor) {
      // 准备编辑器

    },
    onEditorBlur () {
      // 失去焦点事件
    },
    onEditorFocus () {
      // 获得焦点事件
    },
    onEditorChange () {
      // 内容改变事件
    },
    escapeStringHTML (str) {
      // 转码
      str = str.replace(/&lt;/g, '<');
      str = str.replace(/&gt;/g, '>');
      return str;
    }
  },
  computed: {
    editor () {
      return this.$refs.myQuillEditor.quill;
    },
  },
  mounted () {
    this.getUsers();
  }
}

</script>

<style scoped>
</style>