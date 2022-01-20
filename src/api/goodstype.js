import request from '@/utils/request'

export function storeGoodsType(params) {
  return request({
    url: '/goodstype',
    method: 'post',
    params: params
  })
}

export function goodsTypeList(listQuery) {
  return request({
    url: '/goodstype',
    method: 'get',
    params: listQuery
  })
}

export function delGoodsType(id) {
  return request({
    url: '/goodstype/'+id,
    method: 'delete'
  })
}

export function editGoodsType(id) {
  return request({
    url: '/goodstype/'+id+'/edit',
    method: 'get'
  })
}

export function updateGoodsType(id,params) {
  return request({
    url: '/goodstype/'+id,
    method: 'patch',
    params:params
  })
}

export function showGoodsType() {
  return request({
    url: '/goodstype/1',
    method: 'get',
  })
}
