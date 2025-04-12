import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import "./styles.css";

const Details = () => {

    const { id } = useParams();

    const mockResults = [
        {
            id: 1,
            title: 'The Great Gatsby',
            description: 'A story of the fabulously wealthy Jay Gatsby and his love for the beautiful Daisy Buchanan.',
            creator: 'F. Scott Fitzgerald',
            date: '1925',
            subjects: ['Fiction', 'Classic', 'American Literature'],
            language: 'English',
            license: 'Public Domain',
            imageUrl: 'https://archive.org/services/img/greatgatsby001gut',
            collection: 'Book',
            year: '1925'
        },
        {
            id: 2,
            title: 'Citizen Kane',
            description: 'The quasi-biographical story of Charles Foster Kane, a newspaper tycoon.',
            creator: 'Orson Welles',
            date: '1941',
            subjects: ['Drama', 'Film Noir', 'Classic Cinema'],
            language: 'English',
            license: 'Public Domain',
            imageUrl: 'https://archive.org/services/img/citizenkane',
            collection: 'Movie',
            year: '1941'
        }
    ];

    // Find the item with the matching ID
    const item = mockResults.find(item => item.id === Number(id));

    if (!item) {
        return <div>Item not found</div>;
    }

    return (
        <div className="details-container">
            <div className="item-header">
                <img src={item.imageUrl} alt={item.title} style={{ maxWidth: '300px' }} />
                <div>
                    <h1>{item.title}</h1>
                    <h2>{item.creator}</h2>
                    <p>{item.year} • {item.collection}</p>
                </div>
            </div>

            <div className="item-details">
                <p>{item.description}</p>

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
