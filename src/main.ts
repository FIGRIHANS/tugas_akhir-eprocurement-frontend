// import './assets/main.css'
import './styles.css'
import 'vue-select/dist/vue-select.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import middleware from './middleware'

import { createI18n } from 'vue-i18n'
import { message } from '@/i18n/index'

import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import VueApexCharts from 'vue3-apexcharts'
import vSelect from 'vue-select'
import 'vue-toastification/dist/index.css'

const app = createApp(App)
const i18n = createI18n({
  locale: localStorage.getItem('locale') || 'id',
  fallbackLocale: 'en',
  messages: message,
})

app.use(createPinia())
app.use(router)
app.use(middleware)
app.use(VueApexCharts)
app.use(i18n)
app.component('VueDatePicker', VueDatePicker)
app.component('v-select', vSelect)

app.mount('#app')
