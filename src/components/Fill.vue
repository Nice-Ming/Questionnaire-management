<template>
	<div class="container">
		<div class="qu-wrap">
			<header>
				<span @click="iterator = backBtn(); iterator.next()">&lt; 返回</span>
				<p>{{ quData.title }}</p>
			</header>
			<div class="qu-content">
				<section class="qu-item" v-for="(item, index) in questions">
					<h3>{{ `Q${index + 1}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${item.topic}` }}
						<span v-if="item.isMandatory"> *</span>
					</h3>
					<textarea rows="8"
						      cols="80"
					          v-if="item.type === 'textarea'"
					          v-model="item.answer"
					          :required="item.isMandatory">
					</textarea>
					<ul v-else class="options-list">
						<li v-for="(option, optIndex) in item.options">
							<label >
								<input v-if="item.type === 'radio'"
									   :type="item.type"
									   :name="index + 1"
									   @change="item.answer = optIndex">
								<input v-else
									   :type="item.type"
									   :name="index + 1"
									   @change="checkboxAnswer($event, optIndex, item.answer)">
								<span>{{ option }}</span>
							</label>
						</li>
					</ul>
				</section>
			</div>
			<footer>
				<span id="submitBtn" @click="iterator = submitBtn(); iterator.next()">提交问卷</span>
			</footer>
		</div>
		<div class="overlay" v-show="isShowPrompt">
			<div class="prompt-box">
				<header>
					<span>提示</span>
					<a href="javascript:;" @click="isShowPrompt = false">&times;</a>
				</header>
				<p>{{ promptText }}</p>
				<footer>
					<span @click="isShowPrompt = false; iterator && iterator.next()">确定</span>
					<span @click="isShowPrompt = false">取消</span>
				</footer>
			</div>
		</div>
	</div>
</template>

<script>
import Store from '../store.js';

export default {
	name: 'Fill',
	data() {
		return {
			quData: {},
			questions: [],
			answers: {},
			promptText: '',
			isShowPrompt: false,
		}
	},

	beforeRouterEnter(to, from, next) {
		let id = to.params.id;
		let item = {};
		if (id !== 0) {
			let length = Store.fetch().length;
			if (id < 0 || id > length) {
				alert('非法路由');
				next('');
			}
			else {
				item = Store.fetch()[id - 1];
			}

			if (item.state === 0) {
				next();
			}
			else {
				alert('非法路由');
				next('/');
			}
		}
		else {
			next();
		}
	},

	created() {
		this.getData();
	},

	methods: {
		getData() {
			let id = this.$route.params.id;

			this.quData = Store.fetch()[id - 1];
			this.questions = this.quData.questions;
			this.questions.forEach((item) => {
				if (item.type === 'checkbox') {
					item.answer = [];
				}
				else {
					item.answer = '';
				}
			});
		},

		showPrompt(text) {
			this.promptText = text;
			this.isShowPrompt = true;
		},

		checkboxAnswer(event, index, answer) {
			if (event.target.checked) {
				answer.push(index);
			}
			else {
				answer.splice(answer.indexOf(index), 1);
			}
		},

		requireValidate() {
			let textareas = document.querySelectorAll('textarea');
			return [].every.call(textareas, item => {
				if (item.hasAttribute('required') && item.value.trim() === '') {
					return false;
				}
				return true;
			})
		},

		getAnswer() {
			this.questions.forEach((item, index) => {
				this.answers[`Q${index + 1}answer`] = item.answer;
			})
		},

		sendAnswer() {
			this.getAnswer();
			this.$router.push({path: '/'});
			console.log('非正式项目，无需发送用户回答数据，打印出来看看就好');
			console.log(this.answers);
		},

		*submitBtn() {
			let text = ``;
			if (this.quData.state === 0) {
				text = `问卷尚未发布，无法提交！`;
				this.iterator = null;
			}
			else if (!this.requireValidate()) {
				text = `有必填项未填写，无法提交！`;
				this.iterator = null;
			}
			else {
				text = `确认提交问卷吗？`
			}

			yield this.showPrompt(text);
			yield this.sendAnswer();
		},

		*backBtn() {
			yield this.showPrompt(`放弃答题回到主页吗？`);
			yield this.$router.push({path: '/'});
		},
	},
}
</script>

<style scoped lang="scss">
@import '../style/_Fill.scss';
</style>
