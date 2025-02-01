// import './assets/main.css'
import './styles.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import middleware from './middleware'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(middleware)

app.mount('#app')
