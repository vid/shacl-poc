import rdf from 'rdf-ext';
import namespace from '@rdfjs/namespace';

import { Validator } from './validator';

const schema = namespace('http://schema.org/');
const ex = namespace('http://example.com/');
const xsd = namespace('http://www.w3.org/2001/XMLSchema#>');
const rdfNS = namespace('http://www.w3.org/1999/02/22-rdf-syntax-ns#');

const EVENT = schema('Event');
const START_DATE = schema('startDate');
const TYPE = rdfNS('type');
const LOCATION = schema('location');

const validator = new Validator();

go();
async function go() {
  let dataset = rdf.dataset();
  let bnode = rdf.blankNode();

  const formDate = bnode;
  dataset.add(rdf.quad(formDate, TYPE, EVENT));
  dataset.add(rdf.quad(formDate, START_DATE, rdf.literal(new Date().toISOString(), rdf.namedNode('http://www.w3.org/2001/XMLSchema#dateTime'))));
  dataset.add(rdf.quad(formDate, LOCATION, rdf.literal('somewhere')));
  console.log(dataset.toString());
  validator.validate(dataset);
}
