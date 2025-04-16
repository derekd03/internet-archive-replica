import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import DOMPurify from 'dompurify';
import './styles.css';

const Edit = () => {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const item = location.state?.item;

    const [metadata, setMetadata] = useState({
        title: item?.title || '',
        description: item?.description || '',
        subjects: item?.subjects || [],
        creator: item?.creator || '',
        collection: item?.collection || '',
        language: item?.language || '',
        license: item?.license || ''
    });

    // Ensure subjects is an array before calling join()
    const subjects = Array.isArray(metadata.subjects) ? metadata.subjects : (metadata.subjects || '').split(',');

    // Metadata fields configuration
    const metadataFields = [
        { name: 'title', label: 'Title', required: true },
        { name: 'description', label: 'Description', required: true, type: 'textarea' },
        { name: 'subjects', label: 'Subject Tags (separated by commas)', required: true },
        { name: 'creator', label: 'Creator' },
        {
            name: 'language', label: 'Language', type: 'select', options: [
                { value: '', label: 'Choose one...' },
                { value: 'eng', label: 'English' },
                { value: 'fre', label: 'French' },
            ]
        },
        {
            name: 'license', label: 'License', type: 'select', options: [
                '', 'CC0', 'CC', 'PD'
            ]
        }
    ];

    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!item) {
            // Fetch item data from the server
            axios.get(`http://localhost:5000/item/${id}`)
                .then((res) => {
                    const fetchedItem = res.data;
                    setMetadata({
                        title: fetchedItem.title || '',
                        description: fetchedItem.description || '',
                        subjects: fetchedItem.subjects || [],
                        creator: fetchedItem.creator || '',
                        collection: fetchedItem.collection || '',
                        language: fetchedItem.language || '',
                        license: fetchedItem.license || ''
                    });
                })
                .catch(err => {
                    console.error(err);
                    setError('Failed to fetch item metadata.');
                });
        } else {
            setMetadata({
                title: item.title || '',
                description: item.description || '',
                subjects: item.subjects || [],
                creator: item.creator || '',
                collection: item.collection || '',
                language: item.language || '',
                license: item.license || ''
            });
        }
    }, [item, id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setMetadata((prevMetadata) => ({
            ...prevMetadata,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!metadata.title || !metadata.description || !metadata.subjects || !metadata.collection) {
            return setError('Please fill in all required fields');
        }

        setIsLoading(true);
        setError(null);
        setMessage(null);

        try {

            const response = await axios.put(`http://localhost:5000/edit/${id}`, metadata, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.data?.message) {
                setMessage(response.data.message);
                navigate(`/details/${id}`, { state: { item: { ...item, ...metadata } } });
            } else {
                setError('Edit succeeded but no confirmation from server');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Error updating item');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div id="file_info" className="table">
            <div id="metadata">
                <form onSubmit={handleSubmit}>
                    {metadataFields.map((field) => (
                        <div className="metadata_row" key={field.name}>
                            <span className="mdata_key">
                                {field.label}{field.required && <span className="required_star">*</span>}
                            </span>
                            {field.type === 'textarea' ? (
                                <textarea
                                    name={field.name}
                                    value={metadata[field.name]}
                                    onChange={handleChange}
                                    placeholder={field.label}
                                />
                            ) : field.type === 'select' ? (
                                <select
                                    name={field.name}
                                    value={metadata[field.name]}
                                    onChange={handleChange}
                                >
                                    {field.options.map(opt =>
                                        typeof opt === 'string' ? (
                                            <option key={opt} value={opt}>
                                                {opt === '' ? 'Choose one...' : opt}
                                            </option>
                                        ) : (
                                            <option key={opt.value} value={opt.value}>
                                                {opt.label}
                                            </option>
                                        )
                                    )}
                                </select>
                            ) : (
                                <div className="mdata_value">
                                    <input
                                        name={field.name}
                                        type={field.type || 'text'}
                                        value={metadata[field.name]}
                                        onChange={handleChange}
                                        placeholder={field.label}
                                    />
                                </div>
                            )}
                        </div>
                    ))}
                    <br />
                    <button className="btn btn-submit" type="submit" disabled={isLoading}>
                        {isLoading ? 'Saving...' : 'Save'}
                    </button>
                    {error && <div className="error-message">{DOMPurify.sanitize(error)}</div>}
                    {message && <div className="success-message">{DOMPurify.sanitize(message)}</div>}
                </form>
            </div>
        </div>
    );
};

export default Edit;