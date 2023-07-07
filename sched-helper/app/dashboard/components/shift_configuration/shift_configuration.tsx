'use client'
import { Container, Row, Col, Form, FloatingLabel, InputGroup, Button } from 'react-bootstrap'
import styles from './shift_configuration.module.css'
import Divider from '@/app/components/divider'
import Tag from './tag'
import TagBox from './tagbox'
import { ChangeEvent } from 'react'
import { Constraint } from '../../shift_config_def'

export default function ShiftConfiguration({onShiftConfigChange, onAddingShiftConstraint} : {onShiftConfigChange: (config: {})=>void, onAddingShiftConstraint: (constraint: Constraint)=>void}){

    const handleDaysChange = (e: ChangeEvent<HTMLInputElement>)=>{
        onShiftConfigChange({days: e.target.value})
    }

    const handleNoWChange = (e: ChangeEvent<HTMLInputElement>)=>{
        onShiftConfigChange({number_of_workers: e.target.value})
    }

    return (
        <>
        <Container>
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
                                    onChange={handleDaysChange}
                            />
                            </FloatingLabel> 
                        </Col> 
                        <Col>
                            <FloatingLabel controlId="floatingInputGrid" label="Number of workers">
                                <Form.Control 
                                    type="number"
                                    placeholder='Number of workers'
                                    onChange={handleNoWChange}
                                />
                            </FloatingLabel>
                        </Col>
                    </Row>
                    <Row className={styles.rows}>

                        <Col>
                            <FloatingLabel controlId="floatingInputGrid" label="Computation Time(sec)">
                                <Form.Control aria-describedby="basic-addon2" placeholder='Computation Time(sec)'/>
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
                            <TagBox onAddingShiftConstraint={onAddingShiftConstraint}/>
                        </Col>
                    </Row>
                </div>
            </Form>
        </Container>
        </>
    )
}