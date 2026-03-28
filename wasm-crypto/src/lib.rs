use aes_gcm::{
    aead::{Aead, KeyInit},
    Aes256Gcm, Nonce,
};
use rand::RngCore;
use wasm_bindgen::prelude::*;

/// 生成随机密钥（32 字节 = 256 位）
#[wasm_bindgen]
pub fn generate_key() -> Vec<u8> {
    let mut key = [0u8; 32];
    rand::thread_rng().fill_bytes(&mut key);
    key.to_vec()
}

/// 生成随机 nonce（12 字节 = 96 位，AES-GCM 推荐）
fn generate_nonce() -> [u8; 12] {
    let mut nonce = [0u8; 12];
    rand::thread_rng().fill_bytes(&mut nonce);
    nonce
}

/// 加密数据
/// 返回格式: nonce(12字节) + ciphertext
#[wasm_bindgen]
pub fn encrypt(data: &[u8], key: &[u8]) -> Result<Vec<u8>, JsValue> {
    if key.len() != 32 {
        return Err(JsValue::from_str("Key must be 32 bytes (256 bits)"));
    }

    let cipher = Aes256Gcm::new_from_slice(key).map_err(|e| JsValue::from_str(&e.to_string()))?;

    let nonce_bytes = generate_nonce();
    let nonce = Nonce::from_slice(&nonce_bytes);

    let ciphertext = cipher
        .encrypt(nonce, data)
        .map_err(|e| JsValue::from_str(&e.to_string()))?;

    // 组合: nonce + ciphertext
    let mut result = nonce_bytes.to_vec();
    result.extend(ciphertext);
    Ok(result)
}

/// 解密数据
/// 输入格式: nonce(12字节) + ciphertext
#[wasm_bindgen]
pub fn decrypt(encrypted: &[u8], key: &[u8]) -> Result<Vec<u8>, JsValue> {
    if key.len() != 32 {
        return Err(JsValue::from_str("Key must be 32 bytes (256 bits)"));
    }

    if encrypted.len() < 12 {
        return Err(JsValue::from_str("Invalid encrypted data: too short"));
    }

    // 分离 nonce 和 ciphertext
    let (nonce_bytes, ciphertext) = encrypted.split_at(12);
    let nonce = Nonce::from_slice(nonce_bytes);

    let cipher = Aes256Gcm::new_from_slice(key).map_err(|e| JsValue::from_str(&e.to_string()))?;

    cipher
        .decrypt(nonce, ciphertext)
        .map_err(|e| JsValue::from_str(&e.to_string()))
}

/// 加密字符串（返回 Base64 编码）
#[wasm_bindgen]
pub fn encrypt_string(plaintext: &str, key: &[u8]) -> Result<String, JsValue> {
    let encrypted = encrypt(plaintext.as_bytes(), key)?;
    Ok(base64::Engine::encode(
        &base64::engine::general_purpose::STANDARD,
        &encrypted,
    ))
}

/// 解密字符串（输入 Base64 编码）
#[wasm_bindgen]
pub fn decrypt_string(ciphertext: &str, key: &[u8]) -> Result<String, JsValue> {
    let encrypted = base64::Engine::decode(
        &base64::engine::general_purpose::STANDARD,
        ciphertext,
    )
    .map_err(|e| JsValue::from_str(&format!("Base64 decode error: {}", e)))?;

    let decrypted = decrypt(&encrypted, key)?;
    String::from_utf8(decrypted).map_err(|e| JsValue::from_str(&format!("UTF-8 decode error: {}", e)))
}

/// 将密钥转换为十六进制字符串（用于显示/存储）
#[wasm_bindgen]
pub fn key_to_hex(key: &[u8]) -> String {
    hex::encode(key)
}

/// 从十六进制字符串解析密钥
#[wasm_bindgen]
pub fn key_from_hex(hex_str: &str) -> Result<Vec<u8>, JsValue> {
    hex::decode(hex_str).map_err(|e| JsValue::from_str(&e.to_string()))
}

/// 将密钥转换为 Base64 字符串
#[wasm_bindgen]
pub fn key_to_base64(key: &[u8]) -> String {
    base64::Engine::encode(&base64::engine::general_purpose::STANDARD, key)
}

/// 从 Base64 字符串解析密钥
#[wasm_bindgen]
pub fn key_from_base64(b64_str: &str) -> Result<Vec<u8>, JsValue> {
    base64::Engine::decode(&base64::engine::general_purpose::STANDARD, b64_str)
        .map_err(|e| JsValue::from_str(&e.to_string()))
}

/// 计算 SHA-256 哈希
#[wasm_bindgen]
pub fn sha256(data: &[u8]) -> Vec<u8> {
    use sha2::{Digest, Sha256};
    let mut hasher = Sha256::new();
    hasher.update(data);
    hasher.finalize().to_vec()
}

/// 将字节数组转换为十六进制字符串
#[wasm_bindgen]
pub fn bytes_to_hex(bytes: &[u8]) -> String {
    hex::encode(bytes)
}

/// 将十六进制字符串转换为字节数组
#[wasm_bindgen]
pub fn hex_to_bytes(hex_str: &str) -> Result<Vec<u8>, JsValue> {
    hex::decode(hex_str).map_err(|e| JsValue::from_str(&e.to_string()))
}

// ===== 单元测试 =====

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_encrypt_decrypt() {
        let key = generate_key();
        let data = b"Hello, WebAssembly!";

        let encrypted = encrypt(data, &key).expect("Encryption failed");
        let decrypted = decrypt(&encrypted, &key).expect("Decryption failed");

        assert_eq!(data.to_vec(), decrypted);
    }

    #[test]
    fn test_encrypt_decrypt_string() {
        let key = generate_key();
        let plaintext = "你好，世界！Hello World! 🎉";

        let encrypted = encrypt_string(plaintext, &key).expect("Encryption failed");
        let decrypted = decrypt_string(&encrypted, &key).expect("Decryption failed");

        assert_eq!(plaintext, decrypted);
    }

    #[test]
    fn test_key_conversion() {
        let key = generate_key();

        // Hex 测试
        let hex = key_to_hex(&key);
        let parsed = key_from_hex(&hex).expect("Hex parse failed");
        assert_eq!(key, parsed);

        // Base64 测试
        let b64 = key_to_base64(&key);
        let parsed = key_from_base64(&b64).expect("Base64 parse failed");
        assert_eq!(key, parsed);
    }
}
