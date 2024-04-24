import React, { useState } from 'react';
import { Formik, Form, Field } from 'formik';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const RecipeForm = ({ initialValues }) => {
    const { authToken } = useAuth();
    const [selectedFile, setSelectedFile] = useState(null);
    const [submissionError, setSubmissionError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleAutoExpand = (event) => {
        event.target.style.height = 'inherit';
        event.target.style.height = `${event.target.scrollHeight}px`;
    };

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        const formData = new FormData();
        formData.append('title', values.title);
        formData.append('description', values.description);
        formData.append('ingredients', values.ingredients);
        formData.append('instructions', values.instructions);

        if (selectedFile) {
            formData.append('recipeImage', selectedFile);
        }

        if (!authToken) {
            console.error('Token not found');
            setSubmissionError('Authentication required. Please log in again.');
            setSubmitting(false);
            return;
        }

        try {
            const response = await fetch('https://recipe-sharing-platform-sm-8996552549c5.herokuapp.com/recipes', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${authToken}` },
                body: formData,
            });

            if (!response.ok) {
                const errorResponse = await response.json();
                throw new Error(errorResponse.message || 'Failed to submit recipe');
            }

            const result = await response.json();
            setSuccessMessage('Recipe successfully uploaded!');
            resetForm({});
        } catch (error) {
            console.error('Submission error:', error);
            setSubmissionError(error.message || 'An unexpected error occurred. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="recipe-form-container container">
            <h2>Add New Recipe</h2>
            {successMessage && <div className="success-message">{successMessage}</div>}
            <Formik initialValues={initialValues || { title: '', description: '', ingredients: '', instructions: '' }} onSubmit={handleSubmit} enableReinitialize>
                {({ isSubmitting }) => (
                    <Form className="form">
                        <div className="form-control">
                            <label htmlFor="title">Title</label>
                            <Field id="title" name="title" placeholder="Recipe Title" />
                        </div>
                        <div className="form-control">
                            <label htmlFor="description">Description</label>
                            <Field id="description" name="description" as="textarea" placeholder="Recipe Description" onInput={handleAutoExpand} />
                        </div>
                        <div className="form-control">
                            <label htmlFor="ingredients">Ingredients</label>
                            <Field id="ingredients" name="ingredients" as="textarea" placeholder="List all ingredients" onInput={handleAutoExpand} />
                        </div>
                        <div className="form-control">
                            <label htmlFor="instructions">Instructions</label>
                            <Field id="instructions" name="instructions" as="textarea" placeholder="Cooking Instructions" onInput={handleAutoExpand} />
                        </div>
                        <div className="form-control">
                            <label htmlFor="recipeImage">Recipe Image (Only Jpeg or PNG)</label>
                            <input id="recipeImage" name="recipeImage" type="file" onChange={handleFileChange} className="input-file" />
                        </div>
                        {submissionError && <div className="error-message">{submissionError}</div>}
                        <button type="submit" disabled={isSubmitting} className="btn btn-primary">Submit</button>
                        <Link to="/dashboard" className="btn btn-secondary">Back to Dashboard</Link>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default RecipeForm;
