'use client' 

import { CircularProgressbar } from 'react-circular-progressbar';
import { Container, Row, Col } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import 'react-circular-progressbar/dist/styles.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import styles from './score.module.css'


export default function Score({shift_id, index}: {shift_id: string, index: number}){

    const [ scores, setScores ] = useState(null);
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

    useEffect(()=>{
        if(!scores){
            loadScore().then((data)=>{
                console.log(data)
                setScores(data)
            })
        }
    }, [shift_id, index])


    return (
        <>
            <Container>
                <Row>
                    <Col sm={4}></Col>
                    <Col sm={4}>
                        {scores && <CircularProgressbar 
                                        value={scores['overall_score']*100} 
                                        text={`${Number(scores['overall_score']*100).toFixed(2)}%`} 
                                    /> 
                        }
                    </Col>
                    <Col sm={4}></Col>
                </Row>
                <Row>
                    <Col>
                        <Container fluid>
                        {scores && Object.entries(scores).map(([key, value])=>{
                            if(key !== 'overall_score'){
                                return (
                                    <Row key={key}>
                                        <Col sm={9}>
                                            <p>{key}</p>
                                        </Col>
                                        <Col sm={3}>
                                            <p>{(100*Number(value)).toFixed(2)}%</p>
                                        </Col>
                                    </Row>
                                )
                            }
                            return <></> 
                        
                        })}

                        </Container>
                    </Col>
                </Row>
            </Container>
        </>
    )
}
