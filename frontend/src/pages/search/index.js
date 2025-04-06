import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import SearchBar from '../../components/searchBar/SearchBar';
import './styles.css';
import { useSearchParams } from "react-router-dom";

const Search = () => {
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();
    const [query, setQuery] = useState(searchParams.get("query") || '');
    const navigate = useNavigate(); // Initialize useNavigate

    const mockResults = [
        {
            id: 1,
            title: 'The Great Gatsby',
            year: '1925',
            creator: 'F. Scott Fitzgerald',
            collection: 'Book',
            language: 'English',
            imageUrl: 'https://archive.org/services/img/greatgatsby001gut',
        },
        {
            id: 2,
            title: 'Citizen Kane',
            year: '1941',
            creator: 'Orson Welles',
            collection: 'Movie',
            language: 'English',
            imageUrl: 'https://archive.org/services/img/citizenkane',
        }
    ];

    // Debounce the query to delay search execution
    useEffect(() => {
        const handler = setTimeout(() => {
            if (query) {
                setSearchParams({ query });
                setIsLoading(true);

                // Simulate an API call
                setTimeout(() => {
                    setResults(mockResults.filter(item =>
                        item.title.toLowerCase().includes(query.toLowerCase()) ||
                        item.creator.toLowerCase().includes(query.toLowerCase())
                    ));
                    setIsLoading(false);
                }, 500);
            }
        }, 300);

        return () => clearTimeout(handler);
    }, [query, setSearchParams]);

    const handleRowClick = (id) => {
        navigate(`/details/${id}`); // Navigate to the details page
    };

    return (
        <div className="archive-search">
            <div className="search-header">
                <h1>Search</h1>
                <SearchBar value={query} onChange={setQuery} />
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
                                <tr key={item.id} onClick={() => handleRowClick(item.id)} style={{ cursor: 'pointer' }}>
                                    <td><img src={item.imageUrl} alt={item.title} style={{ width: '60px' }} /></td>
                                    <td>{item.title}</td>
                                    <td>{item.creator}</td>
                                    <td>{item.year}</td>
                                    <td>{item.collection}</td>
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