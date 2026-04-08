const Notification = ({ message, type }) => {
  if (!message) return null

  const style = {
    padding: '10px',
    marginBottom: '10px',
    border: '2px solid',
    borderColor: type === 'error' ? 'red' : 'green',
    color: type === 'error' ? 'red' : 'green',
    borderRadius: '5px',
  }

  return <div style={style}>{message}</div>
}

export default Notification