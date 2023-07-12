'use client'
import { Container, Row, Col, Form, FloatingLabel, InputGroup, Button } from 'react-bootstrap'
import styles from './shift_configuration.module.css'
import TagBox from './tagbox'
import { ChangeEvent, useEffect, useState, useContext } from 'react'
import { Constraint } from '../../shift_config_def'
import { ShiftContext } from '../contexts/shfit_context'

import Score from '../score/score'
import { set } from 'zod'

export default function ShiftConfiguration(
    { onShiftConfigChange, onAddingShiftConstraint, onRemovingConstraint }:
        {
            onShiftConfigChange: (config: {}) => void,
            onAddingShiftConstraint: (constraint: Constraint) => void,
            onRemovingConstraint: (constraint_name: string) => void
        }
) {

    // const [ reset, setReset ] = useState(false)
    const { shiftConfig, shiftContent } = useContext(ShiftContext)
    const [days, setDays] = useState(0)
    const [number_of_workers, setNumberOfWorkers] = useState(0)
    const [computation_time, setComputationTime] = useState(0)

    const handleDaysChange = (e: ChangeEvent<HTMLInputElement>) => {
        setDays(Number(e.target.value))
        onShiftConfigChange({ days: Number(e.target.value) })
    }

    const handleNoWChange = (e: ChangeEvent<HTMLInputElement>) => {
        setNumberOfWorkers(Number(e.target.value))
        onShiftConfigChange({ number_of_workers: Number(e.target.value) })
    }

    const handleComputationTimeChange = (e: ChangeEvent<HTMLInputElement>) => {
        setComputationTime(Number(e.target.value))
        onShiftConfigChange({ computation_time: Number(e.target.value) })
    }

    useEffect(() => {
        if (shiftConfig) {
            // console.log("shift config is ready")
            setDays(shiftConfig.days);
            setNumberOfWorkers(shiftConfig.number_of_workers);
            setComputationTime(shiftConfig.computation_time);
            // console.log(shiftConfig)
        }
    }, [shiftConfig]);


    return (
        <>
            <Container>
                <Row>
                    <div className={styles.section}>
                        <Row className={`${styles.rows} ${styles.divider}`}>
                            <h6>Score</h6>
                        </Row>
                        <Row className={styles.rows}>
                            <Score shift_id='9c87a528-44f8-439e-aea3-c4c68dda2bdc' index={0} />
                        </Row>
                    </div>
                </Row>
                <Form className={styles.form} as={Row}>
                    <div className={styles.section}>
                        <Row className={`${styles.rows} ${styles.divider}`}>
                            {/* <Divider text='Shift Configuration' /> */}
                            <h6>Shift Configuration</h6>
                        </Row>
                        <Row className={styles.rows}>
                            <Col sm={4}>
                                <FloatingLabel controlId="floatingInputGrid" label="Days">
                                    <Form.Control
                                        type="number"
                                        placeholder="Days"
                                        value={days}
                                        onChange={handleDaysChange}
                                    />
                                </FloatingLabel>
                            </Col>
                            <Col>
                                <FloatingLabel controlId="floatingInputGrid" label="Number of workers">
                                    <Form.Control
                                        type="number"
                                        placeholder='Number of workers'
                                        value={number_of_workers}
                                        onChange={handleNoWChange}
                                    />
                                </FloatingLabel>
                            </Col>
                        </Row>
                        <Row className={styles.rows}>

                            <Col>
                                <FloatingLabel controlId="floatingInputGrid" label="Computation Time(sec)">
                                    <Form.Control
                                        type="number"
                                        aria-describedby="basic-addon2"
                                        placeholder='Computation Time(sec)'
                                        value={computation_time}
                                        onChange={handleComputationTimeChange}
                                    />
                                </FloatingLabel>
                            </Col>
                        </Row>
                    </div>
                    <div className={styles.section}>
                        <Row className={`${styles.rows} ${styles.divider}`}>
                            <h6>Constraints</h6>
                        </Row>
                        <Row className={styles.rows}>
                            <Col>
                                <TagBox onAddingShiftConstraint={onAddingShiftConstraint} onRemovingConstraint={onRemovingConstraint} />
                            </Col>
                        </Row>
                    </div>
                </Form>
            </Container>
        </>
    )
}