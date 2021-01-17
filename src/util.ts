// NB. implementing here to avoid depending on bluebird
export async function delay(millis: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, millis);
  });
}

export function toHexColor(c: number): string {
  let hex = c.toString(16);
  while (hex.length < 6) {
    hex = '0' + hex;
  }
  return `#${hex}`;
}
export function getRandomColor(): number {
  return Math.random() * 0xffffff;
}
