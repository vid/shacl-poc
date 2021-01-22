/* eslint-disable react/jsx-one-expression-per-line */
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { DevTool } from '@hookform/devtools';

import { getFields, validateForm, FormField } from './lib/forms';
import { Validator } from './lib/Validator';
import { DATETIME } from './lib/ns';
import FormDebug from './FormDebug';
import { EventShacl } from './lib/ttl/event-shacl.ttl';

export default () => {
  const [fields, setFields] = useState([]);
  const [validationErrors, setValidationErrors] = useState([]);
  const [validator, setValidator] = useState(new Validator(EventShacl));
  const [result, setResult] = useState(<span />);

  const [shacl, setShacl] = useState(EventShacl);

  const { register, control, handleSubmit } = useForm({ mode: 'onChange' });

  const getShapes = async () => {
    const shapeFields = await getFields(validator);

    setFields(shapeFields);
  };
  useEffect(() => {
    getShapes();
  }, [shacl]);

  const changeShacl = (newShacl) => {
    setShacl(newShacl);
    setValidator(new Validator(shacl));
    getShapes();
  };

  const inputs = fields.map((f: FormField) => {
    const { key, description, path, dataType } = f;

    let error;
    const exists = validationErrors?.find((v) => v.path.equals(path));
    if (exists) {
      error = (
        <span className="form-notify" role="img" aria-label="Field validation failed">
          ☹{exists.message[0].value}
        </span>
      );
    }
    return (
      <div key={key}>
        <label htmlFor={key}>{description?.value}</label>
        <input className="field field-name" id={key} name={key} ref={register} type={dataType.value === DATETIME.value ? 'datetime-local' : 'text'} />
        {error}
      </div>
    );
  });
  const doValidate = async (d) => {
    console.log('sh', shacl);
    const res = await validateForm(validator, d, fields);
    setResult(
      res ? (
        <span />
      ) : (
        <span className="form-notify" role="img" aria-label="Validation succeeded">
          😄
        </span>
      )
    );
    console.log('validation result', res);
    setValidationErrors(res);
  };
  return (
    <>
      <form onSubmit={handleSubmit(doValidate)}>
        <ul className="form-ul">
          {inputs}
          <br />
          <input type="submit" />
          {result}
        </ul>
      </form>

      <div style={{ padding: '50px' }}>
        <FormDebug shacl={shacl} changeShacl={changeShacl} />
      </div>
      <DevTool control={control} />
    </>
  );
};
