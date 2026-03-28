/* tslint:disable */
/* eslint-disable */
export const memory: WebAssembly.Memory;
export const bytes_to_hex: (a: number, b: number) => [number, number];
export const decrypt: (a: number, b: number, c: number, d: number) => [number, number, number, number];
export const decrypt_string: (a: number, b: number, c: number, d: number) => [number, number, number, number];
export const encrypt: (a: number, b: number, c: number, d: number) => [number, number, number, number];
export const encrypt_string: (a: number, b: number, c: number, d: number) => [number, number, number, number];
export const generate_key: () => [number, number];
export const hex_to_bytes: (a: number, b: number) => [number, number, number, number];
export const key_from_base64: (a: number, b: number) => [number, number, number, number];
export const key_from_hex: (a: number, b: number) => [number, number, number, number];
export const key_to_base64: (a: number, b: number) => [number, number];
export const key_to_hex: (a: number, b: number) => [number, number];
export const sha256: (a: number, b: number) => [number, number];
export const __wbindgen_exn_store: (a: number) => void;
export const __externref_table_alloc: () => number;
export const __wbindgen_externrefs: WebAssembly.Table;
export const __wbindgen_malloc: (a: number, b: number) => number;
export const __wbindgen_free: (a: number, b: number, c: number) => void;
export const __externref_table_dealloc: (a: number) => void;
export const __wbindgen_realloc: (a: number, b: number, c: number, d: number) => number;
export const __wbindgen_start: () => void;
