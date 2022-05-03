import api from "./api";

export async function list() {
  const response = await api.get("/recommendations");
  return response.data;
}

export async function create(data) {
  const response = await api.post("/recommendations", data);
  return response.data;
}
