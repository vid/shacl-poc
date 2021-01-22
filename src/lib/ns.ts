import namespace from '@rdfjs/namespace';
import $rdf from 'rdf-ext';

const schema = namespace('http://schema.org/');
// const ex = namespace('http://example.com/');
// const xsd = namespace('http://www.w3.org/2001/XMLSchema#>');
const rdf = namespace('http://www.w3.org/1999/02/22-rdf-syntax-ns#');
const sh = namespace('http://www.w3.org/ns/shacl#');

export const EVENT = schema('Event');
export const NAME = schema('name');
export const START_DATE = schema('startDate');
export const TYPE = rdf('type');
export const LOCATION = schema('location');
export const NODE_SHAPE = sh('NodeShape');
export const PATH_SHAPE = sh('path');
export const ORDER_SHAPE = sh('order');
export const DESCRIPTION_SHAPE = sh('description');
export const PROPERTY_SHAPE = sh('property');
export const DATATYPE_SHAPE = sh('datatype');
export const DATETIME = $rdf.namedNode('http://www.w3.org/2001/XMLSchema#dateTime');
export const STRING = $rdf.namedNode('http://www.w3.org/2001/XMLSchema#string');
