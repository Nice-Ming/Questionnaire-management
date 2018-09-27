export const accountMixin = {
  data() {
    return {
      resultType: '',
      resultText: '',
      isShowResult: false,
    }
  },

  computed: {
    resultClassName() {
      return this.resultType
    }
  },

  methods: {
    showResult(type, msg) {
      this.resultType = type
      this.resultText = msg
      this.isShowResult = true
    }
  }
}