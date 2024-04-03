import React, { useState } from 'react';
import { Formik, Form, Field, FieldArray } from 'formik';
import { Link } from 'react-router-dom';

const RecipeForm = ({ initialValues, onSubmit }) => {
  const [submissionError, setSubmissionError] = useState('');
  const [selectedFile, setSelectedFile] = useState(null); // State for file input

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]); // Set selected file
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    const formData = new FormData();
    // Append form fields to formData
    Object.keys(values).forEach(key => formData.append(key, values[key]));
    if (selectedFile) {
      formData.append('recipeImage', selectedFile); // Append selected file under 'recipeImage' key
    }

    try {
      await onSubmit(formData); // Adjust onSubmit to handle formData
      setSubmissionError('');
    } catch (error) {
      setSubmissionError(error.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="recipe-form-container">
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit} // Use custom handleSubmit
      >
        {({ values, isSubmitting }) => (
          <Form>
            <label htmlFor="title">Title</label>
            <Field id="title" name="title" placeholder="Chocolate Cake" />

            <label htmlFor="description">Description</label>
            <Field id="description" name="description" as="textarea" placeholder="Delicious chocolate cake..." />

            <FieldArray name="ingredients">
              {({ insert, remove, push }) => (
                <div className="ingredient-list">
                  <h4>Ingredients</h4>
                  {values.ingredients.length > 0 &&
                    values.ingredients.map((ingredient, index) => (
                      <div key={index} className="ingredient-field">
                        <Field name={`ingredients.${index}.name`} placeholder="Ingredient" className="ingredient-input" />
                        <Field name={`ingredients.${index}.quantity`} placeholder="Quantity" className="ingredient-input" />
                        <div className="ingredient-actions">
                          <button type="button" onClick={() => remove(index)}>- Remove</button>
                          <button type="button" onClick={() => push({ name: '', quantity: '' })}>+ Add More</button>
                        </div>
                      </div>
                    ))}
                  <button type="button" onClick={() => push({ name: '', quantity: '' })}>+ Add Ingredient</button>
                </div>
              )}
            </FieldArray>

            {/* File input for image upload */}
            <div>
              <label htmlFor="recipeImage">Recipe Image:</label>
              <input
                id="recipeImage"
                name="recipeImage"
                type="file"
                accept="image/png, image/jpeg"
                onChange={handleFileChange}
              />
            </div>

            {submissionError && <div style={{ color: 'red', marginTop: '10px' }}>{submissionError}</div>}
            <button type="submit" disabled={isSubmitting}>Submit</button>
            <Link to="/dashboard" className="button-link">Back to Dashboard</Link>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default RecipeForm;
