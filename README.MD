# Nexus Hub | Real-time Chat Application

[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=flat&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=flat&logo=socket.io&logoColor=white)](https://socket.io/)
[![Express.js](https://img.shields.io/badge/Express.js-000000?style=flat&logo=express&logoColor=white)](https://expressjs.com/)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

A robust, real-time multi-client chat application built with **Node.js** and **Socket.io**. This application supports **Broadcast (Public)** and **Unicast (Private)** messaging modes, image sharing, and features a modern, responsive UI inspired by WhatsApp Web.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Demo](#demo)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation & Setup](#installation--setup)
- [Usage Guide](#usage-guide)
- [Troubleshooting](#troubleshooting)
- [Future Enhancements](#future-enhancements)
- [License](#license)
- [Contact](#contact)

## Overview

**Zentalk** Developed a real-time chat application featuring Unicast (Private) and Broadcast (Public) messaging modes with Image Sharing and Emoji support.

## Features

- **⚡ Real-time Messaging**: Instant message delivery using WebSocket protocol.
- **📢 Broadcast Mode**: Send messages to all connected users in the public lobby.
- **🔒 Unicast (Private) Mode**: Click on any user in the sidebar to start a private, one-on-one chat.
- **📷 Media Sharing**: Support for image uploads and sharing via Base64 encoding.
- **😀 Emoji Picker**: Integrated emoji picker for expressive conversations.
- **🔍 Smart Search**:
  - Filter users in the sidebar.
  - Search within chat history for specific messages.
- **🎨 Modern UI/UX**: Fully responsive design with a clean, WhatsApp-like interface.
- **👤 User Status**: Real-time updates when users join or leave the chat.
- **🗑️ Chat Management**: Option to clear chat history locally.
- **🔐 Auth Simulation**: Simple Login/Signup mechanism using Browser LocalStorage.

## Demo


## Tech Stack

- **Frontend**: HTML5, CSS, JavaScript
- **Backend**: Node.js
- **Real-time Engine**: Socket.io (WebSockets).


## Project Structure

```bash
chat-app/
├── public/                 # Client-side files
│   ├── index.html          # Main HTML structure
│   ├── style.css           # Styling and Responsive Design
│   └── script.js           # Frontend Logic & Socket Client
├── server.js               # Main Server Logic (Node.js)
├── package.json            # Dependencies and Scripts
|── README.md
|___ .gitignore                         # Project Documentation