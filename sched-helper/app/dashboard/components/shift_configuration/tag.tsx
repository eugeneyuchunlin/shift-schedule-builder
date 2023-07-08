import React, { ChangeEvent, useState } from 'react';
import styles from './tag.module.css';
import Image from 'next/image';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { TagProps } from './tags_definition';
import { Constraint } from '../../shift_config_def';

export default function Tag({
    props,
    plus,
    action,
    onAddingShiftConstraint,
}: {
    props: TagProps;
    plus: boolean;
    action: () => void;
    onAddingShiftConstraint: (constraint: Constraint) => void;
}) {
    const [show, setShow] = useState(false);
    const [formValues, setFormValues] = useState({});

    const handleClick = () => {
        if (plus) {
            setShow(true);
        } else {
            action();
        }
    };

    const handleClose = () => {
        setShow(false);
    };

    const handleAdd = () => {
        handleClose();
        action();
        const parameters = Object.entries(formValues).map(([key, value]) => ({
            parameter_name: key,
            parameter_value: Number(value),
        }));
        onAddingShiftConstraint({ name: props.key, parameters: parameters });
        setFormValues({})
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormValues((prevFormValues) => ({
            ...prevFormValues,
            [name]: value,
        }));
    };

    return (
        <>
            <div className={styles.tag} onClick={handleClick}>
                <span onClick={() => { console.log("click") }} className={styles.text}>{props.text}</span>
                <button className={styles.button}>
                    {plus ? <Image src="/add.svg" width={10} height={10} alt="add" /> : <>&#x2715;</>}
                </button>
            </div>

            <Modal show={show} size="lg" onHide={() => setShow(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{props.text}</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <p>{props.description}</p>
                    <Form>
                        {props.parameters.map((parameter, index) => (
                            <Form.Group as={Row} className="mb-3" controlId={`form${index}`} key={index}>
                                <Form.Label column sm="6">{parameter.parameter_name}</Form.Label>
                                <Col sm="6">
                                    <Form.Control
                                        type="text"
                                        name={parameter.parameter_name}
                                        onChange={handleInputChange}
                                    />
                                </Col>
                            </Form.Group>
                        ))}
                        <Form.Group as={Row} className="mb-3" controlId={`form${props.parameters.length}`}>
                            <Form.Label column sm="6">Weight</Form.Label>
                            <Col sm="6">
                                <Form.Control
                                    type="text"
                                    name="weight"
                                    onChange={handleInputChange}
                                />
                            </Col>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleAdd}>
                        Add
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
