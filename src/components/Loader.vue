<template>
  <div class="loader">
    <div class="loder-inner line-scale">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Loader'
}
</script>

<style lang="scss" scoped>
@import '../style/public.scss';

.loader {
	@include flex-center();
  position: absolute;
	top: 5rem;
	right: 0;
	bottom: 0;
	left: 0;
	background-color: #f9f9f9;
}

/**
 * loading icon
 */
@keyframes line-scale {
  0% {
		transform: scaley(1);
	}

  50% {
		transform: scaley(0.4);
	}

  100% {
		transform: scaley(1);
	}
}

.line-scale > div:nth-child(1) {
		animation: line-scale 1s 0.1s infinite cubic-bezier(.2, .68, .18, 1.08);
}
.line-scale > div:nth-child(2) {
		animation: line-scale 1s 0.2s infinite cubic-bezier(.2, .68, .18, 1.08);
}
.line-scale > div:nth-child(3) {
		animation: line-scale 1s 0.3s infinite cubic-bezier(.2, .68, .18, 1.08);
}
.line-scale > div:nth-child(4) {
		animation: line-scale 1s 0.4s infinite cubic-bezier(.2, .68, .18, 1.08);
}
.line-scale > div:nth-child(5) {
		animation: line-scale 1s 0.5s infinite cubic-bezier(.2, .68, .18, 1.08);
}
.line-scale > div {
	background-color: $orange;
	width: 4px;
	height: 35px;
	border-radius: 2px;
	margin: 2px;
	animation-fill-mode: both;
	display: inline-block;
}
</style>


