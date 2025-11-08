import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from '../config/axios';
import { AuthContext } from '../context/AuthContext';

const UserDashboard = () => {
  const { user, loading: authLoading } = useContext(AuthContext);
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        navigate('/login');
      } else {
        fetchApplications();
      }
    }
  }, [user, authLoading, navigate]);

  const fetchApplications = async () => {
    try {
      const res = await axios.get('/api/adoptions/my-applications');
      setApplications(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>My Adoption Applications</h1>
      {applications.length === 0 ? (
        <div className="card">
          <p>You have no adoption applications yet.</p>
          <Link to="/" className="btn btn-primary" style={{ marginTop: '20px' }}>
            Browse Pets
          </Link>
        </div>
      ) : (
        <div className="card">
          <table className="table">
            <thead>
              <tr>
                <th>Pet Name</th>
                <th>Species</th>
                <th>Breed</th>
                <th>Age</th>
                <th>Status</th>
                <th>Applied Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {applications.map(app => (
                <tr key={app._id}>
                  <td>{app.pet.name}</td>
                  <td>{app.pet.species}</td>
                  <td>{app.pet.breed}</td>
                  <td>{app.pet.age} years</td>
                  <td>
                    <span className={`badge badge-${app.status === 'approved' ? 'approved' : app.status === 'rejected' ? 'rejected' : 'pending-app'}`}>
                      {app.status}
                    </span>
                  </td>
                  <td>{new Date(app.createdAt).toLocaleDateString()}</td>
                  <td>
                    <Link to={`/pet/${app.pet._id}`} className="btn btn-secondary" style={{ padding: '5px 15px', fontSize: '14px' }}>
                      View Pet
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;

