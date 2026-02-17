import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';

import { api } from '~/service';
import { ProtectedRoute } from '~/components/ProtectedRoute';
import { MapEditor, type RouteData } from '~/components/MapEditor';
import { Text, Button, Form } from '~/primitives';
import type { ApiResponse } from '~/types';

export const Route = createFileRoute('/runs/new')({
  component: NewRun,
});

function NewRun() {
  const [name, setName] = useState('');
  const [routeData, setRouteData] = useState<RouteData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!routeData || routeData.coordinates.length === 0) {
        setError('Please draw a route on the map');
        setLoading(false);
        return;
      }

      const response = await api.post<ApiResponse<{ id: string }>>('/runs', {
        name: name || undefined,
        coordinates: routeData.coordinates,
        boundingBox: routeData.boundingBox,
      });

      if (response.success) {
        navigate({ to: `/runs/${response.data.id}` });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create run');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="flex h-[calc(100vh-8rem)] flex-col">
        <Text element="h1" className="mb-4">
          Create New Run
        </Text>
        <Form onSubmit={handleSubmit} className="mb-4">
          {error && (
            <div className="mb-4 rounded border border-red-400 bg-red-100 p-3 text-red-700">
              {error}
            </div>
          )}
          <Form.TextInput
            id="name"
            name="name"
            label="Run Name"
            placeholder="Enter run name"
            value={name}
            onChange={setName}
          />
          <div className="mb-4">
            <Button type="submit" disabled={loading || !routeData || routeData.coordinates.length === 0}>
              {loading ? 'Creating...' : 'Create Run'}
            </Button>
            {routeData && routeData.coordinates.length > 0 && (
              <span className="ml-4 text-sm text-gray-600">
                {routeData.coordinates.length} points drawn
              </span>
            )}
          </div>
        </Form>
        <div className="flex-1 rounded-lg border border-gray-300">
          <MapEditor
            onRouteChange={setRouteData}
          />
        </div>
      </div>
    </ProtectedRoute>
  );
}
