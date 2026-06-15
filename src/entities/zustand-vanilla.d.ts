declare module "zustand/vanilla" {
  export type SetState<T> = (
    partial: T | Partial<T> | ((state: T) => T | Partial<T>),
    replace?: boolean,
  ) => void;

  export type GetState<T> = () => T;

  export interface StoreApi<T> {
    setState: SetState<T>;
    getState: GetState<T>;
    getInitialState: GetState<T>;
    subscribe: (listener: (state: T, previousState: T) => void) => () => void;
  }

  export type StateCreator<T> = (
    setState: SetState<T>,
    getState: GetState<T>,
    store: StoreApi<T>,
  ) => T;

  export function createStore<T>(): (
    initializer: StateCreator<T>,
  ) => StoreApi<T>;
}
