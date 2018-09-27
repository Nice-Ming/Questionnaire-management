<template>
  <div id="app">
  	<v-header></v-header>
  	<router-view></router-view>
  </div>
</template>

<script>
import vHeader from './components/Header'

export default {
  name: 'App',
  components: {
  	vHeader
  }
}
</script>

<style>
@import "style/reset";

#app {
  min-width: 110rem;
  height: 100%;
  font-family: arial;
  background-color: #f9f9f9;
  overflow: auto;
}

@media screen and (max-width: 640px) {
	#app {
		min-width: 100%;
  }
}
</style>
