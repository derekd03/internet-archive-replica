import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import DOMPurify from 'dompurify';
import './styles.css';
import { formatFileSize } from '../../utils/fileHelpers';

const initialMetadata = {
    title: '',
    url: '',
    description: '',
    subjects: [],
    creator: '',
    collection: '',
    language: '',
    license: ''
};

const MAX_GB = 2 * 1024 * 1024 * 1024; // 2GB in bytes

const Upload = () => {

    const navigate = useNavigate();
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [metadata, setMetadata] = useState(initialMetadata);
    const [isDragging, setIsDragging] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setMetadata((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleUpload = async (e) => {
        e.preventDefault();

        // Validate required fields
        if (!file) return setError('Please select a file to upload');
        if (!metadata.title.trim()) return setError('Title is required');
        if (!metadata.description.trim()) return setError('Description is required');
        if (!metadata.subjects.trim()) return setError('Subjects are required');
        if (!metadata.collection) return setError('Please select a collection');

        if (file && file.size > MAX_GB) {
            setError('File size exceeds the maximum limit of 2GB.');
            return;
        }

        setIsLoading(true);
        setError(''); // Clear any previous error
        setMessage(''); // Clear any previous success message

        const formData = new FormData();
        formData.append('file', file);
        formData.append('title', metadata.title);
        formData.append('description', metadata.description);

        const subjects = Array.isArray(metadata.subjects) ? metadata.subjects : metadata.subjects.split(',');
        formData.append('subjects', subjects.join(','));

        formData.append('creator', metadata.creator);
        formData.append('collection', metadata.collection);
        formData.append('language', metadata.language);
        formData.append('license', metadata.license);

        try {
            const res = await axios.post('http://localhost:5000/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (res.status === 200) {
                if (res.data?.file_id) {
                    setMessage(res.data.message || 'Upload successful!');
                    setError(''); // Clear any error
                    navigate(`/details/${res.data.file_id}`);

                } else {
                    setMessage('Upload successful, but no file ID returned from server.');
                    setError(''); // Clear any error
                }
            } else {
                setMessage('');
                setError('Unexpected response from server.');
            }
        } catch (err) {
            console.error('Upload error:', err); // Debugging log
            setError(err.response?.data?.message);
            setMessage(''); // Clear any success message
        } finally {
            setIsLoading(false);
        }
    };

    // Drag-and-drop handlers
    const handleDragEnter = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    }, []);

    const handleDragOver = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
    }, []);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        // Check if files are dropped
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const droppedFile = e.dataTransfer.files[0];

            // Validate file size
            if (droppedFile.size > MAX_GB) {
                setError('File size exceeds the maximum limit of 2GB.');
                setFile(null); // Clear any previously selected file
            } else {
                setFile(droppedFile);
                setError(''); // Clear any previous error
            }
        }
    }, []);

    // Handle file input change
    const handleFileChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const selectedFile = e.target.files[0];
            if (selectedFile.size > MAX_GB) {
                setError('File size exceeds the maximum limit of 2GB.');
                setFile(null);
            } else {
                setFile(selectedFile);
                setError('');
            }
        }
    };

    // Metadata fields configuration
    const metadataFields = [
        { name: 'title', label: 'Title', required: true },
        { name: 'description', label: 'Description', required: true, type: 'textarea' },
        { name: 'subjects', label: 'Subject Tags (separated by commas)', required: true },
        { name: 'creator', label: 'Creator' },
        {
            name: 'collection', label: 'Collection', required: true, type: 'select', options: [
                '', 'Community texts', 'Community video', 'Community audio',
                'Community software', 'Community images', 'Community data'
            ]
        },
        {
            name: 'language', label: 'Language', type: 'select', options: [
                { value: '', label: 'Choose one...' },
                'eng', 'fre'
            ]
        },
        {
            name: 'license', label: 'License', type: 'select', options: [
                '', 'CC0', 'CC', 'PD'
            ]
        }
    ];

    return (
        <div>
            {isLoading ? (
                <div className="loading">
                    <h2>Uploading...</h2>
                    <p>Please wait while your file is being uploaded.</p>
                </div>
            ) : (
                <>
                    {/* Drag-and-drop area */}
                    {!file && (
                        <div
                            id="file_drop"
                            className={`drag_target ${isDragging ? 'drag-active' : ''}`}
                            onDragEnter={handleDragEnter}
                            onDragLeave={handleDragLeave}
                            onDragOver={handleDragOver}
                            onDrop={handleDrop}
                        >
                            <div id="file_drop_contents">
                                <b>Drag &amp; Drop files here or</b>
                                <button
                                    className="btn btn-archive"
                                    onClick={() => document.getElementById('file_input_initial').click()}
                                >
                                    Choose files to upload
                                </button>
                                <b>(Max 2GB)</b>
                                <input
                                    type="file"
                                    id="file_input_initial"
                                    className="hidden"
                                    onChange={handleFileChange}
                                />
                            </div>
                        </div>
                    )}
                    {/* Metadata and upload button (only shown if a file is selected) */}
                    {file && (
                        <div id="file_info" className="table">
                            <div id="metadata">
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
                                                    placeholder={field.prefix}
                                                />
                                            </div>
                                        )}
                                    </div>
                                ))}
                                <br />
                                <form onSubmit={handleUpload}>
                                    <button className="btn btn-submit" type="submit" disabled={isLoading}>
                                        {isLoading ? 'Uploading...' : 'Upload'}
                                    </button>
                                    <span className="file-size"><b>{formatFileSize(file.size)}</b></span>
                                </form>
                            </div>
                        </div>
                    )}

                    {message && <div className="success-message">{DOMPurify.sanitize(message)}</div>}
                    {error && <p className="error-text">{error}</p>}
                </>
            )}
        </div>
    );
};

export default Upload;