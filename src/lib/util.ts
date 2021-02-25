// import fs from 'fs';
// import factory from 'rdf-ext';
import ParserN3 from '@rdfjs/parser-n3';
import str from 'string-to-stream';
import $rdf from 'rdf-ext';
import Dataset from 'rdf-ext/lib/Dataset';
import JsonLdParser from 'rdf-parser-jsonld';

// export async function loadN3FromFile(filePath) {
//   const stream = fs.createReadStream(filePath);
//   const parser = new ParserN3({ factory });
//   return factory.dataset().import(parser.import(stream));
// }

export async function loadN3FromString(ttl) {
  const parser = new ParserN3({ $rdf });
  return $rdf.dataset().import(parser.import(str(ttl)));
}

export async function convertQuadsToDataset(quadsText): Promise<Dataset> {
  const quads = await loadN3FromString(quadsText);
  return quads;
}

export async function convertJsonLDtoDataset(jsonld): Promise<Dataset> {
  let parser = new JsonLdParser({ factory: $rdf });
  const quadStream = parser.import(str(JSON.stringify(jsonld)));
  return await $rdf.dataset().import(quadStream);
}

export function formDateToIso(v) {
  try {
    return new Date(v).toISOString();
  } catch (e) {
    return v;
  }
}
