export function stringToHexColor(str: string) {
    if (str === '@You') {
        return '#0f0'
    }
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
        hash = hash & hash;
    }

    const h = Math.abs(hash) % 360;
    const s = 70 + (Math.abs(hash) % 30);
    const l = 45 + (Math.abs(hash) % 20);

    return hslToHex(h, s, l);
}

function hslToHex(h: number, s: number, l: number) {
    s /= 100;
    l /= 100;
    const k = (n: number) => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = (n: number) =>
        Math.round(255 * (l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))));
    return "#" + [f(0), f(8), f(4)].map(x => x.toString(16).padStart(2, "0")).join("");
}