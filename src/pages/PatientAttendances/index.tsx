import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Atendimento from "../../services/entities/atendimento";
import { listAttendanceByCpfHttp } from "../../services/http/attendance";
import { WarningTuple } from "../../util/getHttpErrors";

import SpinnerBlock from "../../components/SpinnerBlock";
import Warning from "../../components/Warning";
import PatientCollapseCard from "../../components/CollapseCard/patient";
import AttendanceCard from "../../components/DataCard/attendance";

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

        if (routeParams.patientCpf) {
            setIsLoading("get");
            listAttendanceByCpfHttp(routeParams.patientCpf).then(response => {
                setAttendances([...response]);

                if (response.length === 0)
                    setWarning(["warning", "Nenhum atendimento do paciente foi encontrado."]);

                setIsLoading("");
            });
        }
        else {
            setWarning(["danger", "Paciente inválido."]);
            return;
        }
    }

    return (
        <>
            <h1>Histórico de atendimentos do paciente</h1>

            {isLoading === "get" && <SpinnerBlock />}

            <Warning value={warning} />

            {attendances[0] !== undefined && <PatientCollapseCard
                cpf={attendances[0].agendamento.paciente.cpf}
                name={attendances[0].agendamento.paciente.nome}
                contact={attendances[0].agendamento.paciente.contato}
                address={attendances[0].agendamento.paciente.endereco}
            />}

            {attendances.map(x => (
                <AttendanceCard
                    key={x.idAtendimento}
                    id={x.idAtendimento}
                    date={x.data}
                    serviceName={x.agendamento.servico.nomeServico}
                    doctorName={x.agendamento.medico.nomeFuncionario}
                    comments={x.observacoes}
                    diagnosis={x.diagnostico}
                />
            ))}
        </>
    );
}

export default PatientAttendances;