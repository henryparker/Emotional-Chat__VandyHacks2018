

var app5 = new Vue({
  el: '#app-5',
  methods: {
    turnOfCamera: function () {
      this.message = this.message.split('').reverse().join('')
    }
  }
})

