// FIXME a lot of this is cobbled together from the rdfjs multiverse

import $rdf from 'rdf-ext';
import ParserN3 from '@rdfjs/parser-n3';
import str from 'string-to-stream';
import Dataset from 'rdf-ext/lib/Dataset';
import JsonLdParser from 'rdf-parser-jsonld';
import { Writer as N3Writer } from 'n3';
import { ContextParser } from 'jsonld-context-parser';
import stringifyStream from 'stream-to-string';
import streamifyArray from 'streamify-array';
import { JsonLdSerializer } from 'jsonld-streaming-serializer';
import { TYPES } from './defs';

// from https://github.com/rubensworks/jsonld-streaming-serializer.js/blob/master/test/lib/JsonLdSerializer-test.ts
async function convertDatasetToJsonLD(dataset, context?) {
  const serializer = new JsonLdSerializer({ context });
  return JSON.parse(await stringifyStream(streamifyArray(dataset.toArray()).pipe(serializer)));
}

export async function parseTurtleToDataset(ttl) {
  const parser = new ParserN3({ $rdf });
  return $rdf.dataset().import(parser.import(str(ttl)));
}

export async function convertJsonLDtoDataset(jsonld): Promise<Dataset> {
  const parser = new JsonLdParser({ factory: $rdf });
  const quadStream = parser.import(str(JSON.stringify(jsonld)));
  return $rdf.dataset().import(quadStream);
}

export function convertDatasetToTurtle(ds: Dataset, prefixes = {}): string {
  const writer = new N3Writer({ prefixes, format: 'Turtle' });

  const decl = Object.entries(prefixes)
    .filter(([k, v]) => !k.includes(':'))
    .map(([key, value]) => `@prefix ${key}: <${value['@id'] || value}>`)
    .join('.\n');
  return `${decl}.\n\n${writer.quadsToString(ds.toArray())}`;
}

export function getContextFromTurtle(ttl): { [prefix: string]: string } {
  const re = RegExp(/@prefix .*?>/, 'img');
  const matches = ttl.match(re);
  if (!matches) {
    return {};
  }
  const context = matches.reduce((a, m) => {
    const [, prefix, uri] = m.split(/\s+/);

    return { ...a, [prefix.replace(/:/, '')]: uri.replace(/[<\|>]/g, '') };
  }, {});
  return context;
}

export async function parseQuadsToDataset(input): Promise<Dataset> {
  const parser = new ParserN3({ $rdf });
  return $rdf.dataset().import(parser.import(str(input)));
}

export async function convertFrom(from: string, input: string): Promise<{ dataset: Dataset; context?: object }> {
  if (from === TYPES.TTL) {
    const context = getContextFromTurtle(input);
    return { dataset: await parseTurtleToDataset(input), context };
  }
  if (from === TYPES.JSONLD) {
    const jsonld = typeof input === 'string' ? JSON.parse(input) : input;
    let context;
    if (jsonld['@context']) {
      const myParser = new ContextParser({
        skipValidation: true,
        expandContentTypeToBase: true,
      });
      context = (await myParser.parse(jsonld)).getContextRaw();
    }
    return { dataset: await convertJsonLDtoDataset(jsonld), context };
  }
  if (from === TYPES.DS_ARRAY) {
    return { dataset: $rdf.dataset(JSON.parse(input)) };
  }
  if (from === TYPES.QUADS) {
    return { dataset: await parseQuadsToDataset(input) };
  }
  throw Error(`unknown type ${from}`);
}

export async function convertTo(to, dataset, context?) {
  if (to === TYPES.JSONLD) {
    return convertDatasetToJsonLD(dataset, context);
  }
  if (to === TYPES.TTL) {
    return convertDatasetToTurtle(dataset, context);
  }
  if (to === TYPES.DS_ARRAY) {
    return dataset.toArray();
  }
  if (to === TYPES.QUADS) {
    return convertDatasetToTurtle(dataset);
  }
  throw Error(`unknown to ${to}`);
}

export async function convertBetween(from: string, to: string, input: string): Promise<any> {
  const { dataset, context } = await convertFrom(from, input);
  return convertTo(to, dataset, context);
}

export function formDateToIso(v) {
  try {
    return new Date(v).toISOString();
  } catch (e) {
    return v;
  }
}
