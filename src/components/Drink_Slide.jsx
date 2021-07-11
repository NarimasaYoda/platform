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

const Drink_Slide = ({ DB, STORAGE, STORAGE2, uid }) => {
    const [posts, setPosts] = useState([{
        id: "",
        date: "",
        event: "",
        image: "",
        image_name: "",
        text: "",

        tag_name: "",// itemNames = ["GTJZ", "Toshiya", "タナ", "大当", "夢亀"];
        item_initial: "",// itemInitial = ["G", "T", "T", "O", "Y"];
        item_fullName: "",//itemOfficialNames = ["後藤醸造","寿矢","タナ","大当たり","夢亀ラーメン"];
        item_comment: "",//itemCategories = ["立ち飲み！", "寿司うまし", "魚が美味", "ソウルフード", "熊本ラーメン"];

        timestamp: null,
    }]);

    //useEffectを使って、firebaseのデータを取得してuseStateで保持する。Firebaseに変更があったら感知する(Firebaseの機能)。
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
    }, []); //最初に一度Firebaseにアクセスすることを意味する

    const [swipeableActions, setSwipeableActions] = useState();
    const [tabIndex, setTabIndex] = useState(0);

    const classes = useStyles();

    const handleChange = index => { setTabIndex(index) };

    useEffect(() => {
        const ms = 500;
        setTimeout(() => setTabIndex(2), ms * 2);
        setTimeout(() => setTabIndex(3), ms * 3);
        setTimeout(() => setTabIndex(4), ms * 4);
        setTimeout(() => setTabIndex(0), ms * 5);
    }, [])

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
                            <CardContent className={classes.cardContent}>
                                <Typography
                                    variant="body2"
                                    color="textSecondary"
                                    component="p"
                                >
                                    {postItem.text}
                                </Typography>
                                <hr />
                                {uid &&
                                    (<Drink_NowTweet
                                        id={postItem.id}
                                        DB={DB}
                                        STORAGE={STORAGE}
                                        STORAGE2={STORAGE2}
                                        uid={uid}
                                    />)
                                }
                                {!uid &&
                                    (<Drink_NowTweet
                                        id={postItem.id}
                                        DB={DB}
                                        STORAGE={STORAGE}
                                        STORAGE2={STORAGE2}
                                    />)
                                }

                                <Drink_NowFeed
                                    id={postItem.id}
                                    DB={DB}
                                    STORAGE={STORAGE}
                                    STORAGE2={STORAGE2}
                                />

                            </CardContent>
                        </Card>
                    </div>
                ))}
            </SwipeableViews>

        </>
    );
};
export default Drink_Slide;
