import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import "./styles.css";

const Details = () => {

    const { id } = useParams();
    const navigate = useNavigate();

    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch(`http://localhost:5000/item/${id}`)
            .then((res) => res.json())
            .then((data) => setItem(data))
            .catch((err) => console.error('Failed to load item', err))
            .finally(() => setLoading(false));
    }, [id]);

    const handleDelete = async () => {
        const confirm = window.confirm("Are you sure you want to delete this item?");
        if (!confirm) return;

        try {
            const response = await fetch(`http://localhost:5000/delete/${item.id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                alert("Item deleted successfully");
                navigate('/');
            } else {
                const data = await response.json();
                alert("Failed to delete item: " + data.message);
            }
        } catch (error) {
            alert("Error deleting item: " + error.message);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error || !item) return <div>Error: {error || "Item not found"}</div>;

    const downloadUrl = item.id
        ? `http://localhost:5000/download/${item.id}`
        : null;

    return (
        <div className="details-container">
            <div className="item-header">
                <div className="item-info">
                    <h1>{item.title}</h1>
                    <h2>{item.creator}</h2>
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
                    <button
                        onClick={handleDelete}
                        className="delete-button"
                    >
                        Delete
                    </button>
                    <button
                        onClick={() => navigate(`/edit/${item.id}`, { state: { item } })}
                        className="edit-button"
                    >
                        Edit
                    </button>
                </div>
            </div>

            <div className="item-details">
                <div className="details-grid">
                    <div>
                        <h3>Description</h3>
                        <p>{item.description || "No description available"}</p>
                    </div>
                    <div>
                        <h3>Collection</h3>
                        <p className="item-meta">
                            {/* Format collection name */}
                            {item.collection.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase())}
                        </p>
                    </div>
                    <div>
                        <h3>Upload Date</h3>
                        <p>{item.upload_date ? new Date(item.upload_date).toLocaleDateString() : "No date listed"}</p>
                    </div>
                    <div>
                        <h3>Release Date</h3>
                        <p>{item.metadata_date ? new Date(item.metadata_date).toLocaleDateString() : "No date listed"}</p>
                    </div>
                    <div>
                        <h3>Subjects</h3>
                        <p>{Array.isArray(item.subjects) ? item.subjects.join(', ') : "No subjects listed"}</p>
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
