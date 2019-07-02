<template>
  <el-container>
    <el-aside width="190px">
      <app-aside></app-aside>
    </el-aside>
    <el-container>
      <el-header>
        <app-header></app-header>
      </el-header>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import AppAside from "./components/AppAside";
import AppHeader from "./components/AppHeader";
export default {
  name: "AppLayout",
  data() {
    return {};
  },
  components: {
    AppAside,
    AppHeader
  }
};
</script>

<style scoped lang="less">
.el-container {
  height: 100%;
}
.el-main {
  background-color: #cee6e7;
}
.el-aside {
  background-color: #85c0c2;
}
.el-header {
  background-color: #a9d6d6;
}
</style>
