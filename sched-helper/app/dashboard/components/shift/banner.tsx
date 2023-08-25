'use client'
import { useEffect, useRef, useState, useContext } from 'react'
import Image from 'next/image'
import styles from './banner.module.css'
import { Container, Row, Col, Navbar, Tooltip, OverlayTrigger } from 'react-bootstrap'
import { ShiftConfig } from '../../shift_config_def'
import { ShiftContent, PersonalShiftContent } from '../shift/shift'
import AlertBlock from '../alert/alert'
import { setDefaultHighWaterMark } from 'stream'
import { ShiftContext } from '../contexts/shfit_context'

export default function Banner(
    {
        reloadShiftContent,
        setDefaultShiftContent,
        setFixedMode,
    }:
        {
            reloadShiftContent: () => void
            setDefaultShiftContent: () => void
            setFixedMode: (mode: boolean) => void
        }
) {
    const { shiftContent, shiftConfig, reservedLeave } = useContext(ShiftContext);

    const [running, setRunning] = useState(false);
    const [status, setStatus] = useState("");
    const [showAlert, setShowAlert] = useState(false);
    const [brushMode, setBrushMode] = useState(false);

    const taskSocketRef = useRef<WebSocket | null>(null);
    useEffect(() => {
        taskSocketRef.current = new WebSocket(
            "ws://127.0.0.1:8000" +
            `/ws/tasks/${shiftConfig.shift_id}/`
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
            if (data.message) {
                setStatus(data.message)
            }

            if (data.message === "Saved") {
                reloadShiftContent();
                setTimeout(() => {
                    setRunning(false);
                }, 1000)
            }
        }

        return () => {
            taskSocket.close();
        }
    }, [shiftConfig.shift_id])

    const handleRun = () => {
        // check if data is valid
        let valid = true;
        if (!shiftConfig.number_of_workers || shiftConfig.number_of_workers <= 0) {
            valid = false;
        }

        if (!shiftConfig.days || shiftConfig.days <= 0) {
            valid = false;
        }

        if (!shiftConfig.computation_time || shiftConfig.computation_time <= 0) {
            valid = false;
        }

        if (!shiftConfig.constraints || shiftConfig.constraints.length === 0) {
            valid = false;
        }

        if( shiftConfig.algorithm === undefined || shiftConfig.algorithm === -1){
            console.log("algorithm invalid")
            console.log(shiftConfig.algorithm)
            valid = false;
        }

        if (valid) {
            setRunning(true);
            // prepare the data
            const data = {
                shift_id: shiftConfig.shift_id,
                number_of_workers: shiftConfig.number_of_workers,
                days: shiftConfig.days,
                computation_time: shiftConfig.computation_time,
                constraints: shiftConfig.constraints,
                content: shiftContent.content,
                reserved_leave: reservedLeave,
                algorithm: shiftConfig.algorithm
            }
            if (taskSocketRef.current) {
                console.log(data)
                taskSocketRef.current.send(JSON.stringify(data));
            }
        } else {
            console.log("show alert")
            setShowAlert(true);
        }

    }

    const handleSave = async () =>{
        // seperate name and shift_array
        const name_list = [] as string[];
        const shift_array_list = [] as string[][];
        shiftContent.content.forEach((element: PersonalShiftContent) => {
            name_list.push(element.name);
            shift_array_list.push(element.shift_array);
        });

        const constraints = [ ...shiftConfig.constraints ]
        constraints.forEach((constraint) => {
            if(constraint.name === 'customize_leave'){
                if('reserved_leave' in constraint.parameters){
                    delete constraint.parameters.reserved_leave
                }
            }
        })

        console.log("constraints : ", constraints)
        console.log('reserved_leave : ', reservedLeave)

        const data = {
            shift_id: shiftConfig.shift_id,
            computation_time: shiftConfig.computation_time || 0,
            name_list: name_list,
            shift: shift_array_list,
            constraints: constraints,
            reserved_leave: reservedLeave,
            algorithm: shiftConfig.algorithm
        }
        console.log(data)

        const response = await fetch('/dashboard/api/shifts/save', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
        console.log("saved")
    }

    interface BannerUtility {
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
            onClick: setDefaultShiftContent,
        },
        {
            src: "/brush.svg",
            alt: "Fix",
            onClick: () => {
                setBrushMode(!brushMode);
                setFixedMode(!brushMode);
            },
        },
        // {
        //     src: "/download.svg",
        //     alt: "Download",
        //     onClick: () => { },
        // },
        {
            src: "/save.svg",
            alt: "Save",
            onClick: () => { handleSave() },
        }
    ]


    return (
        <>
            <Navbar>
                <Container fluid>
                    <Navbar.Brand>
                        {shiftConfig.name}
                    </Navbar.Brand>
                    {running ? <>
                        <Col sm={4}>
                            {/* <ProgressBar totalDuration={1000} completed={completed} /> */}
                        </Col>
                        <Col sm={3}>
                            Status : {status}
                        </Col>
                    </> : <>
                        <Col sm={7}></Col>
                    </>}

                    {Utitlities.map((utility, index) => (
                        <Col key={index}>
                            <OverlayTrigger placement='top' delay={{ show: 350, hide: 150 }} overlay={<Tooltip id={`tooltip-${index}`}>{utility.alt}</Tooltip>}>
                                {brushMode && index === 3 ? (
                                    <Image className={`${styles.icon} ${styles.icon_active_mode}`} src={utility.src} width={30} height={30} alt={utility.alt} onClick={utility.onClick} />
                                ) : (
                                    <Image className={styles.icon} src={utility.src} width={30} height={30} alt={utility.alt} onClick={utility.onClick} />
                                )}
                            </OverlayTrigger>

                        </Col>
                    ))}

                </Container>
            </Navbar>

            <AlertBlock show={showAlert} handleClose={() => { setShowAlert(false) }} />
        </>
    )
}