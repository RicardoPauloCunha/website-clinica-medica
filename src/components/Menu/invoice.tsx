import { NavLink as Link, Outlet } from 'react-router-dom';

import { NavLink, NavItem, Nav } from 'reactstrap';

const PaymentMenu = () => {
    return (
        <>
            <Nav
                tabs
                className="mb-4"
            >
                <NavItem>
                    <NavLink
                        to="/notas-fiscais/listar"
                        tag={Link}
                    >
                        Notas fiscais
                    </NavLink>
                </NavItem>
            </Nav>

            <Outlet />
        </>
    );
}

export default PaymentMenu;