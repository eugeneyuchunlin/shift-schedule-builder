'use client'

import { CircularProgressbar } from 'react-circular-progressbar';
import { Container, Row, Col } from 'react-bootstrap';
import { useState, useEffect, useContext } from 'react';
import { ShiftContext } from '../contexts/shfit_context';
import 'react-circular-progressbar/dist/styles.css';
import 'bootstrap/dist/css/bootstrap.min.css';



export default function Score({ shift_id, index }: { shift_id: string, index: number }) {

    const { shiftConfig, shiftContent } = useContext(ShiftContext);

    const [scores, setScores] = useState(null);
    const loadScore = async () => {
        const response = await fetch('/dashboard/api/shifts/score/?shift_id=' + shift_id + '&index=' + index, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            const data = await response.json();
            return data['scores'][0];
        }
    };

    useEffect(() => {
        if (!scores) {
            loadScore().then((data) => {
                console.log(data)
                setScores(data)
            })
        }
        console.log(shiftContent)
    }, [shift_id, index])


    return (
        <>
            <Container>
                <Row>
                    <Col sm={4}></Col>
                    <Col sm={4}>
                        {scores && <CircularProgressbar
                            value={scores['overall_score'] * 100}
                            text={`${Number(scores['overall_score'] * 100).toFixed(2)}%`}
                        />
                        }
                    </Col>
                    <Col sm={4}></Col>
                </Row>
                <Row>
                    <Col>
                        <Container fluid>
                            {scores && Object.entries(scores).map(([key, value], index) => {
                                if (key !== 'overall_score') {
                                    const uniqueKey = `${key}-${index}`; // Generate a unique key

                                    return (
                                        <Row key={uniqueKey}>
                                            <Col sm={9} key={`${uniqueKey}-col1`}>
                                                <p>{key}</p>
                                            </Col>
                                            <Col sm={3} key={`${uniqueKey}-col2`}>
                                                <p>{(100 * Number(value)).toFixed(2)}%</p>
                                            </Col>
                                        </Row>
                                    );
                                }
                                return null;
                            })}
                        </Container>
                    </Col>
                </Row>
            </Container>
        </>
    )
}
