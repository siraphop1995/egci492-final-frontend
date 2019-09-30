import Vue from 'vue'
import Router from 'vue-router'
import VueCookies from 'vue-cookies'
import Toolbar from '@/components/Toolbar'
import SignIn from '@/components/SignIn'
import SignUp from '@/components/SignUp'
import SignOut from '@/components/SignOut'
import NewsFeed from '@/components/NewsFeed'
import ViewImageFromNewsFeed from '@/components/ViewImageFromNewsFeed'
import ViewImageFromMyProfile from '@/components/ViewImageFromMyProfile'
import AddImage from '@/components/AddImage'
import MyProfile from '@/components/MyProfile'
import EditProfile from '@/components/EditProfile'
import Uploader from '@/components/Uploader'
import NewsFeed2 from '@/components/NewsFeed2'
import MyProfile2 from '@/components/MyProfile2'

Vue.use(Router)
Vue.use(VueCookies)
VueCookies.config('7d')

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/newfeed'
    },
    {
      path: '/toolbar',
      name: 'Toolbar',
      component: Toolbar
    },
    {
      path: '/signin',
      name: 'SignIn',
      component: SignIn
    },
    {
      path: '/signup',
      name: 'SignUp',
      component: SignUp
    },
    {
      path: '/signout',
      name: 'SignOut',
      component: SignOut
    },
    {
      path: '/newsfeed',
      name: 'NewsFeed',
      component: NewsFeed
    },
    {
      path: '/viewimagefromnewsfeed/:imageId',
      name: 'ViewImageFromNewsFeed',
      component: ViewImageFromNewsFeed
    },
    {
      path: '/viewimagefrommyprofile/:imageId',
      name: 'ViewImageFromMyProfile',
      component: ViewImageFromMyProfile
    },
    {
      path: '/addimage',
      name: 'AddImage',
      component: AddImage
    },
    {
      path: '/myprofile',
      name: 'MyProfile',
      component: MyProfile
    },
    {
      path: '/editprofile',
      name: 'EditProfile',
      component: EditProfile
    },
    {
      path: '/uploader',
      name: 'Uploader',
      component: Uploader
    },
    {
      path: '/newsfeed2',
      name: 'NewsFeed2',
      component: NewsFeed2
    },
    {
      path: '/myprofile2',
      name: 'MyProfile2',
      component: MyProfile2
    }
  ],
  mode: 'history'
})
