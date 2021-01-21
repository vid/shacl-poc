import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { DevTool } from '@hookform/devtools';
import { getFields } from './lib/forms';
import { Validator } from './lib/Validator';

const validator = new Validator();

export default () => {
  const [fields, setFields] = useState([]);

  useEffect(() => {
    const getShapes = async () => {
      const vshapes = await validator.getShapes();
      const shapeFields = await getFields(vshapes);

      setFields(shapeFields);
    };

    getShapes();
  }, []);

  const { register, control, handleSubmit } = useForm({
    mode: 'onChange',
  });

  const inputs = fields.map((f) => (
    <>
      <label htmlFor="test">{f.name}</label>
      <input id="test" name="test" ref={register} />
    </>
  ));

  return (
    <>
      <form onSubmit={handleSubmit((d) => console.log(d))}>
        <h1>React Hook Form DevTools</h1>
        {inputs}
        <input type="submit" />
      </form>
      <DevTool control={control} />
    </>
  );
};
