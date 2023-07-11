'use client'
import { ChangeEvent, useState, useEffect } from 'react'
import { Container, Row, Col } from "@/app/components/bootstrap";
import NavBar from "@/app/components/navbar";
import HistoryShifts from "./components/history_shifts/history_shift";
import ShiftConfiguration from "./components/shift_configuration/shift_configuration";
import ShiftView from './components/shift/shift_view'
import styles from './page.module.css'
import { ShiftConfig, Constraint } from './shift_config_def'
import { ShiftProvider } from './components/contexts/shfit_context';
import { ShiftContent } from './components/shift/shift'

export default function Page() {

    const [shiftConfig, setShiftConfig] = useState({} as ShiftConfig)
    const [shiftContent, setShiftContent] = useState({} as ShiftContent)
    const [reset, setReset] = useState(false)

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

    const handleRemovingConstraint = (constraint_name: string): void => {
        setShiftConfig((prevConfig) => {
            const updatedConfig: ShiftConfig = {
                ...prevConfig,
                constraints: prevConfig.constraints?.filter((constraint) => constraint.name !== constraint_name),
            };
            console.log(updatedConfig)
            return updatedConfig;
        });
    }


    const handleShiftConfigChange = (newConfig: any): void => {
        setShiftConfig((prevConfig) => {
            // Create a new copy of the shiftConfig object
            const updatedConfig: any = { ...prevConfig };

            // Update the properties in the newConfig object
            for (const [key, value] of Object.entries(newConfig)) {
                updatedConfig[key] = value;
            }
            // console.log(updatedConfig);
            return updatedConfig;
        });
    };

    const handleSelectingShift = (shift_name: string, shift_id: string) => {
        console.log("Selecting shift: " + shift_id);
        handleShiftConfigChange({name: shift_name, shift_id: shift_id});
    }


    const loadShiftContent = async () => {
        try {
            const response = await fetch(`/dashboard/api/shifts/load?shift_id=${shiftConfig.shift_id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                const newContent: ShiftContent = {
                    shift_name: shiftConfig.name,
                    shift_id: shiftConfig.shift_id,
                    days: shiftConfig.days || 0,
                    number_of_workers: shiftConfig.number_of_workers || 0,
                    content: [],
                };

                if (data) {
                    // console.log(data)
                    const shift0 = data.shifts[0];

                    newContent.number_of_workers = shift0.length;
                    newContent.days = shift0[0].length;

                    handleShiftConfigChange({
                        number_of_workers: newContent.number_of_workers,
                        days: newContent.days,
                    })

                    for (let i = 0; i < newContent.number_of_workers; i++) {
                        newContent.content.push({
                            name: data['name_list'][i],
                            shift_array: shift0[i],
                        });
                    }

                }else{
                    handleShiftConfigChange({
                        number_of_workers: 0,
                        days: 0,
                    })
                    newContent.number_of_workers = 0;
                    newContent.days = 0;
                }

                return newContent;
            } else {
                throw new Error('Failed to load shift content');
            }
        } catch (error) {
            throw new Error('Failed to load shift content');
        }
    };

    const resetShiftContennt = (newContent: ShiftContent) => {
        setShiftContent(newContent);
        setReset(true);
        setTimeout(() => {
            setReset(false);
        }, 1000)
    } 

    const setDefaultShiftContent = async () => {
        const newContent = await loadShiftContent();
        for (let i = 0; i < newContent.content.length; i++) {
            newContent.content[i].shift_array = [];
            for (let j = 0; j < newContent.days; j++) {
                newContent.content[i].shift_array.push("1");
            }
        }
        console.log(newContent)
        resetShiftContennt(newContent);
    }

    const reloadShiftContent = async () => {
        const originalContent = await loadShiftContent();
        resetShiftContennt(originalContent);
    }

    useEffect(() => {
        if (shiftContent.shift_id !== shiftConfig.shift_id) {
            loadShiftContent()
                .then((newContent) => {
                    // console.log(newContent)
                    setShiftContent(newContent);
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }, [shiftConfig.shift_id]);

    useEffect(() => {
        // console.log("Number of workers: " + props.number_of_workers)
        // console.log("Days: " + props.days)
        const updatedContent = { ...shiftContent };
        updatedContent.number_of_workers = shiftConfig.number_of_workers;
        updatedContent.days = shiftConfig.days;

        if(!updatedContent.content) updatedContent.content = [];

        for (let i = updatedContent.content.length; i < shiftConfig.number_of_workers; i++) {
            updatedContent.content.push({ name: "name " + (i + 1), shift_array: [] as string[] });
        }

        for (let i = 0; i < updatedContent.content.length; i++) {
            for (let j = updatedContent.content[i].shift_array.length; j < shiftConfig.days; j++) {
                updatedContent.content[i].shift_array.push("1");
            }
        }
        setShiftContent(updatedContent);
        
    }, [shiftConfig.number_of_workers, shiftConfig.days]);


    const updateShiftContentElement = (name: string, col: number, val: string) => {
        const new_content = { ...shiftContent };
        const index = new_content.content.findIndex((element) => element.name === name);

        if (col < 0){
            new_content.content[index].name = val;
        }else{
            new_content.content[index].shift_array[col] = val;
        }
        setShiftContent(new_content); // TODO: should store in a copy
    }


    return (
        <>
            <HistoryShifts onSelectShift={handleSelectingShift}/>
            <Container fluid id={styles.main_container}>
                <Row id={styles.main_view}>
                    <Col sm={8}>
                        <ShiftProvider shiftContent={shiftContent} shiftConfig={shiftConfig} >
                            <ShiftView 
                                reset={reset}
                                reloadShiftContent={reloadShiftContent} 
                                setDefaultShiftContent={setDefaultShiftContent} 
                                updateShiftContentElement={updateShiftContentElement}
                            />
                        </ShiftProvider>
                        
                    </Col>
                    <Col>
                        <ShiftProvider shiftContent={shiftContent} shiftConfig={shiftConfig} >
                            <ShiftConfiguration 
                                onShiftConfigChange={handleShiftConfigChange} 
                                onAddingShiftConstraint={handleAddingConstraint} 
                                onRemovingConstraint={handleRemovingConstraint} 
                            />
                        </ShiftProvider>
                    </Col>
                </Row>
            </Container>
        </>
    )
}
