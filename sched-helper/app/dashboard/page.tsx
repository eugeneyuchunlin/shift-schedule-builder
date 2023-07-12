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
    const [updateContentFlag, setUpdateContentFlag] = useState(false)
    const [reservedLeave, setReservedLeave] = useState({} as {[key: string]: number[]}) // reserved Leave
    const [reservedWD, setReservedWD] = useState({} as {[key: string]: number[]}) // reserved Working Days
    const [updateReservedFlag, setUpdateReservedFlag] = useState(false)

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
                    console.log(data)
                    const shift0 = data.shifts[0];

                    newContent.number_of_workers = shift0.length;
                    newContent.days = shift0[0].length;

                    handleShiftConfigChange({
                        number_of_workers: newContent.number_of_workers,
                        days: newContent.days,
                        // FIXME: compute_time -> computation_time
                        computation_time: data['compute_time'],
                        constraints: data['constraints']
                    })
                    // FIXME: days_off_index -> reserved_leave
                    setReservedLeave(data['days_off_index'])
                    console.log("reload reserved leave")

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
        setUpdateContentFlag(!updateContentFlag);
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
        setUpdateReservedFlag(!updateReservedFlag);
    }

    

    const rescaleShiftContent = async (updatedContent: ShiftContent) => {
        try {
          if (!updatedContent.content) updatedContent.content = [];
      
          if (updatedContent.content.length < shiftConfig.number_of_workers) {
            for (let i = updatedContent.content.length; i < shiftConfig.number_of_workers; i++) {
              updatedContent.content.push({ name: "name " + (i + 1), shift_array: [] as string[] });
            }
          } else {
            updatedContent.content.splice(shiftConfig.number_of_workers);
          }
      
          for (let i = 0; i < updatedContent.content.length; i++) {
            if (updatedContent.content[i].shift_array.length < shiftConfig.days) {
              for (let j = updatedContent.content[i].shift_array.length; j < shiftConfig.days; j++) {
                updatedContent.content[i].shift_array.push("1");
              }
            } else {
              updatedContent.content[i].shift_array.splice(shiftConfig.days);
            }
          }
      
          console.log(updatedContent);
          return updatedContent;
        } catch (error) {
          throw error;
        }
      };


    const updateShiftContentElement = (name: string, col: number, val: string) => {
        const new_content = { ...shiftContent };
        const index = new_content.content.findIndex((element) => element.name === name);

        if (col < 0){
            new_content.content[index].name = val;
        }else{
            new_content.content[index].shift_array[col] = val;
        }
        setShiftContent(new_content); // TODO: should store in a copy
        setUpdateContentFlag(!updateContentFlag)
    }

    useEffect(() => {
        if (shiftContent.shift_id !== shiftConfig.shift_id) {
            loadShiftContent()
                .then((newContent) => {
                    // console.log(newContent)
                    setShiftContent(newContent);
                    setUpdateContentFlag(!updateContentFlag);
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }, [shiftConfig.shift_id]);

    useEffect(() => {
        // console.log("Number of workers: " + shiftConfig.number_of_workers)
        // console.log("Days: " + shiftConfig.days)
        const updatedContent = { ...shiftContent };
        updatedContent.number_of_workers = shiftConfig.number_of_workers;
        updatedContent.days = shiftConfig.days;

        // console.log("rescale the shift content")
        rescaleShiftContent(updatedContent)
        .then((updatedContent: ShiftContent) => {
        //   console.log("rescale done");
          setShiftContent(updatedContent);
          setUpdateContentFlag(!updateContentFlag);
        })
        .catch((error) => {
          // Handle any errors that occur during rescaling
          console.error("Rescaling error:", error);
        });
        
    }, [shiftConfig.number_of_workers, shiftConfig.days]);


    return (
        <>
            <HistoryShifts onSelectShift={handleSelectingShift}/>
            <Container fluid id={styles.main_container}>
                <Row id={styles.main_view}>
                    <Col sm={8}>
                        <ShiftProvider 
                            shiftContent={shiftContent} 
                            shiftConfig={shiftConfig} 
                            updateContentFlag={updateContentFlag}
                            reservedLeave={reservedLeave}
                            reservedWD={reservedWD}
                            updateReservedFlag={updateReservedFlag}
                        >
                            <ShiftView 
                                reset={reset}
                                reloadShiftContent={reloadShiftContent} 
                                setDefaultShiftContent={setDefaultShiftContent} 
                                updateShiftContentElement={updateShiftContentElement}
                            />
                        </ShiftProvider>
                        
                    </Col>
                    <Col>
                        <ShiftProvider 
                            shiftContent={shiftContent} 
                            shiftConfig={shiftConfig} 
                            updateContentFlag={updateContentFlag}
                            reservedLeave={reservedLeave}
                            reservedWD={reservedWD}
                            updateReservedFlag={updateReservedFlag}
                        >
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
