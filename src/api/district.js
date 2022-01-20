import request from '@/utils/request'

export function storeDistrict(params) {
  return request({
    url: '/district',
    method: 'post',
    params: params
  })
}

export function districtList() {
  return request({
    url: '/district',
    method: 'get',
  })
}

