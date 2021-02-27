import * as util from './util';
import SemantifyItEventShacl from './shacl/semantify-it-event-shacl.json';

const shapeTTL = `
@prefix ex: <http://example.com>.
@prefix sh:	<http://www.w3.org/ns/shacl#>.

ex:PersonShape
	a sh:NodeShape .

`;

const shapeContext = {
  ex: 'http://example.com',
  sh: 'http://www.w3.org/ns/shacl#'
};

it('gets context from Turtle', () => {
  const context = util.contextFromTurtle(shapeTTL);
  expect(context).toEqual(shapeContext)
});

it('loads from string', async () => {
  const dataset = await util.loadN3FromString(shapeTTL);
  expect(dataset).toBeDefined();
});

it('converts quads to n3', async () => {
  const quadsText = `<http://example.org/subject> <http://example.org/predicate> "object" <http://example.org/graph> .`;
  const dataset = await util.convertQuadsToDataset(quadsText);
  expect(dataset).toBeDefined();
});

it('converts jsonld to dataset', async () => {
  const dataset = await util.convertJsonLDtoDataset(SemantifyItEventShacl);
  expect(dataset).toBeDefined();
});

it('converts dataset to Turtle', async () => {
  const quadsText = `<http://example.org/subject> <http://example.org/predicate> "object" <http://example.org/graph> .`;
  const dataset = await util.convertQuadsToDataset(quadsText);
  const res = util.convertDatasetToTurtle(dataset, { ex: 'http://example.org/' });

  expect(res).toBeDefined();
  expect(typeof res).toBe('string');
});

it('converts json-ld to Turtle', async () => {
  const res = await util.convertJsonLDToTurtle(SemantifyItEventShacl);

  expect(res).toBeDefined();
  expect(typeof res).toBe('string');
});

it('converts Turtle to json-ld', async () => {
  const res = await util.convertTurtleToJsonLD(shapeTTL);

  expect(res).toBeDefined();
  expect(typeof res).toBe('object');
  expect(res['@context']).toEqual(shapeContext);
});
