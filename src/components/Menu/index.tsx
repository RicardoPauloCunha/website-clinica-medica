import { useEffect, useState } from 'react';
import { NavLink as Link, useNavigate } from 'react-router-dom';

import { useAuth } from '../../contexts/auth';
import { getLoggedUser, handlerLogout } from '../../localStorages/auth';
import EmployeeTypeEnum, { } from '../../services/enums/employeeType';

import { Button, Collapse, NavLink, Nav, Navbar, NavbarBrand, NavbarText, NavbarToggler, NavItem } from 'reactstrap';
import { NavbarProfile } from './styles';

const Menu = () => {
    const navigate = useNavigate();
    const { loggedUser, defineLoggedUser } = useAuth();

    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        defineLoggedUser(getLoggedUser());
        // eslint-disable-next-line
    }, []);

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
                        {loggedUser?.employeeType === EmployeeTypeEnum.Admin && <>
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

                        {loggedUser?.employeeType === EmployeeTypeEnum.Receptionist && <>
                            <NavItem>
                                <NavLink
                                    to="/agendamentos"
                                    tag={Link}
                                >
                                    Agendamentos
                                </NavLink>
                            </NavItem>

                            <NavItem>
                                <NavLink
                                    to="/pagamentos"
                                    tag={Link}
                                >
                                    Pagamentos
                                </NavLink>
                            </NavItem>
                        </>}

                        {loggedUser?.employeeType === EmployeeTypeEnum.Stockist && <>
                            <NavItem>
                                <NavLink
                                    to="/materiais"
                                    tag={Link}
                                >
                                    Materiais
                                </NavLink>
                            </NavItem>
                        </>}

                        {loggedUser?.employeeType === EmployeeTypeEnum.Doctor && <>
                            <NavItem>
                                <NavLink
                                    to="/consultas"
                                    tag={Link}
                                >
                                    Agendamentos médicos
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