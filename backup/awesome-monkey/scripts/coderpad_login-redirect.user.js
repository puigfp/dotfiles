// ==UserScript==
// @name        Coderpad login redirect
// @namespace   Benoit's hackywacky User Scripts
// @match       https://app.coderpad.io/*
// @grant       none
// @version     1.0
// @author      Benoit Zugmeyer
// @description Redirects to the opened pad after logging in Coderpad.
// ==/UserScript==

const pathname = location.pathname;

if (pathname.endsWith("/waiting_room")) {
  sessionStorage.setItem("next", pathname.slice(0, -"/waiting_room".length));
} else if (pathname === "/dashboard/pads") {
  const next = sessionStorage.getItem("next");
  if (next) {
    sessionStorage.removeItem("next");
    location.href = next;
  }
}