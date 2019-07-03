<template>
  <el-card>
    <div class="header">
      <span>评论管理</span>
    </div>
    <el-table :data="articles">
      <el-table-column
        prop="title"
        label="标题"
      ></el-table-column>
      <el-table-column
        prop="total_comment_count"
        label="总评论数"
      ></el-table-column>
      <el-table-column
        prop="fans_comment_count"
        label="评论粉丝数"
      ></el-table-column>
      <el-table-column
        prop=""
        label="允许评论"
      >
        <template slot-scope="scope">
          <el-switch
            :disabled="scope.row.changeLoading"
            v-model="scope.row.comment_status"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="changeStatus(scope.row)"
          >
          </el-switch>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script>
export default {
  name: "articleCOmment",
  data() {
    return {
      articles: []
    };
  },
  created() {
    this.loadArticle();
  },
  methods: {
    async loadArticle() {
      const comment = await this.$http({
        url: "articles",
        method: "GET",
        params: {
          response_type: "comment"
        }
      });
      comment.results.forEach(item => {
        item.changeLoading = false;
      });
      this.articles = comment.results;
      console.log(comment);
    },
    async changeStatus(item) {
      item.changeLoading = true;
      // console.log(item);
      try {
        const res = await this.$http({
          url: "/comments/status",
          method: "PUT",
          params: {
            article_id: item.id.toString()
          },
          data: {
            allow_comment: item.comment_status
          }
        });
        item.changeLoading = false;
        this.$message({
          type: "success",
          message: "修改成功",
          duration: 800
        });
      } catch (error) {
        item.changeLoading = false;
        item.comment_status = !item.comment_status;
        this.$message({
          type: "error",
          message: "修改失败"
        });
      }
    }
  },
  components: {}
};
</script>

<style scoped lang="less">
</style>
