// src/components/AdminDashboard.tsx
import React, { useState, useEffect } from 'react';
import { Modal, Button, TextField } from '@mui/material';
import axios from 'axios';

const AdminDashboard: React.FC = () => {
  const [tests, setTests] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [newTest, setNewTest] = useState({ name: '', duration: 0 });

  useEffect(() => {
    const fetchTests = async () => {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.get('https://quiz-server-sigma.vercel.app/tests', { headers });
      setTests(response.data);
    };
    fetchTests();
  }, []);

  const handleCreateTest = async () => {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    await axios.post('https://quiz-server-sigma.vercel.app/admin/tests', newTest, { headers });
    setShowPopup(false);
    setNewTest({ name: '', duration: 0 });
  };

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <Button onClick={() => setShowPopup(true)}>Create New Test</Button>
      <ul>
        {tests.map((test: any) => (
          <li key={test.id}>
            {test.name} - {test.duration} minutes
            {/* Add analytics link */}
          </li>
        ))}
      </ul>

      <Modal open={showPopup} onClose={() => setShowPopup(false)}>
        <div>
          <h2>Create New Test</h2>
          <TextField label="Test Name" value={newTest.name} onChange={(e) => setNewTest({ ...newTest, name: e.target.value })} />
          <TextField label="Duration (minutes)" type="number" value={newTest.duration} onChange={(e) => setNewTest({ ...newTest, duration: Number(e.target.value) })} />
          <Button onClick={handleCreateTest}>Create Test</Button>
        </div>
      </Modal>
    </div>
  );
};

export default AdminDashboard;
