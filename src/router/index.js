import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '主页', icon: 'dashboard' }
    }]
  },

  {
    path: '/user',
    component: Layout,
    meta: { title: '用户管理', icon: 'el-icon-user-solid' },
    children: [
      {
        path: 'list',
        name: 'UserList',
        component: () => import('@/views/user/userlist'),
        meta: { title: '用户列表', icon: 'el-icon-user-solid' }
      },
    ]
  },

  {
    path: '/goods',
    component: Layout,
    meta: { title: '商品管理', icon: 'el-icon-s-goods' },
    redirect: '/goods/goods-list',
    children: [
      {
        path: 'goods-type-list',
        name: 'GoodsTypeList',
        component: () => import('@/views/goods/goodstype/index'),
        meta: { title: '商品类型',  }
      },
      {
        path: 'create-goods-type',
        name: 'CreateGoodsType',
        component: () => import('@/views/goods/goodstype/create'),
        meta: { title: '添加商品类型'},
        hidden: true
      },

      {
        path: 'goodstype/edit/:id(\\d+)',
        component: () => import('@/views/goods/goodstype/edit'),
        name: 'EditGoodsType',
        meta: { title: '编辑商品类型', noCache: true},
        hidden: true
      },

      {
        path: 'goods-list',
        name: 'GoodsList',
        component: () => import('@/views/goods/index'),
        meta: { title: '商品列表',  }
      },
      {
        path: 'create-goods',
        name: 'CreateGoods',
        component: () => import('@/views/goods/create'),
        meta: { title: '添加商品'},
        hidden: true
      },

      {
        path: 'edit/:id(\\d+)',
        component: () => import('@/views/goods/edit'),
        name: 'EditGoods',
        meta: { title: '编辑商品', noCache: true},
        hidden: true
      },

    ]
  },

  {
    path: '/order',
    component: Layout,
    meta: { title: '订单管理', icon: 'el-icon-notebook-2' },
    children: [
      {
        path: 'recy-order-list',
        name: 'RecyOrderList',
        component: () => import('@/views/order/recy-order/list'),
        meta: { title: '回收订单', }
      },
      {
        path: 'convert-order-list',
        name: 'ConvertOrderList',
        component: () => import('@/views/order/convert-order/list'),
        meta: { title: '兑换订单', }
      },
    ]
  },


  {
    path: '/agreement',
    component: Layout,
    redirect: '/agreement/create',
    name: 'Agreement',
    meta: { title: '回收须知', icon: 'el-icon-s-help' },
    children: [
      {
        path: 'create',
        name: 'CreateAgreement',
        component: () => import('@/views/agreement/create'),
        meta: { title: '添加须知', icon: 'tree' },
        hidden: true
      },
      {
        path: 'list',
        name: 'AgreementList',
        component: () => import('@/views/agreement/list'),
        meta: { title: '须知列表', icon: 'table' }
      },
      {
        path: 'edit/:id(\\d+)',
        component: () => import('@/views/agreement/edit'),
        name: 'EditAgreement',
        meta: { title: '编辑须知', noCache: true, activeMenu: '/agreement/list' },
        hidden: true
      },
    ]
  },

  {
    path: '/banner',
    component: Layout,
    children: [
      {
        path: 'list',
        name: 'BannerList',
        component: () => import('@/views/banner/index'),
        meta: { title: 'Banner管理', icon: 'el-icon-s-platform' }
      },
      {
        path: 'create',
        name: 'CreateBanner',
        component: () => import('@/views/banner/create'),
        meta: { title: '添加Banner', },
        hidden: true
      },

      {
        path: 'edit/:id(\\d+)',
        name: 'EditBanner',
        component: () => import('@/views/banner/edit'),
        meta: { title: '编辑Banner',  },
        hidden: true
      },
    ]
  },

  {
    path: '/classify',
    component: Layout,
    meta: { title: '分类管理', icon: 'el-icon-s-unfold'  },
    children: [
      {
        path: 'list',
        name: 'ClassifyList',
        component: () => import('@/views/classify/index'),
        meta: { title: '分类列表', }
      },
      {
        path: 'create',
        name: 'CreateClassify',
        component: () => import('@/views/classify/create'),
        meta: { title: '添加分类' },
        hidden: true
      },

      {
        path: 'edit/:id(\\d+)',
        name: 'EditClassify',
        component: () => import('@/views/classify/edit'),
        meta: { title: '编辑分类' },
        hidden: true
      },

      {
        path: 'income-list',
        name: 'IncomeList',
        component: () => import('@/views/classify/income/index'),
        meta: { title: '预计收益',}
      },
      {
        path: 'create-income',
        name: 'CreateIncome',
        component: () => import('@/views/classify/income/create'),
        meta: { title: '添加收益' },
        hidden: true
      },

      {
        path: 'income/edit/:id(\\d+)',
        name: 'EditIncome',
        component: () => import('@/views/classify/income/edit'),
        meta: { title: '编辑收益' },
        hidden: true
      },

      {
        path: 'appliance',
        name: 'Appliance',
        component: () => import('@/views/classify/appliance/index'),
        meta: { title: '家电管理',}
      },
      
      {
        path: 'district',
        name: 'District',
        component: () => import('@/views/classify/district/index'),
        meta: { title: '地区管理',}
      },
    ]
  },

  {
    path: '/setting',
    component: Layout,
    name: 'Setting',
    meta: { title: '系统设置', icon: 'el-icon-s-help' },
    children: [

      {
        path: 'minapp-setting',
        name: 'MinappSettingIndex',
        component: () => import('@/views/setting/minapp-setting/index'),
        meta: { title: '小程序设置', }
      },
      {
        path: 'partner-setting',
        name: 'PartnerList',
        component: () => import('@/views/setting/partner-setting/index'),
        meta: { title: '合作伙伴设置', }
      },
      {
        path: 'create-partner',
        name: 'CreatePartner',
        component: () => import('@/views/setting/partner-setting/create'),
        meta: { title: '添加合作伙伴' },
        hidden: true
      },
      {
        path: 'edit/:id(\\d+)',
        name: 'EditPartner',
        component: () => import('@/views/setting/partner-setting/edit'),
        meta: { title: '编辑合作伙伴', icon: 'tree' },
        hidden: true
      },
      {
        path: 'list',
        name: 'AdminList',
        component: () => import('@/views/admin/index'),
        meta: { title: '后台帐号',  }
      },
      {
        path: 'create',
        name: 'CreateAdmin',
        component: () => import('@/views/admin/create'),
        meta: { title: '添加后台帐号', },
        hidden: true
      },

      {
        path: 'edit',
        name: 'EditAdmin',
        component: () => import('@/views/admin/edit'),
        meta: { title: '编辑后台帐号',},
        hidden: true
      },

      {
        path: 'capsule-setting',
        name: 'CapsuleSettingIndex',
        component: () => import('@/views/setting/capsule-setting/index'),
        meta: { title: '胶囊设置', }
      },

    ]
  },


  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
