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
    <div className="recipe-form-container container">
      <h2 className="form-header">Add New Recipe</h2>
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
      >
        {({ values, isSubmitting }) => (
          <Form className="form">
            <div className="form-control">
              <label htmlFor="title">Title</label>
              <Field id="title" name="title" placeholder="Chocolate Cake" className="input"/>
            </div>

            <div className="form-control">
              <label htmlFor="description">Description</label>
              <Field id="description" name="description" as="textarea" placeholder="Delicious chocolate cake..." className="textarea"/>
            </div>

            <FieldArray name="ingredients">
              {({ insert, remove, push }) => (
                <div className="ingredient-list">
                  <h4>Ingredients</h4>
                  {values.ingredients.length > 0 &&
                    values.ingredients.map((ingredient, index) => (
                      <div key={index} className="ingredient-field form-control">
                        <Field name={`ingredients.${index}.name`} placeholder="Ingredient" className="ingredient-input" />
                        <Field name={`ingredients.${index}.quantity`} placeholder="Quantity" className="ingredient-input" />
                        <div className="ingredient-actions">
                          <button type="button" className="btn" onClick={() => remove(index)}>- Remove</button>
                          <button type="button" className="btn" onClick={() => push({ name: '', quantity: '' })}>+ Add More</button>
                        </div>
                      </div>
                    ))}
                  <button type="button" className="btn" onClick={() => push({ name: '', quantity: '' })}>+ Add Ingredient</button>
                </div>
              )}
            </FieldArray>

            <div className="form-control">
              <label htmlFor="recipeImage">Recipe Image:</label>
              <input
                id="recipeImage"
                name="recipeImage"
                type="file"
                accept="image/png, image/jpeg"
                onChange={handleFileChange}
                className="input-file"
              />
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
