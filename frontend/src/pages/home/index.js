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
                    src="/assets/ia/ia-logo-2c2c2c.03bd7e88c8814d63d0fc..svg"
                />
                <h1 id="whoweare">
                    <strong>Internet Archive Replica</strong> is a student project
                    demonstrating Content and Multimedia Database Systems studying how to build a
                    library of millions of free texts, movies, software, music, websites, and more.
                </h1>
            </div>
            <div id="mediacount-icon-container">
                <a
                    className="media-type"
                    title="Texts"
                    onClick={() => handleSearch("community texts")}
                >
                    <div className="media-icon">
                        <img
                            src="/assets/community/texts.50ef50821843b0c1b509..svg"
                            style={{
                                filter:
                                    "invert(92%) sepia(23%) saturate(7462%) hue-rotate(331deg) brightness(105%) contrast(96%)",
                            }}
                            alt="Texts Image"
                        />
                    </div>
                </a>
                <a
                    className="media-type"
                    title="Videos"
                    onClick={() => handleSearch("community videos")}
                >
                    <div className="media-icon">
                        <img
                            src="/assets/community/video.019a132986c14dbd9dcd..svg"
                            style={{
                                filter:
                                    "invert(57%) sepia(33%) saturate(6194%) hue-rotate(333deg) brightness(100%) contrast(90%)",
                            }}
                            alt="Videos Image"
                        />
                    </div>
                </a>
                <a
                    className="media-type"
                    title="Audio"
                    onClick={() => handleSearch("community audio")}
                >
                    <div className="media-icon">
                        <img
                            src="/assets/community/audio.23c07c232f065edd356d..svg"
                            style={{
                                filter:
                                    "invert(53%) sepia(62%) saturate(3361%) hue-rotate(164deg) brightness(100%) contrast(101%)",
                            }}
                            alt="Audio Image"
                        />
                    </div>
                </a>
                <a
                    className="media-type"
                    title="Software"
                    onClick={() => handleSearch("community software")}
                >
                    <div className="media-icon">
                        <img
                            src="/assets/community/software.1eea97c20a216147d6e3..svg"
                            style={{
                                filter:
                                    "invert(73%) sepia(60%) saturate(419%) hue-rotate(36deg) brightness(95%) contrast(86%)",
                            }}
                            alt="Software Image"
                        />
                    </div>
                </a>
                <a
                    className="media-type"
                    title="Images"
                    onClick={() => handleSearch("community images")}
                >
                    <div className="media-icon">
                        <img
                            src="/assets/community/images.0861d5babb794202dd1e..svg"
                            style={{
                                filter:
                                    "invert(70%) sepia(12%) saturate(772%) hue-rotate(220deg) brightness(88%) contrast(96%)",
                            }}
                            alt="Images Image"
                        />
                    </div>
                </a>
                <a
                    className="media-type"
                    title="Data"
                    onClick={() => handleSearch("community data")}
                >
                    <div className="media-icon">
                        <img
                            src="/assets/community/data.0411d146cbe4c925dbd3..svg"
                            style={{
                                filter:
                                    "invert(37%) sepia(81%) saturate(3889%) hue-rotate(224deg) brightness(103%) contrast(101%)",
                            }}
                            alt="Data Image"
                        />
                    </div>
                </a>
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
