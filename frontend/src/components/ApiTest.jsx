import React, { useState, useEffect } from 'react';

const ApiTest = () => {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const testApi = async () => {
      try {
        const response = await fetch('/api/test');
        if (!response.ok) {
          throw new Error(`Status: ${response.status}`);
        }
        const data = await response.json();
        setMessage(data.message);
      } catch (err) {
        setError(`API Error: ${err.message}`);
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    testApi();
  }, []);

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>API Connection Test</h2>
      {isLoading ? (
        <p>Testing API connection...</p>
      ) : error ? (
        <div style={{ color: 'red', padding: '10px', border: '1px solid red' }}>
          {error}
          <p>Make sure your backend server is running at http://localhost:5000</p>
        </div>
      ) : (
        <div style={{ color: 'green', padding: '10px', border: '1px solid green' }}>
          API Connection Successful! Response: {message}
        </div>
      )}
    </div>
  );
};

export default ApiTest;