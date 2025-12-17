export async function importGeneric(file) {
  // store file metadata for generic files
  return {
    name: file.name,
    size: file.size,
    raw: file
  };
}
