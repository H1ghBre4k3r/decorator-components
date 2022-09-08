export interface Clazz {
  new (...arg: any[]): HTMLElement & { render(): string };
  observedAttributes?: string[];
}
