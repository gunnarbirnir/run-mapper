import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';

import { api } from '~/service';
import { ProtectedRoute } from '~/components/ProtectedRoute';
import { PageLayout } from '~/components/PageLayout';
import { useAuth } from '~/contexts/AuthContext';
import { Button, Text } from '~/primitives';
import type { EditorRun, ApiResponse } from '~/types';

export const Route = createFileRoute('/editor/runs/')({
  component: EditorRunsList,
});

function EditorRunsList() {
  const [runs, setRuns] = useState<EditorRun[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (authLoading || !user) {
      return;
    }

    const fetchRuns = async () => {
      try {
        setLoading(true);
        const response =
          await api.get<ApiResponse<EditorRun[]>>('/editor-runs');
        if (response.success) {
          setRuns(response.data);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load runs');
      } finally {
        setLoading(false);
      }
    };

    fetchRuns();
  }, [user, authLoading]);

  return (
    <ProtectedRoute>
      <PageLayout>
        <PageLayout.MainContent>
          <Text element="h1">My Runs</Text>
          <Text variant="paragraph">View and manage your running routes</Text>
          {loading && <Text variant="paragraph">Loading runs...</Text>}
          {error && (
            <div className="mb-4 rounded border border-red-400 bg-red-100 p-3 text-red-700">
              {error}
            </div>
          )}
          {!loading && !error && (
            <>
              {runs.length === 0 ? (
                <Text variant="paragraph">
                  No runs yet. Create your first run!
                </Text>
              ) : (
                <div className="mb-6 space-y-2">
                  {runs.map((run) => (
                    <div
                      key={run.id}
                      className="flex items-center justify-between rounded border border-gray-300 p-4"
                    >
                      <div>
                        <Text className="font-semibold">
                          {run.name || 'Unnamed Run'}
                        </Text>
                        {run.createdAt && (
                          <Text className="text-sm text-gray-500">
                            Created:{' '}
                            {new Date(run.createdAt).toLocaleDateString()}
                          </Text>
                        )}
                      </div>
                      <Button linkTo={`/editor/runs/${run.id}`}>View</Button>
                    </div>
                  ))}
                </div>
              )}
              <Button linkTo="/editor/runs/new" className="mt-4">
                Create New Run
              </Button>
            </>
          )}
        </PageLayout.MainContent>
      </PageLayout>
    </ProtectedRoute>
  );
}
