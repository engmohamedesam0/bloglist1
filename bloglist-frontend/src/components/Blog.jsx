const Blog = ({ blog, onLike, user }) => {
  return (
    <div style={{ border: '1px solid', padding: '5px', marginBottom: '5px' }}>
      <div>
        <strong>{blog.title}</strong> - {blog.author}
      </div>
      <div>{blog.url}</div>
      <div>
        likes: {blog.likes}
        {user && (
          <button onClick={() => onLike(blog.id)}>like</button>
        )}
      </div>
      <div>added by {blog.user?.name}</div>
    </div>
  )
}

export default Blog