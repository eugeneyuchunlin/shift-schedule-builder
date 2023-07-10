'use client'
import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import styles from './banner.module.css'
import {Container, Row, Col, Navbar, Tooltip, OverlayTrigger} from 'react-bootstrap'
import { ShiftConfig } from '../../shift_config_def'
import { ShiftContent } from '../shift/shift'
import AlertBlock from '../alert/alert'

export default function Banner(
    {props, shift_content, reloadShiftContent} : 
    {
        props: ShiftConfig, 
        shift_content: ShiftContent
        reloadShiftContent: () => void
    }
) {

    const [ running, setRunning ] = useState(false);
    const [ status, setStatus ] = useState("");
    const [ showAlert, setShowAlert ] = useState(false);

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
            if (data.message){
                setStatus(data.message)
            }

            if (data.message === "Saved"){
                setTimeout(()=>{
                    setRunning(false);
                }, 1000)
            }
        }

        return () => {
            taskSocket.close();
        }
    }, [props.shift_id]) 

    const handleRun = () => {
        // check if data is valid
        let valid = true;
        if (!props.number_of_workers || props.number_of_workers <= 0){
            valid = false;
        }

        if(!props.days || props.days <= 0){
            valid = false;
        }

        if(!props.computation_time || props.computation_time <= 0){
            valid = false;
        }

        if(!props.constraints || props.constraints.length === 0){
            valid = false;
        }

        if(valid){
            setRunning(true);
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
        }else{
            console.log("show alert")
            setShowAlert(true);
        }
        
    }

    interface BannerUtility{
        src: string;
        alt: string;
        onClick: () => void;
    }

    const Utitlities = [
        {
            src: "/run.svg",
            alt: "Run",
            onClick: handleRun,
        },
        {
            src: "/reload.svg",
            alt: "Reload",
            onClick: reloadShiftContent,
        },
        {
            src: "/erase.svg",
            alt: "Reset",
            onClick: ()=>{},
        },
        {
            src: "/info.svg",
            alt: "Info",
            onClick: ()=>{},
        },
        {
            src: "/download.svg",
            alt: "Download",
            onClick: ()=>{},
        },
        {
            src: "/save.svg",
            alt: "Save",
            onClick: ()=>{},
        }
    ]


    return (
        <>
            <Navbar>
                <Container fluid>
                    <Navbar.Brand>
                        {props.name}
                    </Navbar.Brand>
                    { running ? <>
                    <Col sm={3}>
                         {/* <ProgressBar totalDuration={1000} completed={completed} /> */}
                     </Col>
                     <Col sm={3}>
                            Status : {status}
                     </Col>
                    </> : <>
                        <Col sm={6}></Col>
                    </>}

                    {Utitlities.map((utility, index) => (
                        <Col key={index}>
                            <OverlayTrigger placement='top' delay={{ show: 350, hide: 150 }} overlay={<Tooltip id={`tooltip-${index}`}>{utility.alt}</Tooltip>}>
                                <Image className={styles.icon} src={utility.src} width={30} height={30} alt={utility.alt} onClick={utility.onClick}></Image>
                            </OverlayTrigger>
                        </Col>
                    ))}
                    
                </Container>
            </Navbar> 

            <AlertBlock show={showAlert} handleClose={()=>{setShowAlert(false)}} />
        </>
    )
}