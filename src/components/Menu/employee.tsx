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
                        Listar
                    </NavLink>
                </NavItem>

                <NavItem>
                    <NavLink
                        to="/funcionarios/cadastrar"
                        tag={Link}
                    >
                        Cadastrar
                    </NavLink>
                </NavItem>

                <NavItem>
                    <NavLink
                        to="/funcionarios/medicos/cadastrar"
                        tag={Link}
                    >
                        Cadastrar médico
                    </NavLink>
                </NavItem>
            </Nav>

            <Outlet />
        </>
    );
}

export default EmployeeMenu;