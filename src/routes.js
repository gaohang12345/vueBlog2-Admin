import Login from './views/Login.vue'
import NotFound from './views/404.vue'
import Home from './views/Home.vue'
import Main from './views/Main.vue'

// 文章
import ArticleList from './views/nav1/ArticleList.vue'
import AddArticle from './views/nav1/AddArticle.vue'
import ArticleTypeList from './views/nav1/ArticleTypeList.vue'
import RecycleBin from './views/nav1/RecycleBin.vue'

// 下载
import DownloadList from './views/nav2/DownloadList.vue'
import DownloadTypeList from './views/nav2/DownloadTypeList.vue'

// 图床
import ConfigureCrawler from './views/nav3/ConfigureCrawler.vue'
import PictureList from './views/nav3/PictureList.vue'

// 网站管理
import UserList from './views/nav4/UserList.vue'
import RoleList from './views/nav4/RoleList.vue'

// 报表
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
      { path: '/articleList', component: ArticleList, name: '文章列表' },
      { path: '/addArticle', component: AddArticle, name: '发布文章' },
      {
        path: '/articleTypeList',
        component: ArticleTypeList,
        name: '文章类型'
      },
      { path: '/recycleBin', component: RecycleBin, name: '回收站' }
    ]
  },
  {
    path: '/',
    component: Home,
    name: '下载',
    iconCls: 'fa fa-id-card-o', //图标样式class el-icon-message
    children: [
      { path: '/downloadList', component: DownloadList, name: '下载列表' },
      {
        path: '/downloadTypeList',
        component: DownloadTypeList,
        name: '下载类型'
      }
    ]
  },
  {
    path: '/',
    component: Home,
    name: '图床',
    iconCls: 'fa fa-id-card-o', //图标样式class el-icon-message
    children: [
      {
        path: '/configureCrawler',
        component: ConfigureCrawler,
        name: '配置爬虫'
      },
      { path: '/pictureList', component: PictureList, name: '图片列表' }
    ]
  },
  {
    path: '/',
    component: Home,
    name: '网站管理',
    iconCls: 'fa fa-address-card',
    children: [
      { path: '/userList', component: UserList, name: '用户管理' },
      { path: '/roleList', component: RoleList, name: '角色管理' }
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
