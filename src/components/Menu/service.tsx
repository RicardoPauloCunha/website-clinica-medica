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
                        to="/servicos/listar"
                        tag={Link}
                    >
                        Listar
                    </NavLink>
                </NavItem>

                <NavItem>
                    <NavLink
                        to="/servicos/cadastrar"
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

export default ServiceMenu;