import $rdf from 'rdf-ext';
import SHACLValidator from 'rdf-validate-shacl';
import Dataset from 'rdf-ext/lib/Dataset';

import { convertFrom } from './util';
import { TSHACL } from './defs';

export class Validator {
  validator = undefined;

  nodeShapes: Dataset;

  shaclInput: TSHACL;

  constructor(shaclInput: TSHACL) {
    this.shaclInput = shaclInput;
  }

  private async getValidator() {
    if (this.validator) {
      return this.validator;
    }
    const shapes = await this.getNodeShapes();
    const validator = new SHACLValidator(shapes, { $rdf });
    this.validator = validator;
    return validator;
  }

  async getNodeShapes(): Promise<Dataset> {
    if (this.nodeShapes) {
      return this.nodeShapes;
    }
    const { type, text } = this.shaclInput;

    const { dataset } = await convertFrom(type, text);
    return dataset;
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
