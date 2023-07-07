'use client'
import { Container, Row, Col, Form, FloatingLabel, InputGroup, Button } from 'react-bootstrap'
import styles from './shift_configuration.module.css'
import Divider from '@/app/components/divider'
import Tag from './tag'
import TagBox from './tagbox'

export default function ShiftConfiguration(){


    return (
        <>
        <Container className={styles.form_block}>
            
            <Form className={styles.form} as={Row}>
                <Row className={`${styles.rows} ${styles.divider}`}>
                    <Divider text='Shift Configuration' />
                </Row>   
                <Row className={styles.rows}>
                    <Col>
                        <FloatingLabel controlId="floatingInputGrid" label="Year">
                            <Form.Control type="text" placeholder="Year" />
                        </FloatingLabel> 
                    </Col> 
                    <Col>
                        <FloatingLabel controlId="floatingInputGrid" label="Month">
                            <Form.Control type="text" placeholder="Month" />
                        </FloatingLabel>
                    </Col>
                </Row>
                {/* <Row className={styles.rows}>
                    <Col>
                        <FloatingLabel controlId="floatingInputGrid" label="Monthly Leave">
                            <Form.Control aria-describedby="basic-addon2" size="lg" placeholder='Monthly Leave'/>
                        </FloatingLabel>
                    </Col>
                </Row> */}
                <Row className={styles.rows}>
                    <Col>
                        <FloatingLabel controlId="floatingInputGrid" label="Number of workers">
                            <Form.Control aria-describedby="basic-addon2" size="lg" placeholder='Number of workers'/>
                        </FloatingLabel>
                    </Col>
                    <Col>
                        <FloatingLabel controlId="floatingInputGrid" label="Computation Time">
                            <Form.Control aria-describedby="basic-addon2" size="lg" placeholder='Computation Time'/>
                        </FloatingLabel>
                    </Col>
                </Row>
                <Row className={`${styles.rows} ${styles.divider}`}>
                    <Divider text='Constraints' />
                </Row>
                <Row className={styles.rows}>
                    <Col>
                        <TagBox />
                    </Col>
                </Row>
                {/* <Row className={styles.rows}> */}
                    {/* <Col sm={12}> */}
                        {/* <Button variant="primary">Submit</Button> */}
                    {/* </Col> */}
                {/* </Row> */}
            </Form>
             
            {/* <Row className={styles.divider}>
                <hr />
            </Row> */}

        </Container>
        </>
    )
}