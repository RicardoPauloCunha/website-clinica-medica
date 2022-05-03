import { NavLink as Link, Outlet } from 'react-router-dom';

import { NavLink, NavItem, Nav } from 'reactstrap';

const EmployeeMenu = () => {
    return (
        <>
            <Nav
            tabs
            className="mb-4"
            >
                <NavItem>
                    <NavLink
                        to="/funcionarios/listar"
                        tag={Link}
                    >
                        Lista
                    </NavLink>
                </NavItem>

                <NavItem>
                    <NavLink
                        to="/funcionarios/cadastrar"
                        tag={Link}
                    >
                        Cadastro
                    </NavLink>
                </NavItem>

                <NavItem>
                    <NavLink
                        to="/funcionarios/medicos/cadastrar"
                        tag={Link}
                    >
                        Médico
                    </NavLink>
                </NavItem>
            </Nav>

            <Outlet />
        </>
    );
}

export default EmployeeMenu;