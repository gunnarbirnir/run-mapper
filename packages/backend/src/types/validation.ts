import type { EditorRun } from './index.js';

export interface ValidationError {
  status: number;
  error: string;
  message: string;
}

export interface OkResult<T> {
  ok: true;
  value: T;
  error?: undefined;
}

export interface ErrResult {
  ok: false;
  error: ValidationError;
  value?: undefined;
}

export type ValidationResult<T> = OkResult<T> | ErrResult;

export type CreateRunBody = Omit<EditorRun, 'id' | 'createdAt'>;

export type UpdateRunBody = Omit<EditorRun, 'id'>;
