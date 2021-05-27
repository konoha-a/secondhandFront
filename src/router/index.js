import Vue from 'vue'
import VueRouter from 'vue-router'
import Index from '../views/Index.vue'
import UserLogin from '../views/UserLogin.vue'
import UserRegister from '../views/UserRegister.vue'
import Publish from '../views/Publish.vue'
import Favorites from '../views/Favorites.vue'
import ManagerLogin from '../views/ManagerLogin.vue'
import GoodsDetail from '../views/GoodsDetail.vue'
import GoodsClass from '../views/GoodsClass.vue'
import SubmitOrder from '../views/SubmitOrder.vue'
import UserDetail from '../views/UserDetail.vue'
import Search from '../views/Search.vue'

import Manager from '../views/Manager.vue'
import GoodsManage from '../views/ManagePage/GoodsManage.vue'
import OrderManage from '../views/ManagePage/OrderManage.vue'
import UserManage from '../views/ManagePage/UserManage.vue'
import MessManage from '../views/ManagePage/MessManage.vue'

import Message from '../views/Message.vue'
import MyMess from '../views/MessPage/MyMess.vue'
import SystemMess from '../views/MessPage/SystemMess.vue'
import MessSet from '../views/MessPage/MessSet.vue'

import PerCenter from '../views/PerCenter.vue'
import MyAttents from '../views/PerPage/MyAttents.vue'
import MyFans from '../views/PerPage/MyFans.vue'
import MyGoods from '../views/PerPage/MyGoods.vue'
import MyHistory from '../views/PerPage/MyHistory.vue'
import MyBuy from '../views/PerPage/MyBuy.vue'
import MySell from '../views/PerPage/MySell.vue'
import PerIndex from '../views/PerPage/PerIndex.vue'
import MySet from '../views/PerPage/MySet.vue'
import RecAdder from '../views/PerPage/RecAdder.vue'

Vue.use(VueRouter)

const routes = [
  {
    path:'/',
    name: 'Index',
    component: Index,
  },
  {
    path:'/index',
    name:'Index',
    component: Index
  },
  {
    path:'/userLogin',
    name:'UserLogin',
    component: UserLogin
  },
  {
    path:'/userRegister',
    name:'UserRegister',
    component: UserRegister
  },
  {
    path:'/publish',
    name:'Publish',
    component: Publish
  },
  {
    path:'/favorites',
    name:'Favorites',
    component: Favorites,
  },
  {
    path:'/managerLogin',
    name:'ManagerLogin',
    component: ManagerLogin
  },  
  {
    path:'/goodsDetail',
    name:'GoodsDetail',
    component:GoodsDetail
  },
  {
    path:'/goodsClass',
    name:'GoodsClass',
    component:GoodsClass
  },
  {
    path:'/submitOrder',
    name:'SubmitOrder',
    component:SubmitOrder
  },
  {
    path:'/userDetail',
    name:'UserDetail',
    component:UserDetail
  },
  {
    path:'/search',
    name:'Search',
    component:Search
  },
  {
    path:'/manager',
    name:'Manager',
    component: Manager,
    redirect:'/userManage',
    children:[
      {
        path:'/goodsManage',
        name:'GoodsManage',
        component:GoodsManage,
      },
      {
        path:'/orderManage',
        name:'OrderManage',
        component:OrderManage,
      },
      {
        path:'/userManage',
        name:'UserManage',
        component:UserManage,
      },
      {
        path:'/messManage',
        name:'MessManage',
        component:MessManage,
      },
    ]
  },
  {
    path:'/message',
    name:'Message',
    component: Message,
    redirect:'/myMess',
    children:[
      {
        path:'/myMess',
        name:'MyMess',
        component:MyMess,
      },
      {
        path:'/systemMess',
        name:'systemMess',
        component:SystemMess,
      },
      {
        path:'/messSet',
        name:'MessSet',
        component:MessSet,
      },
    ]
  },
  {
    path:'/perCenter',
    name:'PerCenter',
    component:PerCenter,
    redirect:'/perIndex',
    children:[
      {
        path:'/myAttents',
        name:'MyAttents',
        component:MyAttents
      },
      {
        path:'/myFans',
        name:'MyFans',
        component:MyFans
      },
      {
        path:'/myGoods',
        name:'MyGoods',
        component:MyGoods
      },
      {
        path:'/myHistory',
        name:'MyHistory',
        component:MyHistory
      },
      {
        path:'/myBuy',
        name:'MyBuy',
        component:MyBuy
      },
      {
        path:'/mySell',
        name:'MySell',
        component:MySell
      },
      {
        path:'/mySet',
        name:'MySet',
        component:MySet
      },
      {
        path:'/perIndex',
        name:'PerIndex',
        component:PerIndex
      },
      {
        path:'/recAdder',
        name:'RecAdder',
        component:RecAdder
      }
    ]
  },

]

const router = new VueRouter({
  routes
})

export default router
