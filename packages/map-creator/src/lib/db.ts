// Database configuration placeholder
// This file will be configured with your chosen database solution
// Options: SQLite, PostgreSQL, TanStack DB, etc.

export interface Run {
  id: string
  name: string
  path: string
  createdAt: Date
  updatedAt: Date
}

// Placeholder database functions
// Replace with actual database implementation

export async function getRuns(): Promise<Run[]> {
  // TODO: Implement database query
  return []
}

export async function getRunById(id: string): Promise<Run | null> {
  // TODO: Implement database query
  return null
}

export async function createRun(run: Omit<Run, 'id' | 'createdAt' | 'updatedAt'>): Promise<Run> {
  // TODO: Implement database insert
  throw new Error('Not implemented')
}

export async function updateRun(id: string, run: Partial<Run>): Promise<Run> {
  // TODO: Implement database update
  throw new Error('Not implemented')
}

export async function deleteRun(id: string): Promise<void> {
  // TODO: Implement database delete
  throw new Error('Not implemented')
}
