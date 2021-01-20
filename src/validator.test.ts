import $rdf from 'rdf-ext';
import namespace from '@rdfjs/namespace';

import { Validator } from './validator';

const schema = namespace('http://schema.org/');
// const ex = namespace('http://example.com/');
// const xsd = namespace('http://www.w3.org/2001/XMLSchema#>');
const rdf = namespace('http://www.w3.org/1999/02/22-rdf-syntax-ns#');

const EVENT = schema('Event');
const START_DATE = schema('startDate');
const TYPE = rdf('type');
const LOCATION = schema('location');

const validator = new Validator();

it('validates', async () => {
  const dataset = $rdf.dataset();
  const bnode = $rdf.blankNode();

  const form = bnode;
  dataset.add($rdf.quad(form, TYPE, EVENT));
  dataset.add($rdf.quad(form, START_DATE, $rdf.literal(new Date().toISOString(), $rdf.namedNode('http://www.w3.org/2001/XMLSchema#dateTime'))));
  dataset.add($rdf.quad(form, LOCATION, $rdf.literal('somewhere')));
  const res = await validator.validate(dataset);
  expect(res).toBeUndefined();
});

it('fails validation for missing startDate', async () => {
  const dataset = $rdf.dataset();
  const bnode = $rdf.blankNode();

  const form = bnode;
  dataset.add($rdf.quad(form, TYPE, EVENT));
  dataset.add($rdf.quad(form, LOCATION, $rdf.literal('somewhere')));
  const res = await validator.validate(dataset);
  expect(res).toBeDefined();
  expect(res.length).toBe(1);
  expect(res[0].path).toEqual(START_DATE);
});
