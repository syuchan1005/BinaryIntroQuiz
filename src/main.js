// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import axios from 'axios';

import Vue from 'vue';
import VueMaterial from 'vue-material';

import 'vue-material/dist/vue-material.css';
import 'material-design-icons/iconfont/material-icons.css';
import App from './App';
import router from './router';

Vue.config.productionTip = false;

Vue.mixin({
  mounted() {
    let { title } = this.$options;
    if (title) {
      title = typeof title === 'function' ? title.call(this) : title;
      document.title = `${title} - BinaryIntroQuiz`;
    }
  },
});

Vue.prototype.$http = axios;

Vue.use(VueMaterial);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App },
});
