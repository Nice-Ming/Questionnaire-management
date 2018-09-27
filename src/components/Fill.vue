<template>
	<div class="container">
		<loader v-show="isLoading"/>
		<div class="qu-wrap">
			<header>
				{{ paperObj.title }}
			</header>
			<div class="qu-content">
				<section class="qu-item" v-for="(item, index) in questionList">
					<h3>
						<span class="qu-num">{{`Q${index + 1}`}}</span>
						<span class="qu-topic">{{ item.questionTitle }}</span>
						<span class="qu-type">{{ item.questionType | transformQursiotnType}}</span>
					</h3>
					<textarea rows="8"
						      	cols="80"
					          v-if="item.questionType === 3"
										v-model="answerList[index].answerContent[0]"
					>
					</textarea>
					<ul v-else class="options-list">
						<li  v-for="(option, optIndex) in item.questionOption">
							<label>
								<input v-if="item.questionType === 1"
											type="radio"
											:value="option"
									    :name="index + 1"
											v-model="answerList[index].answerContent[0]"
								>
								<input v-else-if="item.questionType === 2"
											type="checkbox"
											:value="option"
									    :name="index + 1"
											v-model="answerList[index].answerContent"
								>
								<span>{{ option }}</span>
							</label>
						</li>
					</ul>
				</section>
			</div>
			<footer>
				<span class="btn" v-if="isFillMode" @click="iterator = submit(); iterator.next()">提交问卷</span>
				<span class="btn" v-else @click="back()">返回</span>
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
import Loader from "./Loader";
import { getPaper, viewPaper, commitPaper } from '../api'

export default {
	name: 'Fill',

	components: {
		'loader': Loader
	},

	filters: {
		transformQursiotnType(type) {
			return	type === 1 ? '(单选题)' : (type === 2 ? '(多选题)' : '(文本题)')
		}
	},

	data() {
		return {
			paperObj: {},
			questionList: [],
			answerList: [],
			promptText: '',
			isShowPrompt: false,
			isFillMode: false,
			isLoading: false,
		}
	},

	created() {
		// 设置该页面模式 /fill（答题） /view（查看）
		this.isFillMode = this.$route.path === '/fill'
		this._getPaper();
	},

	methods: {
		showPrompt(text) {
			this.promptText = text;
			this.isShowPrompt = true;
		},

		validateAnswer() {
			let noAnswerList = this.answerList.filter(item => {
				if (item.questionType !== 3 && !item.answerContent.length) {
					return item
				}
			})

			return !!noAnswerList.length
		},

		initAnswerList() {
			this.questionList.map((item, index) => {
				this.$set(this.answerList, index, {
					id: item.id,
					questionType: item.questionType,
					answerContent: []
				})
			})
		},

		back() {
			this.$router.push('/')
		},

		*commitSuccess() {
			yield this.showPrompt('提交成功')
			yield (() => {
				window.location.href = 'about:blank'
  			window.close()
			})()
		},

		*submit() {
			let text = '';
			if (this.validateAnswer()) {
				text = '有选择题未填写，无法提交！'
				this.iterator = null;
			} else {
				text = `确认提交问卷吗？`
			}

			yield this.showPrompt(text);
			yield this._commitPaper();
		},

		_getPaper() {
			let data = {id: this.$route.query.id}
			this.isLoading = true

			if (this.isFillMode) {
				viewPaper(data).then(res => {
					if (res.code === 0) {
						let status = res.data.status
						if (status === 1) {
							this.paperObj = res.data
							this.questionList = res.data.questions
							this.initAnswerList()
							this.isLoading = false
						} else {
							window.alert(res.msg)
							setTimeout(() => {
								window.location.href = 'about:blank'
  							window.close()
							}, 5000);
						}
					}
				})
			} else {
				getPaper(data).then(res => {
					if (res.code === 0) {
						this.paperObj = res.data
						this.questionList = res.data.questions
						this.isLoading = false
						this.initAnswerList()
					}
				})
			}
		},

		_commitPaper() {
			let data = {
				id: this.paperObj.id,
				answers: this.answerList
			}
			commitPaper(data).then(res => {
				if (res.code === 0) {
					this.iterator = this.commitSuccess()
					this.iterator.next()
				}
			})
		}
	}
}
</script>

<style scoped lang="scss">
@import '../style/public.scss';
@import '../style/_Fill.scss';
</style>
