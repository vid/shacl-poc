import $rdf from 'rdf-ext';

import { TYPE, EVENT, START_DATE, LOCATION, DATETIME, NAME } from './ns';
import { EventShacl } from './shacl/event-shacl.ttl';

import { Validator } from './Validator';

const ttlShacl = {ttl: EventShacl};
it('validates', async () => {
  const validator = new Validator(ttlShacl);
  const dataset = $rdf.dataset();
  const form = $rdf.blankNode();

  dataset.add($rdf.quad(form, TYPE, EVENT));
  dataset.add($rdf.quad(form, NAME, $rdf.literal('an event')));
  dataset.add($rdf.quad(form, START_DATE, $rdf.literal(new Date().toISOString(), DATETIME)));
  dataset.add($rdf.quad(form, LOCATION, $rdf.literal('somewhere')));
  const res = await validator.validate(dataset);
  expect(res).toBeUndefined();
});

it('fails validation for missing name and startDate', async () => {
  const validator = new Validator(ttlShacl);
  const dataset = $rdf.dataset();
  const form = $rdf.blankNode();

  dataset.add($rdf.quad(form, TYPE, EVENT));
  dataset.add($rdf.quad(form, LOCATION, $rdf.literal('somewhere')));
  const res = await validator.validate(dataset);
  expect(res).toBeDefined();
  expect(res.length).toBe(2);
  expect(res[0].path).toEqual(NAME);
  expect(res[1].path).toEqual(START_DATE);
});

it('fails validation for too short name', async () => {
  const validator = new Validator(ttlShacl);
  const dataset = $rdf.dataset();
  const form = $rdf.blankNode();

  dataset.add($rdf.quad(form, TYPE, EVENT));
  dataset.add($rdf.quad(form, NAME, $rdf.literal('')));
  dataset.add($rdf.quad(form, START_DATE, $rdf.literal(new Date().toISOString(), DATETIME)));
  dataset.add($rdf.quad(form, LOCATION, $rdf.literal('somewhere')));
  const res = await validator.validate(dataset);
  expect(res).toBeDefined();
  expect(res.length).toBe(1);
  expect(res[0].path).toEqual(NAME);
});
