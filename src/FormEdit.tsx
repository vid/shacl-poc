import React from 'react';
import { useForm } from 'react-hook-form';
import { convertQuadsToDataset } from './lib/util';

export default ({ shacl, defaultShacl, changeShacl }: { shacl: string; changeShacl: any; defaultShacl: string }) => {
  const { register, handleSubmit } = useForm();

  const transformThenChangeShacl = async (text: string, format) => {
    // const ttl = await convertQuadsToDataset(text);
    if (format === 'ttl') {
      changeShacl({ ttl: text });
    } else {
      changeShacl({ jsonld: JSON.parse(text) });
    }
  };
  const resetForm = () => {
    (document.getElementById('shacl') as HTMLInputElement).value = defaultShacl;
    (document.getElementById('format') as HTMLInputElement).value = 'ttl';
  };
  return (
    <>
      <form onSubmit={handleSubmit((d) => transformThenChangeShacl(d.shacl, d.format))}>
        <ul className="form-ul">
          <textarea id="shacl" name="shacl" ref={register} style={{ width: '80%' }} rows={30} defaultValue={shacl} />
          <br />
          <select id="format" name="format" ref={register}>
            <option value="ttl">Turtle</option>
            <option value="jsonld">JSON-LD</option>
          </select>
          <button>Update</button>
          <button onClick={resetForm}>Reset</button>
        </ul>
      </form>
    </>
  );
};
