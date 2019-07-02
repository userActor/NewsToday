<template>
  <el-card class="publish-card">
    <div
      slot="header"
      class="header"
    >
      <span>发布文章</span>
      <div>
        <el-button
          type="success"
          @click="handlePublish(false)"
        >{{isEdit ? '更新':'发布'}}</el-button>
        <el-button
          type="success"
          @click="handlePublish(true)"
        >存入草稿</el-button>
      </div>
    </div>
    <el-form
      :model="articleForm"
      v-loading="$route.name ==='publish-edit' && loading"
    >
      <el-form-item label="标题">
        <el-input
          type="text"
          v-model="articleForm.title"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <quill-editor
          v-model="articleForm.content"
          ref="myQuillEditor"
          :options="editorOption"
        >
        </quill-editor>
      </el-form-item>
      <el-form-item label="封面">
      </el-form-item>
      <el-form-item label="频道">
        <!-- <article-channel
          :value="articleForm.channel_id"
          @input="articleForm.channel_id  = $event"
        ></article-channel> -->
        <!-- 简写 -->
        <article-channel v-model="articleForm.channel_id"></article-channel>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
import ArticleChannel from "@/components/articleChannel";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";

import { quillEditor } from "vue-quill-editor";
export default {
  name: "ArticlePublish",
  data() {
    return {
      articleForm: {
        title: "",
        content: "",
        cover: {
          type: 0,
          images: []
        },
        channel_id: ""
      },
      loading: false,
      editorOption: {
        // some quill options
      }
    };
  },
  computed: {
    editor() {
      return this.$refs.myQuillEditor.quill;
    },
    isEdit() {
      return this.$route.name === "publish-edit";
    }
  },
  created() {
    //因为用的是同一个组件，所以要根据name来判断当前处理的逻辑
    if (this.isEdit) {
      this.loadArticle();
    }
  },
  components: {
    ArticleChannel,
    quillEditor
  },

  methods: {
    handlePublish(draft = false) {
      if (this.isEdit) {
        this.submitEdit(draft);
      } else {
        this.submitAdd(draft);
      }
    },
    submitEdit(draft) {
      this.$http({
        method: "PUT",
        url: `/articles/${this.$route.params.id}`,
        data: this.articleForm,
        params: {
          draft
        }
      })
        .then(res => {
          this.$message({
            type: "success",
            message: "更新成功"
          });
          this.$router.push("/article");
        })
        .catch(err => {
          this.$message({
            type: "error",
            message: "更新失败"
          });
        });
    },
    submitAdd(draft) {
      this.$http({
        method: "POST",
        url: "/articles",
        data: this.articleForm,
        params: {
          draft
        }
      })
        .then(res => {
          this.$message({
            type: "success",
            message: "发布成功"
          });
        })
        .catch(err => {
          this.$message({
            type: "error",
            message: "发布失败"
          });
        });
    },
    loadArticle() {
      this.loading = true;
      this.$http({
        method: "GET",
        url: `/articles/${this.$route.params.id}`
      })
        .then(res => {
          // console.log(res);
          this.loading = false;
          this.articleForm = res;
        })
        .catch(err => {
          this.loading = false;
          this.$message({
            type: "error",
            message: "加载失败"
          });
        });
    }
  },
  mounted() {
    console.log("this is current quill instance object", this.editor);
  }
};
</script>

<style scoped lang="less">
.publish-card {
  min-height: 100%;
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
