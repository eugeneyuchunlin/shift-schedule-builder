'use client'

import styles from './status.module.css'
import { Container, Row, Col, Form} from 'react-bootstrap';
import ProgressBar from "@ramonak/react-progress-bar";


export default function Status(){
    const percentage = 66;
    return (<>
        <Container className={styles.status_section}>
            <Row className="justify-content-md-center">
                <Col xs>
                    <ProgressBar completed={percentage} />
                </Col>
                <Col xs>
                    Status2
                </Col>
                <Col xs>
                    Status3
                </Col>
            </Row>
        </Container>
    </>)
}