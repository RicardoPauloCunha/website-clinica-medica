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
                        to="/agendamentos/cadastrar"
                        tag={Link}
                    >
                        Cadastro
                    </NavLink>
                </NavItem>
            </Nav>

            <Outlet />
        </>
    );
}

export default SchedulingMenu;