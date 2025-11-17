export function createBatchUrl(batch: { display_id: number }): string {
  return `/batches/${batch.display_id}`
}

export function createTestUrl(test: { display_id: number }): string {
  return `/tests/${test.display_id}`
}

export function parseTestUrl(urlOrId: string): string {
  if (urlOrId.includes('/')) {
    const parts = urlOrId.split('/')
    return parts[parts.length - 1]
  }
  return urlOrId
}

export function parseBatchUrl(urlOrId: string): string {
  if (urlOrId.includes('/')) {
    const parts = urlOrId.split('/')
    return parts[parts.length - 1]
  }
  return urlOrId
}