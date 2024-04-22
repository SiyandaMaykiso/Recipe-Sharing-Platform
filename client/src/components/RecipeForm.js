import React, { useState } from 'react';
import { Formik, Form, Field } from 'formik';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';  // Make sure the path to AuthContext is correct

const RecipeForm = ({ initialValues }) => {
    const { authToken } = useAuth(); // Using authToken from AuthContext
    const [selectedFile, setSelectedFile] = useState(null);
    const [submissionError, setSubmissionError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
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
        <div className="recipe-form-container">
            <h2>Add New Recipe</h2>
            {successMessage && <div className="success-message">{successMessage}</div>}
            <Formik initialValues={initialValues || { title: '', description: '', ingredients: '', instructions: '' }} onSubmit={handleSubmit}>
                {({ isSubmitting }) => (
                    <Form>
                        <Field name="title" placeholder="Recipe Title" type="text" />
                        <Field name="description" as="textarea" placeholder="Recipe Description" />
                        <Field name="ingredients" as="textarea" placeholder="List all ingredients" />
                        <Field name="instructions" as="textarea" placeholder="Cooking Instructions" />
                        <input type="file" name="recipeImage" onChange={handleFileChange} />
                        {submissionError && <div className="error-message">{submissionError}</div>}
                        <button type="submit" disabled={isSubmitting}>Submit</button>
                        <Link to="/dashboard" className="btn btn-secondary">Back to Dashboard</Link>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default RecipeForm;
