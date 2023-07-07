'use client'
import { ChangeEvent, useState } from 'react'
import { Container, Row, Col } from "@/app/components/bootstrap";
import NavBar from "@/app/components/navbar";
import HistoryShifts from "./components/history_shifts/history_shift";
import ShiftConfiguration from "./components/shift_configuration/shift_configuration";
import ShiftView from './components/shift/shift_view'
import styles from './page.module.css'
import { ShiftConfig, Constraint } from './shift_config_def'


export default function Page() {

    const [shiftConfig, setShiftConfig] = useState({} as ShiftConfig)

    const handleAddingConstraint = (constraint: Constraint): void => {
        setShiftConfig((prevConfig) => {
            const updatedConfig: ShiftConfig = {
                ...prevConfig,
                constraints: [...(prevConfig.constraints || []), constraint],
            };
            console.log(updatedConfig)
            return updatedConfig;
        });
    };


    const handleShiftConfigChange = (newConfig: any): void => {
        setShiftConfig((prevConfig) => {
            // Create a new copy of the shiftConfig object
            const updatedConfig: any = { ...prevConfig };

            // Update the properties in the newConfig object
            for (const [key, value] of Object.entries(newConfig)) {
                updatedConfig[key] = value;
            }
            console.log(updatedConfig);
            return updatedConfig;
        });
    };


    return (
        <>
            <HistoryShifts />
            <Container fluid id={styles.main_container}>
                <Row id={styles.main_view}>
                    <Col sm={8}>
                        <ShiftView props={shiftConfig}/>
                    </Col>
                    <Col>
                        <ShiftConfiguration onShiftConfigChange={handleShiftConfigChange} onAddingShiftConstraint={handleAddingConstraint} />
                    </Col>
                </Row>
            </Container>
        </>
    )
}