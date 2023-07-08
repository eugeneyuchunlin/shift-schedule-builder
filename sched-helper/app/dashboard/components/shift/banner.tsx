'use client'
import { useEffect, useRef } from 'react'
import Image from 'next/image'
import styles from './banner.module.css'
import {Container, Row, Col, Navbar, Nav} from 'react-bootstrap'
import { ShiftConfig } from '../../shift_config_def'
import { ShiftContent } from '../shift/shift'

export default function Banner({props, shift_content} : {props: ShiftConfig, shift_content: ShiftContent}) {

    const taskSocketRef = useRef<WebSocket | null>(null);
    useEffect(()=> {
        taskSocketRef.current = new WebSocket(
            "ws://127.0.0.1:8000" + 
            `/ws/tasks/${props.shift_id}/`
        );

        const taskSocket = taskSocketRef.current;

        taskSocket.onopen = function (e) {
            console.log("Task socket connected");
        }

        taskSocket.onclose = function (e) {
            console.log("Task socket disconnected");
        }

        taskSocket.onmessage = function (e) {
            const data = JSON.parse(e.data);
            console.log(data);
        }

        return () => {
            taskSocket.close();
        }
    }, [props.shift_id]) 

    const handleRun = () => {
        console.log("Run");
        // prepare the data
        const data = {
            shift_id: props.shift_id,
            number_of_workers: props.number_of_workers,
            days: props.days,
            computation_time: props.computation_time,
            constraints: props.constraints,
            content: shift_content.content,
        }
        if(taskSocketRef.current) {
            taskSocketRef.current.send(JSON.stringify(data));
        }
    }


    return (
        <>
            <Navbar>
                <Container>
                    <Navbar.Brand>
                        {props.name}
                    </Navbar.Brand>
                    <Col sm={7}></Col>
                    <Col>
                        <Image className={styles.icon} src="/run.svg" width={30} height={30} alt="run" onClick={handleRun}></Image>
                    </Col>
                    <Col>
                        <Image className={styles.icon} src="/reset.svg" width={30} height={30} alt="reset"></Image>
                    </Col>
                    <Col>
                        <Image className={styles.icon} src="/info.svg" width={30} height={30} alt="Info"></Image>
                    </Col>
                    <Col>
                        <Image className={styles.icon} src="/download.svg" width={30} height={30} alt="download"></Image>
                    </Col>
                    <Col>
                        <Image className={styles.icon} src="/save.svg" width={30} height={30} alt="save"></Image>
                    </Col>
                </Container>
            </Navbar> 
        </>
    )
}