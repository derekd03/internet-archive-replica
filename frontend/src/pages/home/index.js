import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "../../components/searchBar/SearchBar";
import "./styles.css";

export default function Home() {
    const [query, setQuery] = useState('');
    const navigate = useNavigate();

    const handleSearch = (searchValue) => {
        // Navigate to /search with query param
        navigate(`/search?query=${encodeURIComponent(searchValue)}`);
    };

    return (
        <div id="outer-container">
            <div id="section-container">
                <img
                    id="main-image"
                    alt="Internet Archive Logo"
                    src="/ia-logo-2c2c2c.03bd7e88c8814d63d0fc..svg"
                />
                <h1 id="whoweare">
                    <strong>Internet Archive Replica</strong> is a student project
                    demonstrating Content and Multimedia Database Systems studying how to build a
                    library of millions of free texts, movies, software, music, websites, and more.
                </h1>
            </div>
            <div className="search-bar-container">
                <SearchBar
                    value={query}
                    onChange={setQuery}
                    onSubmit={handleSearch}
                />
            </div>
        </div>
    );
}
