import React, { useState } from 'react';
import { Formik, Form, Field, FieldArray } from 'formik';
import { Link } from 'react-router-dom';

const RecipeForm = ({ initialValues }) => {
    const [submissionError, setSubmissionError] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleSubmit = async (values, { setSubmitting }) => {
        const formData = new FormData();
        Object.keys(values).forEach(key => {
            if (key === 'ingredients') {
                formData.append(key, JSON.stringify(values[key]));
            } else {
                formData.append(key, values[key]);
            }
        });

        if (selectedFile) {
          formData.append('recipeImage', selectedFile);
      }

      const user = JSON.parse(localStorage.getItem('user'));
      const userId = user ? user.user_id : null;

      if (!userId) {
          console.error('User ID not found in localStorage');
          setSubmissionError('User ID not found. Please log in again.');
          setSubmitting(false);
          return;
      }

        formData.append('user_id', userId);

        try {
            const response = await fetch('http://localhost:3000/recipes', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
              throw new Error('Network response was not ok');
          }

          const result = await response.json();
          console.log("Success:", result);
          setSubmissionError('');
      } catch (error) {
          console.error('Submission error:', error);
          setSubmissionError(error.message || 'An unexpected error occurred. Please try again.');
      } finally {
          setSubmitting(false);
      }
  };
 

  return (
    <div className="recipe-form-container container">
        <h2 className="form-header">Add New Recipe</h2>
        <Formik initialValues={initialValues} onSubmit={handleSubmit}>
            {({ values, isSubmitting }) => (
                <Form className="form">
                        <div className="form-control">
                            <label htmlFor="title">Title</label>
                            <Field id="title" name="title" placeholder="Chocolate Cake" className="input" />
                        </div>

                        <div className="form-control">
                            <label htmlFor="description">Description</label>
                            <Field id="description" name="description" as="textarea" placeholder="Delicious chocolate cake..." className="textarea" />
                        </div>

                        <FieldArray name="ingredients">
                            {({ remove, push }) => (
                                <div className="ingredient-list">
                                    <h4>Ingredients</h4>
                                    {values.ingredients.map((_ingredient, index) => (
                                        <div key={index} className="ingredient-field form-control">
                                            <Field name={`ingredients.${index}.name`} placeholder="Ingredient name" className="ingredient-input" />
                                            <Field name={`ingredients.${index}.quantity`} placeholder="Quantity" className="ingredient-input" />
                                            <button type="button" className="btn" onClick={() => remove(index)}>- Remove</button>
                                        </div>
                                    ))}
                                    <button type="button" className="btn" onClick={() => push({ name: '', quantity: '' })}>+ Add Ingredient</button>
                                </div>
                            )}
                        </FieldArray>

                        <div className="form-control">
                            <label htmlFor="recipeImage">Recipe Image:</label>
                            <input id="recipeImage" name="recipeImage" type="file" accept="image/*" onChange={handleFileChange} className="input-file" />
                        </div>

                        {submissionError && <div className="error-message">{submissionError}</div>}
                        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>Submit</button>
                        <Link to="/dashboard" className="btn btn-secondary">Back to Dashboard</Link>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default RecipeForm;
