import { getFields, validateForm } from './forms';
import { Validator } from './Validator';
import { EventShacl } from './ttl/event-shacl.ttl';
import { LOCATION, START_DATE } from './ns';

it('gets fields', async () => {
  const validator = new Validator(EventShacl);
  const fields = await getFields(validator);

  expect(Object.keys(fields).length).toBe(3);
});

it('gets fields', async () => {
  const validator = new Validator(EventShacl);
  const fields = await getFields(validator);

  expect(Object.keys(fields).length).toBe(3);
  expect(fields.every((f) => !!f.dataType)).toBe(true);
});

it('form validation fails ', async () => {
  const validator = new Validator(EventShacl);
  const fields = await getFields(validator);

  const formData = { i0: 'a' };
  const res = await validateForm(validator, formData, fields);

  expect(res).toBeDefined();
  expect(res.length).toBe(2);
  expect(res[0].path.value).toBe(START_DATE.value);
  expect(res[1].path.value).toBe(LOCATION.value);
});

it('form validation passes', async () => {
  const validator = new Validator(EventShacl);
  const fields = await getFields(validator);

  const formData = { i0: 'a', i1: new Date().toISOString(), i2: 'someplace' };
  const res = await validateForm(validator, formData, fields);

  expect(res).toBeUndefined();
});
