const API_BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;

export async function getRun(id: string) {
  if (!API_BASE_URL) {
    throw new Error('Backend URL is not defined');
  }

  const response = await fetch(`${API_BASE_URL}/runs/${id}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch run: ${response.statusText}`);
  }

  return response.json();
}
