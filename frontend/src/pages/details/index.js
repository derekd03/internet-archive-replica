import React from 'react';

const Details = () => {
    const item = {};

    return (
        <div className="details-container">
            <h1>Details Page</h1>
            <div className="item-details">
                <h2>{item.title}</h2>
                <p>{item.description}</p>
                <p><strong>Creator:</strong> {item.creator}</p>
                <p><strong>Date:</strong> {item.date}</p>
                <p><strong>Subjects:</strong> {item.subjects.join(', ')}</p>
                <p><strong>Language:</strong> {item.language}</p>
                <p><strong>License:</strong> {item.license}</p>
                <a href={item.url} target="_blank" rel="noopener noreferrer">View Item</a>
            </div>
        </div>
    );
};

export default Details;
