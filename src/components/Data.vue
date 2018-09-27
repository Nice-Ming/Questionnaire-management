<template>
	<div class="container">
		<div class="qu-wrap">
			<header>
				<router-link tag="span" to="/">&lt; 返回</router-link>
				<p>{{ paperDataObj.title }}</p>
			</header>
			<div class="qu-content">
				<div class="qu-item" v-for="(item, index) in questionList">
					<section class="qu-data">
						<h3>
							<span class="qu-num">{{`Q${index + 1}`}}</span>
							<span class="qu-topic">{{ item.questionTitle }}</span>
							<span class="qu-type">{{ item.questionType | transformQursiotnType}}</span>
						</h3>
						<p v-if="item.questionType !== 3" v-for="option in item.questionOption">{{ option }}</p>
						<p v-if="item.questionType === 3" v-for="answer in item.answerContent">{{ answer }}</p>
					</section>
					<section class="ans-data">
						<h4 v-if="item.questionType !== 3">数据占比</h4>
						<template v-if="item.questionType === 1">
							<p class="outerBar" v-for="(option, optIndex) in item.questionOption">
								<span class="innerBar" :style="{width: item.percentList[optIndex]}"></span>
								<span class="scaleNum">{{ item.answerContent[optIndex] }}</span>
							</p>
						</template>
						<p class="echart" v-if="item.questionType === 2"></p>
					</section>
				</div>
			</div>
			<footer>
				<router-link tag="p" to="/" id="backBtn">返 回</router-link>
			</footer>
		</div>
		<loader v-show="isLoading"/>
	</div>
</template>

<script>
import Loader from './Loader'
import { getPaperData } from '../api'
import echarts from 'echarts/lib/echarts'
import 'echarts/lib/chart/pie'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/toolbox'

export default {
	name: 'Data',

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
			paperDataObj: {},
			questionList: [],
			isLoading: false
		}
	},

	created() {
		this._getPaperData()
	},

	methods: {
		renderEchart(element, data) {
			let myChart = echarts.init(element);
			let option = {
				tooltip : {
					trigger: 'item',
					formatter: "{a} <br/>{b} : {c} ({d}%)"
				},
				series : [
				{
					name: '选择人数',
				  type: 'pie',
					radius : '60%',
					center: ['30%', '50%'],
					data: data,
					itemStyle: {
						emphasis: {
							shadowBlur: 10,
							shadowOffsetX: 0,
							shadowColor: 'rgba(0, 0, 0, 0.5)'
						}
					}
				}
				]
			};
			myChart.setOption(option);
		},

		initEchart() {
			let charts = document.querySelectorAll('.echart');
			let multiSelectQuestions = this.questionList.filter(item => item.questionType === 2)

			multiSelectQuestions.map((item, index) => {
				let data = item.answerContent.map((value, i) => {
					return {value, name: item.questionOption[i]}
				})

				this.renderEchart(charts[index], data);
			})
		},

		calculatePercent() {
			this.questionList.map(item => {
				if (item.questionType === 3) {
					return
				}
				let count = item.answerContent.reduce((accumulator, currentValue) => accumulator + currentValue)
				let percentList = item.answerContent.map(num => {
					let percent = Math.round(num / count * 100)
					return percent + '%'
				})
				item.percentList = percentList
			})
		},

		_getPaperData() {
			let data = {id: this.$route.query.id}
			this.isLoading = true
			getPaperData(data).then(res => {
				if (res.code === 0) {
					this.paperDataObj = res.data
					this.questionList = res.data.questions
					this.isLoading = false
					this.calculatePercent()
					this.$nextTick(() => {
						this.initEchart()
					})
				}
			})
		}
	}
}

</script>

<style scoped lang="scss">
@import '../style/_Data.scss';
</style>
