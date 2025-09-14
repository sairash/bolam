export async function generateInfoHash(roomName: string) {
    const encoder = new TextEncoder();
    const data = encoder.encode(roomName);
    const hashBuffer = await crypto.subtle.digest('SHA-1', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}