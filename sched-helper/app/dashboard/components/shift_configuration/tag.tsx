import React, { ChangeEvent, useEffect, useState, useContext } from 'react';
import styles from './tag.module.css';
import Image from 'next/image';
import { Modal, Button, Form, Row, Col, Tooltip, OverlayTrigger } from 'react-bootstrap';
import { TagProps } from './tags_definition';
import { Constraint } from '../../shift_config_def';
import { ShiftContext } from '../contexts/shfit_context';

export default function Tag({
    props,
    onAddingShiftConstraint,
    onRemovingShiftConstraint,
}: {
    props: TagProps;
    onAddingShiftConstraint: (constraint: Constraint) => void;
    onRemovingShiftConstraint: (constraint_name: string) => void;
}) {
    const { shiftConfig, shiftContent } = useContext(ShiftContext)

    const [added, setAdded] = useState(false);
    const [show, setShow] = useState(false);
    const [formValues, setFormValues] = useState<{ [name: string]: string }>({});

    const handleClick = () => {
        if (!added) {
            setShow(true);
        } else {
            onRemovingShiftConstraint(props.key);
            setAdded(false);
            setFormValues({});
        }
    };

    const handleClose = () => {
        setShow(false);
    };

    const handleAdd = () => {
        handleClose();
        onAddingShiftConstraint({ name: props.key, parameters: formValues });
        setAdded(true);
        // setFormValues({});
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormValues((prevFormValues) => ({
            ...prevFormValues,
            [name]: value,
        }));
    };

    useEffect(() => {
        if (shiftConfig.constraints) {
            const constraint = shiftConfig.constraints.find((constraint: Constraint) => constraint.name === props.key);
            if (constraint) {
                setAdded(true);
                setFormValues(constraint.parameters);
            }
        }
    }, [shiftConfig])

    const tooltipContent = Object.entries(formValues).length > 0 ? (
        <span>
            Parameters: <br />
            {
                Object.entries(formValues).map(([key, value], index) => (
                    key !== 'reserved_leave' ? (
                        <span key={index}>
                            {key}: {value}
                            <br />
                        </span>
                    ) : null
                ))
            }
        </span>
    ) : (
        <span>Click to set your parameters</span>
    );

    const tooltip = <Tooltip id={`tooltip-${props.text}`}>{tooltipContent}</Tooltip>;
    return (
        <>
            <OverlayTrigger placement="top" delay={{ show: 250, hide: 150 }} overlay={tooltip}>
                {added ? (
                    <div className={`${styles.tag} ${styles.tag_chosen}`} onClick={handleClick}>
                        <span className={styles.text}>{props.text}</span>
                        <button className={styles.button}>
                            <>&#x2715;</>
                        </button>
                    </div>
                ) : (
                    <div className={styles.tag} onClick={handleClick}>
                        <span className={styles.text}>{props.text}</span>
                        <button className={styles.button}>
                            <Image src="/add.svg" width={10} height={10} alt="add" />
                        </button>
                    </div>
                )}
            </OverlayTrigger>

            <Modal show={show} size="lg" onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{props.text}</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <p>{props.description}</p>
                    <Form>
                        {props.parameters.map((parameter, index) => (
                            <Form.Group as={Row} className="mb-3" controlId={`form${index}`} key={index}>
                                <Form.Label column sm="6">
                                    {parameter.parameter_name}
                                </Form.Label>
                                <Col sm="6">
                                    <Form.Control
                                        type="number"
                                        name={parameter.parameter_alias}
                                        onChange={handleInputChange}
                                    />
                                </Col>
                            </Form.Group>
                        ))}
                        <Form.Group as={Row} className="mb-3" controlId={`form${props.parameters.length}`}>
                            <Form.Label column sm="6">
                                Weight
                            </Form.Label>
                            <Col sm="6">
                                <Form.Control type="number" name="weight" onChange={handleInputChange} />
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
