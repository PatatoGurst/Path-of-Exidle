import type { TreeData, ThemeCatalog } from '../types/skilltree'

const API_BASE = '/__tree-editor-api'
const THEMES_FILE = 'themes.json'

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init)
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error ?? `Request failed: ${res.status}`)
  }
  return res.json() as Promise<T>
}

export async function listTreeFiles(): Promise<string[]> {
  const { files } = await request<{ files: string[] }>(`${API_BASE}/files`)
  return files
}

export async function loadTreeFile(name: string): Promise<TreeData> {
  return request<TreeData>(`${API_BASE}/file/${encodeURIComponent(name)}`)
}

export async function saveTreeFile(name: string, data: TreeData): Promise<void> {
  await request(`${API_BASE}/file/${encodeURIComponent(name)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
}

export async function loadThemes(): Promise<ThemeCatalog> {
  try {
    return await request<ThemeCatalog>(`${API_BASE}/file/${THEMES_FILE}`)
  } catch {
    return {}
  }
}

export async function saveThemes(catalog: ThemeCatalog): Promise<void> {
  await request(`${API_BASE}/file/${THEMES_FILE}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(catalog),
  })
}
