import React, { useState, useContext } from 'react';
import { AuthContext } from '../App';
import { useDropzone } from 'react-dropzone';
import '../assets/css/CreatePin.css';

function CreatePin() {

    const { user } = useContext(AuthContext);
    const [pinData, setPinData] = useState({
        title: '',
        description: '',
        tags: '', // if tags are a string of comma-separated values
        board: '', // if board is a string ID
    });

    const [image, setImage] = useState(null);
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { getRootProps, getInputProps } = useDropzone({
        accept: 'image/*', // Accept images only
        onDrop: (acceptedFiles) => {
        console.log(acceptedFiles);
        setImage(acceptedFiles[0]); // assuming only one file is needed
        }
    });

    const handleInputChange = (e) => {
        setPinData({ ...pinData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!image) {
            setError('Please select an image for the pin.');
            return;
        }

        setIsSubmitting(true);
        const formData = new FormData();
        formData.append('title', pinData.title);
        formData.append('description', pinData.description);
        formData.append('image', image);
        formData.append('tags', pinData.tags); // Assuming tags is a string of comma-separated values
        formData.append('board', pinData.board);
        formData.append('user', user._id);

        for (let [key, value] of formData.entries()) {
            console.log(key, value);
        }

        try {
            const response = await fetch('http://localhost:5001/pin-creation-tool/', {
            method: 'POST',
            body: formData, // send the form data
        });

        const result = await response.json();
        setIsSubmitting(false);
        if (response.ok) {
            // Reset form and give user feedback
            setPinData({ title: '', description: '', tags: '', board: '' });
            setImage(null);
            alert('Pin created successfully!');
        } else {
            setError('Error creating pin: ' + (result.message || 'Please try again.'));
        }
        } catch (error) {
        setError('An error occurred: ' + error.message);
        setIsSubmitting(false);
        }
  };


  return (
    <div className="create-pin-container">
      <form onSubmit={handleSubmit} className="create-pin-form">

      <div className='create-left'>
            <div className="form-group dropzone" {...getRootProps()}>
                <input {...getInputProps()} />
                <div className="dropzone-content">
                    <span className="dropzone-arrow">↑</span>
                    <p>Choose a file or drag and drop it here</p>
                </div>
                {image && <p>Image selected: {image.name}</p>}
            </div>
        </div>

        <div className='create-right'>
            <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
                type="text"
                id="title"
                name="title"
                value={pinData.title}
                onChange={handleInputChange}
                placeholder="Add a title"
            />
            </div>

            <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
                id="description"
                name="description"
                value={pinData.description}
                onChange={handleInputChange}
                placeholder="Add a detailed description"
            />
            </div>

            <div className="form-group">
            <label htmlFor="tags">Tags</label>
            <input
                type="text"
                id="tags"
                name="tags"
                value={pinData.tags}
                onChange={handleInputChange}
                placeholder="Enter tags, separated by commas"
            />
            </div>

            <div className="form-group">
            <label htmlFor="board">Board</label>
            <input
                type="text"
                id="board"
                name="board"
                value={pinData.board}
                onChange={handleInputChange}
                placeholder="Enter board ID"
            />
            </div>

            {error && <p className="error">{error}</p>}

            <button type="submit" className="create-pin-button">Create Pin</button>

        </div>
      </form>
    </div>
  );  
}

export default CreatePin;
