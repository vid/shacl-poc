import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { convertBetween } from './lib/util';
import { TSHACL, TYPES } from './lib/defs';

export default ({
  defaultShacl,
  changeShacl,
  parseError,
  setParseError,
}: {
  setParseError: (any) => void;
  changeShacl: (shacl: TSHACL) => void;
  defaultShacl: string;
  parseError: Error;
}) => {
  const shaclLines = (text) => text?.split('\n').length;
  const [lines, setLines] = useState(shaclLines(defaultShacl));
  const [currentType, setCurrentType] = useState(TYPES.TTL);
  const { register, handleSubmit } = useForm();

  const TTL_EVENT = 'ttlevent';
  const INPUT_TEXT = 'itext';
  const INPUT_TYPE = 'itype';

  const getInput = (which) => document.getElementById(which) as HTMLInputElement;

  const syncLines = () => {
    const shacl = getInput(INPUT_TEXT).value;
    setLines(shaclLines(shacl));
    document.getElementById('ln').scrollTop = document.getElementById(INPUT_TEXT).scrollTop;
  };

  const selectType = async (convertTo) => {
    setParseError(null);
    if (convertTo === TTL_EVENT) {
      getInput(INPUT_TEXT).value = defaultShacl;
      getInput(INPUT_TYPE).value = TYPES.TTL;
      setCurrentType(TYPES.TTL);
    } else {
      const input = getInput(INPUT_TEXT).value;
      setCurrentType(convertTo);
      if (input) {
        try {
          const value = await convertBetween(currentType, convertTo, input);
          getInput(INPUT_TEXT).value = typeof value === 'string' ? value : JSON.stringify(value, null, 2);
        } catch (e) {
          setParseError(e);
          getInput(INPUT_TYPE).value = currentType;
          setCurrentType(currentType);
          console.error(e);
        }
      }
    }
    syncLines();
  };

  return (
    <>
      <form onSubmit={handleSubmit((d) => changeShacl({ type: getInput(INPUT_TYPE).value as TYPES, text: getInput(INPUT_TEXT).value }))}>
        <ul className="form-ul">
          <select onChange={(ev) => selectType(ev.target.value)} id={INPUT_TYPE} name={INPUT_TYPE} ref={register}>
            <optgroup label="Types">
              <option value={TYPES.TTL}>Turtle</option>
              <option value={TYPES.JSONLD}>JSON-LD</option>
              <option value={TYPES.QUADS}>Quads</option>
              <option value={TYPES.DS_ARRAY}>Dataset Array</option>
            </optgroup>
            <optgroup label="Defaults">
              <option value={TTL_EVENT}>Turtle Event</option>
            </optgroup>
          </select>
          <button type="submit">Update</button>
          {parseError && <div className="parse-error">{parseError.message}</div>}

          <div style={{ position: 'relative', marginTop: '8px' }}>
            <textarea
              id="ln"
              readOnly
              style={{ position: 'absolute', top: 0, width: 65, left: 0, textAlign: 'right', background: 'lightgrey' }}
              rows={30}
              value={[...Array(lines)].map((x, i) => i + 1).join('\n')}
            />
            <textarea
              id={INPUT_TEXT}
              onChange={syncLines}
              onScroll={syncLines}
              name={INPUT_TEXT}
              ref={register}
              style={{ position: 'absolute', top: 0, width: '70%', left: 50, whiteSpace: 'pre', overflowWrap: 'normal', overflowX: 'scroll' }}
              rows={30}
              defaultValue={defaultShacl}
            />
          </div>
        </ul>
      </form>
    </>
  );
};
