import fs from 'fs';

import factory from 'rdf-ext';
import ParserN3 from '@rdfjs/parser-n3';
import SHACLValidator from 'rdf-validate-shacl';
import str from 'string-to-stream';
const getStream = require('get-stream');

const parserN3 = new ParserN3();

export class Validator {
  validator = undefined;
  shapeTTL = str(`@prefix dash: <http://datashapes.org/dash#> .
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .
@prefix schema: <http://schema.org/> .
@prefix sh: <http://www.w3.org/ns/shacl#> .
@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .
@prefix my: <http://my.example.com/> .

my:EventShape
  a sh:NodeShape ;
  sh:targetClass schema:Event ;
  sh:property my:NameShape, my:StartDateShape, my:LocationShape ;
.

my:NameShape 
  #a sh:PropertyShape ;
  sh:path schema:name ;
  sh:datatype xsd:string ;
.
my:StartDateShape
  sh:path schema:startDate ;
  sh:datatype xsd:dateTime ;
  sh:minCount 1 ;
  sh:maxCount 1 ;
.

my:LocationShape 
  sh:path schema:location ;
  sh:datatype xsd:string ;
  sh:minCount 1 ;
  sh:maxCount 1 ;
.
`);

  async getValidator() {
    if (this.validator) {
      return this.validator;
    }
    const stream = await parserN3.import(this.shapeTTL);
    const ishapes = await getStream.array(stream);

    const shapes = ishapes;
    const validator = new SHACLValidator(shapes, { factory });
    this.validator = validator;
    return validator;
  }
  async validate(formData) {
    const validator = await this.getValidator();
    const report = await validator.validate(formData);

    // Check conformance: `true` or `false`
    if (report.conforms) {
      return undefined;
    }

    // See https://www.w3.org/TR/shacl/#results-validation-result
    return report.results.map((result, err) => {
      return ['focusNode', 'message', 'path', 'severity', 'sourceConstraintComponent', 'sourceShape'].reduce((a, f) => ({ ...a, [f]: result[f] }), { result: err++ });
    });
  }
}
async function loadDatasetFromFile(filePath) {
  const stream = fs.createReadStream(filePath);
  const parser = new ParserN3({ factory });
  return factory.dataset().import(parser.import(stream));
}
