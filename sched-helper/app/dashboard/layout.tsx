// 'use client'
import NavBar from "@/app/components/navbar";
import { Container, Row, Col, Nav } from "@/app/components/bootstrap";
import React from "react";

import styles from './layout.module.css'

export default function Layout({children}:{children: React.ReactNode}){
    return (
        <>
        {children}
            {/* <NavBar>

            </NavBar>
            <Container fluid id={styles.main_container}>
                <Row id={styles.main_view}>
                    {children}
                </Row>
            </Container> */}
        </>
    )
}