import useSWR, { type SWRConfiguration } from 'swr';
import apiService, { type ApiResponse } from '@/services/api';

type Primitive = string | number | boolean;
type ParamsValue = Primitive | Primitive[] | Record<string, unknown> | undefined | null | '';

export type ApiSWRArgs = {
  endpoint: string;
  params?: Record<string, ParamsValue>;
  token?: string;
};

function stableStringify(value: unknown): string {
  if (value === null) return 'null';
  if (value === undefined) return 'undefined';
  if (typeof value !== 'object') return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(',')}]`;

  const obj = value as Record<string, unknown>;
  const keys = Object.keys(obj).sort();
  return `{${keys
    .map((k) => `${JSON.stringify(k)}:${stableStringify(obj[k])}`)
    .join(',')}}`;
}

function sanitizeParams(
  params: Record<string, ParamsValue> | undefined,
): Record<string, string | number | boolean> | undefined {
  if (!params) return undefined;

  const sanitized: Record<string, string | number | boolean> = {};
  for (const [key, raw] of Object.entries(params)) {
    if (raw === undefined || raw === null || raw === '') continue;

    if (Array.isArray(raw)) {
      sanitized[key] = raw.join(',');
    } else if (typeof raw === 'object') {
      sanitized[key] = JSON.stringify(raw);
    } else {
      sanitized[key] = raw;
    }
  }
  return sanitized;
}

async function fetchApiData<T>(args: ApiSWRArgs): Promise<T> {
  const res: ApiResponse<T> = await apiService.get<T>(
    args.endpoint,
    sanitizeParams(args.params),
    args.token,
  );

  if (!res.success) {
    throw new Error(res.message || 'Request failed');
  }

  return res.data;
}

/**
 * Generic SWR hook for GET endpoints returning your backend `ApiResponse`.
 * Returns the unwrapped `data` portion.
 */
export function useApiSWR<T>(
  args: ApiSWRArgs | null,
  swrConfig?: SWRConfiguration<T>,
) {
  const key = args
    ? [
        'api:get',
        args.endpoint,
        stableStringify(args.params),
        args.token ?? '',
      ]
    : null;

  return useSWR<T>(key, () => fetchApiData<T>(args!), {
    revalidateOnFocus: false,
    ...(swrConfig ?? {}),
  });
}

