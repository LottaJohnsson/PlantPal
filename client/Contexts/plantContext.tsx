import React, {createContext, useContext, useState} from 'react';


/*
async function CheckIfAuthenticated() {
    const response = await fetch('/isAuthenticated', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    })
}*/


const search = async (query: string) => {
    try {
        const response = await fetch(`/search`, {
            method: "GET",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({query: query})
        })

        const json = await response.json();
        return json.data;

    } catch (error) {
        console.log(error)
        return;
    }
}

