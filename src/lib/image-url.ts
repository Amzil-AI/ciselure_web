export function getImageUrl(filename: string) {
  if (filename.startsWith("http://") || filename.startsWith("https://")) {
    return filename;
  }
  return `/api/uploads/${filename}`;
}
