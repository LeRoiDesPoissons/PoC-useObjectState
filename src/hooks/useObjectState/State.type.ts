export type StateType<Source extends Record<string, unknown> = Record<string, unknown>> = {
    [Key in keyof Source]: {
        value: Source[Key],
        error: Set<string>
    }
};