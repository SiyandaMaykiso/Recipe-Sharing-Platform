import React, { useState } from 'react';
import { Formik, Form, Field, FieldArray } from 'formik';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom

const RecipeForm = ({ initialValues, onSubmit }) => {
  // State for managing submission errors
  const [submissionError, setSubmissionError] = useState('');

  return (
    <div className="recipe-form-container">
      <Formik
        initialValues={initialValues}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            setSubmissionError('');
            await onSubmit(values);
          } catch (error) {
            setSubmissionError(error.message || 'An unexpected error occurred. Please try again.');
          } finally {
            setSubmitting(false);
          }
        }}
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

            {submissionError && <div style={{ color: 'red', marginTop: '10px' }}>{submissionError}</div>}

            <button type="submit" disabled={isSubmitting}>Submit</button>
            {/* Link back to the dashboard */}
            <Link to="/dashboard" className="button-link">Back to Dashboard</Link>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default RecipeForm;
