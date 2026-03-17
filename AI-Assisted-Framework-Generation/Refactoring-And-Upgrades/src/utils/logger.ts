/**
 * Lightweight logger utility for test diagnostics.
 */
export class Logger {
  private readonly context: string;

  constructor(context: string) {
    this.context = context;
  }

  /**
   * Logs an informational message.
   */
  public info(message: string): void {
    console.log(`[INFO] [${this.context}] ${message}`);
  }

  /**
   * Logs a warning message.
   */
  public warn(message: string): void {
    console.warn(`[WARN] [${this.context}] ${message}`);
  }

  /**
   * Logs an error message.
   */
  public error(message: string): void {
    console.error(`[ERROR] [${this.context}] ${message}`);
  }
}
