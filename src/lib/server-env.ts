declare const process:
  | {
      env: Record<string, string | undefined>;
    }
  | undefined;

export const readServerEnv = (key: string) =>
  (import.meta.env[key] as string | undefined) ||
  (typeof process !== "undefined" ? process.env[key] : undefined);
