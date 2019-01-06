<template>
  <section>
    <!--工具条-->
    <el-col :span="24"
            class="toolbar"
            style="padding-bottom: 0px;">
      <el-form :inline="true"
               :model="filters">
        <el-form-item>
          <el-input v-model="filters.title"
                    placeholder="文章名称"></el-input>
        </el-form-item>
        <el-form-item style="padding-left: 5px;"
                      label="发布时间">
          <el-col :span="11">
            <el-date-picker type="date"
                            placeholder="选择开始时间"
                            v-model="filters.dateBegin"
                            style="width: 100%;"></el-date-picker>
          </el-col>
          <el-col :span="1">&nbsp;~</el-col>
          <el-col :span="11">
            <el-date-picker type="date"
                            placeholder="选择结束时间"
                            v-model="filters.dateEnd"
                            style="width: 100%;"></el-date-picker>
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-button type="primary"
                     v-on:click="getArticles">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary"
                     @click="handleAdd">新增</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <!--列表-->
    <el-table :data="articles"
              highlight-current-row
              v-loading="listLoading"
              @selection-change="selsChange"
              style="width: 100%;">
      <el-table-column type="selection"
                       width="55">
      </el-table-column>
      <el-table-column type="index"
                       width="55">
      </el-table-column>
      <el-table-column prop="title"
                       label="文章标题"
                       width="120"
                       sortable>
      </el-table-column>
      <el-table-column prop="article_desc"
                       label="文章描述"
                       width="120">
      </el-table-column>
      <el-table-column prop="article_type_title"
                       label="文章类型"
                       width="120"
                       sortable>
      </el-table-column>
      <el-table-column prop="status"
                       label="文章状态"
                       width="120"
                       :formatter="formatStatus"
                       sortable>
      </el-table-column>
      <el-table-column prop="publish_date"
                       label="发布日期"
                       width="120"
                       sortable>
      </el-table-column>
      <el-table-column prop="thumbnail"
                       label="缩略图"
                       width="120">
        <template slot-scope="scope">
          <img :src="scope.row.thumbnail"
               width="100px" />
        </template>
      </el-table-column>
      <el-table-column prop="text"
                       label="文章内容"
                       min-width="140">
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
                      prop="title">
          <el-input v-model="editForm.title"
                    auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="文章描述"
                      prop="article_desc">
          <el-input v-model="editForm.article_desc"
                    auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="缩略图"
                      prop="thumbnail">
          <el-input v-model="editForm.thumbnail"
                    auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="文章内容"
                      prop="html">
          <div class="edit_container">
            <!--  新增时输入 -->
            <quill-editor v-model="editForm.html"
                          ref="myQuillEditor"
                          :options="editForm.editorOption"
                          @blur="onEditorBlur($event)"
                          @focus="onEditorFocus($event)"
                          @change="onEditorChange($event)">
            </quill-editor>
            <!-- 从数据库读取展示 -->
            <div v-show="0"
                 v-html="editForm.text"
                 class="ql-editor">
              {{editForm.text}}
            </div>
          </div>
        </el-form-item>
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
                      prop="title">
          <el-input v-model="addForm.title"
                    auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="文章描述"
                      prop="article_desc">
          <el-input v-model="addForm.article_desc"
                    auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="缩略图"
                      prop="thumbnail">
          <el-input v-model="addForm.thumbnail"
                    auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item label="文章内容"
                      prop="html">
          <div class="edit_container">
            <!--  新增时输入 -->
            <quill-editor v-model="addForm.html"
                          prop="html"
                          ref="myQuillEditor"
                          :options="addForm.editorOption"
                          @blur="onEditorBlur($event)"
                          @focus="onEditorFocus($event)"
                          @change="onEditorChange($event)">
            </quill-editor>
            <!-- 从数据库读取展示 -->

            <div v-show="0"
                 v-html="addForm.text"
                 class="ql-editor">
              {{addForm.text}}
            </div>
          </div>
        </el-form-item>
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
// import NProgress from 'nprogress'
import { getArticleList, addArticle, modifyArticle, getArticleDetail, batchRemoveArticle, removeArticle } from '../../api/api';

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
        title: '',
        dateBegin: null,
        dateEnd: null
      },
      articles: [],
      total: 0,
      page: 1,
      listLoading: false,
      sels: [],//列表选中列

      editFormVisible: false,//编辑界面是否显示
      editLoading: false,
      editFormRules: {
        title: [
          { required: true, message: '请输入文章标题', trigger: 'blur' }
        ],
        article_desc: [
          { required: true, message: '请输入文章描述', trigger: 'blur' }
        ],
        thumbnail: [
          { required: true, message: '请输入文章缩略图地址', trigger: 'blur' }
        ],
        html: [
          { required: true, message: '请输入文章内容', trigger: 'blur' }
        ]
      },
      //编辑界面数据
      editForm: {
        id: 0,
        title: '',
        article_desc: '',
        html: '',
        text: '',
        editorOption: {}
      },

      addFormVisible: false,//新增界面是否显示
      addLoading: false,
      addFormRules: {
        title: [
          { required: true, message: '请输入文章标题', trigger: 'blur' },
          { min: 3, message: '长度至少 3 个字符', trigger: 'blur' }
        ],
        article_desc: [
          { required: true, message: '请输入文章标题', trigger: 'blur' },
          { max: 128, message: '长度最多 128 个字符', trigger: 'blur' }
        ],
        thumbnail: [
          { required: true, message: '请输入文章缩略图地址', trigger: 'blur' }
        ],
        html: [
          { required: true, message: '请输入文章内容', trigger: 'blur' }
        ]
      },
      //新增界面数据
      addForm: {
        title: '',
        article_desc: '',
        html: '',
        text: '',
        editorOption: {}
      }

    }
  },
  methods: {
    // 文章状态格式化显示
    formatStatus: function (row, column) {
      let status = ''
      switch (row.status) {
        case 0:
          status = '暂存'
          break
        case 1:
          status = '已发布'
          break
      }
      return status
    },
    handleCurrentChange (val) {
      this.page = val;
      this.getArticles();
    },
    //获取用户列表
    getArticles () {
      let para = {
        page: this.page
      };
      this.listLoading = true;
      // NProgress.start();
      getArticleList(para).then((res) => {
        if (res.code == -1) {
          this.$message({
            message: res.data.msg,
            type: 'error'
          });
        } else {
          this.total = res.data.total;
          this.articles = res.data.list;
          this.listLoading = false;
          // NProgress.done();
        }
      });
    },
    //删除
    handleDel: function (index, row) {
      this.$confirm('确认删除该记录吗?', '提示', {
        type: 'warning'
      }).then(() => {
        this.listLoading = true;
        // NProgress.start();
        let para = { id: row.id };
        removeArticle(para).then((res) => {
          this.listLoading = false;
          // NProgress.done();
          this.$message({
            message: '删除成功',
            type: 'success'
          });
          this.getArticles();
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
        title: '',
        article_desc: '',
        html: '',
        text: '',
        editorOption: {}
      };
    },
    //编辑
    editSubmit: function () {
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          this.$confirm('确认提交吗？', '提示', {}).then(() => {
            this.editLoading = true;
            // NProgress.start();
            let para = Object.assign({}, this.editForm);
            modifyArticle(para).then((res) => {
              this.editLoading = false;
              // NProgress.done();
              this.$message({
                message: '提交成功',
                type: 'success'
              });
              this.$refs['editForm'].resetFields();
              this.editFormVisible = false;
              this.getArticles();
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
            // NProgress.start();
            let para = Object.assign({}, this.addForm);
            para.text = this.escapeStringHTML(para.html)
            addArticle(para).then((res) => {
              this.addLoading = false;
              // NProgress.done();
              if (res.code == -1) {
                this.$message({
                  message: res.msg,
                  type: 'error'
                });
              } else {
                this.$message({
                  message: '提交成功',
                  type: 'success'
                });
                this.$refs['addForm'].resetFields();
                this.addFormVisible = false;
                this.getArticles();
              }
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
        // NProgress.start();
        let para = { ids: ids };
        batchRemoveArticle(para).then((res) => {
          this.listLoading = false;
          // NProgress.done();
          this.$message({
            message: '删除成功',
            type: 'success'
          });
          this.getArticles();
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
    this.getArticles();
  }
}

</script>

<style scoped>
</style>