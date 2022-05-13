import PagesRoutes from './routes';

import { AuthContextProvider } from './contexts/auth';

import GlobalStyles from './styles/global';
import Menu from './components/Menu';

const App = () => {
    return (
        <AuthContextProvider>
            <GlobalStyles />
            <PagesRoutes />
            <Menu />
        </AuthContextProvider>
    )
}

export default App;
