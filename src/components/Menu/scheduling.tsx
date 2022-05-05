import { NavLink as Link, Outlet } from 'react-router-dom';

import { NavLink, NavItem, Nav } from 'reactstrap';

const SchedulingMenu = () => {
    return (
        <>
            <Nav
                tabs
                className="mb-4"
            >
                <NavItem>
                    <NavLink
                        to="/agendamentos/listar"
                        tag={Link}
                    >
                        Listar
                    </NavLink>
                </NavItem>

                <NavItem>
                    <NavLink
                        to="/agendamentos/cadastrar"
                        tag={Link}
                    >
                        Cadastrar
                    </NavLink>
                </NavItem>
            </Nav>

            <Outlet />
        </>
    );
}

export default SchedulingMenu;