import dbConnect from "../../utils/dbConnect";
import User from "../../models/user";
import Client from "../../models/client";
import ClientData from "../../models/clientData";
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
        const client = await Client.findOne({ user: req.body.user._id });
        console.log("connectClient", JSON.stringify(req.body));
        if (!client) {
          res.status(400).json({ success: false });
        } else {
          var data = await ClientData.find({
            clientId: client._id,
          }).sort({ date: -1 });
          if (data) res.status(201).json({ data: data });
          else res.status(400).json({ success: false });
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
