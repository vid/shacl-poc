/* eslint-disable react/jsx-one-expression-per-line */
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { DevTool } from '@hookform/devtools';

import { Form, FormField } from './lib/Form';
import { DATETIME } from './lib/ns';
import FormDebug from './FormEdit';
import { EventShacl } from './lib/shacl/event-shacl.ttl';

export default () => {
  const [shacl, setShacl] = useState({ ttl: EventShacl });
  const [form, setForm] = useState<Form | undefined>();
  const [nodeShapes, setNodeShapes] = useState<FormField[] | undefined>();

  const [result, setResult] = useState(<span />);
  const [validationErrors, setValidationErrors] = useState([]);

  const { register, control, handleSubmit } = useForm({ mode: 'onChange' });

  useEffect(() => {
    async function setup() {
      const form = new Form(shacl);
      const nodeShapes = await form.getFields();
      setForm(form);
      setNodeShapes(nodeShapes);
    }
    setup();
  }, [shacl]);

  const changeShacl = async (newShacl) => {
    setShacl(newShacl);
    handleSubmit(doValidate);
  };

  if (!nodeShapes) return <h1>Rendering</h1>;

  const inputs = nodeShapes.map((f: FormField) => {
    const { key, description, path, dataType } = f;
    if (dataType === undefined) {
      return <textarea readOnly key={key} value={`No data type\n${JSON.stringify(f, null, 2)}`} />
    }

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
    const res = await form.validate(d, nodeShapes);
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
        <ul className="form-ul form-narrow">
          {inputs}
          <br />
          <input type="submit" />
          {result}
        </ul>
      </form>

      <div style={{ padding: '50px' }}>
        <FormDebug shacl={form.validator.shacl.ttl} changeShacl={changeShacl} defaultShacl={EventShacl} />
      </div>
      <DevTool control={control} />
    </>
  );
};
