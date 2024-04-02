import React, { useState } from 'react'; // Make sure to import useState
import { Formik, Form, Field, FieldArray } from 'formik';

const RecipeForm = ({ initialValues, onSubmit }) => {
  // State for managing submission errors
  const [submissionError, setSubmissionError] = useState('');

  return (
    // Adding a div with a unique class around the Formik component
    <div className="recipe-form-container"> 
      <Formik
        initialValues={initialValues}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            // Clear previous submission errors
            setSubmissionError('');
            await onSubmit(values);
          } catch (error) {
            // Set new submission error if onSubmit fails
            setSubmissionError(error.message || 'An unexpected error occurred. Please try again.');
          } finally {
            // Always stop submitting, regardless of outcome
            setSubmitting(false);
          }
        }}
        // Add validation schema here if needed
      >
        {({ values, isSubmitting }) => (
          <Form>
            <label htmlFor="title">Title</label>
            <Field id="title" name="title" placeholder="Chocolate Cake" />

            <label htmlFor="description">Description</label>
            <Field id="description" name="description" as="textarea" placeholder="Delicious chocolate cake..." />

            <FieldArray name="ingredients">
              {({ insert, remove, push }) => (
                <div>
                  <h4>Ingredients</h4>
                  {values.ingredients.length > 0 &&
                    values.ingredients.map((ingredient, index) => (
                      <div key={index}>
                        <Field name={`ingredients.${index}.name`} placeholder="Flour" />
                        <Field name={`ingredients.${index}.quantity`} placeholder="2 cups" />
                        <button type="button" onClick={() => remove(index)}>-</button>
                        <button type="button" onClick={() => push({ name: '', quantity: '' })}>+</button>
                      </div>
                    ))}
                  <button type="button" onClick={() => push({ name: '', quantity: '' })}>Add Ingredient</button>
                </div>
              )}
            </FieldArray>

            {/* Display the submission error message */}
            {submissionError && <div style={{ color: 'red', marginTop: '10px' }}>{submissionError}</div>}

            <button type="submit" disabled={isSubmitting}>Submit</button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default RecipeForm;
