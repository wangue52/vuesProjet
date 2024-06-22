import { createRouter, createWebHistory } from 'vue-router'
import { routes } from './routes'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})
router.beforeEach((to , from, next)=>{
const token = localStorage.getItem('token')
if (to.name!=='login' && !token) {
  next({name:'login'})
}
if (to.name==='login' && token) {
  next({name:'dashboard'})
}
next() 
})
export default function (app) {
  app.use(router)
}
export { router }
