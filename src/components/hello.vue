<template>
  <header id="header">
    <h2>问卷管理</h2>
    <router-link tag="h3" to="/">我的问卷</router-link>
  </header>
</template>

<script>
export default {
    mnethods() {
      getList() {
        console.log('helloworld');
      },
    },
}
</script>