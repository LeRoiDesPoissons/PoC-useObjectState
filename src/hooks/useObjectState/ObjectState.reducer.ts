import { StateType } from "./State.type"

type PayloadAction<T extends StateType, Key extends keyof T = keyof T> = {
    key: Key,
    payload: {
        value: T[Key]['value'],
        error: Set<string>
    }
}

type Reset<T extends Record<string, unknown>> = {
    key: 'reset',
    payload: T
}


export function reducer<T extends StateType>(prevState: T, { key, payload }: PayloadAction<T> | Reset<T>): T {
    if (key === 'reset') {
        return { ...payload as T };
    }

    const nextState = structuredClone(prevState);
    
    return {
        ...nextState,
        [key]: payload
    };
};