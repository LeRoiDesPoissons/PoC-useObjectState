## useObjectState
A hook to keep track of and validate object state

### Why

Keeping track of objects can be hard, having to create a local state solution for every component can be tedious and if not done with proper carte can lead to code bloat and creating the same functionality multiple times.  
As a stopgap solution we can create a generic hook to alleviate the more general problems, just keeping track of and updating the state of an object, but it's certainly not an end-all solution since many usecases will not fit the interface.

### Why not useReducer

Essentially that is what it is but with some more sugar on top such as validation and use with forms.  
But not having to write a custom reducer in each component, only to rewrite the same functionality over and over is a win in my book.

### How does it work

Internally it does use a useReducer, but it creates a generic reducer base on the initial object, which it also uses to determine the types.  
Furthermore it exposes some extra functionality such as errors and reset

### How to use it

#### Add the hook to a component

```TypeScript
import { useObjectState } from 'hooks';

const {
    ...
} = useObjectState({});

```
Now we have set it up, but in a way that's not very useful as it has no properties and thus exposes nothing to keep track of

#### Initialization and typing

```TypeScript
import { useObjectState } from 'hooks';

const {
    someProperty
} = useObjectState({
    someProperty: null
});

```
Here we define a property on the object, but as we set it to null we can't do much with it as now it can only be of value 'null'.  
By adding an 'as' clause we can tell the hook to treat it as whatever type we want.

```TypeScript
import { useObjectState } from 'hooks';

const {
    someProperty // <-- Will be typed as string | number
} = useObjectState({
    someProperty: null as unknown as string | number //Need to cast to unknown first since string | number has no overlap with null
});

```
Doing this has a pitfall however, eventho the initial value is `null` the type will ALWAYS be `string | number`, which can lead to unexpected results.  
Here it would be better to set and initial value of ''  .
  
Another way of doing this (and my prefered way) is providing a shape as type argument to the hook.
```TypeScript
import { useObjectState } from 'hooks';

type Nullable<T> = T | null;

const {
    someProperty // <-- Will now be typed as string | number | null
} = useObjectState<{ someProperty: Nullable<string | number> }>({
    someProperty: null
});

```
By doing it this way the type of the exposed property (and validator argument!) is correctly set as potentially null, so we know to check for value when using it.

**Important to remember**

Making a property optional on the shape but not providing it in the initial object will throw an `unknown key` error when trying to update it as keys are checked against the initial object at runtime.
___

#### Options

A configuration object to specify how certain things should behave

```Typescript
// T is the Record type of our initial object
{
    validators?: {
        [Key in keyof T]?: (arg: T[Key]) => string[] | null
    },
    htmlValidation?: boolean,
    validationFromStart?: boolean
}

```
##### Validators

An object where we can specify a validatorfunction for each key on our initial object.  
Each function is provided the value (typed to shape) and is expected to return an array of errormessages (as `string`) if there are errors or null if there are none

##### htmlValidation

For use with `input` elements, if set to true, the update function will check the validationmessages of the input element and add this to the error messages.  
Default is `false`

```Typescript
import { useObjectState } from 'hooks';

const {
    someProperty,
    update
} = useObjectState<{ someProperty: string }>({
    someProperty: ''
});

<input 
    name="someProperty" 
    type="text" 
    minLength={5} 
    maxLength={15} 
    value={someProperty}
    onChange={update} />
```

#### validationFromStart

If the initial values should already be checked against validators (or input attributes if htmlValidation is enabled). Enabling this will instantly set errors if the values do not pass validation.  
Default is `false`

```Typescript
import { useObjectState } from 'hooks';

const {
    someProperty,
    update,
    errors
} = useObjectState<{ someProperty: string }>({
    someProperty: ''
});

<input 
    name="someProperty" 
    type="text" 
    minLength={5} 
    maxLength={15} 
    value={someProperty}
    onChange={update} />

// errors.someProperty will contain something along the lines of "text too short, minimum is 5 (provided: 0)"
```
___
### Return signature

##### Values
Each of the keys in the initial object is returned as a key on the return object, they contain the current value associated with the key

##### update
A function to update values on the object.  
It provides two signatures

###### Programmatic
This implementation allows you to provide a key (the name of the property you wish to update) as an argument and then returns a callback function which accept a value of the type of the key's property  
`(key: keyof T) => (value: T[keyof T]) => void`

```Typescript
const {
    update,
} = useObjectState({
    someProperty: ''
});

function onClick = () {
    update('someProprty')('nameValue');
}
```
###### Event handler
This implementation allows you to directly attach the update function to a dom node, as long as it implements the `ChangeEvent<HTMLInputElement>` interface.  
`(event: ChangeEvent<HTMLInputElement>) => void`  
**Important: the `name` attribute on the currentTarget should match the property on the object, will throw an 'unknown key' error on mismatch**

```Typescript
const {
    someProperty
    update,
} = useObjectState({
    someProperty: ''
});

<input name="someProperty" value={someProperty} onChange={update} />
```

##### reset
Resets the object state to the initial values
Accepts an optional argument to also reset the pristine condition of the state, default is `true`

##### errors
Object containing each key of the original object, either returning and array of errormessages (strings) or null if the value is valid.

##### hasErrors
Boolean indicating if one or more values have validationerrors

##### pristine
Boolean indicating if one or more values have been changed, potentially resets.
