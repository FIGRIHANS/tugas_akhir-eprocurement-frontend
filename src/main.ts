// import './assets/main.css'
import './styles.css'
import 'vue-select/dist/vue-select.css';

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import middleware from './middleware'

import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import VueApexCharts from 'vue3-apexcharts'
import vSelect from 'vue-select'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(middleware)
app.use(VueApexCharts);
app.component('VueDatePicker', VueDatePicker)
app.component('v-select', vSelect)

app.mount('#app')
