import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../config/axios';

const Home = () => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    species: '',
    breed: '',
    age: '',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [speciesList, setSpeciesList] = useState([]);

  useEffect(() => {
    fetchPets();
    fetchSpecies();
  }, [currentPage, filters]);

  const fetchSpecies = async () => {
    try {
      const res = await axios.get('/api/pets');
      const uniqueSpecies = [...new Set(res.data.pets.map(pet => pet.species))];
      setSpeciesList(uniqueSpecies);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchPets = async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        limit: 12,
        ...filters,
      };
      const res = await axios.get('/api/pets', { params });
      setPets(res.data.pets);
      setTotalPages(res.data.totalPages);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value,
    }));
    setCurrentPage(1);
  };

  return (
    <div>
      <h1 style={{ marginBottom: '20px' }}>Available Pets for Adoption</h1>

      <div className="filters">
        <div className="filters-row">
          <div className="form-group">
            <input
              type="text"
              name="search"
              placeholder="Search by name or breed..."
              value={filters.search}
              onChange={handleFilterChange}
            />
          </div>
          <div className="form-group">
            <select name="species" value={filters.species} onChange={handleFilterChange}>
              <option value="">All Species</option>
              {speciesList.map(species => (
                <option key={species} value={species}>{species}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <input
              type="text"
              name="breed"
              placeholder="Filter by breed..."
              value={filters.breed}
              onChange={handleFilterChange}
            />
          </div>
          <div className="form-group">
            <select name="age" value={filters.age} onChange={handleFilterChange}>
              <option value="">All Ages</option>
              <option value="0">Less than 1 year</option>
              <option value="1">1-2 years</option>
              <option value="3">3-6 years</option>
              <option value="7">7+ years</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : pets.length === 0 ? (
        <p>No pets found.</p>
      ) : (
        <>
          <div className="grid">
            {pets.map(pet => (
              <div key={pet._id} className="pet-card">
                {pet.imageUrl && (
                  <img src={pet.imageUrl} alt={pet.name} />
                )}
                <div className="pet-card-body">
                  <h3>{pet.name}</h3>
                  <p><strong>Species:</strong> {pet.species}</p>
                  <p><strong>Breed:</strong> {pet.breed}</p>
                  <p><strong>Age:</strong> {pet.age} years</p>
                  <p><strong>Gender:</strong> {pet.gender}</p>
                  <span className={`badge badge-${pet.status}`}>
                    {pet.status}
                  </span>
                  <div style={{ marginTop: '15px' }}>
                    <Link to={`/pet/${pet._id}`} className="btn btn-primary" style={{ width: '100%' }}>
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={currentPage === i + 1 ? 'active' : ''}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Home;

