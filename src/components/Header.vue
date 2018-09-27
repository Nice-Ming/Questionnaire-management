<template>
	<div class="header">
		<h2>问卷管理</h2>
		<!-- <div class="user">
			<span>{{ username }}</span>
			<span @click="logout()">退出</span>
		</div> -->
	</div>
</template>

<script>
	import { logout } from '../api'
	export default {
		name: 'Header',

		methods: {
			logout() {
				logout()
			}
		}
	}
</script>

<style lang="scss">
	@import "../style/public.scss";

	.header {
		display: flex;
		justify-content: flex-start;
		align-items: center;
		height: 5rem;
		background-color:$orange;
		color: #fff;

		h2 {
			margin: 0 5rem 0 6rem;
			font-size: 1.8rem;

			&:before {
				display: inline-block;
				width: 2rem;
				height: 2rem;
				line-height: 2rem;
				margin-right: .5rem;
				content: "?";
				color: $orange;
				text-align: center;
				background-color: #fff;
				border-radius: 50%;
			}
		}

		h3 {
			font-size: 1.2rem;
			cursor: pointer;
		}
	}
</style>
