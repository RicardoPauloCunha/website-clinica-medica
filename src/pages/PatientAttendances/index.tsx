import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Atendimento from "../../services/entities/atendimento";
import { WarningTuple } from "../../util/getHttpErrors";

import { TextGroupGrid } from "../../styles/components";
import SpinnerBlock from "../../components/SpinnerBlock";
import Warning from "../../components/Warning";
import DataCard from "../../components/DataCard";
import DataText from "../../components/DataText";
import { getSchedulingByCpfHttp } from "../../services/http/attendance";
import { hasValueString } from "../../util/stringFormat";

const PatientAttendances = () => {
    const routeParams = useParams();

    const [isLoading, setIsLoading] = useState<"get" | "">("");
    const [warning, setWarning] = useState<WarningTuple>(["", ""]);

    const [attendances, setAttendances] = useState<Atendimento[]>([]);

    useEffect(() => {
        getAttendances();
        // eslint-disable-next-line
    }, []);

    const getAttendances = () => {
        setWarning(["", ""]);

        let cpf = routeParams.patientCpf;

        if (cpf === undefined || !hasValueString(routeParams.patientCpf)) {
            setWarning(["danger", "Paciente inválido."]);
            return;
        }

        setIsLoading("get");
        getSchedulingByCpfHttp(cpf).then(response => {
            setAttendances([...response]);

            if (response.length === 0)
                setWarning(["warning", "Nenhum atendimento do paciente foi encontrado."]);

            setIsLoading("");
        });
    }

    return (
        <>
            <h1>Histórico de atendimentos do paciente</h1>

            {isLoading === "get" && <SpinnerBlock />}

            <Warning value={warning} />

            {attendances[0] !== undefined && <DataCard
                title="Paciente"
                subtitle={attendances[0].agendamento?.paciente?.nome as string}
            />}

            {attendances.map(x => (
                <DataCard
                    key={x.idAtendimento}
                    title="Dados do atendimento"
                >
                    <TextGroupGrid>
                        <DataText
                            label="Observações"
                            value={x.observacoes}
                            isFullRow={true}
                        />
                        <DataText
                            label="Diagnóstico"
                            value={x.diagnostico}
                            isFullRow={true}
                        />
                    </TextGroupGrid>

                    <h5 className="mt-3">Dados da consulta</h5>
                    <TextGroupGrid>

                        <DataText
                            label="Serviço"
                            value={x.agendamento?.servico?.nomeServico as string}
                        />

                        <DataText
                            label="Data agendamento"
                            value={new Date(x.agendamento?.dataAgendada + "T" + x.agendamento?.horaAgendada).toLocaleString()}
                        />

                        <DataText
                            label="Médico"
                            value={x.agendamento?.medico?.nomeFuncionario as string}
                        />

                        <DataText
                            label="Especialidade"
                            value={x.agendamento?.medico?.especialidade?.nomeEspecialidade as string}
                        />
                    </TextGroupGrid>
                </DataCard>
            ))}
        </>
    );
}

export default PatientAttendances;