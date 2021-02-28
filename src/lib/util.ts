import ParserN3 from '@rdfjs/parser-n3';
import str from 'string-to-stream';
import $rdf from 'rdf-ext';
import Dataset from 'rdf-ext/lib/Dataset';
import JsonLdParser from 'rdf-parser-jsonld';
import { Writer } from 'n3';
import { ContextParser } from 'jsonld-context-parser';
import stringifyStream from 'stream-to-string';
import streamifyArray from 'streamify-array';
import { JsonLdSerializer } from 'jsonld-streaming-serializer';

// FIXME a lot of this is cobbled together from the rdfjs multiverse

export async function loadN3FromString(ttl) {
  const parser = new ParserN3({ $rdf });
  return $rdf.dataset().import(parser.import(str(ttl)));
}

export async function convertN3ToDataset(quadsText): Promise<Dataset> {
  const quads = await loadN3FromString(quadsText);
  return quads;
}

export async function convertJsonLDtoDataset(jsonld): Promise<Dataset> {
  let parser = new JsonLdParser({ factory: $rdf });
  const quadStream = parser.import(str(JSON.stringify(jsonld)));
  return await $rdf.dataset().import(quadStream);
}

export async function convertJsonLDToTurtle(jsonld): Promise<string> {
  const myParser = new ContextParser({
    skipValidation: true,
    expandContentTypeToBase: true,
  });
  const ctx = (await myParser.parse(jsonld)).getContextRaw();

  const ds = await convertJsonLDtoDataset(jsonld);
  return convertDatasetToTurtle(ds, ctx);
}

export function convertDatasetToTurtle(ds: Dataset, prefixes?): string {
  const writer = new Writer({ prefixes, format: 'Turtle' });

  const decl = Object.entries(prefixes)
    .filter(([k, v]) => !k.includes(':'))
    .map(([key, value]) => `@prefix ${key}: <${value['@id'] || value}>`)
    .join('.\n');
  return decl + '.\n\n' + writer.quadsToString(ds.toArray());
}

export function getContextFromTurtle(ttl) {
  const re = RegExp(/@prefix .*?>/, 'img');
  const matches = ttl.match(re);
  const context = matches.reduce((a, m) => {
    const [, prefix, uri] = m.split(/\s+/);

    return { ...a, [prefix.replace(/:/, '')]: uri.replace(/[<\|>]/g, '') };
  }, {});
  return context;
}

export async function convertTurtleToJsonLD(ttl) {
  const context = getContextFromTurtle(ttl);
  const dataset = await convertN3ToDataset(ttl);
  return await serialize(dataset.toArray(), context);
}

// from https://github.com/rubensworks/jsonld-streaming-serializer.js/blob/master/test/lib/JsonLdSerializer-test.ts
async function serialize(quadsArray, context?) {
  const serializer = new JsonLdSerializer({ context });
  return JSON.parse(await stringifyStream(streamifyArray(quadsArray).pipe(serializer)));
}

export function formDateToIso(v) {
  try {
    return new Date(v).toISOString();
  } catch (e) {
    return v;
  }
}
