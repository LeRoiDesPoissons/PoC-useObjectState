import { FC } from "react";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";

export const Empty: FC = () => {
    useDocumentTitle('useObjectState');
    
    return (
        <></>
    )
}