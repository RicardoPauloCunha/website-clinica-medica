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
                        to="/pagamentos/notas-fiscais"
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