import DocumentTitle from "../../util/documentTitle";

const NotFound = () => {
    DocumentTitle("404 | CM");

    return (
        <>
            <h1>404 - Página não encontrada</h1>
        </>
    );
}

export default NotFound;