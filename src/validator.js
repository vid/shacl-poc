"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Validator = void 0;
var rdf_validate_shacl_1 = __importDefault(require("rdf-validate-shacl"));
var rdf_ext_1 = __importDefault(require("rdf-ext"));
var util_1 = require("./util");
var Validator = /** @class */ (function () {
    function Validator() {
        this.validator = undefined;
        this.shapeTTL = "\n@prefix dash: <http://datashapes.org/dash#> .\n@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .\n@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .\n@prefix schema: <http://schema.org/> .\n@prefix sh: <http://www.w3.org/ns/shacl#> .\n@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .\n@prefix my: <http://my.example.com/> .\n\nmy:EventShape\n  a sh:NodeShape ;\n  sh:targetClass schema:Event ;\n  sh:property my:NameShape, my:StartDateShape, my:LocationShape ;\n.\n\nmy:NameShape \n  #a sh:PropertyShape ;\n  sh:path schema:name ;\n  sh:datatype xsd:string ;\n.\nmy:StartDateShape\n  sh:path schema:startDate ;\n  sh:datatype xsd:dateTime ;\n  sh:minCount 1 ;\n  sh:maxCount 1 ;\n.\n\nmy:LocationShape \n  sh:path schema:location ;\n  sh:datatype xsd:string ;\n  sh:minCount 1 ;\n  sh:maxCount 1 ;\n.\n";
    }
    Validator.prototype.getValidator = function () {
        return __awaiter(this, void 0, void 0, function () {
            var shapes, validator;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.validator) {
                            return [2 /*return*/, this.validator];
                        }
                        return [4 /*yield*/, util_1.loadN3FromString(this.shapeTTL)];
                    case 1:
                        shapes = _a.sent();
                        validator = new rdf_validate_shacl_1.default(shapes, { factory: rdf_ext_1.default });
                        this.validator = validator;
                        return [2 /*return*/, validator];
                }
            });
        });
    };
    Validator.prototype.validate = function (formData) {
        return __awaiter(this, void 0, void 0, function () {
            var validator, report;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getValidator()];
                    case 1:
                        validator = _a.sent();
                        return [4 /*yield*/, validator.validate(formData)];
                    case 2:
                        report = _a.sent();
                        // Check conformance: `true` or `false`
                        if (report.conforms) {
                            return [2 /*return*/, undefined];
                        }
                        // See https://www.w3.org/TR/shacl/#results-validation-result
                        return [2 /*return*/, report.results.map(function (result, err) {
                                return ['focusNode', 'message', 'path', 'severity', 'sourceConstraintComponent', 'sourceShape'].reduce(function (a, f) {
                                    var _a;
                                    return (__assign(__assign({}, a), (_a = {}, _a[f] = result[f], _a)));
                                }, { result: err });
                            })];
                }
            });
        });
    };
    return Validator;
}());
exports.Validator = Validator;
