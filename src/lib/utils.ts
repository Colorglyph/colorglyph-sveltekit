import { PUBLIC_API_BASE, PUBLIC_NETWORK, PUBLIC_CONTRACT_ID, PUBLIC_XLM_ID } from '$env/static/public'

export const isLocal = PUBLIC_NETWORK === 'local'
export const isFuture = PUBLIC_NETWORK === 'future'
export const isTest = PUBLIC_NETWORK === 'test'
export const API_BASE = PUBLIC_API_BASE
export const CONTRACT_ID = PUBLIC_CONTRACT_ID
export const XLM_ID = PUBLIC_XLM_ID

export function generateRGBSpectrum(steps: number) {
    const colorArray = [];

    for (let i = 0; i < steps; i++) {
        for (let j = 0; j < steps; j++) {
            const red = 255 - Math.floor((i * 255) / steps);
            const green = 255 - Math.floor((j * 255) / steps);
            const blue = Math.floor((i * j * 255) / (steps * steps));

            const colorValue = red * Math.pow(256, 2) + green * 256 + blue;
            colorArray.push(colorValue);
        }
    }

    return colorArray;
}

export function generateRandomSpectrum(width: number, detail: number) {
    // Calculate the total length of the array
    // const totalLength = steps * steps
    
    // Define the maximum value
    const maxValue = Math.pow(256, 3) - 1

    // Generate an array of random numbers
    // const array = new Array(totalLength).fill(0).map(() => 
    //     Math.floor(Math.random() * (maxValue + 1))
    // )

    const array = []

    for (let i = 0; i < Math.ceil(width * detail); i++) {
        const color = Math.floor(Math.random() * (maxValue + 1))

        for (let j = 0; j < Math.ceil(width / detail); j++) {
            array.push(color)
        }
    }

    return array.slice(0, width * width)
}