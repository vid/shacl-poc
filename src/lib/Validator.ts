import SHACLValidator from 'rdf-validate-shacl';
import factory from 'rdf-ext';
import Dataset from 'rdf-ext/lib/Dataset';

import { loadN3FromString } from './util';

export class Validator {
  validator = undefined;

  shapes: Dataset;

  shapeTTL: string;

  constructor(shapeTTL) {
    this.shapeTTL = shapeTTL;
  }

  private async getValidator() {
    if (this.validator) {
      return this.validator;
    }
    const shapes = await this.getShapes();
    const validator = new SHACLValidator(shapes, { factory });
    this.validator = validator;
    return validator;
  }

  async getShapes(): Promise<Dataset> {
    if (this.shapes) {
      return this.shapes;
    }
    const shapes = await loadN3FromString(this.shapeTTL);
    this.shapes = shapes;
    return shapes;
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
