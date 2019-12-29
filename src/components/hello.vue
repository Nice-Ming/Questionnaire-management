<template>
  <header id="header">
    <h2>问卷管理</h2>
    <router-link tag="h3" to="/">我的问卷</router-link>
  </header>
</template>

<script>
export default {
  data() {
    return {
      aray: []
    };
  }

  mnethods() {
checkItem(item, flag = null) {
			if (typeof item.checked === 'undefined') {
				Vue.set(item, 'checked', true);
			}
			else if (flag !== null) {
				item.checked = !flag;
			}
			else {
				item.checked = !item.checked;
			}
		},

		checkAll(flag) {
			this.quList.forEach( item => {
				this.checkItem(item, flag)
			});
		},

		showPrompt(text) {
			this.promptText = text;
			this.isShowPrompt = true;
		},

    getList() {
      console.log('helloworld');
    },
  },

  watch: {
		quList: {
			handler(list) {
				list.forEach((item, index) => item.id = index + 1);
				Store.save(list);
			},
			deep: true
		}
	}
};

</script>