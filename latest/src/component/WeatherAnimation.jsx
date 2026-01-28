import React from "react";
import Lottie from "lottie-react";

import rainAnimation from "../animations/rain.json";
import cloudAnimation from "../animations/clouds.json";
import sunAnimation from "../animations/sunny.json";
import snowAnimation from "../animations/snow.json";
import blankAnimation from "../animations/blank.json";

export default function WeatherAnimation({ condition }) {
    let animationData;

    switch (condition.toLowerCase()) {
        case "rain":
        case "drizzle":
            animationData = rainAnimation;
            break;
        case "clouds":
            animationData = cloudAnimation;
            break;
        case "clear":
        case "sunny":
            animationData = sunAnimation;
            break;
        case "snow":
            animationData = snowAnimation;
            break;
        default:
            animationData = blankAnimation;
    }

    return <Lottie animationData={animationData} loop={true} style={{ width: 200, height: 200 }} />;
}