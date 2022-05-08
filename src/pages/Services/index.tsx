import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FormHandles } from "@unform/core";

import Servico from "../../services/entities/servico";
import Especialidade from "../../services/entities/especialidade";
import { listServiceByParamsHttp } from "../../services/http/service";
import { listSpecialtyHttp } from "../../services/http/specialty";
import { formatCurrency } from "../../util/formatCurrency";
import { WarningTuple } from "../../util/getHttpErrors";

import { Button } from "reactstrap";
import { ButtonGroupRow, Form, TextGroupGrid } from "../../styles/components";
import SelectInput from "../../components/Input/select";
import SpinnerBlock from "../../components/SpinnerBlock";
import Warning from "../../components/Warning";
import DataCard from "../../components/DataCard";
import DataText from "../../components/DataText";

const Services = () => {
    const navigate = useNavigate();
    const filterFormRef = useRef<FormHandles>(null);

    const [isLoading, setIsLoading] = useState<"get" | "">("");
    const [warning, setWarning] = useState<WarningTuple>(["", ""]);

    const [specialties, setSpecialties] = useState<Especialidade[]>([]);
    const [services, setServices] = useState<Servico[]>([]);

    useEffect(() => {
        getServices(null);
        getSpecialties();
        // eslint-disable-next-line
    }, []);

    const getServices = (specialtyId: number | null) => {
        setWarning(["", ""]);

        setIsLoading("get");
        listServiceByParamsHttp({
            especialidadeId: specialtyId
        }).then(response => {
            setServices([...response]);

            if (response.length === 0)
                setWarning(["warning", "Nenhum serviço foi encontrado."]);

            setIsLoading("");
        });
    }

    const getSpecialties = () => {
        listSpecialtyHttp().then(response => {
            setSpecialties([...response]);
        });
    }

    const handlerChangeSpecialtyId = (optionValue: string) => {
        let specialtyId = Number(optionValue);
        getServices(specialtyId);
    }

    const onClickEditData = (index: number) => {
        navigate("/servicos/" + services[index].idServico + "/editar");
    }

    return (
        <>
            <h1>Lista de serviços</h1>

            <Form
                ref={filterFormRef}
                onSubmit={() => { }}
                className="form-search"
            >
                <SelectInput
                    name='specialtyId'
                    label='Especialidade'
                    placeholder='Filtrar pela especialidade do serviço'
                    options={specialties.map(x => ({
                        value: x.idEspecialidade.toString(),
                        label: x.nomeEspecialidade
                    }))}
                    handlerChange={handlerChangeSpecialtyId}
                />

                <Warning value={warning} />
            </Form>

            {isLoading === "get" && <SpinnerBlock />}

            {services.map((x, index) => (
                <DataCard
                    key={x.idServico}
                    title={x.nomeServico}
                >
                    <TextGroupGrid>
                        <DataText
                            label="Valor"
                            value={formatCurrency(x.valor)}
                        />

                        <DataText
                            label="Especialidade"
                            value={x.especialidade?.nomeEspecialidade}
                        />

                        <DataText
                            label="Descrição"
                            value={x.descricaoServico}
                            isFullRow={true}
                        />
                    </TextGroupGrid>

                    <ButtonGroupRow>
                        <Button
                            color="warning"
                            onClick={() => onClickEditData(index)}
                        >
                            Editar
                        </Button>
                    </ButtonGroupRow>
                </DataCard>
            ))}
        </>
    );
}

export default Services;