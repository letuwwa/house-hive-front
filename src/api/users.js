import api from "./client";

export function getUsers() {
  return api.get("/api/users/");
}

export function followUser(username) {
  return api.post(`/api/users/follow/${username}`);
}

export function getFriends() {
  return api.get("/api/users/friends");
}

export function unfollowUser(username) {
  return api.post(`/api/users/unfollow/${username}`);
}

export function getStats() {
  return api.get("/api/users/stats");
}