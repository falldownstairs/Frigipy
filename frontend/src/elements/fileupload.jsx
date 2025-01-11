import React, { useState } from 'react';
import axios from 'axios';
import './fileupload.css';

function FileUploader() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [ingredients, setIngredients] = useState([]);
    const [responseMessage, setResponseMessage] = useState('');
    const [recipe, setRecipe] = useState(null); 
    const [newIngredient, setNewIngredient] = useState(''); 

    function handleFileChange(event) {
        const file = event.target.files[0];
        setSelectedFile(file);
    }

    async function fileUploadHandler() {
        if (!selectedFile) {
            console.error('No file selected');
            return;
        }

        setUploading(true);
        const reader = new FileReader();

        reader.onloadend = async function () {
            const base64Image = reader.result.split(',')[1];

            const obj = { img: base64Image };
            const json = JSON.stringify(obj);

            try {
                const response = await axios.post(
                    'http://127.0.0.1:8000/api/processImg/',
                    json,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    }
                );

                console.log('Response:', response.data);

                let ingredientsArray = response.data;
                if (typeof ingredientsArray === 'string') {
                    try {
                        ingredientsArray = JSON.parse(response.data);
                    } catch (parseError) {
                        console.error('Error parsing response:', parseError);
                        setResponseMessage('Failed to process ingredients.');
                        return;
                    }
                }

                setIngredients(prevIngredients => [...prevIngredients, ...ingredientsArray]);
                setResponseMessage('File uploaded successfully!');
            } catch (error) {
                console.error('Error:', error.response?.data || error.message);
                setResponseMessage('Failed to upload file.');
            } finally {
                setUploading(false);
            }
        };

        reader.readAsDataURL(selectedFile);
    }

    async function fetchRecipe() {
        try {
            const ingredientsArray = ingredients
    
            const response = await axios.post(
                'http://127.0.0.1:8000/api/processIngredients/', 
                ingredientsArray, 
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            setRecipe(response.data);  
            console.log('Recipe fetched:', response.data);
        } catch (error) {
            console.error('Error fetching recipe:', error);
        }
    }

    const removeIngredient = (index) => {
        setIngredients(prevIngredients => prevIngredients.filter((_, i) => i !== index));
    };

    const addIngredient = () => {
        if (newIngredient.trim() !== '') {
            setIngredients(prevIngredients => [...prevIngredients, newIngredient]);
            setNewIngredient('');
        }
    };

    return (
        <div className="container">
            <div className="left-box">
                <div className="upload-section">
                    <input type="file" onChange={handleFileChange} />
                    <button onClick={fileUploadHandler} disabled={uploading}>
                        {uploading ? 'Uploading...' : 'UPLOAD'}
                    </button>

                    {responseMessage && <div className="response-message">{responseMessage}</div>}

                    <div className="recipe-section">
                        <button onClick={fetchRecipe}>Get Recipe</button>
                    </div>
                </div>

                <div className="ingredients-list">
                    {ingredients.length === 0 ? (
                        <div className="ingredient-placeholder">No ingredients found. Upload an image to process.</div>
                    ) : (
                        <div>
                            <h3>Ingredients:</h3>
                            {ingredients.map((ingredient, index) => (
                                <div className="ingredient-box" key={index}>
                                    <span className="ingredient-name">
                                        {index + 1}. {ingredient}
                                    </span>
                                    <button className="delete-btn" onClick={() => removeIngredient(index)}>
                                        ✖
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="add-ingredient-section">
                    <input
                        type="text"
                        value={newIngredient}
                        onChange={(e) => setNewIngredient(e.target.value)}
                        placeholder="Add an ingredient"
                        className="ingredient-input"
                    />
                    <button onClick={addIngredient} className="add-btn">
                        Add
                    </button>
                </div>
            </div>

            <div className="right-box">
                {recipe ? (
                    <div className="recipe-card">
                        <div className="recipe-name-box">
                            <h2 className="recipe-name">{recipe.name}</h2>
                        </div>

                        <div className="ingredients-box">
                            <h3>Ingredients:</h3>
                            <ul>
                                {recipe.ingredients.map((ingredient, index) => (
                                    <li key={index}>
                                        {index + 1}. {ingredient}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="instructions-box">
                            <h3>Instructions:</h3>
                            <ol>
                                {recipe.instructions.map((step, index) => (
                                    <li key={index}>
                                        {index + 1}. {step}
                                    </li>
                                ))}
                            </ol>
                        </div>
                    </div>
                ) : (
                    <div className="recipe-placeholder">
                        <p>No recipe generated yet. Upload an image and fetch a recipe.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default FileUploader;

