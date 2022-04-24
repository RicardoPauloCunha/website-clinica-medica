import PagesRoutes from './routes';
import GlobalStyles from './styles/global';
import { AuthContextProvider } from './contexts/auth';
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
