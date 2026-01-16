import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';

import { api } from '~/service';
import { ProtectedRoute } from '~/components/ProtectedRoute';
import { useAuth } from '~/contexts/AuthContext';
import { Button, Text } from '~/primitives';
import type { Run, ApiResponse } from '~/types';

export const Route = createFileRoute('/runs/')({
  component: RunsList,
});

function RunsList() {
  const [runs, setRuns] = useState<Run[]>([]);
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
        const response = await api.get<ApiResponse<Run[]>>('/runs');
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
      <div>
        <Text element="h1" className="mb-4">
          All Runs
        </Text>
        <Text className="mb-6">View and manage your running routes</Text>

        {loading && <Text>Loading runs...</Text>}
        {error && (
          <div className="mb-4 rounded border border-red-400 bg-red-100 p-3 text-red-700">
            {error}
          </div>
        )}
        {!loading && !error && (
          <>
            {runs.length === 0 ? (
              <Text className="mb-4">No runs yet. Create your first run!</Text>
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
                    <Button linkTo={`/runs/${run.id}`}>View</Button>
                  </div>
                ))}
              </div>
            )}
            <Button linkTo="/runs/new">Create New Run</Button>
          </>
        )}
      </div>
    </ProtectedRoute>
  );
}
