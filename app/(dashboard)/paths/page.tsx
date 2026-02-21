'use client';

import { FormEvent, useMemo, useState } from 'react';
import { apiClient, ApiError } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface PathStepForm {
  name: string;
  systemPromptOverride: string;
}

interface PathFormState {
  id: string;
  name: string;
  description: string;
  shortDescription: string;
  iconUrl: string;
  steps: PathStepForm[];
}

const DEFAULT_PATH_ID = 'shadow-work';

const emptyForm = (id: string): PathFormState => ({
  id,
  name: '',
  description: '',
  shortDescription: '',
  iconUrl: '',
  steps: [],
});

export default function PathsEditorPage() {
  const [pathId, setPathId] = useState(DEFAULT_PATH_ID);
  const [form, setForm] = useState<PathFormState>(emptyForm(DEFAULT_PATH_ID));
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const hasLoadedPath = useMemo(() => form.id.length > 0, [form.id]);

  const normalizePathResponse = (payload: unknown) => {
    const maybeWrapped = payload as { data?: unknown };
    const source = maybeWrapped?.data ?? payload;
    const data = source as {
      id?: string;
      name?: string;
      description?: string;
      shortDescription?: string;
      iconUrl?: string;
      steps?: Array<{ name?: string; systemPromptOverride?: string }>;
    };

    return {
      name: data.name ?? '',
      description: data.description ?? '',
      shortDescription: data.shortDescription ?? '',
      iconUrl: data.iconUrl ?? '',
      steps: (data.steps ?? []).map((step) => ({
        name: step.name ?? '',
        systemPromptOverride: step.systemPromptOverride ?? '',
      })),
    };
  };

  const loadPath = async () => {
    const normalizedPathId = pathId.trim();
    if (!normalizedPathId) {
      setError('Path ID is required.');
      return;
    }

    setLoading(true);
    setError(null);
    setStatus(null);

    try {
      const payload = await apiClient<unknown>(`/admin/paths/${normalizedPathId}`);
      const data = normalizePathResponse(payload);

      setForm({
        id: normalizedPathId,
        ...data,
      });
      setStatus(`Loaded "${normalizedPathId}".`);
    } catch (err) {
      console.error('Failed to load path:', err);
      if (err instanceof ApiError && err.status === 404) {
        setForm(emptyForm(normalizedPathId));
        setError(`Path "${normalizedPathId}" was not found.`);
      } else {
        setError('Failed to load path from admin API.');
      }
    } finally {
      setLoading(false);
    }
  };

  const savePath = async (event: FormEvent) => {
    event.preventDefault();
    if (!form.id.trim()) {
      setError('Path ID is required before saving.');
      return;
    }

    if (!form.name.trim()) {
      setError('Path title is required.');
      return;
    }

    const hasEmptyStepName = form.steps.some((step) => !step.name.trim());
    if (hasEmptyStepName) {
      setError('Every step must have a name before saving.');
      return;
    }

    setSaving(true);
    setError(null);
    setStatus(null);

    try {
      const normalizedId = form.id.trim();
      const cleanedSteps = form.steps.map((step, index) => ({
        index,
        name: step.name.trim(),
        systemPromptOverride: step.systemPromptOverride.trim(),
      }));

      await apiClient<unknown>(`/admin/paths/${normalizedId}`, {
        method: 'PUT',
        body: JSON.stringify({
          id: normalizedId,
          name: form.name.trim(),
          description: form.description.trim(),
          shortDescription: form.shortDescription.trim(),
          iconUrl: form.iconUrl.trim(),
          steps: cleanedSteps,
          totalSteps: cleanedSteps.length,
        }),
      });

      setForm((prev) => ({ ...prev, id: normalizedId }));
      setStatus(`Saved "${normalizedId}" successfully.`);
    } catch (err) {
      console.error('Failed to save path:', err);
      if (err instanceof ApiError && err.status === 404) {
        setError(`Path "${form.id.trim()}" was not found. This endpoint updates existing paths only.`);
      } else {
        setError('Failed to save path via admin API.');
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Paths Editor</h1>
        <p className="text-muted-foreground">
          Edit path metadata and steps through staff admin API endpoints.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Select Path</CardTitle>
          <CardDescription>
            Load any path from the admin API (`/admin/paths/:id`).
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 md:flex-row md:items-end">
          <div className="w-full max-w-sm space-y-2">
            <Label htmlFor="path-id">Path ID</Label>
            <Input
              id="path-id"
              value={pathId}
              onChange={(event) => setPathId(event.target.value)}
              placeholder="shadow-work"
            />
          </div>
          <Button type="button" onClick={loadPath} disabled={loading || saving}>
            {loading ? 'Loading...' : 'Load Path'}
          </Button>
        </CardContent>
      </Card>

      {hasLoadedPath ? (
        <form className="space-y-6" onSubmit={savePath}>
          <Card>
            <CardHeader>
              <CardTitle>Path Details</CardTitle>
              <CardDescription>Title, descriptions, and icon URL.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="path-name">Title</Label>
                <Input
                  id="path-name"
                  value={form.name}
                  onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="path-short-description">Short Description</Label>
                <Textarea
                  id="path-short-description"
                  value={form.shortDescription}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, shortDescription: event.target.value }))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="path-description">Description</Label>
                <Textarea
                  id="path-description"
                  value={form.description}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, description: event.target.value }))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="path-icon-url">Icon URL</Label>
                <Input
                  id="path-icon-url"
                  value={form.iconUrl}
                  onChange={(event) => setForm((prev) => ({ ...prev, iconUrl: event.target.value }))}
                  placeholder="https://..."
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Steps</CardTitle>
              <CardDescription>Add, remove, and edit step names and prompts.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {form.steps.length === 0 ? (
                <p className="text-sm text-muted-foreground">No steps yet.</p>
              ) : null}

              {form.steps.map((step, index) => (
                <div key={`${index}-${step.name}`} className="rounded-lg border p-4 space-y-3">
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="font-medium">Step {index + 1}</h3>
                    <Button
                      type="button"
                      size="sm"
                      variant="destructive"
                      onClick={() =>
                        setForm((prev) => ({
                          ...prev,
                          steps: prev.steps.filter((_, stepIndex) => stepIndex !== index),
                        }))
                      }
                    >
                      Remove
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`step-name-${index}`}>Step Name</Label>
                    <Input
                      id={`step-name-${index}`}
                      value={step.name}
                      onChange={(event) =>
                        setForm((prev) => ({
                          ...prev,
                          steps: prev.steps.map((entry, stepIndex) =>
                            stepIndex === index
                              ? { ...entry, name: event.target.value }
                              : entry
                          ),
                        }))
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`step-prompt-${index}`}>System Prompt Override</Label>
                    <Textarea
                      id={`step-prompt-${index}`}
                      value={step.systemPromptOverride}
                      onChange={(event) =>
                        setForm((prev) => ({
                          ...prev,
                          steps: prev.steps.map((entry, stepIndex) =>
                            stepIndex === index
                              ? { ...entry, systemPromptOverride: event.target.value }
                              : entry
                          ),
                        }))
                      }
                    />
                  </div>
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  setForm((prev) => ({
                    ...prev,
                    steps: [...prev.steps, { name: '', systemPromptOverride: '' }],
                  }))
                }
              >
                Add Step
              </Button>
            </CardContent>
          </Card>

          <div className="flex items-center gap-3">
            <Button type="submit" disabled={saving || loading}>
              {saving ? 'Saving...' : 'Save Path'}
            </Button>
            {status ? <p className="text-sm text-green-600">{status}</p> : null}
            {error ? <p className="text-sm text-destructive">{error}</p> : null}
          </div>
        </form>
      ) : null}
    </div>
  );
}
