const apiUrl = process.env.NEXT_PUBLIC_API_URL

export async function getBlogByPath(blogpath: string) {
  const res = await fetch(`${apiUrl}/api/blog/${blogpath}`, {
    cache: 'no-store',
  });

  if (!res.ok) return null;
  return await res.json();
}

export async function getProductByPath(productPath: string) {
  const res = await fetch(`${apiUrl}/api/product/v1/${productPath}`, {
    cache: 'no-store',
  });

  if (!res.ok) return null;
  return await res.json();
}