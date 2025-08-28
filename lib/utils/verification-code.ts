import { createHash } from "crypto";

export function generateVerificationCode(
  storeName: string,
  redemptionId: string
): string {
  // Criar um hash único baseado no nome da loja e ID do resgate
  const hash = createHash("sha256")
    .update(`${storeName}-${redemptionId}-${Date.now()}`)
    .digest("hex");

  // Pegar os primeiros 8 caracteres do hash
  const hashPart = hash.substring(0, 8).toUpperCase();

  // Criar um código alfanumérico de 12 caracteres
  // Formato: LOJAHASH (ex: LOJAA1B2C3D4)
  const storePrefix = storeName
    .substring(0, 4)
    .toUpperCase()
    .replace(/[^A-Z]/g, "A"); // Substituir caracteres especiais por A

  // Garantir que o prefixo tenha exatamente 4 caracteres
  const paddedPrefix = storePrefix.padEnd(4, "A");

  return `${paddedPrefix}${hashPart}`;
}

export function validateVerificationCode(code: string): boolean {
  // Validar formato: XXXXXXXXXXXX (12 caracteres alfanuméricos)
  const codeRegex = /^[A-Z0-9]{12}$/;
  return codeRegex.test(code);
}

export function extractStorePrefix(code: string): string {
  // Extrair o prefixo da loja do código (primeiros 4 caracteres)
  return code.substring(0, 4);
}
