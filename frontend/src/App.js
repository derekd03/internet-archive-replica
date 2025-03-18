import React, { useState } from 'react';
import axios from 'axios';

function App() {

  const [file, setFile] = useState(null);
  const [query, setQuery] = useState('');
  const [result, setResult] = useState('');

  const handleUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await axios.post('http://localhost:5000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log(res.data);
      setResult(res.data);
    } catch (err) {
      console.error(err);
    }
  }

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.get(`http://localhost:5000/search?q=${query}`);
      console.log(res.data);
      setResult(res.data);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div>
      <h1>Internet Archive Replica</h1>
      <form onSubmit={handleUpload}>
        <input type="file" onChange={(e) => setFile(e.target.files[0])} />
        <button type="submit">Upload</button>
      </form>
      <form onSubmit={handleSearch}>
        <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} />
        <button type="submit">Search</button>
      </form>
      <div>
        {result && (
          <div>
            <h2>Results:</h2>
            <ul>
              {result.map((r, index) => (
                <li key={index}>
                  <strong>{r._source.filename}</strong> ({r._source.filetype}, {r._source.filesize} bytes)
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
