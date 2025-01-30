import React, { useEffect, useReducer, useState } from "react";
import { apiUrl } from "../../../config/config.json";
import http from "../../../services/httpService";

const endpoint = apiUrl + "/tickets/";

function usePieChart() {
    // Constant data
    const initialState = {
        tickets: {},
        padding: {
            top: "70px",
            bottom: "70px",
        },
        categoryInfo: {}, // Ensure categoryInfo is initialized
    };
    const reducer = (state, action) => {
        switch (action.type) {
            case "SORT_DATA":
                let categoryWiseData = {};
                for (let item of action.payload) {
                    categoryWiseData[item.category] = categoryWiseData[item.category]
                        ? [...categoryWiseData[item.category], item]
                        : [item];
                }
                const pTop =
                    (categoryWiseData["bug-error"]?.length >
                        categoryWiseData["other"]?.length
                        ? calcP(categoryWiseData["bug-error"])
                        : calcP(categoryWiseData["other"])) + "px";
                const pBottom =
                    (categoryWiseData["invoices"]?.length >
                        categoryWiseData["feature-request"]?.length
                        ? calcP(categoryWiseData["invoices"])
                        : calcP(categoryWiseData["feature-request"])) + "px";
                // Sorting by priority
                const priorityOrder = ["urgent", "high", "normal", "low"];
                for (let category in categoryWiseData) {
                    let sortedArr = [];
                    for (let priority of priorityOrder) {
                        let separateByPriority = [];
                        for (let ticket of categoryWiseData[category]) {
                            if (ticket.priority === priority) {
                                separateByPriority.push(ticket);
                            }
                        }
                        sortedArr = [...sortedArr, ...separateByPriority];
                    }
                    categoryWiseData[category] = sortedArr;
                }
                return {
                    ...state,
                    tickets: categoryWiseData,
                    padding: { top: pTop, bottom: pBottom },
                };
            case "SET_CATEGORY_INFO":
                return {
                    ...state,
                    categoryInfo: action.payload,
                };
            default:
                return state;
        }
    };

    const [state, dispatch] = useReducer(reducer, initialState);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await http.get(endpoint);
                dispatch({ type: "SORT_DATA", payload: res.data });
                // Extract category info from the response data
                const categoryInfo = res.data.reduce((acc, cur) => {
                    acc[cur.category] = { color: getCategoryColor(cur.category), name: cur.category };
                    return acc;
                }, {});
                dispatch({ type: "SET_CATEGORY_INFO", payload: categoryInfo });
            } catch (error) {
                console.log(error);
            }
        };
        fetchData();
    }, []);

    function calcP(arr) {
        return (arr.length > 2 ? arr.length - 2 : 0) * 150 + 70;
    }

    // Function to get category color
    const getCategoryColor = (category) => {
        // Define color mapping for each category
        const colorMap = {
            "bug-error": "#ff00d3",
            complaint: "#b854ea",
            disconnection: "#6055eb",
            invoices: "#00c5f0",
            "feature-request": "#00f2d3",
            sales: "#00f179",
            support: "#90f05c",
            other: "#facb52",
        };
        // Return color for the category
        return colorMap[category] || "#000"; // Default color black if category not found
    };
    return { tickets: state.tickets, padding: state.padding, categoryInfo: state.categoryInfo };
}

export default usePieChart;




















