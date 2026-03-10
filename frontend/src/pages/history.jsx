import React, {useContext, useEffect, useState} from 'react';   
import {AuthContext} from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import HomeIcon from "@mui/icons-material/Home";
import { IconButton } from '@mui/material';

export default function History(){
    const {getHistoryOfUser} = useContext(AuthContext);

    const[meetings, setMeetings] = useState([])

    const routeTo = useNavigate();

    useEffect(() => {
    const fetchHistory = async () => {
    try {
        const history = await getHistoryOfUser();
        console.log("History response:", history); // Check what's returned
        
        // Try these one by one based on your API response shape:
        setMeetings(Array.isArray(history) ? history : history?.data || []);
    } catch (err) {
        console.error("Error fetching history:", err);
    }
}
     fetchHistory();
    },[])

    let formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, "0");
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const year = date.getFullYear();

        return `${day}/${month}/${year}`
    }

    return(
        <div>
            <IconButton onClick={() => {
                            routeTo("/home")
                        }}>
                         <HomeIcon/>   
                        </IconButton>
                      
            { meetings.length !== 0 ? meetings.map((e,i) => {
                    return(
                        <>

                        
                        <Card  key ={i} variant="outlined">

                         <CardContent>
      <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14 }}>
        Code: {e.meetingCode}
      </Typography>
     
      <Typography sx={{ color: 'text.secondary', mb: 1.5 }}>
        Date:{formatDate(e.date)}
        </Typography>
     
    </CardContent>
      
                        </Card>
                        </>
                    )
                }): <Typography>No meeting history found.</Typography>  
            }
        
        </div>
    )   
}