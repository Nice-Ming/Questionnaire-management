<template>
	<div class="container">
		<div class="qu-wrap">
			<header>
				<span @click="iterator = backBtn(); iterator.next()">&lt; 返回</span>
				<p v-show="!titleEditing" @click="titleEditing = true">{{ paperObj.title || '问卷标题' }}</p>
				<input type="text"
				v-focus
				v-model="paperObj.title"
				:class="{inlineShow: titleEditing}"
				@blur="titleEditing = false"
				@keyup.enter="titleEditing = false">
			</header>
			<div class="qu-content">
				<section class="qu-item"
				v-for="(item, index) in questionList"
				:class="{nowEditing: curIndex === index && topicEditing, optEditing: curIndex === index}">
					<h3 @click="curIndex = index; curOptIndex=''; topicEditing = true">
						<span class="qu-num">{{`Q${index + 1}`}}</span>
						<span class="qu-topic">{{ item.questionTitle || '请编辑题目内容' }}</span>
						<input type="text"
						v-focus
						v-model="item.questionTitle"
						@blur="topicEditing = false"
						@keyup.enter="topicEditing = false">
						<span class="qu-type">{{ item.questionType | transformQursiotnType}}</span>
					</h3>
					<textarea v-if="item.questionType === 3" rows="8" cols="80"></textarea>
					<ul v-else class="options-list" >
						<li v-for="(option, optIndex) in item.questionOption"
								:class="{optionEditing: curOptIndex === optIndex}"
						>
							<span class="optionText"
								  	@click="curIndex=index; curOptIndex=optIndex; topicEditing = false">
										{{ option || '请编辑选项内容' }}
							</span>
							<input type="text"
							v-focus
							v-model="item.questionOption[optIndex]"
							@blur="curIndex=''"
							@keyup.enter="curIndex=''">
							<ul class="opt-ctrl">
								<li v-if="optIndex === item.questionOption.length - 1" @click="addOption(item.questionOption)">添加</li>
								<li @click="deleteOption(optIndex, item.questionOption)">删除</li>
							</ul>
						</li>
					</ul>
					<ul class="operat-list">
						<li v-if="index !== 0"
								@click="moveUp(index, questionList)">上移</li>
						<li v-if="index !== questionList.length - 1"
								@click="moveDown(index, questionList)">下移</li>
						<li @click="deleteQuestion(index)">删除</li>
					</ul>
					<div></div>
				</section>
				<div class="add-box" v-if="excelFile === null">
					<p class="qu-type" :class="{expand: isAdding}">
						<span @click="addQuestion('radio')">单选题</span>
						<span @click="addQuestion('checkbox')">多选题</span>
						<span @click="addQuestion('textarea')">文本题</span>
					</p>
					<p class="add-btn" @click="isAdding = !isAdding;">
						<span>+ 添加问题</span>
					</p>
				</div>
				<template v-if="!questionList.length">
					<div class="download-box" v-if="!isEditMode" @click="downLoadExcel()">
						<p class="download-btn">
							<span>下载Excel模板</span>
						</p>
					</div>
					<div class="upload-box" v-if="!isEditMode" @click="importExcel()">
						<p class="upload-btn">
							<input type="file" ref="fileInput" @change="fileChange($event)" style="display: none">
							<span>{{ excelFileName || '上传Excel表格' }}</span>
						</p>
					</div>
				</template>
			</div>
			<footer>
				<template v-if="excelFile === null">
					<div class="date-part">
						<div>
							<label>开始日期</label>
								<input type="text"
								readonly="true"
								v-model="paperObj.startTime"
								@click="showDatePicker('start')">
						</div>
						<div>
							<label>截止日期</label>
								<input type="text"
								readonly="true"
								v-model="paperObj.endTime"
								@click="showDatePicker('end')">
						</div>
						<date-picker
							id="date-picker"
							:class="datePickerType"
							v-show="isShowDatepicker"
							@sendDate="changeDate">
						</date-picker>
					</div>
					<div class="ctrl-part">
						<span @click="iterator = savePaper(); iterator.next()">保存问卷</span>
						<span @click="iterator = releasePaper(); iterator.next()">发布问卷</span>
					</div>
				</template>
				<div class="upload-part" v-else>
					<span @click="iterator = savePaperExcel(); iterator.next()">保存问卷表格</span>
				</div>
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
	<loader v-show="isLoading"/>
</div>
</template>

<script>
import Loader from './Loader'
import Datepicker from './Datepicker'
import { apiDomain, getPaper, updatePaper, uploadPaper } from '../api'

const questionTemplate = {
	radio: {
		questionType: 1,
		questionTitle: "",
		questionOption: ["",""]
	},
	checkbox: {
			questionType: 2,
			questionTitle: "",
			questionOption: ["",""]
		},
	textarea: {
			questionType: 3,
			questionTitle: "",
			questionOption: []
		}
}

