import $rdf from 'rdf-ext';
import Dataset from 'rdf-ext/lib/Dataset';
import NamedNodeExt from 'rdf-ext/lib/NamedNode';
import Quad from 'rdf-ext/lib/Quad';

import { TYPE, NODE_SHAPE, PROPERTY_SHAPE, PATH_SHAPE, DATATYPE_SHAPE, EVENT, DATETIME, ORDER_SHAPE, DESCRIPTION_SHAPE } from './ns';
import { formDateToIso } from './util';
import { TSHACL, Validator } from './Validator';

export type FormField = {
  key: string;
  dataType: NamedNodeExt<string>;
  path: NamedNodeExt<string>;
  order: NamedNodeExt<string>;
  description: NamedNodeExt<string>;
  property: NamedNodeExt<string>;
  properties: Dataset;
};

export class Form {
  validator: Validator;

  constructor(shacl: TSHACL) {
    this.validator = new Validator(shacl);
  }

  async getFields(): Promise<FormField[]> {
    const shapes = await this.validator.getNodeShapes();
    const focusNodes: Quad[] = shapes.match(undefined, TYPE, NODE_SHAPE).toArray();

    const focusNode = focusNodes[0];

    const focusNodeProperties = shapes.match(focusNode.subject, PROPERTY_SHAPE).toArray();
    const fields = focusNodeProperties.reduce((all, p, k) => {
      const { object: property } = p;

      const properties = shapes.match(property);

      const tryProperty = (predicate) => {
        const a = properties.match(undefined, predicate).toArray();
        return a[0]?.object;
      };
      const path = tryProperty(PATH_SHAPE);
      const order = tryProperty(ORDER_SHAPE);
      const description = tryProperty(DESCRIPTION_SHAPE);
      const dt = properties.match(undefined, DATATYPE_SHAPE).toArray();
      let dataType;
      if (dt.length) {
        dataType = dt[0].object;
      } else {
        console.log('no dt', properties);
      }
      return [...all, { key: `i${k}`, dataType, path, order, description, property, properties }];
    }, []);
    return fields;
  }

  async validate(formData, fields: FormField[]) {
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
      const pre = dataType?.equals(DATETIME) ? formDateToIso(v) : v;
      const value = $rdf.literal(pre, dataType);
      dataset.add($rdf.quad(form, path, value));
    });
    const res = await this.validator.validate(dataset);
    return res;
  }
}
