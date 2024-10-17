import  { useState, useEffect } from 'react';
import { Table, Button, Alert, Form, InputGroup } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch} from '@fortawesome/free-solid-svg-icons';
import { getAllUser } from '../services/UserService';

const MngUser = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getAllUser();
        setUsers(response.data);
        setFilteredUsers(response.data); // Initially, show all users
      } catch (err) {
        setError('Failed to fetch users');
      }
    };

    fetchUsers();
  }, []);

  const handleSearch = () => {
    if (searchQuery.trim() !== '') {
      const filtered = users.filter(user =>
        user.user_Name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users); // If search query is empty, show all users
    }
  };

  return (
    <div className="container mt-5">
      <h2>User List</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <InputGroup className="mb-3">
        <Form.Control
          placeholder="Search by username"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Button variant="outline-secondary" onClick={handleSearch}>
          <FontAwesomeIcon icon={faSearch} /> Search
        </Button>
      </InputGroup>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Login Type</th>
            <th>Username</th>
            <th>Email</th>
            <th>Phone Number</th>
            <th>Address</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.login_Type}</td>
                <td>{user.user_Name}</td>
                <td>{user.email}</td>
                <td>{user.phone_Number}</td>
                <td>{user.address}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center">No users found</td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default MngUser;
