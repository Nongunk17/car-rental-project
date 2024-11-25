"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.firebaseConfig = exports.db = void 0;

var app_1 = require("firebase/app");
var firestore_1 = require("firebase/firestore");



// Initialize Firebase
var app = (0, app_1.initializeApp)(firebaseConfig);
// Remove the initialization for analytics
// var analytics = (0, analytics_1.getAnalytics)(app);
var db = (0, firestore_1.getFirestore)(app);
exports.db = db;