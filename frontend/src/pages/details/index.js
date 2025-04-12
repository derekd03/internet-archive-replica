import React from 'react';
import { useParams, useLocation } from 'react-router-dom';
import "./styles.css";

const Details = () => {

    const { id } = useParams();
    const location = useLocation();
    // Find the item with the matching ID
    const item = location.state?.item;

    if (!item) {
        return <div>Item not found</div>;
    }

    const downloadUrl = item.id
        ? `http://localhost:5000/download/${item.id}`
        : null;

    return (
        <div className="details-container">
            <div className="item-header">
                <img src={item.imageUrl} alt={item.title} style={{ maxWidth: '300px' }} />
                <div>
                    <h1>{item.title}</h1>
                    <h2>{item.creator}</h2>
                    <p>{item.year} • {item.collection}</p>
                    {downloadUrl && (
                        <a
                            href={downloadUrl}
                            className="download-button"
                            download
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Download
                        </a>
                    )}
                </div>
            </div>

            <div className="item-details">
                <p>{item.description || "No description available"}</p>

                <div className="details-grid">
                    <div>
                        <h3>Date</h3>
                        <p>{item.date}</p>
                    </div>
                    <div>
                        <h3>Subjects</h3>
                        <p>{item.subjects.join(', ')}</p>
                    </div>
                    <div>
                        <h3>Language</h3>
                        <p>{item.language}</p>
                    </div>
                    <div>
                        <h3>License</h3>
                        <p>{item.license}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Details;
