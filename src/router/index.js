import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
      meta: {
        title: 'Home',
      }
    },
    {
      path: '/weather/:state/:city',
      name: 'city',
      component: () => import('../views/CityView.vue'),
      meta: {
        title: 'Weather',
      }
    }
  ],
})

router.beforeEach((to, from, next) => {
  document.title = `${to.params.state ? `${to.params.city}, ${to.params.state}` :  to.meta.title} | The Local Weather`
  next()
})

export default router
