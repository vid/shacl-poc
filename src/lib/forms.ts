import $rdf from 'rdf-ext';
import Dataset from 'rdf-ext/lib/Dataset';
import NamedNodeExt from 'rdf-ext/lib/NamedNode';

import { TYPE, NODE_SHAPE, PROPERTY_SHAPE, PATH_SHAPE, DATATYPE_SHAPE, EVENT, DATETIME, ORDER_SHAPE, DESCRIPTION_SHAPE } from './ns';

export type FormField = {
  key: string;
  dataType: NamedNodeExt<string>;
  path: NamedNodeExt<string>;
  order: NamedNodeExt<string>;
  description: NamedNodeExt<string>;
  property: NamedNodeExt<string>;
  properties: Dataset;
};

export async function getFields(validator): Promise<FormField[]> {
  const shapes = await validator.getShapes();
  const focusNodes = shapes.match(undefined, TYPE, NODE_SHAPE).toArray();

  const focusNodeProperties = shapes.match(focusNodes[0].subject.value, PROPERTY_SHAPE).toArray();
  const fields = focusNodeProperties.reduce((all, p, k) => {
    const property = p.object;
    const properties = shapes.match(property);

    const tryProperty = (predicate) => {
      const a = <NamedNodeExt>properties.match(undefined, predicate).toArray();
      return a[0]?.object;
    };
    const path = tryProperty(PATH_SHAPE);
    const order = tryProperty(ORDER_SHAPE);
    const description = tryProperty(DESCRIPTION_SHAPE);
    const dataType = <NamedNodeExt>properties.match(undefined, DATATYPE_SHAPE).toArray()[0].object;
    return [...all, { key: `i${k}`, dataType, path, order, description, property, properties }];
  }, []);
  return fields;
}

function formDateToIso(v) {
  try {
    return new Date(v).toISOString();
  } catch (e) {
    return v;
  }
}

export async function validateForm(validator, formData, fields: FormField[]) {
  const dataset = $rdf.dataset();
  const form = $rdf.blankNode();
  dataset.add($rdf.quad(form, TYPE, EVENT));

  Object.entries(formData).forEach(([k, v]: [k: string, v: string]) => {
    if (v.length < 1) {
      return;
    }
    const field = fields.find((f) => f.key === k);
    const { dataType, path } = field;
    // default date needs some transformation
    const pre = dataType.equals(DATETIME) ? formDateToIso(v) : v;
    const value = $rdf.literal(pre, dataType);
    dataset.add($rdf.quad(form, path, value));
  });
  const res = await validator.validate(dataset);
  return res;
}
