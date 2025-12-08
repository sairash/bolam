export async function deterministicRandomString(input: string, length: number = 4): Promise<string> {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  // Encode input as bytes
  const encoder = new TextEncoder();
  const data = encoder.encode(input);

  // Create SHA-256 hash
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));

  // Convert to deterministic string
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars[hashArray[i] % chars.length];
  }

  return result;
}

export function generateRandomString(length: number):string {
  return Math.random().toString(36).substring(2, 2 + length);
}
