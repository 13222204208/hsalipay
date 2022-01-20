import request from '@/utils/request'

export function storeGoods(params) {
  return request({
    url: '/goods',
    method: 'post',
    params: params
  })
}

export function goodsList(listQuery) {
  return request({
    url: '/goods',
    method: 'get',
    params: listQuery
  })
}

export function delGoods(id) {
  return request({
    url: '/goods/'+id,
    method: 'delete'
  })
}

export function editGoods(id) {
  return request({
    url: '/goods/'+id+'/edit',
    method: 'get'
  })
}

export function updateGoods(id,params) {
  return request({
    url: '/goods/'+id,
    method: 'patch',
    params:params
  })
}
