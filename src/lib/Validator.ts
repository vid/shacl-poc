import SHACLValidator from 'rdf-validate-shacl';
import factory from 'rdf-ext';
import Dataset from 'rdf-ext/lib/Dataset';

import { convertJsonLDtoDataset, convertQuadsToDataset } from './util';

type ttl = Text;
type jsonld = object;

export type TSHACL = { ttl?: string; jsonld?: object };

export class Validator {
  validator = undefined;

  nodeShapes: Dataset;

  shacl: TSHACL;

  constructor(shacl: TSHACL) {
    this.shacl = shacl;
  }

  private async getValidator() {
    if (this.validator) {
      return this.validator;
    }
    const shapes = await this.getNodeShapes();
    const validator = new SHACLValidator(shapes, { factory });
    this.validator = validator;
    return validator;
  }

  async getNodeShapes(): Promise<Dataset> {
    if (this.nodeShapes) {
      return this.nodeShapes;
    }
    const inp = this.shacl.ttl ? convertQuadsToDataset : convertJsonLDtoDataset;
    try {
      const shapes = await inp(this.shacl[Object.keys(this.shacl)[0]]);
      this.nodeShapes = shapes;
      return shapes;
    } catch (e) {
      throw e;
    }
  }

  async validate(formData: Dataset) {
    const validator = await this.getValidator();
    const report = await validator.validate(formData);

    // Check conformance: `true` or `false`
    if (report.conforms) {
      return undefined;
    }

    // See https://www.w3.org/TR/shacl/#results-validation-result
    return report.results.map((result, err) =>
      ['focusNode', 'message', 'path', 'severity', 'sourceConstraintComponent', 'sourceShape'].reduce((a, f) => ({ ...a, [f]: result[f] }), { result: err })
    );
  }
}
