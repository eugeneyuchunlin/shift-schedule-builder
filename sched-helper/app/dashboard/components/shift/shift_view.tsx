import { useState, useEffect } from 'react';
import { Container, OffcanvasBody, Row } from 'react-bootstrap';
import Banner from './banner';
import Shift, { ShiftContent } from './shift';
import styles from './shift_view.module.css';
import { ShiftConfig } from '../../shift_config_def';

export default function ShiftView({ props, onSettingShiftConfig }: { props: ShiftConfig, onSettingShiftConfig: (newConfig: any) => void }) {
    const [shiftContent, setShiftContent] = useState({} as ShiftContent);
    const [reset, setReset] = useState(false);


    const loadShiftContent = async () => {
        try {
            const response = await fetch(`/dashboard/api/shifts/load?shift_id=${props.shift_id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                const newContent: ShiftContent = {
                    shift_name: props.name,
                    shift_id: props.shift_id,
                    days: props.days || 0,
                    number_of_workers: props.number_of_workers || 0,
                    content: [],
                };

                if (data) {
                    // console.log(data)
                    const shift0 = data.shifts[0];

                    newContent.number_of_workers = shift0.length;
                    newContent.days = shift0[0].length;

                    onSettingShiftConfig({
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
                    onSettingShiftConfig({
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
        if (shiftContent.shift_id !== props.shift_id) {
            loadShiftContent()
                .then((newContent) => {
                    // console.log(newContent)
                    setShiftContent(newContent);
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }, [props.shift_id]);

    useEffect(() => {
        // console.log("Number of workers: " + props.number_of_workers)
        // console.log("Days: " + props.days)
        const updatedContent = { ...shiftContent };
        updatedContent.number_of_workers = props.number_of_workers;
        updatedContent.days = props.days;

        if(!updatedContent.content) updatedContent.content = [];

        for (let i = updatedContent.content.length; i < props.number_of_workers; i++) {
            updatedContent.content.push({ name: "name " + (i + 1), shift_array: [] as string[] });
        }

        for (let i = 0; i < updatedContent.content.length; i++) {
            for (let j = updatedContent.content[i].shift_array.length; j < props.days; j++) {
                updatedContent.content[i].shift_array.push("1");
            }
        }
        setShiftContent(updatedContent);
        
    }, [props.number_of_workers, props.days]);


    const updateShiftContentElement = (name: string, col: number, val: string) => {
        if (Object.keys(shiftContent).length == 0) {
            const newContent: ShiftContent = {
                ...shiftContent,
                content: shiftContent.content.map((element) => {
                    if (element.name === name) {
                        const updatedShiftArray = [...element.shift_array];
                        if (col < 0) {
                            // Update name
                            return {
                                ...element,
                                name: val,
                            };
                        } else if (col < updatedShiftArray.length) {
                            // Update shift array value
                            updatedShiftArray[col] = val;
                            return {
                                ...element,
                                shift_array: updatedShiftArray,
                            };
                        }
                    }
                    return element;
                }),
            };
            setShiftContent(newContent);
        }
    };

    return (
        <>
            {props.shift_id ? (
                <Container className={styles.shift_container} fluid>
                    <Row>
                        <Banner 
                            props={props} 
                            shift_content={shiftContent} 
                            reloadShiftContent={reloadShiftContent}
                            setDefaultShiftContent={setDefaultShiftContent}
                        />
                    </Row>
                    <Row>
                        <hr />
                    </Row>
                    <Row>
                        <Shift
                            reset={reset}
                            props={props}
                            content={shiftContent}
                            updateShiftContentElement={updateShiftContentElement}
                        />
                    </Row>
                </Container>
            ) : (
                <Container className={styles.empty_shift} fluid>
                    <span className={styles.text}>Create or choose a shift to start</span>
                </Container>
            )}
        </>
    );
}
