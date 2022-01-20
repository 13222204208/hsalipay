import request from '@/utils/request'

export function storeIncome(params) {
  return request({
    url: '/income',
    method: 'post',
    params: params
  })
}

export function incomeList(listQuery) {
  return request({
    url: '/income',
    method: 'get',
    params: listQuery
  })
}

export function delIncome(id) {
  return request({
    url: '/income/'+id,
    method: 'delete'
  })
}

export function editIncome(id) {
  return request({
    url: '/income/'+id+'/edit',
    method: 'get'
  })
}

export function updateIncome(id,params) {
  return request({
    url: '/income/'+id,
    method: 'patch',
    params:params
  })
}
