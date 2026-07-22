import api from "./client.js";

export function getHouse(house_Id) {
  return api.get(`/api/v1/houses/${house_Id}`);
}

export function listHouseMembers(house_Id) {
  return api.get(`/api/v1/house-members?house_id=${house_Id}`);
}
