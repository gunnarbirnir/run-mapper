import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';

import { api } from '~/service';
import { ProtectedRoute } from '~/components/ProtectedRoute';
import { Text, Button, Form } from '~/primitives';
import type { ApiResponse } from '~/types';

export const Route = createFileRoute('/runs/new')({
  component: NewRun,
});

function NewRun() {
  const [name, setName] = useState('');
  const [pathData, setPathData] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let parsedPathData;
      if (pathData.trim()) {
        try {
          parsedPathData = JSON.parse(pathData);
        } catch {
          setError('Invalid JSON in path data');
          setLoading(false);
          return;
        }
      }

      const response = await api.post<ApiResponse<{ id: string }>>('/runs', {
        name: name || undefined,
        routeData: parsedPathData,
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
      <div>
        <Text element="h1" className="mb-4">
          Create New Run
        </Text>
        <Form onSubmit={handleSubmit}>
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
          <Form.TextArea
            id="path"
            name="path"
            label="Path Data (JSON)"
            placeholder='Enter path coordinates or route data as JSON, e.g. {"type": "FeatureCollection", "features": [...]}'
            value={pathData}
            onChange={setPathData}
          />
          <Button type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Create Run'}
          </Button>
        </Form>
      </div>
    </ProtectedRoute>
  );
}
