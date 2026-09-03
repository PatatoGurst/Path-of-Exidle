import { promises as fs } from 'node:fs'
import path from 'node:path'
import type { Plugin, ViteDevServer } from 'vite'

const API_PREFIX = '/__tree-editor-api'
const VALID_FILENAME = /^[\w.-]+\.json$/

function resolveDataFile(dataNodesDir: string, name: string): string | null {
  if (!VALID_FILENAME.test(name)) {
    return null
  }
  const resolved = path.resolve(dataNodesDir, name)
  if (resolved !== dataNodesDir && !resolved.startsWith(dataNodesDir + path.sep)) {
    return null
  }
  return resolved
}

function sendJson(res: import('node:http').ServerResponse, status: number, body: unknown) {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(body))
}

interface TreeDataLike {
  id: unknown
  version: unknown
  metadata: unknown
  nodes: unknown[]
}

function isTreeDataLike(value: unknown): value is TreeDataLike {
  return (
    !!value &&
    typeof value === 'object' &&
    Array.isArray((value as TreeDataLike).nodes) &&
    'metadata' in (value as object)
  )
}

function reindent(json: string, extraSpaces: number): string {
  const pad = ' '.repeat(extraSpaces)
  return json
    .split('\n')
    .map((line, i) => (i === 0 ? line : pad + line))
    .join('\n')
}

function serializeTreeData(data: TreeDataLike): string {
  const metadataJson = reindent(JSON.stringify(data.metadata, null, 2), 2)
  const nodesJson = data.nodes.map((n) => '    ' + JSON.stringify(n)).join(',\n')
  return `{\n  "id": ${JSON.stringify(data.id)},\n  "version": ${JSON.stringify(data.version)},\n  "metadata": ${metadataJson},\n  "nodes": [\n${nodesJson}\n  ]\n}\n`
}

function serializeFile(parsed: unknown): string {
  if (isTreeDataLike(parsed)) {
    return serializeTreeData(parsed)
  }
  return JSON.stringify(parsed, null, 2) + '\n'
}

function readBody(req: import('node:http').IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    let data = ''
    req.on('data', (chunk) => {
      data += chunk
    })
    req.on('end', () => resolve(data))
    req.on('error', reject)
  })
}

async function listTreeFiles(dataNodesDir: string): Promise<string[]> {
  const entries = await fs.readdir(dataNodesDir).catch(() => [])
  const result: string[] = []
  for (const entry of entries) {
    if (!entry.endsWith('.json')) {
      continue
    }
    try {
      const raw = await fs.readFile(path.join(dataNodesDir, entry), 'utf-8')
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed?.nodes)) {
        result.push(entry)
      }
    } catch {
      // not valid JSON / not a tree file, skip
    }
  }
  return result.sort()
}

function registerRoutes(server: ViteDevServer, dataNodesDir: string) {
  server.middlewares.use(API_PREFIX, async (req, res) => {
    const url = new URL(req.url ?? '/', 'http://localhost')

    try {
      if (req.method === 'GET' && url.pathname === '/files') {
        const files = await listTreeFiles(dataNodesDir)
        sendJson(res, 200, { files })
        return
      }

      const fileMatch = url.pathname.match(/^\/file\/(.+)$/)
      if (fileMatch) {
        const filePath = resolveDataFile(dataNodesDir, decodeURIComponent(fileMatch[1]))
        if (!filePath) {
          sendJson(res, 400, { error: 'Invalid filename' })
          return
        }

        if (req.method === 'GET') {
          const raw = await fs.readFile(filePath, 'utf-8').catch(() => null)
          if (raw === null) {
            sendJson(res, 404, { error: 'File not found' })
            return
          }
          res.statusCode = 200
          res.setHeader('Content-Type', 'application/json')
          res.end(raw)
          return
        }

        if (req.method === 'PUT') {
          const body = await readBody(req)
          let parsed: unknown
          try {
            parsed = JSON.parse(body)
          } catch {
            sendJson(res, 400, { error: 'Invalid JSON body' })
            return
          }
          await fs.writeFile(filePath, serializeFile(parsed), 'utf-8')
          sendJson(res, 200, { ok: true })
          return
        }
      }

      sendJson(res, 404, { error: 'Not found' })
    } catch (err) {
      sendJson(res, 500, { error: err instanceof Error ? err.message : 'Unknown error' })
    }
  })
}

export function treeEditorApiPlugin(): Plugin {
  let dataNodesDir = ''

  return {
    name: 'tree-editor-api',
    apply: 'serve',
    configResolved(config) {
      dataNodesDir = path.resolve(config.root, 'data/nodes')
    },
    configureServer(server) {
      registerRoutes(server, dataNodesDir)
    },
  }
}
