import { createApp } from 'vue'
import App from './App.vue'
const app = createApp(App)

//router
import router from './router';
app.use(router)

//echarts
// import initEcharts from './plugins/echarts';
// initEcharts(app)

//ElementPlus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
app.use(ElementPlus, { size: 'default', zIndex: 3000 })
//ElementPlus icon
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

//pinia
import { createPinia } from 'pinia';
app.use(createPinia());

app.mount('#app')