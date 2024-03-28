export const getTitleFromUrl = async (url: string): Promise<string> => {
  const res = await fetch(url);
  const text = await res.text();
  const title = text.match(/<title>(.*?)<\/title>/);

  return title?.[1] || "";
};
