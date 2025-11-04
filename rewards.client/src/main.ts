import type { App as VueApp } from 'vue'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/styles/main.css'

const app: VueApp = createApp(App)

app.use(router)
app.mount('#app')
