import React, { useState, useEffect } from 'react';
import { Formik, Form, Field } from 'formik';
import { Link } from 'react-router-dom';

const RecipeForm = ({ initialValues }) => {
    const [formValues, setFormValues] = useState(initialValues);
    const [submissionError, setSubmissionError] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        // Initialize or correct form values on mount or when initialValues change
        setFormValues({
            ...initialValues,
            ingredients: typeof initialValues.ingredients === 'string' ? initialValues.ingredients : '',
            instructions: typeof initialValues.instructions === 'string' ? initialValues.instructions : ''
        });
    }, [initialValues]);

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        console.log('Submitting Ingredients:', values.ingredients);
        const formData = new FormData();
        formData.append('title', values.title);
        formData.append('description', values.description);
        formData.append('ingredients', values.ingredients);
        formData.append('instructions', values.instructions);

        if (selectedFile) {
            formData.append('recipeImage', selectedFile);
        }

        const user = JSON.parse(localStorage.getItem('user'));
        const userId = user ? user.user_id : null;
        const token = user ? user.token : null;

        if (!userId || !token) {
            console.error('User ID or token not found in localStorage');
            setSubmissionError('Authentication required. Please log in again.');
            setSubmitting(false);
            return;
        }

        formData.append('user_id', userId);

        try {
            const response = await fetch('http://localhost:3000/recipes', {
                method: 'POST',
                body: formData,
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const result = await response.json();
            console.log("Success:", result);
            setSuccessMessage('Recipe successfully uploaded!');
            resetForm({ values: '' }); // Reset the form with empty values
        } catch (error) {
            console.error('Submission error:', error);
            setSubmissionError(error.message || 'An unexpected error occurred. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleAutoExpand = (event) => {
      // Reset height and width to auto
      event.target.style.height = 'auto';
      event.target.style.width = 'auto';

      // Set height to the scroll height of the content
      event.target.style.height = `${event.target.scrollHeight}px`;
      // Set width to the scroll width of the content
      event.target.style.width = `${event.target.scrollWidth}px`;
  };


    return (
        <div className="recipe-form-container container">
            <h2 className="form-header">Add New Recipe</h2>
            {successMessage && <div className="success-message">{successMessage}</div>}
            <Formik initialValues={formValues} onSubmit={handleSubmit} enableReinitialize>
                {({ isSubmitting }) => (
                    <Form className="form">
                        <div className="form-control">
                            <label htmlFor="title">Title</label>
                            <Field id="title" name="title" placeholder="Recipe Title" />
                        </div>
                        <div className="form-control">
                            <label htmlFor="description">Description</label>
                            <Field id="description" name="description" as="textarea" placeholder="Recipe Description" />
                        </div>
                        <div className="form-control">
                            <label htmlFor="ingredients">Ingredients</label>
                            <Field id="ingredients" name="ingredients" as="textarea" placeholder="List all ingredients" onInput={handleAutoExpand} />
                        </div>
                        <div className="form-control">
                            <label htmlFor="instructions">Instructions</label>
                            <Field id="instructions" name="instructions" as="textarea" placeholder="Cooking instructions" onInput={handleAutoExpand} />
                        </div>
                        <div className="form-control">
                            <label htmlFor="recipeImage">Recipe Image</label>
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