import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

export default ({ shacl, defaultShacl, changeShacl }: { shacl: string; changeShacl: any; defaultShacl: string }) => {
  const shaclLines = () => shacl.split('\n').length;
  const [lines, setLines] = useState(shaclLines());
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
    syncLines();
  };
  const syncLines = () => {
    document.getElementById('ln').scrollTop = document.getElementById('shacl').scrollTop;
    setLines(shaclLines());
  };
  
  return (
    <>
      <form onSubmit={handleSubmit((d) => transformThenChangeShacl(d.shacl, d.format))}>
        <ul className="form-ul">
          <select id="format" name="format" ref={register}>
            <option value="ttl">Turtle</option>
            <option value="jsonld">JSON-LD</option>
          </select>
          <button>Update</button>
          <button onClick={resetForm}>Reset</button>

          <div style={{ position: 'relative', marginTop: '8px' }}>
            <textarea id="ln" readOnly style={{ position: 'absolute', top: 0, width: 65, left: 0 }} rows={30} defaultValue={[...Array(lines)].map((x, i) => i + 1).join('\n')} />
            <textarea
              id="shacl"
              onChange={syncLines}
              onScroll={syncLines}
              name="shacl"
              ref={register}
              style={{ position: 'absolute', top: 0, width: '70%', left: 50 }}
              rows={30}
              defaultValue={shacl}
            />
          </div>
        </ul>
      </form>
    </>
  );
};