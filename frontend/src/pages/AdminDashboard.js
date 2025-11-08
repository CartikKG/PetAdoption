import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../config/axios';
import { AuthContext } from '../context/AuthContext';

const AdminDashboard = () => {
  const { user, loading: authLoading } = useContext(AuthContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('pets');
  const [pets, setPets] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPetModal, setShowPetModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedPet, setSelectedPet] = useState(null);
  const [petForm, setPetForm] = useState({
    name: '',
    species: '',
    breed: '',
    age: '',
    gender: 'Male',
    description: '',
    imageUrl: '',
    status: 'available',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!authLoading) {
      if (!user || user.role !== 'admin') {
        navigate('/');
      } else {
        if (activeTab === 'pets') {
          fetchPets();
        } else {
          fetchApplications();
        }
      }
    }
  }, [user, authLoading, navigate, activeTab]);

  const fetchPets = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/pets', { params: { limit: 1000 } });
      setPets(res.data.pets);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/adoptions');
      setApplications(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setPetForm({
      ...petForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddPet = () => {
    setPetForm({
      name: '',
      species: '',
      breed: '',
      age: '',
      gender: 'Male',
      description: '',
      imageUrl: '',
      status: 'available',
    });
    setSelectedPet(null);
    setShowPetModal(true);
    setError('');
    setSuccess('');
  };

  const handleEditPet = (pet) => {
    setPetForm({
      name: pet.name,
      species: pet.species,
      breed: pet.breed,
      age: pet.age,
      gender: pet.gender,
      description: pet.description,
      imageUrl: pet.imageUrl || '',
      status: pet.status,
    });
    setSelectedPet(pet);
    setShowPetModal(true);
    setError('');
    setSuccess('');
  };

  const handleSubmitPet = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      if (selectedPet) {
        await axios.put(`/api/pets/${selectedPet._id}`, petForm);
        setSuccess('Pet updated successfully!');
      } else {
        await axios.post('/api/pets', petForm);
        setSuccess('Pet added successfully!');
      }
      setShowPetModal(false);
      fetchPets();
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || 'Operation failed');
    }
  };

  const handleDeletePet = async (id) => {
    if (window.confirm('Are you sure you want to delete this pet?')) {
      try {
        await axios.delete(`/api/pets/${id}`);
        setSuccess('Pet deleted successfully!');
        fetchPets();
      } catch (error) {
        setError('Failed to delete pet');
      }
    }
  };

  const handleApproveApplication = async (id) => {
    try {
      await axios.put(`/api/adoptions/${id}/approve`);
      setSuccess('Application approved!');
      fetchApplications();
      fetchPets();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to approve application');
    }
  };

  const handleRejectApplication = async (id) => {
    try {
      await axios.put(`/api/adoptions/${id}/reject`);
      setSuccess('Application rejected!');
      fetchApplications();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to reject application');
    }
  };

  if (authLoading || loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>Admin Dashboard</h1>

      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <button
          onClick={() => setActiveTab('pets')}
          className={`btn ${activeTab === 'pets' ? 'btn-primary' : 'btn-secondary'}`}
        >
          Manage Pets
        </button>
        <button
          onClick={() => setActiveTab('applications')}
          className={`btn ${activeTab === 'applications' ? 'btn-primary' : 'btn-secondary'}`}
        >
          Manage Applications
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {activeTab === 'pets' && (
        <div>
          <div style={{ marginBottom: '20px' }}>
            <button onClick={handleAddPet} className="btn btn-primary">
              Add New Pet
            </button>
          </div>

          <div className="card">
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Species</th>
                  <th>Breed</th>
                  <th>Age</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pets.map(pet => (
                  <tr key={pet._id}>
                    <td>{pet.name}</td>
                    <td>{pet.species}</td>
                    <td>{pet.breed}</td>
                    <td>{pet.age} years</td>
                    <td>
                      <span className={`badge badge-${pet.status}`}>
                        {pet.status}
                      </span>
                    </td>
                    <td>
                      <button
                        onClick={() => handleEditPet(pet)}
                        className="btn btn-secondary"
                        style={{ padding: '5px 15px', fontSize: '14px', marginRight: '5px' }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeletePet(pet._id)}
                        className="btn btn-danger"
                        style={{ padding: '5px 15px', fontSize: '14px' }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'applications' && (
        <div className="card">
          <table className="table">
            <thead>
              <tr>
                <th>Pet Name</th>
                <th>Applicant</th>
                <th>Email</th>
                <th>Status</th>
                <th>Applied Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {applications.map(app => (
                <tr key={app._id}>
                  <td>{app.pet.name}</td>
                  <td>{app.user.name}</td>
                  <td>{app.user.email}</td>
                  <td>
                    <span className={`badge badge-${app.status === 'approved' ? 'approved' : app.status === 'rejected' ? 'rejected' : 'pending-app'}`}>
                      {app.status}
                    </span>
                  </td>
                  <td>{new Date(app.createdAt).toLocaleDateString()}</td>
                  <td>
                    {app.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleApproveApplication(app._id)}
                          className="btn btn-primary"
                          style={{ padding: '5px 15px', fontSize: '14px', marginRight: '5px' }}
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleRejectApplication(app._id)}
                          className="btn btn-danger"
                          style={{ padding: '5px 15px', fontSize: '14px' }}
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showPetModal && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{selectedPet ? 'Edit Pet' : 'Add New Pet'}</h2>
              <span className="close" onClick={() => setShowPetModal(false)}>&times;</span>
            </div>
            <form onSubmit={handleSubmitPet}>
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  value={petForm.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Species</label>
                <input
                  type="text"
                  name="species"
                  value={petForm.species}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Breed</label>
                <input
                  type="text"
                  name="breed"
                  value={petForm.breed}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Age (years)</label>
                <input
                  type="number"
                  name="age"
                  value={petForm.age}
                  onChange={handleInputChange}
                  min="0"
                  step="0.1"
                  required
                />
              </div>
              <div className="form-group">
                <label>Gender</label>
                <select name="gender" value={petForm.gender} onChange={handleInputChange} required>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Unknown">Unknown</option>
                </select>
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={petForm.description}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Image URL</label>
                <input
                  type="url"
                  name="imageUrl"
                  value={petForm.imageUrl}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Status</label>
                <select name="status" value={petForm.status} onChange={handleInputChange} required>
                  <option value="available">Available</option>
                  <option value="adopted">Adopted</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
              <button type="submit" className="btn btn-primary">
                {selectedPet ? 'Update Pet' : 'Add Pet'}
              </button>
              <button
                type="button"
                onClick={() => setShowPetModal(false)}
                className="btn btn-secondary"
                style={{ marginLeft: '10px' }}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;

