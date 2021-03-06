import { NavLink as Link, Outlet } from 'react-router-dom';

import { NavLink, NavItem, Nav } from 'reactstrap';

const MaterialMenu = () => {
    return (
        <>
            <Nav
                tabs
                className="mb-4"
            >
                <NavItem>
                    <NavLink
                        to="/materiais/listar"
                        tag={Link}
                    >
                        Listar
                    </NavLink>
                </NavItem>

                <NavItem>
                    <NavLink
                        to="/materiais/cadastrar"
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

export default MaterialMenu;