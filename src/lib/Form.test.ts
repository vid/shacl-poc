import { Form } from './Form';
import { EventShacl } from './shacl/event-shacl.ttl';
import { LOCATION, START_DATE } from './ns';
import { TYPES } from './defs';

const jsonShacl = { type: TYPES.TTL, text: EventShacl };
const shaclInput = jsonShacl;

it('gets fields', async () => {
  const form = new Form(shaclInput);
  const fields = await form.getFields();

  expect(Object.keys(fields).length).toBe(3);
});

it('gets fields', async () => {
  const form = new Form(shaclInput);
  const fields = await form.getFields();

  expect(Object.keys(fields).length).toBe(3);
  expect(fields.every((f) => !!f.dataType)).toBe(true);
});

it('form validation fails ', async () => {
  const form = new Form(shaclInput);
  const fields = await form.getFields();

  const formData = { i0: 'a' };
  const res = await form.validate(formData, fields);

  expect(res).toBeDefined();
  expect(res.length).toBe(2);
  expect(res[0].path.value).toBe(START_DATE.value);
  expect(res[1].path.value).toBe(LOCATION.value);
});

it('form validation passes', async () => {
  const form = new Form(shaclInput);
  const fields = await form.getFields();

  const formData = { i0: 'a', i1: new Date().toISOString(), i2: 'someplace' };
  const res = await form.validate(formData, fields);

  expect(res).toBeUndefined();
});
