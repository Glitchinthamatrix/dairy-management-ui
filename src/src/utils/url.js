export function getMimeTypeFromUrl(URL) {
  if (URL && /\.(mp3|wav)$/.test(URL)) {
    const arr = URL.split(".");
    return `audio/${arr[arr.length - 1].toLowerCase()}`;
  } else {
    return "audio/mp3";
  }
}
