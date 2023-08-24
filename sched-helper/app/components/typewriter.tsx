'use client'

import { clear } from 'console';
import React, { useState, useEffect } from 'react';

const Typewriter = ({ text, delay, className }: { text: string, delay:number, className?:string }) => {

    const [currentText, setCurrentText] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => { 
        if (currentIndex < text.length) {
            const timeout = setTimeout(() => {
                setCurrentText((value) => value + text[currentIndex]);
                setCurrentIndex((value) => value + 1);
            }, delay);
            return ()=> clearTimeout(timeout);
        }

    }, [currentIndex, delay, text]);
    

    return <span className={className}>{currentText}</span>;
};

export default Typewriter;