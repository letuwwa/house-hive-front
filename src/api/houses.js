import api from './client.js'

export function listHouses() {
  return api.get('/api/v1/houses')
}

export function createHouse(houseData) {
  return api.post('/api/v1/houses', houseData)
}

export function joinHouse(houseId) {
  return api.post(`/api/v1/houses/${encodeURIComponent(houseId)}/join`)
}
