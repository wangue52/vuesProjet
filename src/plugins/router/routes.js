
export const routes = [


  { path: '/', redirect: '/dashboard' },
  {
    path: '/',
    component: () => import('@/layouts/default.vue'),
    children: [
      {
        path: 'dashboard',
        component: () => import('@/pages/dashboard.vue'),
        
      },
      {
        path: 'account-settings',
        component: () => import('@/pages/account-settings.vue'),
       
      },
      {
        path: 'nouvelle-lettre',
        component: () => import('@/pages/nouvelle-lettre.vue'),
       
      },
      {
        path: 'location',
        component: () => import('@/pages/location.vue'),
       
      },
      {
        path: 'bloc',
        component: () => import('@/pages/bloc.vue'),
       
      },
      {
        path: 'ajouter-user',
        component: () => import('@/pages/ajouter-user.vue'),
       
      },
      {
        path: 'liste-utilisateur',
        component: () => import('@/pages/liste-utilisateur.vue'),
      
      },
      {
        path: 'liste-boutique',
        component: () => import('@/pages/liste-boutique.vue'),
      },
      {
        path: 'store-localisation',
        component: () => import('@/pages/store-localisation.vue'),
      },
    ],
  },
  {
    path: '/',
    component: () => import('@/layouts/blank.vue'),
    children: [
      {
        path: 'login',
        component: () => import('@/pages/login.vue'),
      },
      {
        path: 'register',
        component: () => import('@/pages/register.vue'),
      },
      {
        path: '/:pathMatch(.*)*',
        component: () => import('@/pages/[...error].vue'),
      },
    ],
  },
]

