import { Container, Row, Col, Nav } from "@/app/components/bootstrap";
import NavBar from "@/app/components/navbar";
import HistoryShifts from "./components/history_shifts/history_shift";
import ShiftConfiguration from "./components/shift_configuration/shift_configuration";
import styles from './page.module.css'

export default function Page(){

    return (
        <>
           <HistoryShifts />
            <Container fluid id={styles.main_container}>
                <Row id={styles.main_view}>
                    <Col sm={8}>c2</Col>
                    <Col>
                        <ShiftConfiguration />
                    </Col>
                </Row>
            </Container>

            
        </>
    )
}