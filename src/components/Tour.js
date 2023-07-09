import { React , useState } from "react";
import Rating from '@mui/material/Rating';
import Typography from '@mui/material/Typography';
import { alpha, styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';

import "./Tour.css";

import VerifyBot from "./chatbot/verify-bot";

const CustomSelect = styled(Select)(() => ({
    width: 300,
    "&.MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "white",
        color: "white"
      },
      "&:hover fieldset": {
        borderColor: "white",
        color: "white"
      },
      "&.Mui-focused fieldset": {
        borderColor: "white",
        color: "white"
      }
    }
  }));

function Tour()
{
    const [ showRateBox , setShowRateBox ] = useState(false);
    const [ submittedReview , setSubmittedReview ] = useState(false);
    const [value1, setValue1] = useState(2);
    const [value2, setValue2] = useState(2);
    const [value3, setValue3] = useState(2);
    const [value4, setValue4] = useState(2);
    const [value5, setValue5] = useState(2);
    const [model, setModel] = useState(0);
    const [driverRating , setDriverRating] = useState(null)
    
    const handleChange = (event) => {
        setModel(event.target.value);
        console.log( event.target.value );
      };

    
    const evaluateDriver = () => 
    {
        var score = 0;

        if( value1 == 1 || value2 == 1 || value3 == 1 || value4 == 1 || value5 == 1 )
        {
            score = 1;
        }
        else
        {
            score += value1;
            score += value2;
            score += value3;
            score += value4;
            score += value5;
            score += model;
            score /= 6
        }

        if( score > 4 )
        {
            setDriverRating("Excellent");
        }
        else if( score > 3 )
        {
            setDriverRating("Good");
        }
        else if( score > 2 )
        {
            setDriverRating("Average");
        }
        else if( score > 1 )
        {
            setDriverRating("Bad");
        }
        else
        {
            setDriverRating("Terrible");
        }

    }

    return(
        <div className="Root">

            <div className="Background01">
            <div className="MainContainerDark">
                <div className="Modules"/>
                <h2 style={{width:"66%"}}>
                
                In order to enhance the ease of integration and simplicity of the proposed solution, we've broken it down into 3 major functional parts.
                <br/><br/>
                These parts can be integrated into existing applications thus augmenting them with the added benefits provided by Accessibility Assist while also reducing development complexity and cost.
                <br/><br/>
                The 3 main functional components are :
                <br/>1. AccessiBot : An LLM based chat bot
                <br/>2. Logistic Regression Polling : An AI model for improved driver polling
                <br/>3. Dedicated Feedback : A feedback system inclusive of special needs
                </h2>
            </div>
            </div>
 
            <div className="Chatbot">
                <div className="Phone">
                <VerifyBot />
                </div>
            </div>
 
            <div className="Regression">
                <div className="RegressionBox">

                <h2 style={{alignSelf:"center", fontSize:"3vh"}}>Regression Evaluation Parameters</h2>
                <div className="RatingsOption" style={{flexDirection:"row", width:"100%", justifyContent:"start", gap:"5%"}}>
                <h2>Car Model : </h2>
                <Box sx={{ minWidth: 120 }}>
                <FormControl fullWidth color="primary">
                    <CustomSelect
                    style={{color:"white", borderColor:"white", width:"100%", height:"7vh" }}
                    color="primary"
                    id="demo-simple-select"
                    value={model}
                    onChange={handleChange}
                    defaultValue={1}
                    minWidth
                    inputProps={{ 'aria-label': 'Without label' }}
                    >
                    <MenuItem value={1}>Tata Indica</MenuItem>
                    <MenuItem value={1}>Suzuki Swift</MenuItem>
                    <MenuItem value={1}>Toyota Glanza</MenuItem>

                    <MenuItem value={2.5}>Tata Tigor</MenuItem>
                    <MenuItem value={2.5}>Suzuki Dzire</MenuItem>
                    <MenuItem value={2.5}>Toyota Etios</MenuItem>

                    <MenuItem value={5}>Tata Sumo</MenuItem>
                    <MenuItem value={5}>Suzuki Ertiga</MenuItem>
                    <MenuItem value={5}>Toyota Innova</MenuItem>
                    </CustomSelect>
                </FormControl>
                </Box>

                </div>

                <div className="RatingOptionsBox">

                <div className="RatingsOption">
                <h2>Overall</h2>
                    <Rating
                        name="simple-controlled"
                        value={value1}
                        defaultValue={0}
                        onChange={(event, newValue) => {
                        setValue1(newValue);
                        }}
                    />
                </div>

                <div className="RatingsOption">
                <h2>Seating Space</h2>
                    <Rating
                        name="simple-controlled"
                        value={value2}
                        defaultValue={0}
                        onChange={(event, newValue) => {
                        setValue2(newValue);
                        }}
                    />
                </div>

                <div className="RatingsOption">
                <h2>Storage Space</h2>
                    <Rating
                        name="simple-controlled"
                        value={value3}
                        defaultValue={0}
                        onChange={(event, newValue) => {
                        setValue3(newValue);
                        }}
                    />
                </div>

                <div className="RatingsOption">
                <h2>Driver Behaviour</h2>
                    <Rating
                        name="simple-controlled"
                        value={value4}
                        defaultValue={0}
                        onChange={(event, newValue) => {
                        setValue4(newValue);
                        }}
                    />
                </div>

                <div className="RatingsOption">
                <h2>Overall Accessibility</h2>
                    <Rating
                        name="simple-controlled"
                        value={value5}
                        defaultValue={0}
                        onChange={(event, newValue) => {
                        setValue5(newValue);
                        }}
                    />
                </div>


                </div>

    
                    <div className="SubmitButton" style={{fontSize:"1.5vh", alignSelf:"center"}} onClick={ evaluateDriver }>Submit</div>

                    {
                        driverRating && <div className={"DriverRating "+driverRating}>{driverRating}</div>    
                    }

                </div>
            </div>
 
            <div className="Feedback">

                <div className="Rate">
                    <div className="RateButton HighlightButton" onClick={ () => { setShowRateBox(!showRateBox) } }>Rate Driver</div>
                    <div className={"RateBox " + (showRateBox?"ShowRateBox":"")}>


                    <h2>Overall</h2>
                    <Rating
                        name="simple-controlled"
                        value={value1}
                        defaultValue={0}
                        onChange={(event, newValue) => {
                        setValue1(newValue);
                        }}
                    />

                    <h2>Seating Space</h2>
                    <Rating
                        name="simple-controlled"
                        value={value2}
                        defaultValue={0}
                        onChange={(event, newValue) => {
                        setValue2(newValue);
                        }}
                    />

                    <h2>Storage Space</h2>
                    <Rating
                        name="simple-controlled"
                        value={value3}
                        defaultValue={0}
                        onChange={(event, newValue) => {
                        setValue3(newValue);
                        }}
                    />

                    <h2>Driver Behaviour</h2>
                    <Rating
                        name="simple-controlled"
                        value={value4}
                        defaultValue={0}
                        onChange={(event, newValue) => {
                        setValue4(newValue);
                        }}
                    />

                    <h2>Overall Accessibility</h2>
                    <Rating
                        name="simple-controlled"
                        value={value5}
                        defaultValue={0}
                        onChange={(event, newValue) => {
                        setValue5(newValue);
                        }}
                    />  
                    
                    <div className="SubmitButton" onClick={ () => { setSubmittedReview(true) } }>Submit</div>

                    </div>
                
                    {
                        submittedReview && (<div className="RatingDone HoldPosition">
                        <div className="Tick"></div>
                        <h1>Review Submitted!</h1>
                        </div>)
                    }
                    
                </div>
                
            </div>
 
        </div>
    )
}

export default Tour;