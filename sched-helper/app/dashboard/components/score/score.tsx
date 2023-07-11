'use client'

import { CircularProgressbar } from 'react-circular-progressbar';
import { Container, Row, Col } from 'react-bootstrap';
import { useState, useEffect, useContext } from 'react';
import { ShiftContext } from '../contexts/shfit_context';
import 'react-circular-progressbar/dist/styles.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { set } from 'zod';
import { TagsDefinition } from '../shift_configuration/tags_definition';


export default function Score({ shift_id, index }: { shift_id: string, index: number }) {

    const { shiftConfig, shiftContent } = useContext(ShiftContext);

    const [scores, setScores] = useState(null);
    const [overallScore, setOverallScore] = useState(0);
    // const loadScore = async () => {
    //     const response = await fetch('/dashboard/api/shifts/score/?shift_id=' + shift_id + '&index=' + index, {
    //         method: 'GET',
    //         headers: {
    //             'Content-Type': 'application/json',
    //         },
    //     });

    //     if (response.ok) {
    //         const data = await response.json();
    //         return data['scores'][0];
    //     }
    // };


    // useEffect(() => {
    //     if (!scores) {
    //         loadScore().then((data) => {
    //             console.log(data)
    //             let total_scores = 0;
    //             for (const [key, value] of Object.entries(data)) {
    //                 total_scores += Number(value);
    //             }
    //             total_scores /= Object.keys(data).length;
    //             setOverallScore(total_scores);
    //             setScores(data)
    //         })
    //     }
    //     console.log(shiftContent)

    // }, [shift_id, index])

    useEffect(() => {
        if (shiftConfig.constraints) {
            const constraints = shiftConfig.constraints;
            const constraints_score = {} as any;
            for (const constraint of constraints) {
                const tag = TagsDefinition.find((tag) => tag.key === constraint.name);
                if (tag) {
                    constraints_score[tag.text] = tag.evaluate(shiftContent.content, constraint.parameters);
                }
            }
            console.log(constraints_score)
            setScores(constraints_score)
        }
    }, [shiftConfig.constraints])

    useEffect(() => {
        if (scores) {
            let total_scores = 0;
            for (const [key, value] of Object.entries(scores)) {
                total_scores += Number(value);
            }
            total_scores /= Object.keys(scores).length > 0 ? Object.keys(scores).length : 1;
            setOverallScore(total_scores);
        }
    }, [scores])


    return (
        <>
            <Container>
                <Row>
                    <Col sm={4}></Col>
                    <Col sm={4}>
                        {scores && <CircularProgressbar
                            value={overallScore * 100}
                            text={`${Number(overallScore * 100).toFixed(2)}%`}
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
