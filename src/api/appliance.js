import request from '@/utils/request'

export function storeAppliance(params) {
  return request({
    url: '/appliance',
    method: 'post',
    params: params
  })
}

export function applianceList() {
  return request({
    url: '/appliance',
    method: 'get',
  })
}

export function delAppliance(id) {
  return request({
    url: '/appliance/'+id,
    method: 'delete'
  })
}

export function editIncome(id) {
  return request({
    url: '/income/'+id+'/edit',
    method: 'get'
  })
}

export function updateAppliance(id,params) {
  return request({
    url: '/appliance/'+id,
    method: 'patch',
    params:params
  })
}
