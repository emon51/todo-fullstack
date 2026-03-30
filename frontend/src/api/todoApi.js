import axiosInstance from './axiosInstance'

export const getTodos = async (params = {}) => {
  const response = await axiosInstance.get('/todos/', { params })
  return response.data
}

export const createTodo = async (data) => {
  const response = await axiosInstance.post('/todos/', data)
  return response.data
}

export const getTodo = async (id) => {
  const response = await axiosInstance.get(`/todos/${id}/`)
  return response.data
}

export const updateTodo = async (id, data) => {
  const response = await axiosInstance.put(`/todos/${id}/`, data)
  return response.data
}

export const patchTodo = async (id, data) => {
  const response = await axiosInstance.patch(`/todos/${id}/`, data)
  return response.data
}

export const deleteTodo = async (id) => {
  await axiosInstance.delete(`/todos/${id}/`)
}