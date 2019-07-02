<template>
  <el-select
    :value="value"
    @change="handleChange"
  >

    <el-option
      v-for="item in channel"
      :key='item.id'
      :label="item.name"
      :value="item.id"
    ></el-option>
  </el-select>
</template>

<script>
export default {
  name: "ArticleChannel",
  data() {
    return {
      channel: []
    };
  },
  props: {
    value: {
      type: [String, Number],
      required: true
    }
  },
  created() {
    this.loadChannels();
  },
  methods: {
    handleChange(val) {
      this.$emit("input", val);
    },
    async loadChannels() {
      try {
        const data = await this.$http({
          methond: "GET",
          url: "/channels"
        });
        this.channel = data.channels;
        // console.log(this.channel);
      } catch (error) {
        this.$message({
          type: "error",
          message: "获取频道失败"
        });
      }
    }
  },
  components: {}
};
</script>

<style scoped lang="less">
</style>
