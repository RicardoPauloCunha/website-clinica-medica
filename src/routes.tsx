import { Routes, Route, Navigate, useLocation } from 'react-router-dom';

import { useAuth } from './contexts/auth';
import { userIsAuth } from './localStorages/auth';
import EmployeeTypeEnum from './services/enums/employeeType';

import Layout from './components/Layout';
import MaterialMenu from './components/Menu/material';
import ServiceMenu from './components/Menu/service';
import SchedulingMenu from './components/Menu/scheduling';
import EmployeeMenu from './components/Menu/employee';

import Home from './pages/Home';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import RegisterService from './pages/RegisterService';
import RegisterEmployee from './pages/RegisterEmployee';
import Employees from './pages/Employees';
import RegisterMaterial from './pages/RegisterMaterial';
import Materials from './pages/Materials';
import MaterialRecords from './pages/Records';
import RegisterScheduling from './pages/RegisterScheduling';
import Schedules from './pages/Schedules';
import ConfirmPayment from './pages/ConfirmPayment';
import RefundPayment from './pages/RefundPayment';
import DoctorSchedulesMenu from './components/Menu/doctorSchedules';
import DoctorSchedules from './pages/DoctorSchedules';

type RequireAuthProps = {
    employeeType: EmployeeTypeEnum;
    children: React.ReactNode;
}

const RequireAuth = ({ employeeType, children }: RequireAuthProps): JSX.Element => {
    let location = useLocation();

    let { userIsChecked, loggedUser } = useAuth();

    if (loggedUser?.employeeType === employeeType || (!userIsChecked && userIsAuth()))
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
                        <RequireAuth employeeType={EmployeeTypeEnum.Admin} children={<RegisterService />} />
                    } />
                </Route>

                <Route path="funcionarios" element={<EmployeeMenu />}>
                    <Route path="listar" element={
                        <RequireAuth employeeType={EmployeeTypeEnum.Admin} children={<Employees />} />
                    } />
                    <Route path="cadastrar" element={
                        <RequireAuth employeeType={EmployeeTypeEnum.Admin} children={<RegisterEmployee />} />
                    } />
                    <Route path=":employeeId/editar" element={
                        <RequireAuth employeeType={EmployeeTypeEnum.Admin} children={<RegisterEmployee />} />
                    } />

                    <Route path="medicos">
                        <Route path="cadastrar" element={
                            <RequireAuth employeeType={EmployeeTypeEnum.Admin} children={<RegisterEmployee />} />
                        } />
                        <Route path=":doctorId/editar" element={
                            <RequireAuth employeeType={EmployeeTypeEnum.Admin} children={<RegisterEmployee />} />
                        } />
                    </Route>
                </Route>

                <Route path="materiais" element={<MaterialMenu />}>
                    <Route path="listar" element={
                        <RequireAuth employeeType={EmployeeTypeEnum.Stockist} children={<Materials />} />
                    } />
                    <Route path="cadastrar" element={
                        <RequireAuth employeeType={EmployeeTypeEnum.Stockist} children={<RegisterMaterial />} />
                    } />
                    <Route path=":materialId/editar" element={
                        <RequireAuth employeeType={EmployeeTypeEnum.Stockist} children={<RegisterMaterial />} />
                    } />
                    <Route path=":materialId/registros" element={
                        <RequireAuth employeeType={EmployeeTypeEnum.Stockist} children={<MaterialRecords />} />
                    } />
                </Route>

                <Route path="agendamentos" element={<SchedulingMenu />}>
                    <Route path="listar" element={
                        <RequireAuth employeeType={EmployeeTypeEnum.Receptionist} children={<Schedules />} />
                    } />
                    <Route path="cadastrar" element={
                        <RequireAuth employeeType={EmployeeTypeEnum.Receptionist} children={<RegisterScheduling />} />
                    } />
                    <Route path=":schedulingId/confirmar-pagamento" element={
                        <RequireAuth employeeType={EmployeeTypeEnum.Receptionist} children={<ConfirmPayment />} />
                    } />
                </Route>

                <Route path="consultas" element={<DoctorSchedulesMenu />}>
                    <Route path="listar" element={
                        <RequireAuth employeeType={EmployeeTypeEnum.Doctor} children={<DoctorSchedules />} />
                    } />
                </Route>

                <Route path="pagamentos" element={<SchedulingMenu />}>
                    <Route path=":paymentId/ressarcir" element={
                        <RequireAuth employeeType={EmployeeTypeEnum.Receptionist} children={<RefundPayment />} />
                    } />
                </Route>

                <Route path="*" element={<NotFound />} />
            </Route>
        </Routes>
    )
}

export default PagesRoutes;