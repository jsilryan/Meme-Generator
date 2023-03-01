import React, {useState} from "react"
import memesData from "../memedata.js"

export default function Meme3() {
    let stringifiedMeme, stringifiedUrls
    const [allMemes, setAllMemes] = useState([])
    React.useEffect(
        () => {
            fetch('https://api.imgflip.com/get_memes') 
                .then(res => res.json()) //Take the response and pass it to json
                .then(data => setAllMemes(data.data.memes))
        }, []
    )

    const [memeDetails, setMemeDetails] = useState(() => JSON.parse(localStorage.getItem("memeInfo")) || [])

    const [currentMemeImage, setCurrentMemeImage] = React.useState("")
    
    const [urls, setUrls] = useState(() => JSON.parse(localStorage.getItem("urlInfo")) || [])
    
    React.useEffect(
        () => {
            stringifiedMeme = JSON.stringify(memeDetails)
            localStorage.setItem("memeInfo", stringifiedMeme)
        },[urls]
    )

    React.useEffect(
        () => {
            stringifiedUrls = JSON.stringify(urls)
            localStorage.setItem("urlInfo", stringifiedUrls)
        },[memeDetails]
    )

    function getMemeImage(){
        const randomNumber = Math.floor(Math.random() * allMemes.length)
        const url = allMemes[randomNumber].url
        const meme = 
        {  
            topText: "",
            bottomText: "",
            randomImage: url
        }
        urls.includes(url) ? setMemeDetails(prevMemes => [...prevMemes]) : setMemeDetails(prevMemes => [meme, ...prevMemes]) 
        urls.includes(url) ? setUrls(prevUrls => prevUrls) : setUrls(prevUrls => [url, ...prevUrls])
        setCurrentMemeImage(url)
        console.log(memeDetails) //setm.d
    }

    function findCurrentMeme(){
        return memeDetails.find(memeD => {
            return memeD.randomImage === currentMemeImage
        }) || memeDetails[0]
    }

    function handleChange(event) {
        const {name, value} = event.target
        setMemeDetails(oldMemes => oldMemes.map(oldMeme =>{
            return oldMeme.randomImage === currentMemeImage ? 
            {...oldMeme, 
                [name] : value
            } : oldMeme
        }))
    }

    return (
        <meme>
            <det>
                <in>
                    <input 
                        type = "text" 
                        placeholder = "First Text"
                        name = "topText"
                        value = {findCurrentMeme().topText}
                        onChange = {handleChange}
                    />
                    <input 
                        type = "text" 
                        placeholder = "Last Text"
                        name = "bottomText"
                        value = {findCurrentMeme().bottomText}
                        onChange = {handleChange}
                    />       
                </in>
                <button type = "button" id = "myButton" onClick = {getMemeImage}>Get a new meme image</button>
            </det> 
            <div className="container">
                <img src = {findCurrentMeme().randomImage} />
                <h2 className="top">{findCurrentMeme().topText}</h2>
                <h2 className="bottom">{findCurrentMeme().bottomText}</h2>
            </div>
        </meme>
    )
}


/* //To use async in useEffect, we should define the func separately in the callback function as seen below.
React.useEffect(() => { //Async automatically returns a promise instead of a function or nothing.
    async function getMemes() {
        const res = await fetch("")
        const data = await res.json()
        setAllMemes(data.data.memes)
    }
    getMemes()

    return () => {

    } //NOT A MUST TO USE THE RETURN AS A CLEANUP SINCE WE DO NOT UNMOUNT THE MEME COMPONENT
}, []) 
*/

//If a useEffect has a function that returns something, it should be a cleanup function. Else it should return nothing
