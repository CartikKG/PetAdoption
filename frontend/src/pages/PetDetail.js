import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../config/axios';
import { AuthContext } from '../context/AuthContext';

const PetDetail = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchPet();
  }, [id]);

  const fetchPet = async () => {
    try {
      const res = await axios.get(`/api/pets/${id}`);
      setPet(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setShowModal(true);
  };

  const handleSubmitApplication = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await axios.post('/api/adoptions', {
        petId: id,
        message: message,
      });
      setSuccess('Application submitted successfully!');
      setShowModal(false);
      setMessage('');
      fetchPet();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit application');
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!pet) {
    return <p>Pet not found</p>;
  }

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <button onClick={() => navigate(-1)} className="btn btn-secondary">
          Back
        </button>
      </div>

      <div className="card">
        <div className="pet-detail-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '30px' }}>
          <div>
            {pet.imageUrl && (
              <img
                src={pet.imageUrl}
                alt={pet.name}
                style={{ width: '100%', borderRadius: '8px' }}
              />
            )}
          </div>
          <div>
            <h1>{pet.name}</h1>
            <p style={{ marginBottom: '10px' }}><strong>Species:</strong> {pet.species}</p>
            <p style={{ marginBottom: '10px' }}><strong>Breed:</strong> {pet.breed}</p>
            <p style={{ marginBottom: '10px' }}><strong>Age:</strong> {pet.age} years</p>
            <p style={{ marginBottom: '10px' }}><strong>Gender:</strong> {pet.gender}</p>
            <p style={{ marginBottom: '10px' }}>
              <strong>Status:</strong>{' '}
              <span className={`badge badge-${pet.status}`}>
                {pet.status}
              </span>
            </p>
            <div style={{ marginTop: '20px' }}>
              <h3>Description</h3>
              <p>{pet.description}</p>
            </div>
            {pet.status === 'available' && user && user.role !== 'admin' && (
              <div style={{ marginTop: '30px' }}>
                <button onClick={handleApply} className="btn btn-primary">
                  Apply to Adopt
                </button>
              </div>
            )}
            {!user && pet.status === 'available' && (
              <div style={{ marginTop: '30px' }}>
                <p>Please <a href="/login">login</a> to apply for adoption</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {success && <div className="alert alert-success">{success}</div>}

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Apply to Adopt {pet.name}</h2>
              <span className="close" onClick={() => setShowModal(false)}>&times;</span>
            </div>
            {error && <div className="alert alert-error">{error}</div>}
            <form onSubmit={handleSubmitApplication}>
              <div className="form-group">
                <label>Message (Optional)</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us why you want to adopt this pet..."
                />
              </div>
              <button type="submit" className="btn btn-primary">
                Submit Application
              </button>
              <button
                type="button"
                onClick={() => setShowModal(false)}
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

export default PetDetail;

