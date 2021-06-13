import React, { useState } from "react";
import SwipeableViews from "react-swipeable-views";
import { makeStyles } from "@material-ui/core/styles";

import Avatar from "@material-ui/core/Avatar";
import Card from "@material-ui/core/Card";

import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";

import item001 from "./sub_images/item001.jpg";
import item002 from "./sub_images/item002.jpg";
import item003 from "./sub_images/item003.jpg";
import item004 from "./sub_images/item004.jpg";
import item005 from "./sub_images/item005.jpg";

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

const Drink_Slide = () => {
    const [swipeableActions, setSwipeableActions] = useState();
    const [tabIndex, setTabIndex] = useState(0);
    const classes = useStyles();

    const items = [item001, item002, item003, item004, item005];
    const itemInitial = ["G", "T", "T", "O", "Y"];
    const itemNames = ["GTJZ", "Toshiya", "タナ", "大当", "夢亀"];
    const itemOfficialNames = [
        "後藤醸造",
        "寿矢",
        "タナ",
        "大当たり",
        "夢亀ラーメン"
    ];
    const itemcategories = ["立ち飲み！", "寿司うまし", "魚が美味", "ソウルフード", "熊本ラーメン"];
    const contentTexts = [
        "「後藤醸造」は東京農業大学出身のご夫婦がつくるクラフトビール。",
        "2件目でゆっくりと。大人なお店です。",
        "こちらは1件目に最適なお店です。",
        "いつも行列です。ランチ時の名店。福岡のソウルフードで取材あり。",
        "「ホームランラーメン」の絵本が魅力的。早い再開を願います。"
    ];



    const handleChange = index => {
        setTabIndex(index);
    };

    return (
        <>
            <Tabs
                value={tabIndex}
                onChange={(e, value) => handleChange(value)}
                variant="fullWidth"
                indicatorColor="primary"
            >
                {itemNames.map((itemName, index) => (
                    <Tab
                        className={tabIndex === index && classes[`active${index}`]}
                        label={itemName}
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
                {items.map((item, index) => (
                    <div key={index} className={classes[`slide${index}`]}>
                        <Card className={classes.card}>
                            <CardHeader
                                avatar={
                                    <Avatar aria-label="recipe" className={classes.avatar}>
                                        {itemInitial[index]}
                                    </Avatar>
                                }
                                title={itemOfficialNames[tabIndex]}
                                subheader={itemcategories[tabIndex]}
                            />
                            <img
                                alt={itemOfficialNames[tabIndex]}
                                className={classes.image}
                                src={item}
                            />
                            <hr />
                            <CardContent className={classes.cardContent}>
                                <Typography
                                    variant="body2"
                                    color="textSecondary"
                                    component="p"
                                >
                                    {contentTexts[tabIndex]}
                                </Typography>

                            </CardContent>
                        </Card>
                    </div>
                ))}
            </SwipeableViews>
        </>
    );
};
export default Drink_Slide;
