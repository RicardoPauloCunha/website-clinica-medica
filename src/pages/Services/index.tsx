import { useEffect, useRef, useState } from "react";
import { FormHandles } from "@unform/core";

import Servico from "../../services/entities/servico";
import Especialidade from "../../services/entities/especialidade";
import { listServiceByParamsHttp } from "../../services/http/service";
import { listSpecialtyHttp } from "../../services/http/specialty";
import { WarningTuple } from "../../util/getHttpErrors";

import { Form } from "../../styles/components";
import SelectInput from "../../components/Input/select";
import SpinnerBlock from "../../components/SpinnerBlock";
import Warning from "../../components/Warning";
import ServiceCard from "../../components/DataCard/service";
import DocumentTitle from "../../util/documentTitle";

const Services = () => {
    const filterFormRef = useRef<FormHandles>(null);

    const [isLoading, setIsLoading] = useState<"get" | "">("");
    const [warning, setWarning] = useState<WarningTuple>(["", ""]);

    const [specialties, setSpecialties] = useState<Especialidade[]>([]);
    const [services, setServices] = useState<Servico[]>([]);

    useEffect(() => {
        getServices(undefined);
        getSpecialties();
        // eslint-disable-next-line
    }, []);

    const getServices = (specialtyId: number | undefined) => {
        setWarning(["", ""]);

        setIsLoading("get");
        listServiceByParamsHttp({
            id: specialtyId
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

    DocumentTitle("Serviços | CM");

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

            {services.map(x => (
                <ServiceCard
                    key={x.idServico}
                    id={x.idServico}
                    name={x.nomeServico}
                    price={x.valor}
                    description={x.descricaoServico}
                    specialtyName={x.especialidade.nomeEspecialidade}
                />
            ))}
        </>
    );
}

export default Services;