
export enum TYPES {
  TTL = 'ttl',
  JSONLD = 'jsonld',
  QUADS = 'quads',
  DS_ARRAY = 'ds_array',
}

export type TSHACL = {
  type: TYPES;
  text: string;
}