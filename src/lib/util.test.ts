import * as util from './util';
import { TYPES } from './defs';

const shapeTTL = `@prefix ex: <http://example.com/>.
@prefix sh:	<http://www.w3.org/ns/shacl#>.

ex:PersonShape
	a sh:NodeShape .
`;

const shapeContext = {
  ex: 'http://example.com/',
  sh: 'http://www.w3.org/ns/shacl#',
};

const shapeJsonld = { '@context': shapeContext, '@graph': [{ '@id': 'ex:PersonShape', '@type': ['sh:NodeShape'] }] };
const quadsText = '<http://example.org/subject> <http://example.org/predicate> "object" <http://example.org/graph> .';
const dsArray = [
  {
    subject: {
      value: 'http://example.com/PersonShape',
    },
    predicate: {
      value: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type',
    },
    object: {
      value: 'http://www.w3.org/ns/shacl#NodeShape',
    },
    graph: {
      value: '',
    },
  },
];

it('gets context from Turtle', () => {
  const context = util.getContextFromTurtle(shapeTTL);
  expect(context).toEqual(shapeContext);
});

describe('Convert to dataset', () => {
  it('converts jsonld to dataset', async () => {
    const { context, dataset } = await util.convertFrom(TYPES.JSONLD, JSON.stringify(shapeJsonld));
    expect(context).toBeDefined();
    expect(dataset.toArray().length).toEqual(1);
  });

  it('converts Quads to dataset', async () => {
    const dataset = await util.parseQuadsToDataset(quadsText);
    expect(dataset.toArray().length).toEqual(1);
  });

  it('converts Turtle to dataset', async () => {
    const { context, dataset } = await util.convertFrom(TYPES.TTL, shapeTTL);

    expect(context).toEqual(shapeContext);
    expect(dataset.toArray().length).toEqual(1);
  });
  xit('converts Dataset array to dataset', async () => {
    const { dataset } = await util.convertFrom(TYPES.DS_ARRAY, JSON.stringify(dsArray));
    expect(dataset.toArray().length).toEqual(1);
  });
});

describe('From-to conversions', () => {
  it('converts json-ld to Turtle', async () => {
    const res = await util.convertBetween(TYPES.JSONLD, TYPES.TTL, JSON.stringify(shapeJsonld));

    expect(res).toBeDefined();
    expect(typeof res).toBe('string');
  });

  it('converts Turtle to jsonld', async () => {
    const res = await util.convertBetween(TYPES.TTL, TYPES.JSONLD, shapeTTL);
    expect(res).toStrictEqual(shapeJsonld);
  });

  it('converts Quads to Turtle', async () => {
    const res = await util.convertBetween(TYPES.QUADS, TYPES.TTL, quadsText);
    expect(res.includes(quadsText)).toBeTruthy();
  });
  xit('converts Dataset array to jsonld', async () => {
    const res = await util.convertBetween(TYPES.DS_ARRAY, TYPES.JSONLD, JSON.stringify(dsArray));
    expect(res).toStrictEqual(shapeJsonld);
  });
});
