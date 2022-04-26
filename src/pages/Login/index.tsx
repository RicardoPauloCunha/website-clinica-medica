import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FormHandles, SubmitHandler } from '@unform/core';
import * as Yup from 'yup';

import { useAuth } from '../../contexts/auth';
import { getLoggedUser, handlerSignIn } from '../../localStorages/auth';
import Funcionario from '../../services/entities/funcionario';
import { getEmployeeByIdHttp, postLoginEmployeeHttp, _listEmployee } from '../../services/http/employee';
import { WarningTuple } from '../../util/getHttpErrors';
import getValidationErrors from '../../util/getValidationErrors';

import { Button, Spinner } from 'reactstrap';
import { Form } from '../../styles/components';
import FieldInput from '../../components/Input';
import Warning from '../../components/Warning';

type LocationData = {
    from: Location;
    message: string;
}

type LoginFormData = {
    email: string;
    password: string;
}

const Login = () => {
    const loginFormRef = useRef<FormHandles>(null);
    const navigate = useNavigate();

    const { defineLoggedUser } = useAuth();

    const location = useLocation()?.state as LocationData;
    const from = location?.from?.pathname || "/";
    const message = location?.message || "";
    const selectedEmployee = _listEmployee[0];

    const [isLoading, setIsLoading] = useState<"form" | "">("");
    const [warning, setWarning] = useState<WarningTuple>(location?.message ? ["warning", message] : ["", ""]);

    useEffect(() => {
        getInitialValues();
        // eslint-disable-next-line
    }, []);

    const getInitialValues = async () => {
        let user = getLoggedUser();

        if (user !== null) {
            await getEmployeeByIdHttp(user.idEmployee).then(response => {
                if (response !== undefined)
                    handlerLogin(response);
            })
        }
    }

    const submitLoginForm: SubmitHandler<LoginFormData> = async (data, { reset }) => {
        try {
            setIsLoading("form");
            loginFormRef.current?.setErrors({});

            const shema = Yup.object().shape({
                email: Yup.string()
                    .trim()
                    .email("E-mail inválido.")
                    .required("Coloque o email da sua conta."),
                password: Yup.string()
                    .trim()
                    .required("Coloque a senha da sua conta.")
            });

            await shema.validate(data, {
                abortEarly: false
            });

            setTimeout(async () => {
                await postLoginEmployeeHttp({
                    email: data.email,
                    senha: data.password
                }).then(response => {
                    if (response === undefined) {
                        setWarning(["danger", "Email ou senha inválida."]);
                        return;
                    }

                    handlerLogin(response);
                    reset();
                }).catch(() => {
                    setWarning(["danger", "Email ou senha inválida."]);
                }).finally(() => { setIsLoading(""); });
            }, 1000);
        }
        catch (err) {
            if (err instanceof Yup.ValidationError)
                loginFormRef.current?.setErrors(getValidationErrors(err));
            setWarning(["warning", "Campos inválidos."]);
            setIsLoading("");
        }
    }

    const handlerLogin = (user: Funcionario) => {
        let dataToken = handlerSignIn({
            idEmployee: user.idFuncionario,
            name: user.nome,
            employeeType: user.tipoFuncionario
        });

        defineLoggedUser(dataToken);
        navigate(from, { replace: true });
    }

    return (
        <>
            <h1>Login</h1>

            <Form
                ref={loginFormRef}
                onSubmit={submitLoginForm}
                className="form-data"
                initialData={{
                    email: selectedEmployee.email,
                    password: selectedEmployee.senha
                }}
            >
                <FieldInput
                    name='email'
                    label='Email'
                    placeholder='Coloque seu email'
                    type="email"
                />

                <FieldInput
                    name='password'
                    label='Password'
                    placeholder='Coloque sua senha'
                    type="password"
                />

                <Button
                    type='submit'
                >
                    {isLoading === "form"
                        ? <Spinner size="sm" />
                        : "Entrar"
                    }
                </Button>

                <Warning
                    value={warning}
                />
            </Form>
        </>
    );
}

export default Login;