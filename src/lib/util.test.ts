import * as util from './util';

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
