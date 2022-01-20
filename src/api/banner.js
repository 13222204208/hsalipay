import request from '@/utils/request'

export function storeBanner(params) {
  return request({
    url: '/banner',
    method: 'post',
    params: params
  })
}

export function bannerList(listQuery) {
  return request({
    url: '/banner',
    method: 'get',
    params: listQuery
  })
}

export function delBanner(id) {
  return request({
    url: '/banner/'+id,
    method: 'delete'
  })
}

export function editBanner(id) {
  return request({
    url: '/banner/'+id+'/edit',
    method: 'get'
  })
}

export function updateBanner(id,params) {
  return request({
    url: '/banner/'+id,
    method: 'patch',
    params:params
  })
}
