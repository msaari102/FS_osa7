import { useSelector } from 'react-redux'

const UserList = () => {
  const users = useSelector((state) => state.users)

  return (
    <div>
      <h2>Users</h2>
      <table>
        <thead>
          <tr>
            <td></td>
            <td>
              <b>blogs created</b>
            </td>
          </tr>
        </thead>
        <tbody>
          {[...users]
            .sort((a, b) => b.blogs.length - a.blogs.length)
            .map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.blogs.length}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  )
}

export default UserList
