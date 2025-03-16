'use client'

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

import Sentiment from "sentiment";

export default function SpeechToText() {

    const refs = {
        "Astomania" : useRef(null),
        "Animals" : useRef(null),
        "BACK2BACK" : useRef(null),
        "BagRaidersShooting" : useRef(null),
        "ChillGuy" : useRef(null),
        "Dragostea" : useRef(null),
        "FEIN" : useRef(null),
        "FinalFant" : useRef(null),
        "LebronSunshine" : useRef(null),
        "NUNCAMUDA" : useRef(null),
        "Rickroll" : useRef(null),
        "TamarBraxtonLetMeKnow" : useRef(null),
        "TimeBackBadPiano" : useRef(null),
        "VitasThe7thElement" : useRef(null),
        "WhatwasImadeFor" : useRef(null)
    }
    
    let currently_playing = "Animals";

    const [transcript, setTranscript] = useState("");
    const [isListening, setIsListening] = useState(false);

    const [mood, setMood] = useState(" ")
    
    let recognition;

    const analyzeSentiment = async (text) => {
        let prompt = "Answer either with Y or N. Is the following statement controversial, alarming, or an insult?" + text
        let params = new URLSearchParams({ prompt });

        let url = `/api/gemini?${params.toString()}`

        // Fetch the response from the API
        let res = await fetch(url);
        let data = await res.json();

        var punctuationless = JSON.stringify(data[0]).replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"");
        var finalString = punctuationless.replace(/\s{2,}/g," ");
        if (Array.from(finalString)[1].toLowerCase() == "y") {
            let choice = Math.floor(Math.random() * 2);
            setMood("🔥🔥")
            if (choice == 0) {
                refs[currently_playing].current.pause()
                currently_playing = "BACK2BACK";
                refs[currently_playing].current.play();
            } else {
                refs[currently_playing].current.pause()
                currently_playing = "NUNCAMUDA";
                refs[currently_playing].current.play();
            }
        } else {
            prompt = "Answer only with 1, 2, or 3. Answer 1 if the following statement is an exclamation (like 'Oh shoot' or 'Oh My God'), answer 2 if the following statement is apprehensive (e.g. I have a test tomorrow). Answer 3 if neither of the previous statements apply. " + text
            params = new URLSearchParams({ prompt });
            url = `/api/gemini?${params.toString()}`
            res = await fetch(url);
            data = await res.json();
            
            var punctuationless = JSON.stringify(data[0]).replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"");
            var finalString = punctuationless.replace(/\s{2,}/g," ");

            if (Array.from(finalString)[1] == "1") {
                setMood("😮")
                refs[currently_playing].current.pause()
                currently_playing = "FinalFant";
                refs[currently_playing].current.play();
            } else if (Array.from(finalString)[0] == "2") {
                setMood('Uh oh')
                refs[currently_playing].current.pause()
                currently_playing = "TimeBackBadPiano";
                refs[currently_playing].current.play();
            } else {
                var sentiment = new Sentiment()
                var result = sentiment.analyze(text);

                if (result.score >= 6 || result.comparative >= 3) {
                    let choice = Math.floor(Math.random() * 3);
                    setMood("Flowers and sunshine :)")
                    if (choice == 0) {
                        refs[currently_playing].current.pause();
                        currently_playing = "LebronSunshine";
                        refs[currently_playing].current.play(); // you are my sunshine or FE!N or animals
                    } else if (choice == 1) {
                        refs[currently_playing].current.pause();
                        currently_playing = "FEIN";
                        refs[currently_playing].current.play();
                    } else if (choice == 2) {
                        refs[currently_playing].current.pause()
                        currently_playing = "Animals";
                        refs[currently_playing].current.play();
                    }
                } else if (result.score < 6 && result.score > 2) {
                    let choice = Math.floor(Math.random() * 2);
                    if (choice == 0) {
                        refs[currently_playing].current.pause(); // Dragostea or rick roll
                        currently_playing = "Dragostea";
                        refs[currently_playing].current.play();
                    } else {
                        refs[currently_playing].current.pause();
                        currently_playing = "Rickroll";
                        refs[currently_playing].current.play();
                    }
                } else if (result.score <= 2 && result.score >= -2) {
                    setMood("Sounds like you're feeling pretty meh")
                    let choice = Math.floor(Math.random() * 2);
                    if (choice == 0) {
                        refs[currently_playing].current.pause();
                        currently_playing = "BagRaidersShooting";
                        refs[currently_playing].current.play();
                    } else {
                        refs[currently_playing].current.pause();
                        currently_playing = "ChillGuy";
                        refs[currently_playing].current.play();
                    }
                    // shooting stars or chill guy
                } else if (result.score < -2 && result.score > -6) {
                    setMood("Sounds like you're having a bad day.")
                    let choice = Math.floor(Math.random() * 2)
                    if (choice == 0)  {
                        refs[currently_playing].current.pause();
                        currently_playing = "TamarBraxtonLetMeKnow";
                        refs[currently_playing].current.play();
                    } else {
                        refs[currently_playing].current.pause();
                        currently_playing = "VitasThe7thElement";
                        refs[currently_playing].current.play();
                    }
                    // Let me know, vitas                                
                        refs[currently_playing].current.play();
                } else {
                    setMood("Womp womp.")
                    refs[currently_playing].current.pause();
                    currently_playing = "Astomania";
                    refs[currently_playing].current.play();
                }
                // what was I made for, coffin dancers
            }
        }
    }
    useEffect(() => {
        if (typeof window !== "undefined" && "webkitSpeechRecognition" in window) {
            recognition = new window.webkitSpeechRecognition();
            recognition.continuous = true;
            recognition.interimResults = true;

            recognition.onresult = (event) => {
                let interimTranscript = "";
                let finalTranscript = "";

                for (let i = event.resultIndex; i < event.results.length; i++) {
                    let text = event.results[i][0].transcript;
                    if (event.results[i].isFinal) {
                        finalTranscript += text + " ";
                    } else {
                        interimTranscript += text;
                    }
                }

                setTranscript(finalTranscript || interimTranscript);
                if (finalTranscript) {
                    analyzeSentiment(finalTranscript)
                }
            };

            recognition.onend = () => setIsListening(false);
        }
    }, []);


    const startListening = () => {
    setIsListening(true);
    recognition?.start();
    };

    const stopListening = () => {
    setIsListening(false);
    recognition?.stop();
    };

    const buttonSize = 64

    return (
    <div className="p-4 text-center">
        <div className="text-center">
            <h2 className="text-xl font-bold bg-gradient-to-r from-rose-600 to-blue-600 inline-block text-transparent bg-clip-text">Why do I hear boss music?</h2>
            <h3 className="text-lg mb-10">Enhance your quality of life with your very own theme songs!</h3>
        </div>
        <p className="mt-2 border p-3 rounded bg-gray-200">{transcript || "Start speaking..."}</p>
        <button
            className={`mt-3 px-4 py-2 bg-transparent`}
            onClick={isListening ? stopListening : startListening}
        >
        {isListening ? 
            <Image
                src='/pause-circle.svg'
                width={buttonSize}
                height={buttonSize}
                alt="Stop Recording Audio"
            /> : 
            <Image 
                src='/play-circle.svg'
                width={buttonSize}
                height={buttonSize}
                alt="Start Recording Audio"
            />
        }
        </button>
        <div className="text-center">
            <h3 className="text-lg mb-10 italic">{mood}</h3>
        </div>
        <audio className="hidden" ref={refs['Animals']} src="/Animals.mp3"/>
        <audio className="hidden" ref={refs['Astomania']} src="/Astromania.mp3"/>
        <audio className="hidden" ref={refs['BACK2BACK']} src="/BACK2BACK.mp3"/>
        <audio className="hidden" ref={refs['BagRaidersShooting']} src="/BagRaidersShootingStars.mp3"/>
        <audio className="hidden" ref={refs['ChillGuy']} src="/ChillGuy.mp3"/>
        <audio className="hidden" ref={refs['Dragostea']} src="/Dragostea.mp3"/>
        <audio className="hidden" ref={refs['FEIN']} src="/FEIN.mp3"/>
        <audio className="hidden" ref={refs['FinalFant']} src="/FinalFant.mp3"/>
        <audio className="hidden" ref={refs['LebronSunshine']} src="/LebronSunshine.mp3"/>
        <audio className="hidden" ref={refs['NUNCAMUDA']} src="/NUNCAMUDA.mp3"/>
        <audio className="hidden" ref={refs['Rickroll']} src="/Rickroll.mp3"/>
        <audio className="hidden" ref={refs['TamarBraxtonLetMeKnow']} src="/TamarBraxtonLetMeKnow.mp3"/>
        <audio className="hidden" ref={refs['TimeBackBadPiano']} src="/TimeBackBadPiano.mp3"/>
        <audio className="hidden" ref={refs['VitasThe7thElement']} src="/VitasThe7thElement.mp3"/>
        <audio className="hidden" ref={refs['WhatwasImadeFor']} src="/WhatwasImadeFor.mp3"/>
    </div>
    );
}
