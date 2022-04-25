import Atendimento from "../entities/atendimento";

export const _listAttendance: Atendimento[] = [
    {
        idAtendimento: 1,
        data: "24/04/2022",
        observacoes: "Lorem Ipsum é simplesmente uma simulação de texto da indústria tipográfica e de impressos, e vem sendo utilizado desde o século XVI, quando um impressor desconhecido pegou uma bandeja de tipos e os embaralhou para fazer um livro de modelos de tipos.",
        diagnostico: "Lorem Ipsum sobreviveu não só a cinco séculos, como também ao salto para a editoração eletrônica, permanecendo essencialmente inalterado. Se popularizou na década de 60, quando a Letraset lançou decalques contendo passagens de Lorem Ipsum, e mais recentemente quando passou a ser integrado a softwares de editoração eletrônica como Aldus PageMaker."
    },
    {
        idAtendimento: 2,
        data: "24/04/2022",
        observacoes: "É um fato conhecido de todos que um leitor se distrairá com o conteúdo de texto legível de uma página quando estiver examinando sua diagramação.",
        diagnostico: ""
    }
];

export const getSchedulingByCpfHttp = async (cpf: string): Promise<Atendimento[]> => {
    return _listAttendance.filter(x => x.Agendamento?.paciente?.cpf === cpf);
}

export const postAttendanceHttp = async (requestData: Atendimento): Promise<void> => {
    requestData;
}