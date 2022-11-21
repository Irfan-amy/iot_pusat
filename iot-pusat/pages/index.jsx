
import Head from "next/head";
import React, { use, useEffect, useState } from "react";
import { HiMenuAlt3 } from "react-icons/hi";
import {
  MdOutlineDashboard,
  MdOutlineSystemSecurityUpdateGood,
} from "react-icons/md";
import { RiSettings4Line } from "react-icons/ri";
import { TbReportAnalytics } from "react-icons/tb";
import { AiOutlineUser, AiOutlineHeart } from "react-icons/ai";
import { FiMessageSquare, FiFolder, FiShoppingCart } from "react-icons/fi";
import logo from "./assets/logo.png";
import Image from "next/image";
import mqtt from "mqtt";
import User from "../models/user";
import dbConnect from "../utils/dbConnect";
import Client from "../models/client";
import moment from "moment";
import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

import io from "socket.io-client";

var user;
var _client;
let socket;
let socketId;
const Home = () => {
  const menus = [
    { name: "Dashboard", link: "/", icon: MdOutlineDashboard },
    { name: "User", link: "/", icon: AiOutlineUser },
    { name: "Messages", link: "/", icon: FiMessageSquare },
    { name: "Analytics", link: "/", icon: TbReportAnalytics, margin: true },
    { name: "File Manager", link: "/", icon: FiFolder },
    { name: "Cart", link: "/", icon: FiShoppingCart },
    { name: "Saved", link: "/", icon: AiOutlineHeart, margin: true },
    { name: "Setting", link: "/", icon: RiSettings4Line },
  ];

  let Links = [
    { name: "HOME", link: "/" },
    { name: "SERVICE", link: "/" },
    { name: "ABOUT", link: "/" },
    { name: "BLOG'S", link: "/" },
    { name: "CONTACT", link: "/" },
  ];
  const [open, setOpen] = useState(true);
  const [hasClient, setHasClient] = useState(false);
  const [loginUsername, setLoginUsername] = useState("");
  const [hasLogin, setHasLogin] = useState(false);
  const [protocol, setProtocol] = useState("ws://");
  const [host, setHost] = useState("");
  const [port, setPort] = useState("8000");
  const [clientId, setClientId] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [path, setPath] = useState("/mqtt");
  const [reconnectionPeriod, setReconnectionPeriod] = useState("5000");
  const [timeout, setTimeout] = useState("2000");
  const [topic, setTopic] = useState("");
  const [subscriptions, setSubscriptions] = useState([]);
  const [messages, setMessages] = useState([]);
  useEffect(() => {
    socketInitializer();
  }, []);
  const socketInitializer = async () => {
    // We just call it because we don't need anything else out of it
    await fetch("/api/socket");

    socket = io();

    socket.on("connect", () => {
      console.log(socket.id); // "G5p5..."
      socketId = socket.id;
      socket.on("updateClientData", (data) => {
        setMessages(data);
        console.log(messages);
      });
    });
  };

  async function onPressedLoginBtn() {
    var result = await fetch("http://localhost:3000/api/registerUser", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        username: loginUsername,
      }),
    });
    if (result.status == 200 || result.status == 201) {
      const { data } = await result.json();
      // setUser(data);
      user = data;
      console.log(user._id);
      setHasLogin(true);
      var resultClient = await fetch("http://localhost:3000/api/getClient", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          user: user,
        }),
      });
      if (resultClient.status == 200 || resultClient.status == 201) {
        const { client } = await resultClient.json();
        console.log("test:", client);
        setHasClient(true);
        setHost(client.host);
        setPort(client.port);
        setClientId(client.clientId);
        _client = client;

        socket.emit("registerClient", client._id);
      }
    }
  }

  async function onPressedConnectBtn() {
    var mqttUri = protocol + host;
    const data = {
      user: user._id,
      host: mqttUri,
      username: username,
      password: password,
      clientId: clientId,
      reconnectPeriod: parseInt(reconnectionPeriod),
      connectTimeout: parseInt(timeout),
      port: parseInt(port),
      path: "/mqtt",
    };
    console.log(data);
    var result = await fetch("http://localhost:3000/api/connectClient", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (result.status == 200 || result.status == 201) {
    const {client} = await result.json();
    console.log(client);
    setHasClient(true);
        setHost(client.host);
        setPort(client.port);
        setClientId(client.clientId);
    _client = client;
    socket.emit("registerClient", client._id);
    }
  }

  async function onPressedSubscribeBtn() {
    var result = await fetch("http://localhost:3000/api/subscribeTopic", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({ client: _client, topic: topic }),
    });

    if (result.status == 201) {
      setSubscriptions((await result.json()).subscriptions);
    }
    console.log(_client);
    // setSubscriptions([...subscriptions, subscription]);
    // setSubscription("");
  }

  return (
    
    <section className="flex gap-0">
      <link rel="preconnect" href="https://fonts.googleapis.com "/>
<link rel="preconnect" href="https://fonts.gstatic.com"  />
<link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;1,100;1,200;1,300;1,400&display=swap" rel="stylesheet"></link>
      <div
        className={`bg-[#0E1D24] min-h-screen ${
          open ? "w-72" : "w-16"
        } duration-500 text-gray-100 px-4`}
      >
        <div className="py-3 flex justify-end">
          <HiMenuAlt3
            size={26}
            className="cursor-pointer"
            onClick={() => setOpen(!open)}
          />
        </div>
        <div className="py-3 flex justify-center">
          <Image src={logo} alt="/" />
        </div>
        <div className="mt-4 flex flex-col gap-4 relative">
          {menus?.map((menu, i) => (
            <a
              href="#"
              className={` ${
                menu?.margin && "mt-5"
              } group flex items-center text-sm  gap-3.5 font-medium p-2 hover:bg-gray-800 rounded-md`}
            >
              <div>{React.createElement(menu?.icon, { size: "20" })}</div>
              <h2
                className={`whitespace-pre duration-500 ${
                  !open && "opacity-0 translate-x-28 overflow-hidden"
                }`}
              >
                {menu?.name}
              </h2>
              <h2
                className={`${
                  open && "hidden"
                } absolute left-48 bg-white font-semibold whitespace-pre text-gray-900 rounded-md drop-shadow-lg px-0 py-0 w-0 overflow-hidden group-hover:px-2 group-hover:py-1 group-hover:left-14 group-hover:duration-300 group-hover:w-fit  `}
              >
                {menu?.name}
              </h2>
            </a>
          ))}
        </div>
      </div>
      <div className="flex flex-col w-full">
        <div className="shadow-md h-min w-full fixed top-0">
          <div className="md:flex items-center justify-between bg-white py-4 px-7 ">
            <div className="flex flex-row  ">
              <div className="p-2 bg-blue-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="white"
                  className="w-5  h-5 "
                >
                  <path d="M12.378 1.602a.75.75 0 00-.756 0L3 6.632l9 5.25 9-5.25-8.622-5.03zM21.75 7.93l-9 5.25v9l8.628-5.032a.75.75 0 00.372-.648V7.93zM11.25 22.18v-9l-9-5.25v8.57a.75.75 0 00.372.648l8.628 5.033z" />
                </svg>
              </div>
              <div
                className="font-semibold text-sm  cursor-pointer flex items-center font-[Montserrat] 
            text-gray-800 px-3"
              >
                My First Project
              </div>
            </div>

            <div
              onClick={() => setOpen(!open)}
              className="text-3xl absolute right-8 top-6 cursor-pointer md:hidden"
            ></div>

            {/* <ul className={`md:flex md:items-center md:pb-0 pb-12 absolute md:static bg-white md:z-auto z-[-1] left-0 w-full md:w-auto md:pl-0 pl-9 transition-all duration-500 ease-in ${open ? 'top-20 ':'top-[-490px]'}`}>
        {
          Links.map((link)=>(
            <li key={link.name} className='md:ml-8 text-xl md:my-0 my-7'>
              <a href={link.link} className='text-gray-800 hover:text-gray-400 duration-500'>{link.name}</a>
            </li>
          ))
        }
      </ul> */}
          </div>
        </div>
        <div className="px-24 py-36 font-[Montserrat] flex flex-col">
          <div className="py-5">
            <h1 className="font-semibold text-3xl pb-4">Login</h1>
            {hasLogin ? (
              <div className="h-min w-full border-solid border border-grey300 rounded-md px-10 py-3">
                <div className="flex flex-row py-3">
                  <div className="flex flex-col w-full px-3">
                    <div className="font-semibold text-[#9FA2B4] text-[12px] pb-1">
                      LOGIN USERNAME
                    </div>
                    <div className="text-gray-700 text-[14px] pb-1">
                      {loginUsername}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-min w-full border-solid border border-grey300 rounded-md px-10 py-3">
                <div className="flex flex-row py-3">
                  <div className="flex flex-col w-full px-3">
                    <div className="font-semibold text-[#9FA2B4] text-[12px] pb-1">
                      LOGIN USERNAME
                    </div>
                    <input
                      className=" appearance-none border rounded w-full py-3 px-4 text-gray-700 text-[14px] leading-tight focus:outline-none focus:shadow-outline"
                      id="loginUsername"
                      type="text"
                      placeholder="Username"
                      value={loginUsername}
                      onChange={(e) => setLoginUsername(e.target.value)}
                    ></input>
                  </div>
                </div>

                <div className="flex flex-row py-3">
                  <div className="flex flex-col justify-end basis-5/6 px-3 "></div>

                  <div className="flex flex-col justify-end basis-1/6 px-3 ">
                    <button
                      className=" bg-blue-500 hover:bg-blue-700 text-white font-medium text-[14px] py-2 px-5 rounded"
                      onClick={onPressedLoginBtn}
                    >
                      Connect
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
          {hasLogin && !hasClient ? (
            <div className="py-5">
              <h1 className="font-semibold text-3xl pb-4">Client</h1>
              <div className="h-min w-full border-solid border border-grey300 rounded-md px-10 py-3">
                <div className="flex flex-row py-3">
                  <div className="flex flex-col basis-1/6 px-3">
                    <div className="font-semibold text-[#9FA2B4] text-[12px] pb-1">
                      PROTOCOL
                    </div>
                    <input
                      className=" appearance-none border rounded w-full py-3 px-4 text-gray-700 text-[14px] leading-tight focus:outline-none focus:shadow-outline"
                      id="protocol"
                      type="text"
                      placeholder="ws://"
                      value={protocol}
                      onChange={(e) => setProtocol(e.target.value)}
                    ></input>
                  </div>
                  <div className="flex flex-col basis-2/3 px-3">
                    <div className="font-semibold text-[#9FA2B4] text-[12px] pb-1">
                      HOST
                    </div>
                    <input
                      className=" appearance-none border rounded w-full py-3 px-4 text-gray-700 text-[14px] leading-tight focus:outline-none focus:shadow-outline"
                      id="host"
                      type="text"
                      placeholder="Host"
                      value={host}
                      onChange={(e) => setHost(e.target.value)}
                    ></input>
                  </div>
                  <div className="flex flex-col basis-1/6 px-3">
                    <div className="font-semibold text-[#9FA2B4] text-[12px] pb-1">
                      PORT
                    </div>
                    <input
                      className=" appearance-none border rounded w-full py-3 px-4 text-gray-700 text-[14px] leading-tight focus:outline-none focus:shadow-outline"
                      id="port"
                      type="text"
                      placeholder="8000"
                      value={port}
                      onChange={(e) => setPort(e.target.value)}
                    ></input>
                  </div>
                </div>
                <div className="flex flex-row py-3">
                  <div className="flex flex-col basis-1/3 px-3">
                    <div className="font-semibold text-[#9FA2B4] text-[12px] pb-1">
                      CLIENT-ID
                    </div>
                    <input
                      className=" appearance-none border rounded w-full py-3 px-4 text-gray-700 text-[14px] leading-tight focus:outline-none focus:shadow-outline"
                      id="clientId"
                      type="text"
                      placeholder="Client-Pusat"
                      value={clientId}
                      onChange={(e) => setClientId(e.target.value)}
                    ></input>
                  </div>
                  <div className="flex flex-col basis-1/3 px-3">
                    <div className="font-semibold text-[#9FA2B4] text-[12px] pb-1">
                      USERNAME
                    </div>
                    <input
                      className=" appearance-none border rounded w-full py-3 px-4 text-gray-700 text-[14px] leading-tight focus:outline-none focus:shadow-outline"
                      id="username"
                      type="text"
                      placeholder="Username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    ></input>
                  </div>
                  <div className="flex flex-col basis-1/3 px-3">
                    <div className="font-semibold text-[#9FA2B4] text-[12px] pb-1">
                      PASSWORD
                    </div>
                    <input
                      className=" appearance-none border rounded w-full py-3 px-4 text-gray-700 text-[14px] leading-tight focus:outline-none focus:shadow-outline"
                      id="password"
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    ></input>
                  </div>
                </div>
                <div className="flex flex-row py-3">
                  <div className="flex flex-col basis-1/3 px-3">
                    <div className="font-semibold text-[#9FA2B4] text-[12px] pb-1">
                      MQTT PATH
                    </div>
                    <input
                      className=" appearance-none border rounded w-full py-3 px-4 text-gray-700 text-[14px] leading-tight focus:outline-none focus:shadow-outline"
                      id="mqttPath"
                      type="text"
                      placeholder="/mqtt"
                      value={path}
                      onChange={(e) => setPath(e.target.value)}
                    ></input>
                  </div>
                  <div className="flex flex-col basis-1/3 px-3">
                    <div className="font-semibold text-[#9FA2B4] text-[12px] pb-1">
                      RECONNECTION TIME (ms)
                    </div>
                    <input
                      className=" appearance-none border rounded w-full py-3 px-4 text-gray-700 text-[14px] leading-tight focus:outline-none focus:shadow-outline"
                      id="reconnectionPeriod"
                      type="text"
                      placeholder="2000"
                      value={reconnectionPeriod}
                      onChange={(e) => setReconnectionPeriod(e.target.value)}
                    ></input>
                  </div>
                  <div className="flex flex-col basis-1/3 px-3">
                    <div className="font-semibold text-[#9FA2B4] text-[12px] pb-1">
                      CONNECTION TIMEOUT (ms)
                    </div>
                    <input
                      className=" appearance-none border rounded w-full py-3 px-4 text-gray-700 text-[14px] leading-tight focus:outline-none focus:shadow-outline"
                      id="timeout"
                      type="text"
                      placeholder="5000"
                      value={timeout}
                      onChange={(e) => setTimeout(e.target.value)}
                    ></input>
                  </div>
                </div>
                <div className="flex flex-row py-3">
                  <div className="flex flex-col justify-end basis-5/6 px-3 "></div>

                  <div className="flex flex-col justify-end basis-1/6 px-3 ">
                    <button
                      className=" bg-blue-500 hover:bg-blue-700 text-white font-medium text-[14px] py-2 px-5 rounded"
                      onClick={onPressedConnectBtn}
                    >
                      Connect
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
          {hasLogin && hasClient ? (
            <div className="py-5">
              <h1 className="font-semibold text-3xl pb-4">Client</h1>
              <div className="h-min w-full border-solid border border-grey300 rounded-md px-10 py-3">
                <div className="flex flex-row py-3">
                  <div className="flex flex-col basis-2/3 px-3">
                    <div className="font-semibold text-[#9FA2B4] text-[12px] pb-1">
                      HOST
                    </div>
                    <div className="text-gray-700 text-[14px] pb-1">
                      {host + ":" + port}
                    </div>
                  </div>
                  <div className="flex flex-col basis-1/6 px-3">
                    <div className="font-semibold text-[#9FA2B4] text-[12px] pb-1">
                      CLIENT ID
                    </div>
                    <div className="text-gray-700 text-[14px] pb-1">
                      {clientId}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
          {hasLogin && hasClient ? (
            <div className="py-5 flex flex-row gap-4">
              <div className="flex flex-col basis-1/4">
                <h1 className="font-semibold text-3xl pb-4">Subscription</h1>
                <div className="h-min w-full border-solid border border-grey300 rounded-md px-10 py-3">
                  <div className="flex flex-row py-3">
                    <div className="flex flex-col w-full px-3">
                      <div className="font-semibold text-[#9FA2B4] text-[12px] pb-1">
                        TOPIC
                      </div>
                      <input
                        className=" appearance-none border rounded w-full py-3 px-4 text-gray-700 text-[14px] leading-tight focus:outline-none focus:shadow-outline"
                        id="subscription"
                        type="text"
                        placeholder="topic"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                      ></input>
                    </div>
                  </div>
                  <div className="flex flex-row py-3">
                    <div className="flex flex-col justify-end w-full px-3 ">
                      {subscriptions.map((_) => (
                        <div className="text-gray-700 text-[14px] ">{_}</div>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-row py-3">
                    <div className="flex flex-col justify-end w-full px-3 ">
                      <button
                        className=" w-full bg-blue-500 hover:bg-blue-700 text-white font-medium text-[14px] py-2 px-5 rounded"
                        onClick={onPressedSubscribeBtn}
                      >
                        Subscribe
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col basis-3/4">
                <h1 className="font-semibold text-3xl pb-4">Message</h1>
                <div className="h-[500px] w-full border-solid border border-grey300 bg-gray-900 rounded-md px-3 py-3 overflow-scroll">
                  <div className="flex flex-row py-3">
                    <div className="flex flex-col w-full px-3 ">
                      {messages.map((_) => (
                        <div className="font-semibold text-[#FFF] text-[12px] pb-1">
                          <font className="text-[#2F446F]">
                            {moment(_.date).format("DD/MM/YYYY HH:mm:ss")}
                          </font>
                          &emsp;
                          <font className="text-[#BAE67E]">
                            {_.topic}
                          </font>: {_.value}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
};
export default Home;
