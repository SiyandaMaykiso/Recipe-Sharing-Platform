// src/components/RecipeForm.js
import React from 'react';
import { Formik, Form, Field, FieldArray } from 'formik';

const RecipeForm = ({ initialValues, onSubmit }) => {
  return (
    <Formik
      initialValues={initialValues}
      onSubmit={(values, { setSubmitting }) => {
        onSubmit(values);
        setSubmitting(false);
      }}
      // Add validation schema here if needed
    >
      {({ values, isSubmitting, handleChange }) => (
        <Form>
          <label htmlFor="title">Title</label>
          <Field id="title" name="title" placeholder="Chocolate Cake" />

          <label htmlFor="description">Description</label>
          <Field
            id="description"
            name="description"
            as="textarea"
            placeholder="Delicious chocolate cake..."
          />

          <FieldArray name="ingredients">
            {({ insert, remove, push }) => (
              <div>
                <h4>Ingredients</h4>
                {values.ingredients.length > 0 &&
                  values.ingredients.map((ingredient, index) => (
                    <div key={index}>
                      <Field name={`ingredients.${index}.name`} placeholder="Flour" />
                      <Field name={`ingredients.${index}.quantity`} placeholder="2 cups" />
                      <button type="button" onClick={() => remove(index)}>
                        -
                      </button>
                      <button type="button" onClick={() => push({ name: '', quantity: '' })}>
                        +
                      </button>
                    </div>
                  ))}
                <button type="button" onClick={() => push({ name: '', quantity: '' })}>
                  Add Ingredient
                </button>
              </div>
            )}
          </FieldArray>

          <button type="submit" disabled={isSubmitting}>
            Submit
          </button>
        </Form>
      )}
    </Formik>
  );
};

export default RecipeForm;
