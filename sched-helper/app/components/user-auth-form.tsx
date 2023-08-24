'use client'
import Image from 'next/image'
import React, { useState, useEffect } from 'react';
import { signIn } from 'next-auth/react'
import { Form, Button, Row, Container, Col, Tab, Tabs } from '@/app/components/bootstrap';
import Divider from './divider';
import styles from './user-auth-form.module.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import { User } from 'lucide-react';


function UserRegisterForm(){
    return (
        <>
        <Form>
            <Row className='mb-3'>
                <Form.Group as={Col} controlId="formBasicEmail">
                    <Form.Label>First name</Form.Label>
                    <Form.Control placeholder='Enter first name' disabled/>
                    
                </Form.Group>
                <Form.Group as={Col} controlId="formBasicEmail">
                    <Form.Label>Last name</Form.Label>
                    <Form.Control placeholder='Enter last name' disabled/>
                </Form.Group>
            </Row>
            <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control placeholder='Enter email' disabled/>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control placeholder='Password' disabled/>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control placeholder='Re-enter your Password' disabled/>
            </Form.Group>
            <Button variant="primary" type="submit" disabled>Submit</Button>
        </Form>
        </>
    );
}

function UserCredentialLoginForm(){
    return (
        <>
        <Form>
            <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control placeholder='Enter email' disabled/>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control placeholder='Password' disabled/>
            </Form.Group>
            <Button variant="primary" type="submit" disabled>Submit</Button>
        </Form>
        </>
    );
}

export default function UserAuthForm(){


    return (
        <>
        <div className={styles.form_body}>
            <Tabs defaultActiveKey="register" className='mb-3' fill>
                <Tab eventKey="login" title="Login">
                        <UserCredentialLoginForm />
                </Tab>
                <Tab eventKey="register" title="Register">
                        <UserRegisterForm />
                </Tab> 
            </Tabs>

            <Divider text='Third party sign in/sign up'></Divider>
              
            <Container className={styles.third_party_section} fluid>
                <Row>
                    {/* <Col>
                        <Button className={styles.auth_block} variant="light" onClick={()=> signIn("google")} disabled>Sign In With Google</Button>
                    </Col> */}
                    <Col>
                        <Button className={styles.auth_block} variant="light" onClick={()=> signIn("github")}>
                            <Image src="/github-mark.svg" alt="" width={30} height={30} className={styles.third_party_icon}></Image> 
                            GitHub
                        </Button> 
                    </Col>
                </Row>
            </Container> 
        </div>
        </>
    )
}