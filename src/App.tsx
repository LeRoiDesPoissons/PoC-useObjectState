import { FC } from "react"
import { useObjectState } from "./hooks"

enum Keys {
  NAME = 'name',
  AGE = 'age'
}

export const App: FC = () => {
  const {
    name,
    age,
    update,
    reset,
    errors,
  } = useObjectState(
    {
      [Keys.NAME]: 'The builder',
      [Keys.AGE]: 0
    },
    {
      validators: {
        name: (name) => name !== 'Bob' ? ['Not Bob'] : null,
        age: (age) => age === 12 ? ['I dislike the number 12, pick another'] : null
      },
      htmlValidation: true,
    }
  );

  const setCorrectName = () => {
    update(Keys.NAME)('Bob')
  }

  return (
    <>
      <button onClick={setCorrectName}>Set correct name</button>
      <hr />
      <label htmlFor={Keys.NAME}>
        Pick a nice name
        <input
          placeholder="Name please"
          name={Keys.NAME}
          type="text"
          value={name}
          maxLength={6}
          onChange={update} />
      </label>
      {
        errors.name && (
          <p>{errors.name}</p>
        )
      }
      <hr />
      <label htmlFor={Keys.AGE}>
        Pick a nice age
        <input
          placeholder="Age please"
          name={Keys.AGE}
          type="number"
          min={5}
          max={10}
          value={age}
          onChange={update} />
      </label>
      {
          errors.age?.map((error) => (<p key={error}>{ error }</p>))
      }
      <hr />
      <button onClick={reset}>Reset</button>
    </>
  )
}
