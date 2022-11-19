import dbConnect from "../../utils/dbConnect";
import User from "../../models/user";
import Client from "../../models/client";
import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";
dbConnect();

export default async function handler(req, res) {
  console.log("done");
  const { method } = req;

  switch (method) {
    case "POST":
      try {
        console.log(req.body.user);
        const client = await Client.findOne({ user: req.body.user });
        console.log("connectClient", JSON.stringify(req.body));
        if (!client) {
          req.body._id = uuidv4().toString();
          req.body.action = "register";
          var result = await fetch("http://localhost:3000/api/mqttHandler", {
            method: "POST",
            headers: {
              "Content-type": "application/json",
            },
            body: JSON.stringify(req.body),
          });
          if (result.status == 201) {
            console.log(req.body.user);
            const client = await Client.create(req.body);
            console.log(client);
            res.status(201).json({ success: true });
          } else {
            res.status(400).json({ success: false });
          }
        } else {
          console.log(client);
          res.status(400).json({ success: false });
        }
      } catch (error) {
        console.log(error);
        res.status(400).json({ success: false });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
