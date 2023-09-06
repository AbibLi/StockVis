import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

/**this is a route config to change different view */
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/Home/BasicPie',
    children: [
      {
        path: '/Home/BasicPie',
        name: 'HomePage',
        component: () => import('../views/Home.vue'),
        children: [
          {
            path: '/Home/BasicBar',
            name: 'BasicBar',
            component: () => import('../components/BasicBar.vue'),
          },
          {
            path: '/Home/BasicPie',
            name: 'BasicPie',
            component: () => import('../components/BasicPie.vue'),
          },
          {
            path: '/Home/Sunburst',
            name: 'Sunburst',
            component: () => import('../components/Sunburst.vue'),
          },
          {
            path: '/Home/GridView',
            name: 'GridView',
            component: () => import('../components/GridView.vue'),
          }
        ]
      },

    ]
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;