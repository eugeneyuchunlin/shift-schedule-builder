'use client'

import { CircularProgressbar } from 'react-circular-progressbar';
import { Container, Row, Col } from 'react-bootstrap';
import { useState, useEffect, useContext } from 'react';
import { ShiftContext } from '../contexts/shfit_context';
import 'react-circular-progressbar/dist/styles.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { set } from 'zod';
import { TagsDefinition } from '../shift_configuration/tags_definition';
import { Constraint } from '../../shift_config_def';

export default function Score({ shift_id, index }: { shift_id: string, index: number }) {

    const { shiftConfig, shiftContent, updateContentFlag, reservedLeave } = useContext(ShiftContext);

    const [scores, setScores] = useState(null);
    const [overallScore, setOverallScore] = useState(0);
    const [shift, setShift] = useState([] as number[][]);

    // console.log(reservedLeave)

    useEffect(() => {
        if (shiftConfig.constraints && shift.length) {
          const constraints = shiftConfig.constraints;
          const constraints_score = {} as any;
          const evaluatePromise = constraints.map(async (constraint: Constraint) => {
            const tag = TagsDefinition.find((tag) => tag.key === constraint.name);
            if(constraint.name === 'customize_leave' && tag){
                constraint.parameters = { ...constraint.parameters, reserved_leave: reservedLeave }
            }
            if (tag) {
              constraints_score[tag.text] = {}
                constraints_score[tag.text]['score'] = await tag.evaluate(shift, constraint.parameters);
                constraints_score[tag.text]['weight'] = Number(constraint.parameters['weight']);
            }
          });
      
          Promise.all(evaluatePromise).then(() => {
            // console.log(constraints_score);
            setScores(constraints_score);
          });
        }else{
            setScores(null)
        }
      }, [shiftConfig.constraints, shift]);
      

    useEffect(() => {
        if (scores) {
            let total_scores = 0;
            let total_weight = 0;
            for (const [key, value] of Object.entries<{weight: number, score: number}>(scores)) {
                total_weight += value['weight']
                total_scores += value['score'] * value['weight']
            }
            // the overall score should be weighted
            total_scores /= total_weight > 0 ? total_weight: (Object.keys(scores).length > 0 ? Object.keys(scores).length  : 1);
            setOverallScore(total_scores);
        }
    }, [scores])

    useEffect(()=>{
        if(shiftContent && shiftContent.content){
            // console.log("edited")
            const tempShift = []
            for(const employee of shiftContent.content){
                const convertedArray = employee.shift_array.map(Number);
                tempShift.push(convertedArray);
            }
            setShift(tempShift)
            // console.log(tempShift)
        }
    }, [shiftContent.content, updateContentFlag])


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
                            {scores && Object.entries<{weight: number, score: number}>(scores).map(([key, value], index) => {
                                if (key !== 'overall_score') {
                                    const uniqueKey = `${key}-${index}`; // Generate a unique key

                                    return (
                                        <Row key={uniqueKey}>
                                            <Col sm={9} key={`${uniqueKey}-col1`}>
                                                <p>{key}</p>
                                            </Col>
                                            <Col sm={3} key={`${uniqueKey}-col2`}>
                                                <p>{(100 * Number(value['score'])).toFixed(2)}%</p>
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
