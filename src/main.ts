// import './assets/main.css'
import './styles.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import middleware from './middleware'

import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import VueApexCharts from 'vue3-apexcharts'

const app = createApp(App)

app.use(createPinia())
app.use(router)
// app.use(middleware)
app.use(VueApexCharts);
app.component('VueDatePicker', VueDatePicker)

app.mount('#app')
