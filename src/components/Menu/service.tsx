import { NavLink as Link, Outlet } from 'react-router-dom';

import { NavLink, NavItem, Nav } from 'reactstrap';

const ServiceMenu = () => {
    return (
        <>
            <Nav
                tabs
                className="mb-4"
            >
                <NavItem>
                    <NavLink
                        to="/servicos/cadastrar"
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

export default ServiceMenu;