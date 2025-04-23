import { ChangeEventHandler, FC } from "react";
import { PersonFormKeys } from "./personFormKeys.enum";
import { PersonFormShape } from "./personFormShape.type";
import { useObjectState } from "../../hooks";

export const PersonForm: FC = () => {
  const {
    name,
    age,
    favoriteCharacter,
    isReadPerson,
    update,
    reset,
    errors,
  } = useObjectState<PersonFormShape>(
    {
      [PersonFormKeys.NAME]: 'The builder',
      [PersonFormKeys.AGE]: 0,
      [PersonFormKeys.FAVORITE_CHARACTER]: undefined,
      [PersonFormKeys.IS_REAL_PERSON]: true
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
    update(PersonFormKeys.NAME)('Bob')
  }

  const updateIsRealPerson: ChangeEventHandler<HTMLInputElement> = (e) => {
    const {
      currentTarget: {
        checked
      }
    } = e;

    update(PersonFormKeys.IS_REAL_PERSON)(checked);
  }

  return (
    <>
      <label htmlFor={PersonFormKeys.NAME}>
        Pick a nice name
        <input
          placeholder="Name please"
          name={PersonFormKeys.NAME}
          type="text"
          value={name}
          maxLength={6}
          onChange={update} />
      </label>
      {
        errors.name?.map((error) => (<p key={error}>{error}</p>))
      }
      <button onClick={setCorrectName}>Set correct name</button>
      <label htmlFor={PersonFormKeys.AGE}>
        Pick your favorite number
        <input
          placeholder="Favorite number"
          name={PersonFormKeys.AGE}
          type="number"
          value={age}
          onChange={update} />
      </label>
      {
        errors.age?.map((error) => (<p key={error}>{error}</p>))
      }
      <label htmlFor="favoriteCharacter">
        Choose your favorite A-Z 0-9 character
        <input
          placeholder="Favorite character"
          name={PersonFormKeys.FAVORITE_CHARACTER}
          pattern="^[A-Z0-9]$"
          value={favoriteCharacter}
          onChange={update}
        />
      </label>
      {
        errors.favoriteCharacter?.map((error) => (<p key={error}>{ error }</p>))
      }
      <label htmlFor={PersonFormKeys.IS_REAL_PERSON}>
        Are you a real person
        <input
          name={PersonFormKeys.IS_REAL_PERSON}
          type="checkbox"
          checked={isReadPerson}
          onChange={updateIsRealPerson}
        />
      </label>
      <button onClick={reset}>Reset</button>
    </>
  )
}