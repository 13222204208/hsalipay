import request from '@/utils/request'

export function storeAdmin(params) {
  return request({
    url: '/admin',
    method: 'post',
    params: params
  })
}

export function adminList(listQuery) {
  return request({
    url: '/admin',
    method: 'get',
    params: listQuery
  })
}

export function delAdmin(id) {
  return request({
    url: '/admin/'+id,
    method: 'delete'
  })
}

export function updateAdmin(params) {
  return request({
    url: '/admin/1',//1只为替代，没有作用
    method: 'patch',
    params:params
  })
}
