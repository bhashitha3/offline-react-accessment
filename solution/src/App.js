import React, { useState, useEffect } from 'react';
import './App.css';
import { isNameValid, getLocations } from './mock-api/apis';

function App() {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [nameError, setNameError] = useState('');
  const [locations, setLocations] = useState([]);
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    const loadLocations = async () => {
      try {
        const locationOptions = await getLocations();
        setLocations(locationOptions);
      } catch (error) {
        // Handle errors as appropriate
        console.error('Error fetching locations:', error);
      }
    };
    loadLocations();
  }, []);

  useEffect(() => {
    if (name) {
      const validateName = async () => {
        try {
          const nameIsValid = await isNameValid(name);
          setNameError(nameIsValid ? '' : 'This name has already been taken');
        } catch (error) {
          // Handle errors as appropriate
          console.error('Error validating name:', error);
        }
      };

      const timer = setTimeout(() => {
        validateName();
      }, 500);

      return () => clearTimeout(timer);
    } else {
      setNameError('');
    }
  }, [name]);

  // const handleAddSubmission = () => {
  //   if (name && location && !nameError) {
  //     setSubmissions(prevSubmissions => [...prevSubmissions, { name, location }]);
  //     setName('');
  //     setLocation('');
  //   }
  // };

  const handleNameChange = (e) => {
    const newName = e.target.value;
    setName(newName);
  
    // Clear previous errors as the user types
    setNameError('');
  
    // Validate only if there's a name entered
    if (newName.trim()) {
      isNameValid(newName)
        .then(isValid => {
          setNameError(isValid ? '' : 'This name has already been taken');
        })
        .catch(e => console.error(e));
    }
  };
  

  const handleAddSubmission = () => {
    // First, check if the name already exists in submissions
    const nameAlreadyExists = submissions.some(submission => submission.name.toLowerCase() === name.toLowerCase());
  
    // If the name is valid, and does not already exist, and location is provided
    if (name && location && !nameError && !nameAlreadyExists) {
      setSubmissions(prevSubmissions => [...prevSubmissions, { name, location }]);
      setName('');
      setLocation('');
    } else if (nameAlreadyExists) {
      setNameError('This name has already been taken');
    }
  };
  

  const handleClear = () => {
    setName('');
    setLocation('');
    setNameError('');
  };

  return (
    <div className="App">
      <div className="form">
        <div className="form-field">
          <label htmlFor="name">Name</label>
          <input 
            type="text"
            id="name"
            value={name}
            onChange={e => setName(e.target.value)}
            className={nameError ? 'error' : ''}
          />
          {nameError && <div className="error-message">{nameError}</div>}
        </div>

        <div className="form-field">
          <label htmlFor="location">Location</label>
          <select 
            id="location"
            value={location}
            onChange={e => setLocation(e.target.value)}
          >
            <option value="">Select...</option>
            {locations.map((loc, index) => (
              <option key={index} value={loc}>{loc}</option>
            ))}
          </select>
        </div>

        <div className="form-actions">
          <button onClick={handleClear}>Clear</button>
          <button onClick={handleAddSubmission} disabled={!name || !location || nameError}>Add</button>
        </div>
      </div>

      <div className="table-container">
        <table className="submissions-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Location</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((submission, index) => (
              <tr key={index}>
                <td>{submission.name}</td>
                <td>{submission.location}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
