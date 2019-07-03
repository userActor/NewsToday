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
            v-model="scope.row.comment_status"
            active-color="#13ce66"
            inactive-color="#ff4949"
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
      // console.log(comment);
      this.articles = comment.results;
    }
  },
  components: {}
};
</script>

<style scoped lang="less">
</style>
