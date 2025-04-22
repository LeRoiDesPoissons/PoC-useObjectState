import { ChangeEvent, useEffect, useReducer, useRef } from "react";
import { reducer } from "./ObjectState.reducer";
import { StateType } from "./State.type";

type Input<T extends Record<string, unknown>, Key extends keyof T = keyof T> = Omit<HTMLInputElement, 'currentTarget.name' | 'currentTarget.value'> & { currentTarget: { name: Key, value: T[Key] } };

type Options<T extends Record<string, unknown>> = {
    /**
     * @summary Object where each key must be from the setup Object keys's collection, but not each original key must be represented  
     * @summary Each key specifies a callback function which accepts the key's type as an argument and expect an array of error message or null if no error
     */
    validators?: {
        [Key in keyof T]?: (arg: T[Key]) => string[] | null
    },
    /**
     * Determines if the update function add native html input validation to the errors, or only specified validators
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input#client-side_validation}
     */
    htmlValidation?: boolean,
    /**
     * Set to true if you would like validators to be run against the initial values, without any change input
     */
    validationFromStart?: boolean
};

function MapInitToState<T extends Record<string, string | number | boolean>>(init: T): StateType<T> {
    return Object.entries(init).reduce((accumulator, [key, value]) => {
        accumulator[key as keyof T] = {
            value: value as T[keyof T],
            error: new Set()
        };

        return accumulator;
    }, {} as StateType<T>);
}

/**
 * 
 * @param init Initial values object, the hook uses this to determine the state, each property is typed to the input
 * @see {options}
 * @param options The configuration object 
 * @returns 
 *  - The state representation of each key of the init parameter
 *  - Update function, which can be called in a HoC manner with the key, or as a direct onChange callback (the name of the html input must match the property on the state object)
 * - Reset function, to reset the object to original values. Also resets pristine to true
 * - Error object, containing all keys of the original `init` object, value is either an array of errormessages (string) or null if there are no errors
 * - isPristine, if true, the values have not been changed and validation has not been run
 * - hasErrors, comfort property indicating if the object validators have returned errors or not
 */
export function useObjectState<T extends Record<string, string | number | boolean>>(init: T, options: Options<T> = {}) {
    const {
        htmlValidation = false,
        validationFromStart = false,
        validators = {},
    } = options;

    const firstRender = useRef(!validationFromStart);

    const [state, dispatch] = useReducer(reducer, init, MapInitToState);

    function update<Key extends keyof T = keyof T>(start: ChangeEvent<Input<T, Key>>): void
    function update<Key extends keyof T = keyof T>(start: Key): (arg: T[Key]) => void
    function update<Key extends keyof T = keyof T>(start: Key | ChangeEvent<Input<T, Key>>): void | ((arg: T[Key]) => void) {
        if (typeof start === 'string') {
            if (start in init) {
                return function (value: T[Key]) {
                    const error = new Set<string>();

                    if (!firstRender.current && Object.keys(validators).find((key) => key === start)) {
                        const [, validatorFunc] = Object.entries(validators).find(([key]) => key === start) as [keyof T, ((arg: T[keyof T]) => string[] | null)];

                        validatorFunc(value)
                            ?.filter((value) => value !== '')
                            .forEach((err) => error.add(err));
                    }

                    dispatch({
                        key: start,
                        payload: {
                            value,
                            error
                        }
                    });
                }
            } else {
                throw new SyntaxError('Unknown key');
            }

        } else {
            const {
                currentTarget: {
                    name,
                    value,
                    validationMessage
                }
            } = start as ChangeEvent<HTMLInputElement>;

            if (name in init) {
                const error = new Set<string>();

                if (htmlValidation && validationMessage) {
                    error.add(validationMessage);
                }

                if (!firstRender.current && Object.keys(validators).find((key) => key === name)) {
                    const [, validatorFunc] = Object.entries(validators).find(([key]) => key === name) as [keyof T, ((arg: T[keyof T]) => string[] | null)];

                    // Values coming from HTMLInput are always cast to strings, so we attempt to cast the value to the correct type using the type of the value the initial object
                    switch (typeof init[name]) {
                        case 'string':
                            validatorFunc(String(value) as T[keyof T])
                                ?.filter((value) => value !== '')
                                .forEach((err) => error.add(err));
                            break;
                        case "number":
                        case "bigint":
                            validatorFunc(Number(value) as T[keyof T])
                                ?.filter((value) => value !== '')
                                .forEach((err) => error.add(err));
                            break;
                        case "boolean":
                            validatorFunc(Boolean(value) as T[keyof T])
                                ?.filter((value) => value !== '')
                                .forEach((err) => error.add(err));
                            break;
                        case "object":
                            validatorFunc(Object(value) as T[keyof T])
                                ?.filter((value) => value !== '')
                                .forEach((err) => error.add(err));
                            break;
                        // No idea what type could be, hope for the best
                        case "symbol":
                        case "undefined":
                        case "function":
                        default:
                            validatorFunc(value as T[keyof T])
                                ?.filter((value) => value !== '')
                                .forEach((err) => error.add(err));
                            break;
                    }


                }

                dispatch({
                    key: name,
                    payload: {
                        value,
                        error
                    }
                });
            } else {
                throw new SyntaxError('Unknown key');
            }
        }
    }

    function reset() {
        dispatch({
            key: 'reset',
            payload: MapInitToState(init)
        });

        firstRender.current = true;
    };

    const { values, errors } = Object.entries(state).reduce(
        (accumulator, [key, { value, error }]) => {
            // @ts-expect-error: Must be a mapped type, and have to assign
            accumulator.errors[key] = error.size > 0 ? Array.from(error) : null;
            // @ts-expect-error: Must be a mapped type, and have to assign
            accumulator.values[key] = value;

            return accumulator;
        },
        {
            errors: {},
            values: {}
        } as {
            errors: {
                [Key in keyof T]: string[] | null
            },
            values: {
                [Key in keyof T]: T[Key]
            }
        }
    );

    useEffect(() => {
        firstRender.current = false;
    });

    return {
        ...values,
        update,
        reset,
        errors,
        pristine: firstRender.current,
        hasErrors: Object.values(errors).some((error) => error !== null)
    }
}