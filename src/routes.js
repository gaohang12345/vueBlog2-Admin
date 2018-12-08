import Login from './views/Login.vue'
import NotFound from './views/404.vue'
import Home from './views/Home.vue'
import Main from './views/Main.vue'
import Table from './views/nav1/Table.vue'
import Form from './views/nav1/Form.vue'
import user from './views/nav1/user.vue'
import Page4 from './views/nav2/Page4.vue'
import Page5 from './views/nav2/Page5.vue'
import Page6 from './views/nav3/Page6.vue'
import echarts from './views/charts/echarts.vue'

let routes = [
  {
    path: '/login',
    component: Login,
    name: '',
    hidden: true
  },
  {
    path: '/404',
    component: NotFound,
    name: '',
    hidden: true
  },
  //{ path: '/main', component: Main },
  {
    path: '/',
    component: Home,
    name: '文章',
    iconCls: 'fa fa-id-card-o', //图标样式class el-icon-message
    children: [
      { path: '/main', component: Main, name: '主页', hidden: true },
      { path: '/table', component: Table, name: '文章列表' },
      { path: '/form', component: Form, name: '发布文章' },
      { path: '/user', component: user, name: '文章类型' }
    ]
  },
  {
    path: '/',
    component: Home,
    name: '图床',
    iconCls: 'fa fa-id-card-o', //图标样式class el-icon-message
    children: [
      { path: '/table', component: Table, name: '配置爬虫' },
      { path: '/form', component: Form, name: '图片列表' }
    ]
  },
  {
    path: '/',
    component: Home,
    name: '网站管理',
    iconCls: 'fa fa-address-card',
    children: [
      { path: '/page6', component: Page6, name: '用户管理' },
      { path: '/page7', component: Page6, name: '角色管理' }
    ]
  },
  {
    path: '/',
    component: Home,
    name: '报表',
    iconCls: 'fa fa-bar-chart',
    children: [{ path: '/echarts', component: echarts, name: 'echarts' }]
  },
  {
    path: '*',
    hidden: true,
    redirect: { path: '/404' }
  }
]

export default routes
