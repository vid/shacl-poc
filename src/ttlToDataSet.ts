import { getgid } from 'process';
import { loadN3FromString } from './util';

go();

async function go() {
  const dataset = await loadN3FromString(`
@prefix rdf:	http://www.w3.org/1999/02/22-rdf-syntax-ns#.
@prefix rdfs:	http://www.w3.org/2000/01/rdf-schema#.
@prefix sh:	http://www.w3.org/ns/shacl#.
@prefix xsd:	http://www.w3.org/2001/XMLSchema#.
@prefix ex:	http://example.com/ns#.

ex:PersonShape
	a sh:NodeShape ;
	sh:targetClass ex:Person ;    # Applies to all persons
	sh:property [                 # _:b1
		sh:path ex:ssn ;           # constrains the values of ex:ssn
		sh:maxCount 1 ;
		sh:datatype xsd:string ;
		sh:pattern "^\\d{3}-\\d{2}-\\d{4}$" ;
	] ;
	sh:property [                 # _:b2
		sh:path ex:worksFor ;
		sh:class ex:Company ;
		sh:nodeKind sh:IRI ;
	] ;
	sh:closed true ;
	sh:ignoredProperties ( rdf:type ) .

`);
  console.log(dataset.toString());
}
