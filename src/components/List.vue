<template>
	<div class="container">
		<div class="add-wrapper" v-if="!paperList.length">
			<p @click="addPaper()">+ 新建问卷</p>
		</div>
		<div class="list-wrapper" v-else>
			<ul>
				<li></li>
				<li>标题</li>
				<li>截止时间</li>
				<li>状态</li>
				<li>操作<p @click="addPaper()">+ 新建问卷</p></li>
			</ul>
			<ul v-for="paper in paperList">
				<li @click="checkItem(paper)"><i :class="{'checked': paper.checked}"></i></li>
				<li>{{ paper.title }}</li>
				<li>{{ paper.endTime }}</li>
				<li :class="paper.status | transformStatusClass">{{ paper.status | transformStatusText }}</li>
				<li>
					<template v-if="paper.status === 0">
						<span @click="iterator = editItem(paper); iterator.next()">编辑</span>
						<span @click="viewPaper(paper.id)">查看问卷</span>
					</template>
					<template v-else-if="paper.status === 1">
						<span @click="sharePaper(paper.id)">分享问卷</span>
						<span @click="viewData(paper.id)">查看数据</span>
					</template>
					<template v-else>
						<span @click="iterator = reEditItem(paper); iterator.next()">重新编辑</span>
						<span @click="viewData(paper.id)">查看数据</span>
					</template>
					<span @click="iterator = deleteItem(paper); iterator.next()">删除</span>
				</li>
			</ul>
			<div>
				<p @click="checkAll(isCheckedAll)"><i :class="{'checked': isCheckedAll}"></i></p>
				<p>全选<span @click="iterator = deleteCheckedItems(); iterator.next()">删除</span></p>
			</div>
		</div>
		<div class="overlay" v-show="isShowPrompt">
			<div class="prompt-box">
				<header>
					<span>提示</span>
					<a href="javascript:;" @click="isShowPrompt = false">&times;</a>
				</header>
				<p>{{ promptText }}</p>
				<footer>
					<span @click="iterator.next(); isShowPrompt = false">确定</span>
					<span @click="isShowPrompt = false">取消</span>
				</footer>
			</div>
		</div>
		<div class="overlay" v-show="isShowSharePrompt">
			<div class="prompt">
				<div class="prompt-header">
					<span>分享问卷</span>
					<a href="javascript:;" @click="isShowSharePrompt = false">&times;</a>
				</div>
				<div class="prompt-body">
					<div class="share-link">
						<a :href="shareLink" target="_blank">{{ shareLink }}</a>
					</div>
					<div class="share-qrcode">
						<canvas id="qrcode-canvas"></canvas>
					</div>
					<div class="share-desc">
						<span>(点击右键复制链接/二维码分享问卷)</span>
					</div>
				</div>
			</div>
		</div>
		<loader v-show="isLoading"/>
	</div>
</template>

<script>
import Loader from './Loader'
import { getPaperList, deletePaper } from '../api'
import storage from '../public/js/storage'

const QRCode = require('qrcode')

export default {
	name: 'List',

	components:{
		'loader': Loader
	},

	filters: {
		transformStatusText(status) {
			return status === 0 ? '未发布' : (status === 1 ? '已发布' : '已结束')
		},

		transformStatusClass(status) {
			return status === 0 ? 'unrelease' : (status === 1 ? 'released' : 'ended')
		},
	},

	data() {
		return {
			iterator: null,
			paperList: [],
			promptText: '',
			shareLink: '',
			isShowPrompt: false,
			isShowSharePrompt: false,
			isLoading: false
		}
	},

	computed: {
		isCheckedAll() {
			return this.paperList.every(item => item.checked)
		}
	},

	created() {
		this._getPaperList()
	},

	methods: {
		addPaper() {
			this.$router.push('/add')
		},

		viewPaper(id) {
			this.$router.push({path: '/view', query: {id}})
		},

		viewData(id) {
			this.$router.push({name: 'data', query: {id}})
		},

		checkItem(item, flag = null) {
			if (typeof item.checked === 'undefined') {
				this.$set(item, 'checked', true);
			}
			else if (flag === null) {
				item.checked = !item.checked;
			}
			else {
				item.checked = !flag;
			}
		},

		checkAll(flag) {
			this.paperList.forEach(item => {
				this.checkItem(item, flag)
			});
		},

		showPrompt(text) {
			this.promptText = text;
			this.isShowPrompt = true;
		},

		sharePaper(id) {
			let canvas = document.getElementById('qrcode-canvas')
			this.shareLink = `${window.location.origin}/questionnaire/#/fill?id=${id}`
			QRCode.toCanvas(canvas, this.shareLink, {
				width: 250
			}, function (error) {
				if (error) console.error(error)
			})
			this.isShowSharePrompt = true
		},

		*editItem(item) {
			yield this.showPrompt(`确认要编辑《${item.title}》？`);
			yield this.$router.push({name: 'edit', query: {id: item.id}});
		},

		*reEditItem(item) {
			yield this.showPrompt(`确认要重新编辑《${item.title}》？`);
			yield this.$router.push({path: 're-edit', query: {id: item.id}});
		},

		*deleteItem(item) {
			let index
			yield (() => {
				index = this.paperList.indexOf(item)
				this.showPrompt(`确认要删除《${item.title}》？`)
			})()
			yield this._deletePaper([item])
		},

		*deleteCheckedItems() {
			let checkedPaperList = this.paperList.filter(item => item.checked)
			if (!checkedPaperList.length) {
				yield this.showPrompt('未选择问卷')
			} else {
				yield this.showPrompt('确认要删除所选问卷？')
				yield this._deletePaper(checkedPaperList)
			}
		},

		_getPaperList() {
			this.isLoading = true
			getPaperList().then(res => {
				if (res.code === 0) {
					this.paperList = res.data
					this.isLoading = false
				} else if (res.code === -1) {
					storage.clear()
					this.$router.push('/login')
				}
			})
		},

		_deletePaper(list) {
			let idList = list.map(item => item.id)
			let data = { idList }
			deletePaper(data).then(res => {
				if (res.code === 0) {
					if (res.data === 0) {
						this._getPaperList()
					}
				}
			})
		}
	}
}
</script>

<style scoped lang="scss">
@import '../style/public.scss';
@import '../style/_List.scss';
</style>
