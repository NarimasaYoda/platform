import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import SwipeableViews from "react-swipeable-views";
import { makeStyles } from "@material-ui/core/styles";

import Avatar from "@material-ui/core/Avatar";
import Card from "@material-ui/core/Card";

import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";

// import Drink_Modal from './Drink_Modal'
// import Drink_Now from './Test_Drink_Now'

const useStyles = makeStyles(() => {
    const baseStyle = {
        padding: "1em",
        color: "white"
    };

    const activeBaseStyle = {
        color: "white",
        borderTopLeftRadius: "5px",
        borderTopRightRadius: "5px"
    };

    return {
        slide0: {
            ...baseStyle,
            backgroundColor: "skyblue"
        },
        slide1: {
            ...baseStyle,
            backgroundColor: "orange"
        },
        slide2: {
            ...baseStyle,
            backgroundColor: "indianred"
        },
        slide3: {
            ...baseStyle,
            backgroundColor: "#e4b860"
        },
        slide4: {
            ...baseStyle,
            backgroundColor: "#60bce4"
        },
        image: {
            margin: "0 0 0 70px",
            height: "150px"
        },
        active0: {
            ...activeBaseStyle,
            backgroundColor: "lightseagreen"
        },
        active1: {
            ...activeBaseStyle,
            backgroundColor: "yellowgreen"
        },
        active2: {
            ...activeBaseStyle,
            backgroundColor: "pink"
        },
        active3: {
            ...activeBaseStyle,
            backgroundColor: "#98752e"
        },
        active4: {
            ...activeBaseStyle,
            backgroundColor: "#2e8598"
        },
        card: {
            margin: "0 auto",
            width: "70%"
        },
        cardContent: {
            textAlign: "center"
        }
    };
});

const Drink_Slide = ({ DB, STORAGE, uid }) => {

    const [posts, setPosts] = useState([{
        id: "",
        date: "",
        event: "",
        image: "",
        image_name: "",
        text: "",

        tag_name: "",// itemNames = ["GTJZ", "Toshiya", "??????", "??????", "??????"];
        item_initial: "",// itemInitial = ["G", "T", "T", "O", "Y"];
        item_fullName: "",//itemOfficialNames = ["????????????","??????","??????","????????????","??????????????????"];
        item_comment: "",//itemCategories = ["???????????????", "???????????????", "????????????", "??????????????????", "??????????????????"];

        timestamp: null,
    }]);


    //useEffect???????????????firebase???????????????????????????useState??????????????????Firebase????????????????????????????????????(Firebase?????????)???
    useEffect(() => {
        const firebaseData = db
            .collection(DB)
            .orderBy('timestamp', 'asc')
            .onSnapshot((snapshot) =>
                setPosts(
                    snapshot.docs.map((doc) => ({
                        id: doc.id,
                        date: doc.data().date,
                        event: doc.data().event,
                        image: doc.data().image,
                        image_name: doc.data().image_name,
                        text: doc.data().text,

                        tag_name: doc.data().tag_name,
                        item_initial: doc.data().item_initial,
                        item_fullName: doc.data().item_fullName,
                        item_comment: doc.data().item_comment,

                        timestamp: doc.data().timestamp
                    }))
                )
            )
    }, []); //???????????????Firebase??????????????????????????????????????????



    const [swipeableActions, setSwipeableActions] = useState();
    const [tabIndex, setTabIndex] = useState(0);

    const classes = useStyles();

    const handleChange = index => { setTabIndex(index) };

    return (
        <>
            <Tabs
                value={tabIndex}
                onChange={(e, value) => handleChange(value)}
                variant="fullWidth"
                indicatorColor="primary"
            >
                {posts.map((postItem, index) => (
                    <Tab
                        className={tabIndex === index && classes[`active${index}`]}
                        label={postItem.tag_name}
                    />
                ))}

            </Tabs>

            <SwipeableViews
                enableMouseEvents
                action={actions => setSwipeableActions(actions)}
                resistance
                animateHeight
                index={tabIndex}
                onChangeIndex={index => handleChange(index)}
            >
                {posts.map((postItem, index) => (
                    <div key={index} className={classes[`slide${index}`]}>
                        <Card className={classes.card}>
                            <CardHeader
                                avatar={
                                    <Avatar aria-label="recipe" className={classes.avatar}>
                                        {postItem.item_initial}
                                    </Avatar>
                                }
                                title={postItem.item_fullName}
                                subheader={postItem.item_comment}
                            />
                            <img
                                alt={postItem.item_fullName}
                                className={classes.image}
                                src={postItem.image}
                            />
                            <hr />
                            <CardContent className={classes.cardContent}>
                                <Typography
                                    variant="body2"
                                    color="textSecondary"
                                    component="p"
                                >
                                    {postItem.text}
                                </Typography>

                                {/* <Drink_Modal
                                    id={postItem.id}
                                    DB={DB}
                                    STORAGE={STORAGE}
                                    uid={uid} />

                                <Drink_Now
                                    id={postItem.id}
                                    DB="pubs"
                                    STORAGE="image_pubs"
                                /> */}

                            </CardContent>
                        </Card>
                    </div>
                ))}
            </SwipeableViews>
        </>
    );
};
export default Drink_Slide;
