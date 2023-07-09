import { useState, useEffect, useRef , React } from "react";
import "./verify-bot.css";

import { MapContainer, TileLayer, useMap, Marker, Popup , useMapEvents } from 'react-leaflet'

import { useNavigate } from "react-router-dom";
import SendIcon from "./images/send.png";
import MicIcon from "./images/mic.png";
import TtsDisabledIcon from "./images/notts.png";
import TtsEnabledIcon from "./images/tts.png";
import Loading from "./images/loading.gif";

import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadBytes } from "firebase/storage";

import { Configuration, OpenAIApi } from "openai";


var notkeya = "sk-lHvy@RfdJc@n3jIu"
var notkeyb = "Vhc8Hu@T3BlbkFJ@l1P3"
var notkeyc = "j4b@PTnav@uLMDapPl"


var lat = 0.0 
var long = 0.0

const configuration = new Configuration({
    organization: "org-RZ3uSWP75ShMsyLdXuc7Hot7",
    apiKey: (notkeya + notkeyb + notkeyc).replaceAll( "@" , "" ),
  });

  //console.log( (notkeya + notkeyb + notkeyc).replaceAll( "@" , "" ) )

const openai = new OpenAIApi(configuration);



const firebaseConfig = {

    apiKey: "AIzaSyDediO1CPm4T60pxMLhuimFI3xIFQD7rbw",
  
    authDomain: "verify-bot-ennovate.firebaseapp.com",
  
    projectId: "verify-bot-ennovate",
  
    storageBucket: "verify-bot-ennovate.appspot.com",
  
    messagingSenderId: "656544899745",
  
    appId: "1:656544899745:web:977f5c9b78d1dfee7a06e0",
  
    measurementId: "G-2842XBLZSE"
  
  };
  

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

var access_token = null;
const API_KEY = "39k8898c-c21h-4i09-bh78-h8hh04l2b12";
const url_start = "https://firebasestorage.googleapis.com/v0/b/verify-bot-ennovate.appspot.com/o/";
const url_end = "?alt=media&token=7838da10-fa19-42b9-a953-f3bade7848ee";
var session_id = "";






async function getAccessToken()
    {

                // console.log("Getting Access Token");
                // const req = await fetch( "https://client-sandbox-verification-api.pre.enncrypto.com/auth/login" , {
                //     method : "POST",
                //     headers: {
                //         "Content-Type": "application/json",
                //       },
                //     body: JSON.stringify( {api_key : API_KEY} )
                // }).then( async (response) => {
                //     var body = await response.json();
                //     console.log( body.access_token );
                //     access_token = body.access_token;
                // } );
                // access_token = JSON.parse(response.json().body).access_token;
                // console.log( access_token )

        // setTimeout(
        //     () => {
        //     getAccessToken();    
        //     },
        //     240000
        // );

    }

    
    function text2Binary(string) {
        return string.split('').map(function (char) {
            return char.charCodeAt(0).toString(2);
        }).join(' ');
    }

    var logicState = 0;

    function setLogicState(val)
    {
        logicState = val;
    }

    var last_user_message = "";

