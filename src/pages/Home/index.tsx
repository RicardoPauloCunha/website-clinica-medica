import { useState } from "react";

import { Alert, Button, Col, ModalBody, ModalFooter, ModalHeader, Row } from "reactstrap";
import { DataModal, TextGroupGrid, Form, ButtonGroupRow } from "../../styles/components";
import DataCard from "../../components/DataCard";
import DataText from "../../components/DataText";
import FieldInput from "../../components/Input";
import SelectInput from "../../components/Input/select";

type ModalString = "" | "default";

const Home = () => {
    const [modal, setModal] = useState<ModalString>("");

    const toggleModal = (modalName?: ModalString) => {
        setModal(modalName !== undefined ? modalName : "");
    }

    return (
        <>
            <h1>Title h1</h1>
            <h2>Title h2</h2>
            <h3>Title h3</h3>

            <p>Lorem Ipsum é simplesmente uma simulação de texto da indústria tipográfica e de impressos, e vem sendo utilizado desde o século XVI, quando um impressor desconhecido pegou uma bandeja de tipos e os embaralhou para fazer um livro de modelos de tipos. Lorem Ipsum sobreviveu não só a cinco séculos, como também ao salto para a editoração eletrônica, permanecendo essencialmente inalterado.</p>

            <b>Lorem Ipsum é simplesmente uma simulação de texto</b>

            <Form
                ref={null}
                onSubmit={() => { }}
                className="form-data"
            >
                <FieldInput
                    name="field"
                    label="Input Field"
                />

                <Row>
                    <Col md={6}>
                        <FieldInput
                            name="fieldGroup1"
                            label="Input Group 1"
                        />
                    </Col>

                    <Col md={6}>
                        <FieldInput
                            name="fieldGroup2"
                            label="Input Group 2"
                        />
                    </Col>
                </Row>

                <SelectInput
                    name="field"
                    label="Input Field"
                    placeholder="Selecione uma opção"
                    options={[
                        { label: "Option 1", value: "1" },
                        { label: "Option 2", value: "2" }
                    ]}
                />

                <Button
                    color="secondary"
                >
                    Confirm
                </Button>
            </Form>

            <h2>Title h2</h2>

            <Form
                ref={null}
                onSubmit={() => { }}
                className="form-data"
            >
                <FieldInput
                    name="field"
                    label="Input Field"
                />

                <FieldInput
                    name="field"
                    label="Input Field"
                />

                <Button
                    color="secondary"
                >
                    Confirm
                </Button>
            </Form>

            <Alert
                color="danger"
            >
                Alert danger
            </Alert>

            <Alert
                color="success"
            >
                Alert success
            </Alert>

            <Alert
                color="warning"
            >
                Alert warning
            </Alert>

            <h2>Title h2</h2>

            <DataCard
                title="Title"
            >
                <TextGroupGrid>
                    <DataText
                        label="Field 1"
                        value="value 1"
                    />

                    <DataText
                        label="Field 2"
                        value="value 2"
                    />

                    <DataText
                        label="Field 3"
                        value="value 3"
                    />

                    <DataText
                        label="Field 4"
                        value="value 4"
                    />

                    <DataText
                        label="Field 5"
                        value="value 5"
                    />
                </TextGroupGrid>

                <ButtonGroupRow>
                    <Button
                        color="primary"
                        onClick={() => toggleModal("default")}
                    >
                        Open
                    </Button>

                    <Button
                        color="primary"
                    >
                        Edit
                    </Button>
                </ButtonGroupRow>
            </DataCard>

            <h2>Title h2</h2>

            <Form
                ref={null}
                onSubmit={() => { }}
                className="form-search"
            >
                <FieldInput
                    name="field"
                    label="Input Field"
                />

                <ButtonGroupRow>
                    <Button
                        color="secondary"
                    >
                        Search
                    </Button>
                </ButtonGroupRow>
            </Form>

            <DataCard
                title="Title"
            >
                <TextGroupGrid>
                    <DataText
                        label="Field 1"
                        value="value 1"
                    />

                    <DataText
                        label="Field 2"
                        value="value 2"
                    />

                    <DataText
                        label="Field 3"
                        value="value 3"
                    />

                    <DataText
                        label="Field 4"
                        value="value 4"
                    />

                    <DataText
                        label="Field 5"
                        value="value 5"
                        isFullRow={true}
                    />
                </TextGroupGrid>

                <ButtonGroupRow>
                    <Button
                        color="primary"
                        onClick={() => toggleModal("default")}
                    >
                        Open
                    </Button>

                    <Button
                        color="primary"
                    >
                        Edit
                    </Button>
                </ButtonGroupRow>
            </DataCard>

            <DataModal
                isOpen={modal === "default"}
                toggle={toggleModal}
                centered
            >
                <ModalHeader
                    toggle={() => toggleModal()}
                >
                    Modal title
                </ModalHeader>
                <ModalBody>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

                    <Form
                        ref={null}
                        onSubmit={() => { }}
                        className="form-modal"
                    >
                        <FieldInput
                            name="field"
                            label="Input Field"
                        />

                        <FieldInput
                            name="field"
                            label="Input Field"
                        />
                    </Form>

                    <TextGroupGrid
                        className="text-group-grid-modal"
                    >
                        <DataText
                            label="Field 1"
                            value="value 1"
                        />

                        <DataText
                            label="Field 2"
                            value="value 2"
                        />

                        <DataText
                            label="Field 3"
                            value="value 3"
                        />
                    </TextGroupGrid>

                    <h5>Data</h5>

                    <TextGroupGrid
                        className="text-group-grid-modal"
                    >
                        <DataText
                            label="Field 1"
                            value="value 1"
                        />

                        <DataText
                            label="Field 2"
                            value="value 2"
                        />

                        <DataText
                            label="Field 3"
                            value="value 3"
                        />
                    </TextGroupGrid>
                </ModalBody>
                <ModalFooter>
                    <Button
                        color="secondary"
                    >
                        Confirmar
                    </Button>
                    <Button
                        color="dark"
                        outline
                        onClick={() => toggleModal()}
                    >
                        Cancelar
                    </Button>
                </ModalFooter>
            </DataModal>
        </>
    );
}

export default Home;