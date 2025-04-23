import { PersonFormKeys } from "./personFormKeys.enum";

export type PersonFormShape = { 
    [PersonFormKeys.NAME]: string, 
    [PersonFormKeys.AGE]: number, 
    [PersonFormKeys.IS_REAL_PERSON]: boolean,
    [PersonFormKeys.FAVORITE_CHARACTER]?: string | number
};