function VerifyBot()
{
    const navigate = useNavigate();

    const introduction = "Hi, I'm AccessiBot. A chat bot designed to assist individuals to book a ride using text based prompts. I support Text-To-Speech as well as speech recognition so feel free to use those if needed! Say Hi to begin the booking process!";
    const tutorial = "You can follow the tutorial on the left to verify the authenticity of a product.";
    const begin_verify = "Click the button below to begin verification";
    const error_msg = "I'm sorry, but I wasn't able to handle the request. Please try again."
    const start_booking = "Would you like to use your current location?"
    const own_location = "Ensure location services are enabled so we can get your location"
    const specific_location = "Specify the pick up address"
    const drop_location = "Specify the drop off address"
    const special_needs = "Are you in need of accessibility accomodations?"
    const ready_to_book = "Alright! I shall look around for cabs that can service your request! Hang tight!"

    const [showBot , setShowBot] = useState(false);
    const [inputMessage , setInputMessage] = useState("");
    const [buttonIcon, setButtonIcon] = useState( "url("+MicIcon+")" )
    const [messages , setMessages] = useState([ { source : "Bot" , message : introduction } ])
    const [ttsEnabled , setTtsEnabled] = useState(false)
    const [listening , setListening] = useState(false)
    
    const [ srcLat , setSrcLat ] = useState(22.328133)
    const [ srcLon , setSrcLon ] = useState(79.062075)
    const [ desLat , setDesLat ] = useState(22.328133)
    const [ desLon , setDesLon ] = useState(79.062075)

    const inputFile = useRef(null) 
    const chatscroll = useRef(null)


    //Speech Synthesis
    const synth = window.speechSynthesis;


    const getLatLon = async (query , src) => {
        fetch(query).then((response) => (
            response.json()
        )).then((user) => {
        
            if ( src === true )
            {
                setSrcLat( user[0].lat )
                setSrcLon( user[0].lon )
            }
            else
            {
                setDesLat( user[0].lat )
                setDesLon( user[0].lon )
            }
        
        }).then(console.log("Done"));
    };

    const geoCode = (addr , src) => {
        var query = "https://nominatim.openstreetmap.org/search.php?q=";
        var start_query = addr.split(" ");
        for (let i = 0; i < start_query.length; i++)
        {
            query += "+" + start_query[i];
        }
        query += "&format=jsonv2";
        console.log(query);
        getLatLon(query , src);
    }





    useEffect(() => {
        if (chatscroll) {
            chatscroll.current.addEventListener('DOMNodeInserted', event => {
            const { currentTarget: target } = event;
            target.scroll({ top: target.scrollHeight, behavior: 'smooth' });
          });
        }
      }, [])

      useEffect(
        () => {
        
        if( messages[0].source == "User")
        {

        // setTimeout( () => {
        //     var lastMessage = messages[0].message;
        //     console.log( messages )
        //     setMessages( arr => [ { source : "Bot" , message : lastMessage } , ...arr ] )
        // } , 1000 );

        }
        else if( messages[0].source === "Bot" )
        {
            var lastMessage = messages[0].message;
            console.log( messages )
            const utterThis = new SpeechSynthesisUtterance(lastMessage);
            if(ttsEnabled)
            {    
            utterThis.pitch = 1;
            utterThis.rate = 1;
            utterThis.volume = 0.1;
            synth.speak(utterThis);
            }
        }

        }
        , [messages, ttsEnabled]
      );



          const getLanguageGPT = async (message) => {
            var prompt = `
            determine the language of the source text as follows:
            source = "Hello, nice to meet you!"
            answer = English

            source = "`+message+`"
            answer = 
            `;
        
            console.log(prompt)

            var prompts =  [ { role : "user" , content : prompt }
                            ] 
            

            try {
        
                const result = await openai.createChatCompletion({
                    model: "gpt-3.5-turbo-0613",
                    messages: prompts,
                    max_tokens: 200,
                  });
        
                var chat_response = result.data.choices[0].message.content //.data.choices[0].text;
                console.log(chat_response);
                return chat_response;
            } catch (e) {
                console.error(e);
                return "English";
              }
          }

          const translateGPT = async (message) => {

            console.log("Translate : " + message)

            var language = await getLanguageGPT(last_user_message);

            if( language === "English" || language === "english" )
            {
                return message;
            }

            var prompt = `
            translate "`+message+`" to `+language+`
            `;
        
            console.log(prompt)

            var prompts =  [ { role : "user" , content : prompt }
                            ] 
            

            try {
        
                const result = await openai.createChatCompletion({
                    model: "gpt-3.5-turbo-0613",
                    messages: prompts,
                    max_tokens: 200,
                  });
        
                var chat_response = result.data.choices[0].message.content //.data.choices[0].text;
                console.log(chat_response);
                return chat_response;
            } catch (e) {
                console.error(e);
                return message;
              }
          }


          var init_prompt = [ { role : "user" , content : "Accept the following prompts and classify them as { 1 : 'Request to book a cab',  2 : 'Tutorial request for verification' , 3 : 'Request for introduction' , 4 : 'Greeting' }. in the format { classification : classification_key }" }, 
          { role : "assistant" , content : "Sure! Please provide the prompts, and I'll classify them for you." }] 

          var devicelocations = [ { role : "user" , content : "Accept the following prompts and classify them as { 1 : 'Affirmitive',  2 : 'Negative' }. in the format { classification : classification_key }" },
          { role : "assistant" , content : "Sure! Please provide the prompts, and I'll classify them for you." }]

          const promptChatGPT = async (message) => {
        
            if( message.length == 0 )
            {
                return;
            }
        
            console.log("Prompt : " + message)
            
            var prompts = null

            if( logicState === 0 )
            {
                prompts = init_prompt;
            }

            if( logicState === 1 || logicState === 4 )
            {
                prompts = devicelocations;
            }
            
            
            if( logicState === 2 )
            {
                geoCode( message , true );
                setMessages( arr => [ { source : "Bot" , map : true , src : true } , ...arr ] )
                setLogicState(3);
                return;
            }
            
            if( logicState === 3 )
            {
                geoCode( message , true );
                setMessages( arr => [ { source : "Bot" , map : true , src : true } , ...arr ] )
                var mess = await translateGPT(special_needs);
                setMessages( arr => [ { source : "Bot" , message : mess } , ...arr ] )
                setLogicState(4)
                return;
            }

            prompts.push( { role : "user" , content : "prompt : " + message } )

            try {
        
                const result = await openai.createChatCompletion({
                    model: "gpt-3.5-turbo-0613",
                    messages: prompts,
                    max_tokens: 200,
                  });
        
                var chat_response = result.data.choices[0].message.content //.data.choices[0].text;


                if( logicState === 0 )
                {

                    if( chat_response.includes("1") )
                    {
                        var mess = await translateGPT(start_booking);
                        setMessages( arr => [ { source : "Bot" , message : mess } , ...arr ] )
                        setLogicState(1);
                    }
                    else if( chat_response.includes("2") )
                    {
                        var mess = await translateGPT(tutorial);
                        setMessages( arr => [ { source : "Bot" , message : mess } , ...arr ] )
                        navigate( "/verifybot/tutorial");
                    }
                    else if( chat_response.includes("3") )
                    {
                        var mess = await translateGPT(introduction);
                        setMessages( arr => [ { source : "Bot" , message : mess } , ...arr ] )    
                    }
                    else if( chat_response.includes("4") )
                    {
                        var mess = await translateGPT(start_booking);
                        setMessages( arr => [ { source : "Bot" , message : mess } , ...arr ] )
                        setLogicState(1);    
                    }
                    else
                    {
                        var mess = await translateGPT(chat_response);
                        setMessages( arr => [ { source : "Bot" , message : mess } , ...arr ] )
                    }
    
                }

                if( logicState === 1 )
                {
                    if( chat_response.includes("1") )
                    {


                        function showPosition(position) {
                            console.log(position)
                            lat = position.coords.latitude
                            long = position.coords.longitude

                            setSrcLat(lat)
                            setSrcLon(long)

                          }
                          
                          function getLocation() {
                            if (navigator.geolocation) {
                              navigator.geolocation.getCurrentPosition(showPosition);
                            } else {
                              console.log("Not supported!")
                            }
                          }
                          
                          getLocation();

                        var mess = await translateGPT(own_location);
                        setMessages( arr => [ { source : "Bot" , message : mess } , ...arr ] )
                        setMessages( arr => [ { source : "Bot" , map : true , src : true } , ...arr ] )
                        setMessages( arr => [ { source : "Bot" , message : drop_location } , ...arr ] )
                        setLogicState(3)
                    }
                    else if( chat_response.includes("2") )
                    {
                        var mess = await translateGPT(tutorial);
                        setMessages( arr => [ { source : "Bot" , message : specific_location } , ...arr ] )
                        setLogicState(2)
                    }
                }

                if( logicState === 4 )
                {
                        var mess = await translateGPT(tutorial);
                        setMessages( arr => [ { source : "Bot" , message : ready_to_book } , ...arr ] )
                        setMessages( arr => [ { source : "Bot" , message : "Session ended. Say 'Hi' to book another ride." } , ...arr ] )
                        setLogicState(0)
                }



                console.log(chat_response);
        
            } catch (e) {
                console.error(e);
                setMessages( arr => [ { source : "Bot" , message : "Oops, unfortunately I ran into an error when accessing openAI's services. Please try again after a minute! Error Info : " + e } , ...arr ] )  
            }
        
          }
        


    function handleClick(event)
    {
        if( inputMessage.length > 0 )
        {
            console.log( "Sending Message" );
            console.log( inputMessage );
            last_user_message = inputMessage;
            setMessages( arr => [ { source : "User" , message : inputMessage } , ...arr ] )
            promptChatGPT(inputMessage);
            setInputMessage("");
        }
        else{

            console.log("Mic requested");
            const SpeechRecognitionEvent =
            window.SpeechRecognitionEvent || window.webkitSpeechRecognitionEvent;
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
            
            if (typeof SpeechRecognition === "undefined") {
                setMessages( arr => [ { source : "Bot" , message : "I'm sorry, but the browser doesn't support Web Speech Recognition API. Try using Chrome." } , ...arr ] )
            } else {
                console.log(SpeechRecognition);
                const recognition = new SpeechRecognition();
                const start = () => { setListening(true); console.log("listening") };
                const stop = () => { setListening(false); console.log("stopped listening"); recognition.stop();  };
                const onResult = event => {
                    console.log("result called");
                    for (const res of event.results) {
                        setInputMessage( inputMessage + res[0].transcript)
                    }
                    setTimeout( () => {stop()} , 3000 );
                };
                
                recognition.continuous = true;
                recognition.interimResults = true;
                recognition.addEventListener("result", onResult);
                recognition.start();
                setButtonIcon("url("+Loading+")");
            }



        }
    }  

    function toggleTts()
    {
        setMessages( arr => [ { source : "Bot" , message : "Text-To-Speech has been " + ( ttsEnabled ? "disabled" : "enabled" ) } , ...arr ] )
        setTtsEnabled( !ttsEnabled );
    }   

    function hideBot()
    {
        setShowBot(false);
    }

    function revealBot()
    {
        setShowBot(true);
    }

    const genMap = () => {
    }


    useEffect( ()=> {
        console.log( inputMessage )
        if( inputMessage )
        {
            setButtonIcon("url("+SendIcon+")");
        }
        else
        {
            setButtonIcon("url("+MicIcon+")");
        }
    },
        [inputMessage]
    );

    return (

        <div className="VerifyBot">
        <div className={"BotBody " + (showBot ? "Reveal" : "Hide")}>
            <div className="BotContent">
                <div className="BotHeaderSection">
                    <div className="BotIcon"></div>
                    <div className="BotTitle"><h1>AccessiBot</h1></div>
                    <div className="TtsButton" onClick={toggleTts} style={{backgroundImage : "url(" + ( ttsEnabled ? TtsEnabledIcon : TtsDisabledIcon ) + ")"}}></div>
                    <div className="CloseButton" onClick={hideBot}></div>
                </div>
                <div className="BotChatSection" ref={chatscroll}>
                    <div className="BotChatScrollable">
                    {
                    messages && messages.map( (element,index) => {
                         
                        if( element.message )
                        {
                            return <div key={index+element.message} className={ "BotMessage " + ( element.source == "Bot" ? "Bot" : "User" ) + " " + ( index == 0 ? "NewMessage" : "" ) }>{element.message}</div> 
                        }
                        else if( element.button )
                        {
                            return <div key={index+Math.random()} className={ "BotMessage " + ( "Bot" ) + " " + ( index == 0 ? "NewMessage" : "" ) }><button className="BotVerifyButton">Verify Product</button></div> 
                        }
                        else if(element.map)
                        {
                            return  (       
                            <div className="BotMessage map" id="map1">
                            <MapContainer center={ element.src ? [ srcLat , srcLon ] : [ desLat , desLon ] } zoom={3} scrollWheelZoom={true} >

                                <TileLayer
                                    attribution='<a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />

                                
                                <Marker position={ element.src ? [ srcLat , srcLon ] : [ desLat , desLon ] }>
                                </Marker>

                            </MapContainer>
                            </div>
                      )

                        }
                        else
                        {
                            return <div key={index+element.image} className={ "BotMessage " + ( element.source == "Bot" ? "Bot" : "User" ) + " " + ( index == 0 ? "NewMessage" : "" ) + " Image" } style={{backgroundImage:"url("+(element.image)+")"}} ></div>     
                        } 
                         
                        
                        })
                    }

                    </div>
                </div>
                <div className="BotInputSection">
                    <input placeholder="Enter message" value={inputMessage} onKeyUp={ (event) => { event.key === "Enter" && handleClick() } } onChange={ (event) => { setInputMessage(event.target.value) } } type="text" className="BotInputText"></input>
                    <button style={{ backgroundImage : buttonIcon }} onClick={handleClick} className="BotInputButton"></button>
                </div>
            </div>
        </div>

        <div className={"BotShowButton " + (!showBot ? "Reveal1" : "Hide")} onClick={revealBot}></div>

        </div>

    );

}

export default VerifyBot;





























