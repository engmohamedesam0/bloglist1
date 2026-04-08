const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const { userExtractor } = require('../middleware')

blogsRouter.get('/', async (request, response) => {
  const { search, author, sortBy, order, page, limit } = request.query

  const filter = {}
  if (search) filter.title = { $regex: search, $options: 'i' }
  if (author) filter.author = { $regex: author, $options: 'i' }

  const allowedSortFields = ['likes']
  if (sortBy && !allowedSortFields.includes(sortBy)) {
    return response.status(400).json({ error: `sorting by '${sortBy}' is not supported` })
  }

  const sortOrder = order === 'asc' ? 1 : -1
  const sortOptions = sortBy ? { [sortBy]: sortOrder } : {}

  const pageNum = parseInt(page) || 1
  const pageSize = parseInt(limit) || 10
  const skip = (pageNum - 1) * pageSize

  const total = await Blog.countDocuments(filter)
  const totalPages = Math.ceil(total / pageSize)

  const blogs = await Blog.find(filter)
    .populate('user', { username: 1, name: 1 })
    .sort(sortOptions)
    .skip(skip)
    .limit(pageSize)

  response.json({
    blogs,
    pagination: {
      currentPage: pageNum,
      pageSize,
      total,
      totalPages,
    },
  })
})

blogsRouter.post('/', userExtractor, async (request, response) => {
  const user = request.user

  const blog = new Blog({
    ...request.body,
    user: user._id,
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', userExtractor, async (request, response) => {
  const user = request.user

  const blog = await Blog.findById(request.params.id)

  if (!blog) {
    return response.status(404).json({ error: 'blog not found' })
  }

  if (blog.user.toString() !== user._id.toString()) {
    return response.status(403).json({ error: 'only the creator can delete this blog' })
  }

  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

blogsRouter.patch('/:id/like', async (request, response) => {
  const { id } = request.params

  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    return response.status(400).json({ error: 'malformed id' })
  }

  const blog = await Blog.findByIdAndUpdate(
    id,
    { $inc: { likes: 1 } },
    { new: true }
  )

  if (!blog) {
    return response.status(404).json({ error: 'blog not found' })
  }

  response.json(blog)
})

module.exports = blogsRouter