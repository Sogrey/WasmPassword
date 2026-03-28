/* tslint:disable */
/* eslint-disable */

/**
 * 将字节数组转换为十六进制字符串
 */
export function bytes_to_hex(bytes: Uint8Array): string;

/**
 * 解密数据
 * 输入格式: nonce(12字节) + ciphertext
 */
export function decrypt(encrypted: Uint8Array, key: Uint8Array): Uint8Array;

/**
 * 解密字符串（输入 Base64 编码）
 */
export function decrypt_string(ciphertext: string, key: Uint8Array): string;

/**
 * 加密数据
 * 返回格式: nonce(12字节) + ciphertext
 */
export function encrypt(data: Uint8Array, key: Uint8Array): Uint8Array;

/**
 * 加密字符串（返回 Base64 编码）
 */
export function encrypt_string(plaintext: string, key: Uint8Array): string;

/**
 * 生成随机密钥（32 字节 = 256 位）
 */
export function generate_key(): Uint8Array;

/**
 * 将十六进制字符串转换为字节数组
 */
export function hex_to_bytes(hex_str: string): Uint8Array;

/**
 * 从 Base64 字符串解析密钥
 */
export function key_from_base64(b64_str: string): Uint8Array;

/**
 * 从十六进制字符串解析密钥
 */
export function key_from_hex(hex_str: string): Uint8Array;

/**
 * 将密钥转换为 Base64 字符串
 */
export function key_to_base64(key: Uint8Array): string;

/**
 * 将密钥转换为十六进制字符串（用于显示/存储）
 */
export function key_to_hex(key: Uint8Array): string;

/**
 * 计算 SHA-256 哈希
 */
export function sha256(data: Uint8Array): Uint8Array;

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
    readonly memory: WebAssembly.Memory;
    readonly bytes_to_hex: (a: number, b: number) => [number, number];
    readonly decrypt: (a: number, b: number, c: number, d: number) => [number, number, number, number];
    readonly decrypt_string: (a: number, b: number, c: number, d: number) => [number, number, number, number];
    readonly encrypt: (a: number, b: number, c: number, d: number) => [number, number, number, number];
    readonly encrypt_string: (a: number, b: number, c: number, d: number) => [number, number, number, number];
    readonly generate_key: () => [number, number];
    readonly hex_to_bytes: (a: number, b: number) => [number, number, number, number];
    readonly key_from_base64: (a: number, b: number) => [number, number, number, number];
    readonly key_from_hex: (a: number, b: number) => [number, number, number, number];
    readonly key_to_base64: (a: number, b: number) => [number, number];
    readonly key_to_hex: (a: number, b: number) => [number, number];
    readonly sha256: (a: number, b: number) => [number, number];
    readonly __wbindgen_exn_store: (a: number) => void;
    readonly __externref_table_alloc: () => number;
    readonly __wbindgen_externrefs: WebAssembly.Table;
    readonly __wbindgen_malloc: (a: number, b: number) => number;
    readonly __wbindgen_free: (a: number, b: number, c: number) => void;
    readonly __externref_table_dealloc: (a: number) => void;
    readonly __wbindgen_realloc: (a: number, b: number, c: number, d: number) => number;
    readonly __wbindgen_start: () => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;

/**
 * Instantiates the given `module`, which can either be bytes or
 * a precompiled `WebAssembly.Module`.
 *
 * @param {{ module: SyncInitInput }} module - Passing `SyncInitInput` directly is deprecated.
 *
 * @returns {InitOutput}
 */
export function initSync(module: { module: SyncInitInput } | SyncInitInput): InitOutput;

/**
 * If `module_or_path` is {RequestInfo} or {URL}, makes a request and
 * for everything else, calls `WebAssembly.instantiate` directly.
 *
 * @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
 *
 * @returns {Promise<InitOutput>}
 */
export default function __wbg_init (module_or_path?: { module_or_path: InitInput | Promise<InitInput> } | InitInput | Promise<InitInput>): Promise<InitOutput>;
