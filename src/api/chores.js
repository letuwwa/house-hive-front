import api from "./client.js";

export function listHouseChores(house_Id) {
  return api.get(`/api/v1/chores?house_id=${house_Id}`);
}

export function createChore(choreData) {
  return api.post("/api/v1/chores", choreData);
}

export function updateChore(choreId, choreData) {
  return api.patch(`/api/v1/chores/${choreId}`, choreData);
}

export function deleteChore(choreId) {
  return api.delete(`/api/v1/chores/${choreId}`);
}
