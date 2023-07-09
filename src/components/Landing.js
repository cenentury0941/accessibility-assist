import React from "react";
import { useNavigate } from "react-router-dom";

import down from "./images/down.png"
import "./Landing.css";

function Landing()
{
    const navigate = useNavigate();

    return (
        <div className="Root">
        <div className="Background01Main">
            <div className="MainContainer">
                <div className="Title"></div>
                <div className="FlexRow">
                    <div className="Button" onClick={() => {navigate("./tour")}}>Take The Tour</div>
                    <div className="Button" onClick={() => {window.open( "https://github.com/cenentury0941/accessibility-assist" )}}>
                        Go To Github
                    </div>
                </div>
                <img src={down} className="ArrowImg"/>
            </div>
        </div>
        
        <div className="Background02">
        <div className="MainContainerDark">
                <div className="About"/>
                <h2 style={{width:"66%"}}>
                
                Accessibility Assist is a multi-module approach to handling Accessibility related issues in ride booking services.
                <br/><br/>
                Transportation is one of the most significant barriers between people with disabilities and their full participation in the community. We aim to solve this issue using appropriate technological advances made in recent times such as Large Language Models, Speech Recognition and Synthesis and Logistic Regression Model.

                </h2>
            </div>
        </div>

        <div className="Background03Pain">

        </div>

        <div className="Background04">
            <div className="Book Float"/>
        </div>

        <div className="Background05">
            <div className="Taxi Float"/>
        </div>

        <div className="Background06">
            <div className="Rating Float"/>
        </div>

        <div className="Background07">
        </div>


        </div>
    )
}

export default Landing;