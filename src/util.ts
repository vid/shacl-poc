// import fs from 'fs';
// import factory from 'rdf-ext';
import ParserN3 from '@rdfjs/parser-n3';
import getStream from 'get-stream';
import str from 'string-to-stream';

// export async function loadN3FromFile(filePath) {
//   const stream = fs.createReadStream(filePath);
//   const parser = new ParserN3({ factory });
//   return factory.dataset().import(parser.import(stream));
// }

export async function loadN3FromString(ttl) {
  const parserN3 = new ParserN3();

  const stream = parserN3.import(str(ttl));
  return getStream.array(stream);
}
