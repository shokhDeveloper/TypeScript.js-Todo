"use strict";
let getItem = (key) => window.localStorage.getItem(key);
let setItem = (key, value) => window.localStorage.setItem(key, typeof value === "object" ? JSON.stringify(value) : value);
let generateId = () => {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
};
