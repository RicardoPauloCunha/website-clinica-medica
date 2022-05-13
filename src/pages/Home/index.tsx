import { FaBoxes, FaCalendarDay, FaClipboard, FaFileInvoice, FaHospital, FaUsers } from 'react-icons/fa';

import { useAuth } from '../../contexts/auth';
import EmployeeTypeEnum from '../../services/enums/employeeType';

import ActivityBlock from '../../components/ActivityBlock';
import { HomeEl } from './styles';

const Home = () => {
    const { loggedUser } = useAuth();

    return (
        <HomeEl>
            <h1>Atividades</h1>

            <main>
                {loggedUser?.employeeType === EmployeeTypeEnum.Admin && <>
                    <ActivityBlock
                        title="Clínica Médica"
                        link="/clinica"
                        messages={[
                            "Faça o cadastro dos dados da clínica médica.",
                            "Visualize e atualize as informações da clínica médica."
                        ]}
                        icon={FaHospital}
                    />

                    <ActivityBlock
                        title="Serviços"
                        link="/servicos/listar"
                        messages={[
                            "Adicione novos serviços para os agendamentos.",
                            "Gerencie todos os serviços disponibilizados pela clínica médica."
                        ]}
                        icon={FaClipboard}
                    />

                    <ActivityBlock
                        title="Funcionários"
                        link="/funcionarios/listar"
                        messages={[
                            "Cadastre novos usuários para seus funcionários terem acesso ao sistema.",
                            "Gerencie todos os funcionários que utilizam o sistema da clínica médica."
                        ]}
                        icon={FaUsers}
                    />
                </>}

                {loggedUser?.employeeType === EmployeeTypeEnum.Receptionist && <>
                    <ActivityBlock
                        title="Agendamentos"
                        link="/agendamentos/listar"
                        messages={[
                            "Marque a consulta e/ou exame dos pacientes da clínica médica.",
                            "Visualize e gerencie todos os agendamentos cadastrados."
                        ]}
                        icon={FaCalendarDay}
                    />

                    <ActivityBlock
                        title="Notas fiscais"
                        link="/notas-fiscais/listar"
                        messages={[
                            "Visualize as notas fiscais dos pagamentos e ressarcimentos realizados."
                        ]}
                        icon={FaFileInvoice}
                    />
                </>}

                {loggedUser?.employeeType === EmployeeTypeEnum.Stockist && <>
                    <ActivityBlock
                        title="Materiais"
                        link="/materiais/listar"
                        messages={[
                            "Cadastre os materiais disponíveis na clínica médica.",
                            "Gerencie as informações dos materiais utilizados.",
                            "Registre a entrada/saída de materiais no estoque.",
                            "Visualize o histórico de entrada/saída de materiais.",
                        ]}
                        icon={FaBoxes}
                    />
                </>}

                {loggedUser?.employeeType === EmployeeTypeEnum.Doctor && <>
                    <ActivityBlock
                        title="Agendamentos"
                        link="/consultas/listar"
                        messages={[
                            "Visualize todas as suas consultas e exames agendamentos.",
                            "Registre as informações do atendimento ao paciente.",
                            "Entenda o caso do paciente através do histórico de atendimentos.",
                        ]}
                        icon={FaCalendarDay}
                    />
                </>}
            </main>
        </HomeEl>
    );
}

export default Home;