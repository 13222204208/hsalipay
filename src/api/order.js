import request from '@/utils/request'

export function getRecyOrderList(listQuery) {
  return request({
    url: '/recy-order',
    method: 'get',
    params: listQuery
  })
}

export function updateRecyOrder(id,params) {
  return request({
    url: '/recy-order/'+id,
    method: 'patch',
    params:params
  })
}

export function delRecyOrder(id) {
  return request({
    url: '/recy-order/'+id,
    method: 'delete'
  })
}


//商城兑换订单
export function getConvertOrderList(listQuery) {
  return request({
    url: '/convert-order',
    method: 'get',
    params: listQuery
  })
}

export function updateConvertOrder(id,params) {
  return request({
    url: '/convert-order/'+id,
    method: 'patch',
    params:params
  })
}

export function delConvertOrder(id) {
  return request({
    url: '/convert-order/'+id,
    method: 'delete'
  })
}
