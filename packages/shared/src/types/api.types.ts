export interface HealthCheckResponse {
  status: 'ok' | 'error';
  timestamp: string;
  uptime: number;
  environment: string;
  services: {
    database: {
      status: 'up' | 'down' | 'unconfigured';
      latencyMs?: number;
      error?: string;
    };
    memory: {
      heapUsedMb: number;
      heapTotalMb: number;
    };
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
}
