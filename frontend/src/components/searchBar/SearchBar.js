import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SearchBar.css';

export default function SearchBar({ value, onChange, onSubmit }) {
    const [internalQuery, setInternalQuery] = useState('');
    const navigate = useNavigate();

    const isControlled = typeof value !== 'undefined';

    const handleInputChange = (event) => {
        const newValue = event.target.value;
        if (isControlled) {
            onChange(newValue);
        } else {
            setInternalQuery(newValue);
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        const searchValue = (isControlled ? value : internalQuery).trim();
        if (!searchValue) {
            alert("Please enter a search term.");
            return;
        }

        if (onSubmit) {
            onSubmit(searchValue); // Trigger the handleSearch function passed down as prop
        } else {
            navigate(`/search?query=${encodeURIComponent(searchValue)}`);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div id="input-button">
                <input
                    id="text-input"
                    type="text"
                    value={isControlled ? value : internalQuery}
                    onChange={handleInputChange}
                    enterKeyHint="search"
                    autoCapitalize="off"
                    placeholder="Search"
                />
                <button id="go-button" type="submit">GO</button>
            </div>
        </form>
    );
}
