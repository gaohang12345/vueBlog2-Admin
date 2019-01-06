<template>
  <el-form ref="form"
           :model="form"
           :rules="rules"
           label-width="80px"
           @submit.prevent="onSubmit"
           style="margin:20px;width:60%;min-width:600px;">
    <el-form-item label="文章标题"
                  prop="title">
      <el-input v-model="form.title"></el-input>
    </el-form-item>

    <el-form-item label="文章描述"
                  prop="article_desc">
      <el-input v-model="form.article_desc"></el-input>
    </el-form-item>

    <el-form-item label="缩略图"
                  prop="thumbnail">
      <el-input v-model="form.thumbnail"></el-input>
    </el-form-item>

    <el-form-item label="文章内容"
                  prop="html">
      <div class="edit_container">
        <!--  新增时输入 -->
        <quill-editor v-model="form.html"
                      prop="html"
                      ref="myQuillEditor"
                      :options="form.editorOption"
                      @blur="onEditorBlur($event)"
                      @focus="onEditorFocus($event)"
                      @change="onEditorChange($event)">
        </quill-editor>
        <!-- 从数据库读取展示 -->

        <div v-show="0"
             v-html="form.text"
             class="ql-editor">
          {{form.text}}
        </div>
      </div>
    </el-form-item>

    <el-form-item>
      <el-button @click="submitForm('form')"
                 type="primary">立即创建</el-button>
      <el-button @click="resetForm('form')">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
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
      form: {
        title: '',
        article_desc: '',
        thumbnail: '',
        html: '',
        text: '',
        editorOption: {}
      },
      rules: {
        title: [
          { required: true, message: '请输入文章标题', trigger: 'blur' },
          { min: 3, message: '长度至少 3 个字符', trigger: 'blur' }
        ],
        article_desc: [
          { required: true, message: '请输入文章标题', trigger: 'blur' },
          { max: 128, message: '长度最多 128 个字符', trigger: 'blur' }
        ],
        thumbnail: [
          { required: true, message: '请输入缩略图地址', trigger: 'blur' }
        ],
        html: [
          { required: true, message: '请输入文章内容', trigger: 'blur' }
        ]
      }

    }
  },
  methods: {
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 发请求


        } else {
          return false;
        }
      });
    },
    resetForm (formName) {
      this.$refs[formName].resetFields();
    },
    onSubmit () {
      console.log('submit!');
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
  }
}

</script>