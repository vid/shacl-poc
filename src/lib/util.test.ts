import * as util from './util';
import SemantifyItEventShacl from './shacl/semantify-it-event-shacl.json';

it('loads from string', async () => {
  const shapeTTL = `
@prefix ex: <http://example.com>.
@prefix sh:	<http://www.w3.org/ns/shacl#>.

ex:PersonShape
	a sh:NodeShape .

`;
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
