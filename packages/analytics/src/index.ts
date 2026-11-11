import { validateClientEvent, type QpaiClientEvent } from "./validation";

export * from "./registry";
export * from "./validation";

export interface QpaiAnalyticsProvider {
  initialize(context: { environment: QpaiClientEvent["environment"]; pseudonymousUserId?: string }): Promise<void>;
  log(event: QpaiClientEvent): void;
  setUser(pseudonymousUserId: string | null): Promise<void>;
  flush(): Promise<void>;
  shutdown(): Promise<void>;
}

export interface QpaiAnalytics {
  initialize(context: { consentGranted: boolean; environment: QpaiClientEvent["environment"]; pseudonymousUserId?: string }): Promise<void>;
  track(event: QpaiClientEvent): boolean;
  setUser(pseudonymousUserId: string | null): Promise<void>;
  flush(): Promise<void>;
  shutdown(): Promise<void>;
}

export function createQpaiAnalytics(provider?: QpaiAnalyticsProvider): QpaiAnalytics {
  let enabled = false;

  return {
    async initialize(context) {
      enabled = context.consentGranted && Boolean(provider);
      if (enabled && provider) {
        await provider.initialize({
          environment: context.environment,
          ...(context.pseudonymousUserId ? { pseudonymousUserId: context.pseudonymousUserId } : {}),
        }).catch(() => { enabled = false; });
      }
    },
    track(event) {
      if (!enabled || !provider) return false;
      const result = validateClientEvent(event);
      if (!result.ok) return false;
      try {
        provider.log(result.event);
        return true;
      } catch {
        return false;
      }
    },
    async setUser(pseudonymousUserId) {
      if (!enabled || !provider) return;
      await provider.setUser(pseudonymousUserId).catch(() => undefined);
    },
    async flush() {
      if (!enabled || !provider) return;
      await provider.flush().catch(() => undefined);
    },
    async shutdown() {
      enabled = false;
      if (provider) await provider.shutdown().catch(() => undefined);
    },
  };
}

export function createNoopQpaiAnalytics(): QpaiAnalytics {
  return createQpaiAnalytics();
}
