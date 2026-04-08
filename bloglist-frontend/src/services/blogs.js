import axios from 'axios'

let token = null

const setToken = (newToken) => {
  token = `Bearer ${newToken}`
}

const getAll = async () => {
  const response = await axios.get('/api/blogs')
  return response.data
}

const create = async (newBlog) => {
  const config = {
    headers: { Authorization: token },
  }
  const response = await axios.post('/api/blogs', newBlog, config)
  return response.data
}

const like = async (id) => {
  const response = await axios.patch(`/api/blogs/${id}/like`)
  return response.data
}

export default { setToken, getAll, create, like }