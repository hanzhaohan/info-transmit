import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

import Login from '../views/Login/Login'
import ReadLogin from '../views/ReadLogin/ReadLogin'
// import MarkdownEdit from '../views/MarkdownEdit/MarkdownEdit'
const MarkdownEdit = () => import('../views/MarkdownEdit/MarkdownEdit')
// import ContentShow from '../views/ContentShow/ContentShow'
const ContentShow = () => import('../views/ContentShow/ContentShow')
// import NewInfo from '../views/ContentShow/NewInfo/NewInfo'
const NewInfo = () => import('../views/ContentShow/NewInfo/NewInfo')
// import HelpArticle from '../views/ContentShow/HelpArticle/HelpArticle'
const HelpArticle = () => import('../views/ContentShow/HelpArticle/HelpArticle')
// import ArDownload from '../views/ContentShow/ArDownload/ArDownload'
const ArDownload = () => import('../views/ContentShow/ArDownload/ArDownload')
// import Production from '../views/ContentShow/Production/Production'
const Production = () => import('../views/ContentShow/Production/Production')
// import ArticleDetail from '../views/ArticleDetail/ArticleDetail'
const ArticleDetail = () => import('../views/ArticleDetail/ArticleDetail')
import PlAddImage from '../views/PlAddImage/PlAddImage'
import ProductList from '../views/ProductList/ProductList'
import Files from '../views/ContentShow/ArDownload/Files/Files'

const router = new VueRouter({
    mode: 'history',
    routes: [
        {
            path: '/content',
            component: ContentShow,
            meta: {
                isShow: true,
                isShowTitle: true
            },
            children: [
                {
                    path: '/content/newinfo',
                    component: NewInfo,
                    meta: {
                        isShow: true,
                        isShowTitle: true
                    }
                },
                {
                    path: '/content/helparticle',
                    component: HelpArticle,
                    meta: {
                        isShow: true,
                        isShowTitle: true
                    }
                },
                {
                    path: '/content/ardownload',
                    component: ArDownload,
                    meta: {
                        isShow: true,
                        isShowTitle: true
                    },
                    children: [
                        {
                            path: '/content/ardownload/files',
                            component: Files,
                            meta: {
                                isShow: true
                            }
                        },
                        // {
                        //     path: '',
                        //     redirect: '/content/ardownload/files'
                        // }
                    ]
                },
                {
                    path: '/content/production',
                    component: Production,
                    meta: {
                        isShow: true,
                        isShowTitle: true
                    }
                },
                {
                    path: '',
                    redirect: '/content/newinfo'
                }
            ]
        },
        {
            path: '/detail',
            name: 'detail',
            component: ArticleDetail,
            meta: {
                isShow: true
            }
        },
        {
            path: '/login',
            component: Login
        },
        {
            path: '/readlogin',
            component: ReadLogin
        },
        {
            path: '/mdedit',
            name: 'mdedit',
            component: MarkdownEdit,
            meta: {
                isShow: true,
                requireAuth: true
            }
        },
        {
            path: '/addimage',
            component: PlAddImage,
            meta: {
                isShow: true,
                requireAuth: true
            }
        },
        {
            path: '/productlist',
            component: ProductList,
            meta: {
                isShow: true
            }
        },
        {
            path: '/',
            redirect: '/content'
        },
    ],
    scrollBehavior (to, from, savedPosition) {
        if(to.path == '/detail') {
            return { x: 0, y: 0 };
        } else {
            return savedPosition;
        }
    }
})
router.beforeEach((to, from, next) => {
    const agent = navigator.userAgent
    const isiOS = !!agent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) // ios终端
    if (!to.meta.requireAuth) {
        if (isiOS && to.path !== location.pathname) {
            // 此处不可使用location.replace
            location.assign(to.fullPath)
          } else {
            next()
          }
    } else {
        if (!localStorage.getItem("UserCode") || localStorage.getItem("Company") !== '歐嘉璐尼') {
            Vue.toast('请先登录!');
            next('/login');
        } else {
            if (isiOS && to.path !== location.pathname) {
                // 此处不可使用location.replace
                location.assign(to.fullPath)
              } else {
                next()
              }
        }
    }
})

export default router