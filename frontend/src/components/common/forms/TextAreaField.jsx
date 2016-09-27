import React from 'react';
import FieldError from './FieldError';

const TextAreaField = ({ input, label, placeholder, id, meta: { touched, error } }) => (
  <div>
    <label htmlFor={input.name} className={(touched && error) ? 'invalid' : ''}>
      {label}
      {touched && error ? <FieldError error={error} /> : ''}
    </label>
    <textarea className={id} id={id} {...input} placeholder={placeholder} />
  </div>
);

TextAreaField.propTypes = {
  input: React.PropTypes.object.isRequired,
  label: React.PropTypes.string,
  placeholder: React.PropTypes.string,
  meta: React.PropTypes.object.isRequired,
  id: React.PropTypes.string,
};
export default TextAreaField;
