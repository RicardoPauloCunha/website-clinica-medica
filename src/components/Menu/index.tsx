import { useEffect, useState } from 'react';
import { NavLink as Link, useNavigate } from 'react-router-dom';

import { useAuth } from '../../contexts/auth';
import { getLoggedUser, handlerLogout } from '../../localStorages/auth';

import { Button, Collapse, NavLink, Nav, Navbar, NavbarBrand, NavbarText, NavbarToggler, NavItem } from 'reactstrap';
import { NavbarProfile } from './styles';
import { getValueEmployeeType } from '../../services/enums/employeeType';

const Menu = () => {
    const navigate = useNavigate();
    const { loggedUser, defineLoggedUser } = useAuth();

    const ADMIN_TYPE = getValueEmployeeType("admin");
    const RECEPTIONIST_TYPE = getValueEmployeeType("receptionist");
    const STOCKIST_TYPE = getValueEmployeeType("stockist");

    const [isOpen, setIsOpen] = useState(false);
    const [employeeType, setEmployeeType] = useState("");

    useEffect(() => {
        defineLoggedUser(getLoggedUser());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (loggedUser !== null)
            setEmployeeType(getValueEmployeeType(undefined, loggedUser.employeeType));
        else
            setEmployeeType("");
    }, [loggedUser]);

    const toggleIsOpen = () => {
        setIsOpen(!isOpen);
    }

    const logout = () => {
        defineLoggedUser(null);
        handlerLogout();
        navigate("/");
    }

    return (
        <div>
            <Navbar
                color="primary"
                dark
                expand="md"
                fixed="top"
            >
                <NavbarBrand
                    to="/"
                    tag={Link}
                >
                    Clínica Médica
                </NavbarBrand>

                <NavbarToggler
                    onClick={() => toggleIsOpen()}
                />

                <Collapse
                    navbar
                    isOpen={isOpen}
                >
                    <Nav
                        className="me-auto"
                        navbar
                    >
                        {employeeType === ADMIN_TYPE && <>
                            <NavItem>
                                <NavLink
                                    to="/servicos"
                                    tag={Link}
                                >
                                    Serviços
                                </NavLink>
                            </NavItem>

                            <NavItem>
                                <NavLink
                                    to="/funcionarios"
                                    tag={Link}
                                >
                                    Funcionários
                                </NavLink>
                            </NavItem>
                        </>}

                        {employeeType === RECEPTIONIST_TYPE && <>
                            <NavItem>
                                <NavLink
                                    to="/agendamentos"
                                    tag={Link}
                                >
                                    Agendamentos
                                </NavLink>
                            </NavItem>
                        </>}

                        {employeeType === STOCKIST_TYPE && <>
                            <NavItem>
                                <NavLink
                                    to="/materiais"
                                    tag={Link}
                                >
                                    Materiais
                                </NavLink>
                            </NavItem>
                        </>}
                    </Nav>

                    <NavbarProfile>
                        {loggedUser
                            ? <>
                                <NavbarText>
                                    {loggedUser.name}
                                </NavbarText>

                                <Button
                                    onClick={() => logout()}
                                >
                                    Sair
                                </Button>
                            </>
                            : <Button
                                onClick={() => navigate("/login")}
                            >
                                Login
                            </Button>
                        }
                    </NavbarProfile>
                </Collapse>
            </Navbar>
        </div>
    );
}

export default Menu;