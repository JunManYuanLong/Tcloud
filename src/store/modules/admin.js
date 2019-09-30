import userApi from '@/api/user.js'
import versionApi from '@/api/version.js'
const GET_ASIDE = 'GET_ASIDE'
const ASIDE_HAS_ADMIN = 'ASIDE_HAS_ADMIN'
const ASIDE_NO_ADMIN = 'ASIDE_NO_ADMIN'
const IS_SHOW_MANAGE = 'IS_SHOW_MANAGE'
export default {
    state: {
        siderBarData: [],
        showManage:''
    },
    getters: {
      getSiderBarData (state) {
        return state.siderBarData
      }
    },
    mutations: {
        [ASIDE_HAS_ADMIN](state, lastVersion) {
            state.siderBarData = [
                {
                  icon: 'fa fa-dashboard',
                  text: 'Dashboard',
                  index: 'dashboard',
                  route: {name: 'dashboard'}
                },
                {
                  icon: 'el-icon-tickets',
                  text: '看板',
                  index: 'panel',
                  route: {name: 'panel'}
                },
                {
                  icon: 'el-icon-goods',
                  text: '迭代管理',
                  index: 'version',
                  route: {name: 'versionDetail', params: {versionId: lastVersion}}
                },
                {
                  icon: 'el-icon-menu',
                  text: '用例管理',
                  index: 'module',
                  route: {name: 'module'}
                },
                {
                  icon: 'el-icon-info',
                  text: '缺陷管理',
                  index: 'issue',
                  route: {name: 'issue',params:{versionId:lastVersion}}
                },
                {
                  icon: 'fa fa-book',
                  text: '需求管理',
                  index: 'requirement',
                  route: {name: 'requirementList',params:{requirementClassId:lastVersion=='all'?'a1':lastVersion}}
                },
                
                {
                  icon: 'fa fa-list-ul',
                  text: '流程管理',
                  index: 'flow',
                  route: {name: 'flowList'}
                },
                {
                  icon: 'fa fa-random',
                  text: '接口自动化',
                  index: 'manage',
                  route: {name:'projectManage'}
                },
                // {
                //   icon: 'el-icon-star-off',
                //   text: '埋点管理',
                //   index: 'track',
                //   route: {name:'trackIndex'}
                // },
                {
                  icon: 'el-icon-setting',
                  text: '项目管理',
                  index: 'tag',
                  route: {name:'TagManager'}
                }
            ]
        },
        [ASIDE_NO_ADMIN](state, lastVersion) {
            state.siderBarData = [
                {
                  icon: 'fa fa-dashboard',
                  text: 'Dashboard',
                  index: 'dashboard',
                  route: {name: 'dashboard'}
                },
                {
                  icon: 'el-icon-tickets',
                  text: '看板',
                  index: 'panel',
                  route: {name: 'panel'}
                },
                {
                  icon: 'el-icon-goods',
                  text: '迭代管理',
                  index: 'version',
                  route: {name: 'versionDetail', params: {versionId: lastVersion}}
                },
                {
                  icon: 'el-icon-menu',
                  text: '用例管理',
                  index: 'module',
                  route: {name: 'module'}
                },
                {
                  icon: 'el-icon-info',
                  text: '缺陷管理',
                  index: 'issue',
                  route: {name: 'issue',params:{versionId:lastVersion}}
                },
                {
                  icon: 'fa fa-book',
                  text: '需求管理',
                  index: 'requirement',
                  route: {name: 'requirementList',params:{requirementClassId:lastVersion=='all'?'a1':lastVersion}}
                },{
                  icon: 'fa fa-list-ul',
                  text: '流程管理',
                  index: 'flow',
                  route: {name: 'flowList'}
                },
                {
                  icon: 'fa fa-random',
                  text: '接口自动化',
                  index: 'manage',
                  route: {name:'projectManage'}
                },
                // {
                //   icon: 'el-icon-star-off',
                //   text: '埋点管理',
                //   index: 'track',
                //   route: {name:'trackIndex'}
                // }
            ]
        },
        [IS_SHOW_MANAGE](state,show){
          state.showManage = show
        }
    },
    actions: {
        [GET_ASIDE](store, params) {
            let param = {
                user_id: params.user_id,
                project_id: params.project_id
            }

            versionApi.getVersionByProject({projectid: params.project_id}).then(res => {
              let versionList = res.data.data
              let lastVersionInner = versionList[0]?versionList[0].id:'all'
              if(this.showManage){ // 显示人员管理
                store.commit('ASIDE_HAS_ADMIN', lastVersionInner)
              } else { // 不显示人员管理
                store.commit('ASIDE_NO_ADMIN', lastVersionInner)
              }
              store.commit('SET_VERSION',versionList)
              store.commit('CHANGE_VERSION',false)

              let lastVersion = store.rootState.project.versionList[0]?store.rootState.project.versionList[0].id:params.lastVersion 
              console.log('adminstorelastversion',lastVersion)
              userApi.isShowStuffAdmin(params).then(res => {
                  if (res.data.code == 0) {
                      let isShow = res.data.data[0].isappear == 0 ? true : false
                      store.commit(IS_SHOW_MANAGE,isShow)
                      if (isShow) { // 显示人员管理
                          store.commit(ASIDE_HAS_ADMIN, lastVersion)
                      } else { // 不显示人员管理
                          store.commit(ASIDE_NO_ADMIN, lastVersion)
                      }
                  } else {

                  }
              }, error => {
                  console.log(`${error.message}`)
                  store.commit(ASIDE_NO_ADMIN, lastVersion)
              })

              }).catch(err => {
                console.log(err)
              })

            
        }
    }
}