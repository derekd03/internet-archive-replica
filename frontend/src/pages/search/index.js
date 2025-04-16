import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../../components/searchBar/SearchBar';
import './styles.css';
import { useSearchParams, useLocation } from "react-router-dom";
import DOMPurify from 'dompurify';
import { formatCollectionName } from '../../utils/formatCollectionName';

const Search = () => {
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();
    const [query, setQuery] = useState(searchParams.get("query") || '');
    const navigate = useNavigate();
    const location = useLocation();
    const [page, setPage] = useState(parseInt(searchParams.get("page")) || 1);
    const [totalPages, setTotalPages] = useState(1);
    const [error, setError] = useState(null);

    const handleSearch = (pageNum = 1) => {
        if (!query) return;

        const safePage = Number.isInteger(Number(pageNum)) && Number(pageNum) > 0 ? Number(pageNum) : 1;

        setIsLoading(true);
        setError(null);
        setSearchParams({ query: query.trim(), page: String(safePage) });

        fetch(`http://localhost:5000/search?query=${encodeURIComponent(query)}&page=${safePage}`)
            .then((res) => {
                if (!res.ok) {
                    throw new Error('Network response was not ok');
                }
                return res.json();
            })
            .then((data) => {
                if (Array.isArray(data)) {
                    setResults(data);
                    setTotalPages(Math.ceil(data.length / 10));
                    setPage(safePage);
                } else {
                    throw new Error('Invalid data format received');
                }
            })
            .catch((err) => {
                console.error('Error fetching search results:', err);
                setError(err.message);
                setResults([]);
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    const handleRowClick = (item) => {
        navigate(`/details/${item.id}`, { state: { item } });
    };

    useEffect(() => {
        const queryParam = searchParams.get("query") || "";
        const rawPageParam = searchParams.get("page");
        const pageParam = Number.isInteger(Number(rawPageParam)) && Number(rawPageParam) > 0
            ? Number(rawPageParam)
            : 1;

        if (queryParam) {
            setQuery(queryParam);
            handleSearch(pageParam);
        }
    }, [location.search]);

    return (
        <div className="archive-search">
            <div className="search-header">
                <div className="search-bar-container">
                    <SearchBar value={query} onChange={setQuery} onSubmit={handleSearch} />
                </div>
            </div>
            <div className="search-results">
                {isLoading ? (
                    <div className="loading">Loading...</div>
                ) : error ? (
                    <div className="error">Error: {error}</div>
                ) : results && results.length === 0 ? (
                    <div className="no-results">No results found.</div>
                ) : (
                    <>
                        <div className="card-grid">
                            {results.map(item => (
                                <div
                                    key={item.id}
                                    className="result-card"
                                    onClick={() => handleRowClick(item)}
                                >
                                    <h3>{DOMPurify.sanitize(item.title || "Untitled")}</h3>
                                    <p><strong>Creator:</strong> {DOMPurify.sanitize(item.creator || "Unknown")}</p>
                                    <p><strong>Collection:</strong> {DOMPurify.sanitize(formatCollectionName(item.collection))}</p>
                                    <p><strong>Language:</strong> {item.language || "N/A"}</p>
                                </div>
                            ))}
                        </div>

                        {totalPages > 1 && (
                            <div className="pagination">
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map(num => (
                                    <button
                                        key={num}
                                        onClick={() => handleSearch(num)}
                                        disabled={num === page}
                                        className={`page-btn ${num === page ? 'active' : ''}`}
                                    >
                                        {num}
                                    </button>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Search;