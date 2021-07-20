import React from 'react'
// import { Accordion } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';
// import Accordion from '@material-ui/core/Accordion';
// import AccordionSummary from '@material-ui/core/AccordionSummary';
// import AccordionDetails from '@material-ui/core/AccordionDetails';
import { Accordion, AccordionSummary, AccordionDetails } from '@material-ui/core'

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';


// const useStyles = makeStyles((theme) => ({
//     root: {
//         width: '70%',
//     },
// }));


const Test_accordion = () => {
    // const classes = useStyles();

    return (
        <div>
            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    // aria-controls="panel1a-content"
                    // id="panel1a-header"
                >
                    <p className="comment0 title">Accordion 1</p>
                </AccordionSummary>
                <AccordionDetails>
                    <p className="comment0 title">test1</p>
                </AccordionDetails>
            </Accordion>

            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    // aria-controls="panel2a-content"
                    // id="panel2a-header"
                >
                    <p className="comment0 title">Accordion 2</p>
                </AccordionSummary>
                <AccordionDetails>
                    <p className="comment0 title">test2</p>
                </AccordionDetails>
            </Accordion>

            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    // aria-controls="panel2a-content"
                    // id="panel2a-header"
                >
                    <p className="comment0 title">Accordion 3</p>
                </AccordionSummary>
                <AccordionDetails>
                    <p className="comment0 title">test3</p>
                </AccordionDetails>
            </Accordion>


        </div>
    );
}


export default Test_accordion
