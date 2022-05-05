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

import { Form } from '../../styles/components';
import FieldInput from '../../components/Input';
import Warning from '../../components/Warning';
import LoadingButton from '../../components/LoadingButton';

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

    const _itemEmployee = _listEmployee[3];

    const location = useLocation()?.state as LocationData;
    const from = location?.from?.pathname || "/";
    const message = location?.message || "";

    const [isLoading, setIsLoading] = useState<"form" | "">("");
    const [warning, setWarning] = useState<WarningTuple>(location?.message ? ["warning", message] : ["", ""]);

    useEffect(() => {
        getEmployee();
        // eslint-disable-next-line
    }, []);

    const getEmployee = async () => {
        let user = getLoggedUser();

        if (user !== null) {
            await getEmployeeByIdHttp(user.employeeId).then(response => {
                handlerLogin(response);
            });
        }
    }

    const submitLoginForm: SubmitHandler<LoginFormData> = async (data, { reset }) => {
        try {
            setIsLoading("form");
            setWarning(["", ""]);
            loginFormRef.current?.setErrors({});

            const shema = Yup.object().shape({
                email: Yup.string().trim()
                    .email("E-mail inválido.")
                    .required("Coloque o email da sua conta."),
                password: Yup.string().trim()
                    .required("Coloque a senha da sua conta.")
            });

            await shema.validate(data, {
                abortEarly: false
            });

            await postLoginEmployeeHttp({
                email: data.email,
                senha: data.password
            }).then(response => {
                handlerLogin(response);
            }).catch(() => {
                setWarning(["danger", "Email ou senha inválida."]);
            }).finally(() => { setIsLoading(""); });
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
            employeeId: user.idFuncionario,
            name: user.nomeFuncionario,
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
                    email: _itemEmployee.email,
                    password: _itemEmployee.senha
                }}
            >
                <FieldInput
                    name='email'
                    label='E-mail'
                    placeholder='Coloque seu email'
                    type="email"
                />

                <FieldInput
                    name='password'
                    label='Senha'
                    placeholder='Coloque sua senha'
                    type="password"
                />

                <LoadingButton
                    text="Entrar"
                    isLoading={isLoading === "form"}
                    type="submit"
                />

                <Warning value={warning} />
            </Form>
        </>
    );
}

export default Login;