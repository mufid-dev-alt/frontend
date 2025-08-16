import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Card, Form, Button, ListGroup, Badge } from 'react-bootstrap';
import { API_ENDPOINTS, apiRequest } from '../../config/api';
import './ChatPage.css';

const ChatPage = ({ currentUser }) => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Fetch all users except current user
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await apiRequest(API_ENDPOINTS.users.list);
        if (response.success) {
          // Filter out current user
          const filteredUsers = response.users.filter(user => user.id !== currentUser.id);
          setUsers(filteredUsers);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, [currentUser.id]);

  // Fetch messages when a user is selected
  useEffect(() => {
    if (selectedUser) {
      fetchMessages();
    }
  }, [selectedUser]);

  // Scroll to bottom of messages
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async () => {
    if (!selectedUser) return;

    setLoading(true);
    try {
      const response = await apiRequest(
        API_ENDPOINTS.messages.getConversation(currentUser.id, selectedUser.id)
      );
      if (response.success) {
        setMessages(response.messages || []);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser) return;

    try {
      const messageData = {
        sender_id: currentUser.id,
        receiver_id: selectedUser.id,
        content: newMessage.trim(),
        message_type: 'text'
      };

      const response = await apiRequest(API_ENDPOINTS.messages.create, {
        method: 'POST',
        body: JSON.stringify(messageData),
      });

      if (response.success) {
        setNewMessage('');
        // Refresh messages
        fetchMessages();
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Container fluid className="chat-container mt-4">
      <h2 className="mb-4">Team Chat</h2>
      <Row>
        <Col md={4} className="mb-4">
          <Card className="user-list-card">
            <Card.Header>Team Members</Card.Header>
            <ListGroup variant="flush">
              {users.map(user => (
                <ListGroup.Item 
                  key={user.id} 
                  action 
                  active={selectedUser && selectedUser.id === user.id}
                  onClick={() => setSelectedUser(user)}
                  className="d-flex justify-content-between align-items-center"
                >
                  <div>
                    <div>{user.full_name}</div>
                    <small className="text-muted">{user.department || 'No Department'}</small>
                  </div>
                  <Badge bg="secondary" pill>
                    {user.employee_code}
                  </Badge>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Card>
        </Col>
        <Col md={8}>
          <Card className="chat-card">
            <Card.Header>
              {selectedUser ? (
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <span className="fw-bold">{selectedUser.full_name}</span>
                    <div className="small text-muted">{selectedUser.department || 'No Department'}</div>
                  </div>
                  <Badge bg="info">{selectedUser.employee_code}</Badge>
                </div>
              ) : 'Select a user to start chatting'}
            </Card.Header>
            <Card.Body className="chat-body">
              {selectedUser ? (
                <>
                  <div className="messages-container">
                    {messages.length === 0 && !loading ? (
                      <div className="text-center text-muted my-5">
                        No messages yet. Start the conversation!
                      </div>
                    ) : (
                      messages.map(message => (
                        <div 
                          key={message.id} 
                          className={`message ${message.sender_id === currentUser.id ? 'sent' : 'received'}`}
                        >
                          <div className="message-content">{message.content}</div>
                          <div className="message-time">{formatTime(message.timestamp)}</div>
                        </div>
                      ))
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                  <Form onSubmit={sendMessage} className="message-form">
                    <Form.Group className="d-flex">
                      <Form.Control
                        type="text"
                        placeholder="Type a message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                      />
                      <Button type="submit" variant="primary" className="ms-2">
                        Send
                      </Button>
                    </Form.Group>
                  </Form>
                </>
              ) : (
                <div className="text-center text-muted my-5">
                  Select a team member to start chatting
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ChatPage;