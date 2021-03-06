import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import SwipeableViews from "react-swipeable-views";
import { makeStyles } from "@material-ui/core/styles";

import Avatar from "@material-ui/core/Avatar";
import Card from "@material-ui/core/Card";

import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";

import Drink_NowTweet from './Drink_NowTweet'
import Drink_NowTweetNext from './Drink_NowTweetNext'
import Drink_NowFeed from './Drink_NowFeed'

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
            width: "95%"
        },
        cardContent: {
            textAlign: "center"
        }
    };
});

const Drink_Slide = ({ DB, STORAGE, STORAGE2, uid }) => {


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

    const getPubsData = (() => {
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
    })


    useEffect(() => {
        getPubsData()
    }, []);

    // ******************************
    const [swipeableActions, setSwipeableActions] = useState();
    const [tabIndex, setTabIndex] = useState(0);

    const classes = useStyles();

    const handleChange = index => { setTabIndex(index) };

    useEffect(() => {
        const ms = 300;
        setTimeout(() => setTabIndex(2), ms * 1);
        setTimeout(() => setTabIndex(3), ms * 2);
        setTimeout(() => setTabIndex(4), ms * 3);
        setTimeout(() => setTabIndex(0), ms * 4);
    }, [])

    return (
        <div className="slide">
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
                            <div className="center">
                                <img
                                    alt={postItem.item_fullName}
                                    className={classes.image}
                                    src={postItem.image}
                                />
                            </div>
                            <CardContent className={classes.cardContent}>
                                <Typography
                                    variant="body2"
                                    color="textSecondary"
                                    component="p"
                                >
                                    <span className="our_font">{postItem.text}</span>

                                </Typography>
                                <hr />
                                {uid &&
                                    (<Drink_NowTweet
                                        id={postItem.id}
                                        DB={DB}
                                        STORAGE2={STORAGE2}
                                        uid={uid}
                                    />)
                                }
                                {!uid && (<Drink_NowTweetNext />)}
                                <div className="our_font">
                                    <Drink_NowFeed
                                        id={postItem.id}
                                        DB={DB}
                                        STORAGE={STORAGE}
                                        STORAGE2={STORAGE2}
                                    />
                                    <p className="comment3">??????????????????????????????????????????????????????????????????!????????????????????????????????????</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                ))}
            </SwipeableViews>
        </div>
    );
};
export default Drink_Slide;
