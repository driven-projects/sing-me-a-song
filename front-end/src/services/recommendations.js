import api from "./api";

export async function list() {
  const response = await api.get("/recommendations");
  return response.data;
}

export async function create(data) {
  const response = await api.post("/recommendations", data);
  return response.data;
}

export async function upvote(id) {
  const response = await api.post(`/recommendations/${id}/upvote`);
  return response.data;
}

export async function downvote(id) {
  const response = await api.post(`/recommendations/${id}/downvote`);
  return response.data;
}

export async function listTop() {
  const response = await api.get("/recommendations/top/10");
  return response.data;
}

export async function get(id = 'random') {
  const response = await api.get(`/recommendations/${id}`);
  return response.data;
}
