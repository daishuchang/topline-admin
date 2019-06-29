<template>
  <div class="index-wrap">
    <el-container>
      <el-aside width="200px">Aside</el-aside>
      <el-container>
        <el-header>Header</el-header>
        <el-main>Main</el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
// export default {
//   name: 'AppHome',
//   data () {
//     return {}
//   }
// }

export default {
  name: 'AppLayout',
  data () {
    return {
    }
  },
  created () {},
  methods: {}
}

</script>

<style lang="less" scoped>
.el-container {
  height: 100%;
}

.el-aside {
  background-color: #d5dce5;
}

.el-header {
  background-color: #b5c0cf;
}

.el-main {
  background-color: #eaeef2;
}
</style>
