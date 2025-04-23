import { FC, useEffect } from "react";
import { useObjectState } from "../../hooks";

export const DataLoader: FC = () => {
    const {
        json,
        anotherJson,
        update,
    } = useObjectState<{ [key: string]: JSON | null }>({
        json: null,
        anotherJson: null
    });

    useEffect(() => {
        const timeout = setTimeout(() => {
            update('json')(
                {
                    "glossary": {
                        "title": "example glossary",
                        "GlossDiv": {
                            "title": "S",
                            "GlossList": {
                                "GlossEntry": {
                                    "ID": "SGML",
                                    "SortAs": "SGML",
                                    "GlossTerm": "Standard Generalized Markup Language",
                                    "Acronym": "SGML",
                                    "Abbrev": "ISO 8879:1986",
                                    "GlossDef": {
                                        "para": "A meta-markup language, used to create markup languages such as DocBook.",
                                        "GlossSeeAlso": ["GML", "XML"]
                                    },
                                    "GlossSee": "markup"
                                }
                            }
                        }
                    }
                } as unknown as JSON
            );
        }, 1000);

        return () => {
            clearTimeout(timeout);
        }
    }, []);

    useEffect(() => {
        const timeout = setTimeout(() => {
            update('anotherJson')("5000" as unknown as JSON);
        }, 3000);

        return () => {
            clearTimeout(timeout);
        }
    }, []);

    return (
        <>
            <p>
                {
                    json 
                        ? JSON.stringify(json)
                        : 'Loading json'
                }
            </p>
            <p>
                {
                    anotherJson
                        ? JSON.stringify(anotherJson)
                        : 'Loading anotherJson'
                }
            </p>
        </>
    )
}