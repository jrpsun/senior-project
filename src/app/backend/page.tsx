"use client"
import React, { useState } from 'react'

const backend = () => {
    const [text, setText] = useState("");
    const handleClick = async () => {
        try {
            const res = await fetch("http://localhost:8000/api/data")
            if (!res.ok) {
                throw new Error("Failed to fetch data");
            }
            const result = await res.json()
            setText(result.data)
        } catch (err) {
            console.log("Error:", err)
        }
    }

    return (
        <div>
            <button onClick={handleClick}>Click</button>
            {text}
        </div>
    )
}

export default backend