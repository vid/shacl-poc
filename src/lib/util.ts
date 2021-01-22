// import fs from 'fs';
// import factory from 'rdf-ext';
import ParserN3 from '@rdfjs/parser-n3';
import str from 'string-to-stream';
import $rdf from 'rdf-ext';

// export async function loadN3FromFile(filePath) {
//   const stream = fs.createReadStream(filePath);
//   const parser = new ParserN3({ factory });
//   return factory.dataset().import(parser.import(stream));
// }

export async function loadN3FromString(ttl) {
  const parser = new ParserN3({ $rdf });
  return $rdf.dataset().import(parser.import(str(ttl)));
}
