import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, ListGroup, Badge } from 'react-bootstrap';
import { API_ENDPOINTS, apiRequest } from '../../config/api';
import './TeamPage.css';

const TeamPage = ({ currentUser }) => {
  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await apiRequest(API_ENDPOINTS.users.list);
        if (response.success) {
          setUsers(response.users);
          
          // Extract unique departments
          const deptSet = new Set();
          response.users.forEach(user => {
            if (user.department) {
              deptSet.add(user.department);
            }
          });
          setDepartments(Array.from(deptSet));
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const getUsersByDepartment = (department) => {
    return users.filter(user => user.department === department);
  };

  const getUsersWithoutDepartment = () => {
    return users.filter(user => !user.department);
  };

  return (
    <Container className="mt-4">
      <h2 className="mb-4">Team Members</h2>
      
      {loading ? (
        <div className="text-center my-5">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <>
          {departments.map(department => (
            <Card key={department} className="mb-4">
              <Card.Header className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">{department}</h5>
                <Badge bg="primary" pill>
                  {getUsersByDepartment(department).length}
                </Badge>
              </Card.Header>
              <ListGroup variant="flush">
                {getUsersByDepartment(department).map(user => (
                  <ListGroup.Item 
                    key={user.id}
                    className={`d-flex justify-content-between align-items-center ${user.id === currentUser?.id ? 'current-user' : ''}`}
                  >
                    <div>
                      <div className="fw-bold">{user.full_name}</div>
                      <div className="text-muted small">{user.email}</div>
                    </div>
                    <div className="d-flex align-items-center">
                      <Badge bg={user.role === 'admin' ? 'danger' : 'info'} className="me-2">
                        {user.role}
                      </Badge>
                      <Badge bg="secondary" pill>
                        {user.employee_code}
                      </Badge>
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card>
          ))}
          
          {getUsersWithoutDepartment().length > 0 && (
            <Card className="mb-4">
              <Card.Header className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">No Department</h5>
                <Badge bg="secondary" pill>
                  {getUsersWithoutDepartment().length}
                </Badge>
              </Card.Header>
              <ListGroup variant="flush">
                {getUsersWithoutDepartment().map(user => (
                  <ListGroup.Item 
                    key={user.id}
                    className={`d-flex justify-content-between align-items-center ${user.id === currentUser?.id ? 'current-user' : ''}`}
                  >
                    <div>
                      <div className="fw-bold">{user.full_name}</div>
                      <div className="text-muted small">{user.email}</div>
                    </div>
                    <div className="d-flex align-items-center">
                      <Badge bg={user.role === 'admin' ? 'danger' : 'info'} className="me-2">
                        {user.role}
                      </Badge>
                      <Badge bg="secondary" pill>
                        {user.employee_code}
                      </Badge>
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card>
          )}
        </>
      )}
    </Container>
  );
};

export default TeamPage;