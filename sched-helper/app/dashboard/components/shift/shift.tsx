'use client'
import { Container, Row, Col, Table } from 'react-bootstrap'
import styles from './shift.module.css'
import { ShiftConfig } from '../../shift_config_def'


export default function Shift({ props }: { props: ShiftConfig }) {
    const days = props ? (props.days || 0) : 0
    const number_of_workers = props ? (props.number_of_workers || 0) : 0

    return (
        <>
            <Container fluid>
                <Row>
                    <Col>
                        <Table responsive>
                            <thead>
                                <tr>
                                    { number_of_workers > 0 ? <th className={styles.headcol}>Worker</th> : <></> }
                                    {/* <th className={styles.headcol}>Name</th> */}
                                    {Array.from({ length: days }).map((_, index) => (
                                        <th key={index}>{index + 1}</th>
                                    ))}    
                                </tr>
                            </thead>
                            <tbody>
                                {Array.from({ length: number_of_workers }).map((_, index) => (
                                    <tr key={index}>
                                        <td className={styles.headcol}>{index}</td>
                                        {Array.from({ length: days }).map((_, index) => (
                                            <td key={index}>1</td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Col>
                </Row>
            </Container>
        </>
    )
}