export default {
	name: 'Edit',

	components: {
		'loader': Loader,
		'date-picker': Datepicker
	},

	directives: {
		focus: {
			update: el => el.focus(),
		}
	},

	filters: {
		transformQursiotnType(type) {
			return	type === 1 ? '(单选题)' : (type === 2 ? '(多选题)' : '(文本题)')
		}
	},

	data() {
		return {
			excelFile: null,
			excelFileName: '',
			paperObj: {},
			questionList: [],
			datePickerType: '',
			curIndex: '',
			curOptIndex: '',
			promptText: '',
			iterator: null,
			isEditMode: false,
			isAdding: false,
			titleEditing: false,
			topicEditing: false,
			isShowPrompt: false,
			isShowDatepicker: false,
			isLoading: false
		}
	},

	created() {
		// 设置编辑模式 (add, edit, re-edit)
		this.isEditMode = this.$route.path !== '/add'
		if (this.isEditMode) {
			this._getPaper()
		} else {
			this.paperObj = {
				title: '',
				status: 0,
				startTime: '',
				endTime: '',
				questions: []
			}
		}
	},

	methods: {
		showDatePicker(val) {
			this.datePickerType = val
			this.isShowDatepicker = !this.isShowDatepicker
		},

		changeDate(date) {
			let nowTime = Date.now();
			let chioceTime = new Date(date.replace(/-/g, ','))*1;
			if (chioceTime < (nowTime - 24 * 60 * 60 * 1000)) {
				this.iterator = null;
				this.showPrompt('选择的日期不能早于当前日期，请重新选择！');
				return;
			}
			if (this.datePickerType === 'start') {
				this.paperObj.startTime = date;
			} else {
				this.paperObj.endTime = date
			}
			this.isShowDatepicker = !this.isShowDatepicker
		},

		switchItem(index, array) {
			this.optIndex = '';
			this.curIndex = '';

			let arr = array.splice(index, 2);
			array.splice(index , 0, ...arr.reverse());
		},

		moveUp(index, array) {
			this.switchItem(index - 1, array);
		},

		moveDown(index, array) {
			this.switchItem(index, array);
		},

		errorPrompt(text) {
			this.iterator = null;
			this.showPrompt(text);
		},

		downLoadExcel() {
			window.open(`${apiDomain}/template.xls`)
		},

		importExcel() {
			this.$refs.fileInput.click()
		},

		fileChange(event) {
			let excelFile = event.target.files[0]
			let fileSuffix = excelFile.name.split('.').pop()

			if (fileSuffix !== 'xls' && fileSuffix !== 'xlsx') {
				this.showPrompt('上传文件格式错误')
			} else{
				this.excelFile = excelFile
				this.excelFileName = excelFile.name
			}
		},

		deleteQuestion(index) {
			if (this.questionList.length <= 1) {
				this.errorPrompt(`每份问卷至少一个问题！`);
				return;
			}
			this.questionList.splice(index, 1);
		},

		deleteOption(index, options) {
			if (options.length <= 2) {
				this.errorPrompt(`每个问题至少两个选项`);
				return;
			}
			options.splice(index, 1)
		},

		addOption(options) {
			if (options.length === 6) {
				this.errorPrompt(`每个问题至多六个选项`);
				return;
			}
			options.push('')
		},

		showPrompt(text) {
			this.promptText = text;
			this.isShowPrompt = true;
		},

		addQuestion(type) {
			if (this.questionList.length === 10) {
				this.errorPrompt(`每份问卷至多10个问题！`);
				return;
			}
			let template = JSON.parse(JSON.stringify(questionTemplate[type]))
			this.questionList.push(template);
		},

		validatePaper() {
			if (!this.paperObj.title) {
				this.errorPrompt('请填写问卷标题')
				return false
			}

			if (!this.questionList.length) {
				this.errorPrompt(`每份问卷至少一个问题！`)
				return false
			}

			let isAllQuestionFull = this.questionList.every(item => {
				let emptyOptionList = item.questionOption.filter(option => option === '')
				return item.questionTitle !== '' && !emptyOptionList.length
			})
			if (!isAllQuestionFull) {
				this.errorPrompt('请完善问卷题目内容！')
				return false
			}

			if (!this.paperObj.startTime || !this.paperObj.endTime) {
				this.errorPrompt('请填写问卷发布时间段！')
				return false
			}

			return true
		},

		*backBtn() {
			yield this.showPrompt(`确认未保存回到主页吗？`)
			yield this.$router.push({path: '/'})
		},

		*savePaper() {
			yield this.showPrompt(`确认保存问卷吗？`)
			yield this._savePaper()
		},

		*releasePaper() {
			yield (() => {
				let nowTime = Date.now();
				let startTime = new Date(this.paperObj.startTime.replace(/-/g, ','))*1;
				if (startTime > nowTime) {
					this.showPrompt('确认保存并发布问卷吗？(开始日期晚于当前日期，到期才可答题)')
					return
				}
				this.showPrompt(`确认保存并发布问卷吗？`)
			})()
			yield this._releasePaper()
		},

		*savePaperExcel() {
			yield this.showPrompt(`确认保存问卷表格吗？`)
			yield this._uploadPaper()
		},

		_getPaper() {
			let data = {id: this.$route.query.id}
			this.isLoading = true
			getPaper(data).then(res => {
				if (res.code === 0) {
					if (this.$route.path === '/re-edit') {
						// 重新编辑模式下 初始化试卷的属性
						delete res.data['id']
						delete res.data['createdTime']
						res.data.status = 0
					}
					this.paperObj = res.data
					this.questionList = res.data.questions
					this.isLoading = false
				}
			})
		},

		_savePaper() {
			let data = this.paperObj
			this.paperObj.questions = this.questionList
			updatePaper(data).then(res => {
				if (res.code === 0) {
					this.$router.push({path: '/'})
				}
			})
		},

		_releasePaper() {
			if (this.validatePaper()) {
				let data = this.paperObj
				this.paperObj.status = 1
				this.paperObj.questions = this.questionList
				updatePaper(data).then(res => {
					if (res.code === 0) {
						this.$router.push({path: '/'})
					}
				})
			}
		},

		_uploadPaper() {
			let formData = new FormData()
			formData.append('file', this.excelFile)

			uploadPaper(formData).then(res => {
				if (res.code === 0) {
					this.$router.push({path: '/'})
				} else {
					this.showPrompt(res.msg)
				}
			})
		}
	},
}

</script>

<style scoped lang="scss">
@import '../style/_Edit';
</style>
