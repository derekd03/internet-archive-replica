import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SearchBar.css';

export default function SearchBar() {

    const [query, setQuery] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (event) => {

        event.preventDefault();
        const searchValue = query.trim();

        if (searchValue === "") {
            alert("Please enter a search term.");
            return;
        }

        // Sanitize the query before using in URL
        navigate(`/search?query=${encodeURIComponent(searchValue)}`);
    };

    const handleInputChange = (event) => {
        setQuery(event.target.value);
    };


    return (
        <form onSubmit={handleSubmit}>
            <div id="input-button">
                <input
                    id="text-input"
                    type="text"
                    value={query}
                    onChange={handleInputChange}
                    enterkeyhint="search"
                    autocapitalize="off"
                    placeholder="Search"
                />
                <button id="go-button" type="submit">GO</button>
            </div>
        </form>
    );
}
