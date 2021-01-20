"use strict";
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
var rdf_ext_1 = __importDefault(require("rdf-ext"));
var namespace_1 = __importDefault(require("@rdfjs/namespace"));
var validator_1 = require("./validator");
var schema = namespace_1.default('http://schema.org/');
// const ex = namespace('http://example.com/');
// const xsd = namespace('http://www.w3.org/2001/XMLSchema#>');
var rdf = namespace_1.default('http://www.w3.org/1999/02/22-rdf-syntax-ns#');
var EVENT = schema('Event');
var START_DATE = schema('startDate');
var TYPE = rdf('type');
var LOCATION = schema('location');
var validator = new validator_1.Validator();
it('validates', function () { return __awaiter(void 0, void 0, void 0, function () {
    var dataset, bnode, form, res;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                dataset = rdf_ext_1.default.dataset();
                bnode = rdf_ext_1.default.blankNode();
                form = bnode;
                dataset.add(rdf_ext_1.default.quad(form, TYPE, EVENT));
                dataset.add(rdf_ext_1.default.quad(form, START_DATE, rdf_ext_1.default.literal(new Date().toISOString(), rdf_ext_1.default.namedNode('http://www.w3.org/2001/XMLSchema#dateTime'))));
                dataset.add(rdf_ext_1.default.quad(form, LOCATION, rdf_ext_1.default.literal('somewhere')));
                return [4 /*yield*/, validator.validate(dataset)];
            case 1:
                res = _a.sent();
                expect(res).toBeUndefined();
                return [2 /*return*/];
        }
    });
}); });
it('fails validation for missing startDate', function () { return __awaiter(void 0, void 0, void 0, function () {
    var dataset, bnode, form, res;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                dataset = rdf_ext_1.default.dataset();
                bnode = rdf_ext_1.default.blankNode();
                form = bnode;
                dataset.add(rdf_ext_1.default.quad(form, TYPE, EVENT));
                dataset.add(rdf_ext_1.default.quad(form, LOCATION, rdf_ext_1.default.literal('somewhere')));
                return [4 /*yield*/, validator.validate(dataset)];
            case 1:
                res = _a.sent();
                expect(res).toBeDefined();
                expect(res.length).toBe(1);
                expect(res[0].path).toEqual(START_DATE);
                return [2 /*return*/];
        }
    });
}); });
