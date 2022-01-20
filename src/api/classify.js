import request from '@/utils/request'

export function storeClassify(params) {
  return request({
    url: '/classify',
    method: 'post',
    params: params
  })
}

export function classifyList(listQuery) {
  return request({
    url: '/classify',
    method: 'get',
    params: listQuery
  })
}


export function editClassify(id) {
  return request({
    url: '/classify/'+id+'/edit',
    method: 'get'
  })
}

export function updateClassify(id,params) {
  return request({
    url: '/classify/'+id,
    method: 'patch',
    params:params
  })
}

export function showClassify(id) {
  return request({
    url: '/classify/'+id,
    method: 'get',
  })
}
