
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/Home.vue')
      },
      {
        path: 'post/:articleSlug',
        component: () => import('pages/SingleArticle.vue')
      },
      {
        path: 'tag/:tagSlug',
        component: () => import('pages/TagArchive.vue')
      },
      {
        path: 'category/:categorySlug',
        component: () => import('pages/CategoryArchive.vue')
      },
      {
        path: 'login',
        component: () => import('pages/Login.vue')
      },
      {
        path: 'register',
        component: () => import('pages/Register.vue')
      },
      {
        path: 'forgot-password',
        component: () => import('pages/ForgotPassword.vue')
      },
      {
        path: 'reset-password',
        component: () => import('pages/ResetPassword.vue')
      }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
