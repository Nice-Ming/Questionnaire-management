<template>
	<div class="date-container">
		<header>
			<p class="date-title">
				<span class="left-arrow" @click="getDates(-1)"></span>
				<span v-text="`${year}年 ${month}月`"></span>
				<span class="right-arrow" @click="getDates(1)"></span>
			</p>
			<p class="week-title">
				<ul>
					<li>Mon</li>
					<li>Tue</li>
					<li>Wed</li>
					<li>Thu</li>
					<li>Fri</li>
					<li>Sat</li>
					<li>Sun</li>
				</ul>
			</p>
		</header>
		<div class="date-content">
			<ul  v-for=" week in dates.weeks">
				<template v-for="day in week">
					<li v-if="day.month === month" class="selectable" @click="returnDate(day.showDate)">{{ day.showDate }}</li>
					<li v-else>{{ day.showDate }}</li>
				</template>
			</ul>
		</div>
	</div>
</template>

<script>
	import data from'../data.js';

	export default {
		name: 'Datepicker',
		data() {
			return {
				dates: [],
				month: undefined,
				year: undefined
			}
		},

		mounted() {
			this.dates = data.date();
			this.year = this.dates.year;
			this.month = this.dates.month;
		},

		methods: {
			getDates(n) {
				let year = this.year;
				let month = this.month - 1 + n;

				if (month < 0) {
					year--;
					month = 11;
				}
				if (month > 11){
					year++;
					month = 0;
				}

				this.dates = data.date(year, month);
				this.year = this.dates.year;
				this.month = this.dates.month;
			},

			returnDate(day) {
				let date = `${this.year}-${this.formatDate(this.month)}-${this.formatDate(day)}`;
				this.$emit('sendDate', date);
			},

			formatDate(val) {
				return (val < 10) ? '0' + val : val;
			}
		}
	}

</script>

<style scoped lang="scss">
	@import '../style/_Datepicker.scss';
</style>
