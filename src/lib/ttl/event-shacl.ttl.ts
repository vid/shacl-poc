export const EventShacl = `@prefix dash: <http://datashapes.org/dash#> .
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
  sh:minCount 1 ;
  sh:maxCount 1 ;
  sh:minLength 1;
  sh:maxLength 72;
  sh:description "Event name";
  sh:order 1;
.

my:StartDateShape
  sh:path schema:startDate ;
  sh:datatype xsd:dateTime ;
  sh:minCount 1 ;
  sh:maxCount 1 ;
  sh:description "Start date";
  sh:order 2;
.

my:LocationShape 
  sh:path schema:location ;
  sh:datatype xsd:string ;
  sh:minCount 1 ;
  sh:maxCount 1 ;
  sh:minLength 4;
  sh:maxLength 72;
  sh:description "Location";
  sh:order 3;
. 
`;
