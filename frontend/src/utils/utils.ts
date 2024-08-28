import CryptoJS from "crypto-js";
import JSEncrypt from "jsencrypt";

export const encryptTextMessage = (
  sharedKey: string,
  message: string
): string => {
  const key = CryptoJS.enc.Base64.parse(sharedKey);
  const iv = CryptoJS.lib.WordArray.random(16);
  const encrypted = CryptoJS.AES.encrypt(message, key, { iv: iv });
  const ivBase64 = iv.toString(CryptoJS.enc.Base64);
  const encryptedMessageBase64 = encrypted.toString();
  return ivBase64 + encryptedMessageBase64;
};

export const decryptTextMessage = (
  sharedKey: string,
  encryptedMessage: string
): string => {
  const key = CryptoJS.enc.Base64.parse(sharedKey);
  const ivBase64 = encryptedMessage.slice(0, 24);
  const encryptedMessageBase64 = encryptedMessage.slice(24);
  const iv = CryptoJS.enc.Base64.parse(ivBase64);
  const decrypted = CryptoJS.AES.decrypt(encryptedMessageBase64, key, {
    iv: iv,
  });
  return decrypted.toString(CryptoJS.enc.Utf8);
};

export function parseJwt(token: string) {
  if (token) {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );
    return JSON.parse(jsonPayload);
  }
  return;
}
