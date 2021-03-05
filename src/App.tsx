import { hot } from 'react-hot-loader';
import React, { useState } from 'react';

import FormContainer from './FormContainer';
import { TSHACL, TYPES } from './lib/defs';
import FormEdit from './FormEdit';
import { EventShacl } from './lib/shacl/event-shacl.ttl';

const App = () => {
  const [shacl, setShacl] = useState<TSHACL>({ type: TYPES.TTL, text: EventShacl });
  const [parseError, setParseError] = useState<Error>();
  const changeShacl = async (newShacl: TSHACL) => {
    setShacl(newShacl);
  };
  return (
    <>
      <FormContainer shacl={shacl} setParseError={setParseError} />
      <div style={{ padding: '50px' }}>
        <FormEdit changeShacl={changeShacl} defaultShacl={EventShacl} parseError={parseError} setParseError={setParseError} />
      </div>
    </>
  );
};

export default hot(module)(App);
