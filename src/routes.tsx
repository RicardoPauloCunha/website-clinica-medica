import { Routes, Route, Navigate, useLocation } from 'react-router-dom';

import { useAuth } from './contexts/auth';
import { userIsAuth } from './localStorages/auth';

import Layout from './components/Layout';

import Home from './pages/Home';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import RegisterService from './pages/RegisterService';
import EmployeeType, { getEnumEmployeeType } from './services/enums/employeeType';
import RegisterEmployee from './pages/RegisterEmployee';
import Employees from './pages/Employees';
import RegisterMaterial from './pages/RegisterMaterial';
import Materials from './pages/Materials';
import MaterialRecords from './pages/Records';
import EmployeeMenu from './components/Menu/employee';
import MaterialMenu from './components/Menu/material';
import ServiceMenu from './components/Menu/service';

type RequireAuthProps = {
    employeeType: EmployeeType;
    children: React.ReactNode;
}

const RequireAuth = ({ employeeType, children }: RequireAuthProps): JSX.Element => {
    let location = useLocation();

    let { userIsChecked, loggedUser } = useAuth();

    if ((loggedUser !== null && loggedUser.employeeType === getEnumEmployeeType(employeeType)) || (!userIsChecked && userIsAuth()))
        return <>{children}</>;

    return <Navigate
        to="/login"
        replace
        state={{
            from: location,
            message: "Você não tem autorização para acessar essa página."
        }}
    />;
}

const PagesRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route path="" element={<Home />} />
                <Route path="login" element={<Login />} />

                <Route path="servicos" element={<ServiceMenu />}>
                    <Route path="cadastrar" element={
                        <RequireAuth employeeType="admin" children={<RegisterService />} />
                    } />
                </Route>

                <Route path="funcionarios" element={<EmployeeMenu />}>
                    <Route path="listar" element={
                        <RequireAuth employeeType="admin" children={<Employees />} />
                    } />
                    <Route path="cadastrar" element={
                        <RequireAuth employeeType="admin" children={<RegisterEmployee />} />
                    } />
                    <Route path=":employeeId/editar" element={
                        <RequireAuth employeeType="admin" children={<RegisterEmployee />} />
                    } />

                    <Route path="medicos">
                        <Route path="cadastrar" element={
                            <RequireAuth employeeType="admin" children={<RegisterEmployee />} />
                        } />
                        <Route path=":doctorId/editar" element={
                            <RequireAuth employeeType="admin" children={<RegisterEmployee />} />
                        } />
                    </Route>
                </Route>

                <Route path="materiais" element={<MaterialMenu />}>
                    <Route path="listar" element={
                        <RequireAuth employeeType="stockist" children={<Materials />} />
                    } />
                    <Route path="cadastrar" element={
                        <RequireAuth employeeType="stockist" children={<RegisterMaterial />} />
                    } />
                    <Route path=":materialId/editar" element={
                        <RequireAuth employeeType="stockist" children={<RegisterMaterial />} />
                    } />
                    <Route path=":materialId/registros" element={
                        <RequireAuth employeeType="stockist" children={<MaterialRecords />} />
                    } />
                </Route>

                <Route path="*" element={<NotFound />} />
            </Route>
        </Routes>
    )
}

export default PagesRoutes;