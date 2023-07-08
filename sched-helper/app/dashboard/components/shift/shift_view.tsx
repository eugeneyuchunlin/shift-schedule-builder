'use client'

import { useState, useEffect } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import Banner from './banner'
import Shift, { ShiftContent, PersonalShiftContent } from './shift'
import styles from './shift_view.module.css'
import { ShiftConfig } from '../../shift_config_def'
import { set } from 'zod'


export default function ShiftView({ props }: { props: ShiftConfig }) {

    const [shiftContent, setShiftContent] = useState({} as ShiftContent)

    useEffect(() => {
        // TODO: load shift content from the database


        // if failed to load shift content, initialize content
        const new_content = {} as ShiftContent;
        new_content.shift_name = props.name;
        new_content.shift_id = props.shift_id;
        new_content.days = props.days;
        new_content.number_of_workers = props.number_of_workers;
        new_content.content = [] as PersonalShiftContent[];


        for (let i = new_content.content.length; i < props.number_of_workers; i++) {
            new_content.content.push({ name: "name " + (i + 1), shift_array: [] as string[] });
        }

        for (let i = 0; i < new_content.content.length; i++) {
            for (let j = new_content.content[i].shift_array.length; j < props.days; j++) {
                new_content.content[i].shift_array.push("1");
            }
        }

        setShiftContent(new_content);
        // console.log("new content: ", new_content)
    }, [props.shift_id, props.number_of_workers, props.days])


    const updateShiftContent = (new_content: ShiftContent) => {
        setShiftContent(new_content);
    }

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
            {
                props.shift_id ? <>
                    <Container className={styles.shift_container} fluid>
                        <Row>
                            <Banner props={props} shift_content={shiftContent} />
                        </Row>
                        <Row>
                            <hr />
                        </Row>
                        <Row>
                            <Shift 
                                props={props} 
                                content={shiftContent} 
                                updateShiftContentElement={updateShiftContentElement} 
                            />
                        </Row>
                    </Container>
                </> : 
                <>
                    <Container className={styles.empty_shift} fluid>
                        <span className={styles.text}>Create or choose a shift to start</span>
                    </Container>
                </>
            }

        </>
    )
}