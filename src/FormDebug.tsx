import React from 'react';
import { useForm } from 'react-hook-form';

export default ({ shacl, changeShacl }: { shacl: string; changeShacl: any }) => {
  const { register, handleSubmit } = useForm();

  return (
    <>
      <form onSubmit={handleSubmit((d) => changeShacl(d.shacl))}>
        <textarea name="shacl" ref={register} style={{ width: '80%' }} rows={30} defaultValue={shacl} />
        <br />
        <button type="submit">Update</button>
      </form>
    </>
  );
};
