import { useEffect, useState } from 'react';
import { NavLink as Link, useNavigate } from 'react-router-dom';
import { FaUser } from 'react-icons/fa';

import { useAuth } from '../../contexts/auth';
import { getLoggedUser, handlerLogout } from '../../localStorages/auth';
import EmployeeTypeEnum from '../../services/enums/employeeType';

import { Button, Collapse, NavLink, Nav, Navbar, NavbarBrand, NavbarToggler, NavItem } from 'reactstrap';
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
        defineLoggedUser(undefined);
        handlerLogout();
        navigate("/");
    }

    return (
        <>
            <Navbar
                color="primary"
                dark
                expand="md"
                fixed="top"
            >
                {loggedUser
                    ? <>
                        <NavbarBrand
                            to="/home"
                            tag={Link}
                        >
                            Clínica Médica
                        </NavbarBrand>

                        <NavbarToggler
                            onClick={() => toggleIsOpen()}
                        />
                    </>
                    : <NavbarBrand
                        to="/login"
                        tag={Link}
                    >
                        Clínica Médica
                    </NavbarBrand>
                }

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
                                    to="/clinica"
                                    tag={Link}
                                >
                                    Clínica
                                </NavLink>
                            </NavItem>

                            <NavItem>
                                <NavLink
                                    to="/servicos/listar"
                                    tag={Link}
                                >
                                    Serviços
                                </NavLink>
                            </NavItem>

                            <NavItem>
                                <NavLink
                                    to="/funcionarios/listar"
                                    tag={Link}
                                >
                                    Funcionários
                                </NavLink>
                            </NavItem>
                        </>}

                        {loggedUser?.employeeType === EmployeeTypeEnum.Receptionist && <>
                            <NavItem>
                                <NavLink
                                    to="/agendamentos/listar"
                                    tag={Link}
                                >
                                    Agendamentos
                                </NavLink>
                            </NavItem>

                            <NavItem>
                                <NavLink
                                    to="/notas-fiscais/listar"
                                    tag={Link}
                                >
                                    Notas fiscais
                                </NavLink>
                            </NavItem>
                        </>}

                        {loggedUser?.employeeType === EmployeeTypeEnum.Stockist && <>
                            <NavItem>
                                <NavLink
                                    to="/materiais/listar"
                                    tag={Link}
                                >
                                    Materiais
                                </NavLink>
                            </NavItem>
                        </>}

                        {loggedUser?.employeeType === EmployeeTypeEnum.Doctor && <>
                            <NavItem>
                                <NavLink
                                    to="/consultas/listar"
                                    tag={Link}
                                >
                                    Agendamentos
                                </NavLink>
                            </NavItem>
                        </>}
                    </Nav>

                    <NavbarProfile>
                        {loggedUser && <>
                            <div>
                                <span>
                                    <FaUser />
                                </span>
                                <span>
                                    {loggedUser.name}
                                </span>
                            </div>

                            <Button
                                color="secondary"
                                outline
                                onClick={() => logout()}
                            >
                                Sair
                            </Button>
                        </>}
                    </NavbarProfile>
                </Collapse>
            </Navbar>
        </>
    );
}

export default Menu;