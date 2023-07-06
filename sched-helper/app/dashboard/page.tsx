import { Container, Row, Col, Nav } from "@/app/components/bootstrap";
import NavBar from "@/app/components/navbar";
import HistoryShifts from "./components/history_shift";
import styles from './page.module.css'

export default function Page(){

    return (
        <>
           <HistoryShifts />
            <Container fluid id={styles.main_container}>
                <Row id={styles.main_view}>
                    <Col sm={8}>c2</Col>
                    <Col>C3</Col>
                </Row>
            </Container>

            
        </>
    )
}