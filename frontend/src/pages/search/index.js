import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import SearchBar from '../../components/searchBar/SearchBar';
import './styles.css';
import { useSearchParams, useLocation } from "react-router-dom";

const Search = () => {

    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();
    const [query, setQuery] = useState(searchParams.get("query") || '');
    const navigate = useNavigate(); // Initialize useNavigate
    const location = useLocation();

    // Function to trigger search when the "Go" button is pressed
    const handleSearch = () => {
        if (!query) return; // Don't search if there's no query
        setSearchParams({ query });
        setIsLoading(true);

        fetch(`http://localhost:5000/search?query=${encodeURIComponent(query)}`)
            .then((res) => res.json())
            .then((data) => {
                setResults(data);
            })
            .catch((err) => {
                console.error('Error fetching search results:', err);
                setResults([]);
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    const handleRowClick = (item) => {
        navigate(`/details/${item.id}`, { state: { item } }); // Navigate to the details page
    };

    // Format the collection name to be more readable
    const formatCollectionName = (name) => {
        return name
            .replace(/_/g, ' ')
            .replace(/\b\w/g, c => c.toUpperCase());
    };

    // Only trigger search on mount if query param exists AND navigation came from another page (e.g., Home)
    useEffect(() => {
        const fromHome = location.key !== 'default'; // If location.key is not 'default', the user navigated here
        if (query && fromHome) {
            handleSearch();
        }
    }, []); // Removed query from dependency array to avoid triggering on input change

    return (
        <div className="archive-search">
            <div className="search-header">
                <h1>Search</h1>
                <SearchBar value={query} onChange={setQuery} onSubmit={handleSearch} />
            </div>
            <div className="search-results">
                {isLoading || results.length === 0 ? (
                    <table className="results-table">
                        <thead>
                            <tr>
                                <th>Image</th>
                                <th>Title</th>
                                <th>Creator</th>
                                <th>Year</th>
                                <th>Collection</th>
                                <th>Language</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td colSpan="6" className="placeholder">Loading...</td>
                                </tr>
                            ) : (
                                <tr>
                                    <td colSpan="6" className="placeholder">No results found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                ) : (
                    <table className="results-table">
                        <thead>
                            <tr>
                                <th>Image</th>
                                <th>Title</th>
                                <th>Creator</th>
                                <th>Year</th>
                                <th>Collection</th>
                                <th>Language</th>
                            </tr>
                        </thead>
                        <tbody>
                            {results.map(item => (
                                <tr key={item.id} onClick={() => handleRowClick(item)} style={{ cursor: 'pointer' }}>
                                    <td><img src="/default.png" alt={"No preview"} style={{ width: '60px' }} /></td>
                                    <td>{item.title}</td>
                                    <td>{item.creator}</td>
                                    <td>{item.year}</td>
                                    <td>{formatCollectionName(item.collection)}</td>
                                    <td>{item.language}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default Search;