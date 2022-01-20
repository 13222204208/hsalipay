import request from '@/utils/request'


export function updateMinappSetting(params) {
  return request({
    url: '/minapp-setting',
    method: 'post',
    params: params
  })
}

export function getMinappSettingInfo() {
  return request({
    url: '/minapp-setting',
    method: 'get'
  })
}

//胶囊设置
export function updateCapsuleSetting(params) {
  return request({
    url: '/capsule-setting',
    method: 'post',
    params: params
  })
}

export function getCapsuleSettingInfo() {
  return request({
    url: '/capsule-setting',
    method: 'get'
  })
}

//合作伙伴接口
export function storePartner(params) {
  return request({
    url: '/partner',
    method: 'post',
    params: params
  })
}

export function partnerList(listQuery) {
  return request({
    url: '/partner',
    method: 'get',
    params: listQuery
  })
}

export function delPartner(id) {
  return request({
    url: '/partner/'+id,
    method: 'delete'
  })
}

export function editPartner(id) {
  return request({
    url: '/partner/'+id+'/edit',
    method: 'get'
  })
}

export function updatePartner(id,params) {
  return request({
    url: '/partner/'+id,
    method: 'patch',
    params:params
  })
}

