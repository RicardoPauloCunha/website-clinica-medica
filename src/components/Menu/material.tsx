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
                        Lista
                    </NavLink>
                </NavItem>

                <NavItem>
                    <NavLink
                        to="/materiais/cadastrar"
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

export default MaterialMenu;