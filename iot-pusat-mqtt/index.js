var mqtt = require("mqtt");

const options = {
  username: "",
  password: "",
  clientId: "testtststs",
  reconnectPeriod: 2000,
  connectTimeout: 5000,
  port: 8000,
  path: "/mqtt",
};

const client = mqtt.connect("ws://broker.hivemq.com", options);
console.log("Connecting");
client.on("connect", function () {
  console.log("Connected");
  client.subscribe("mytopic3", function (err) {
    if (!err) {
      client.publish("mytopic3", "Hello mqtt");
      client.publish("mytopic3", "Hello mqtt");
      client.publish("mytopic3", "Hello mqtt");
      client.publish("mytopic3", "Hello mqtt");
      client.publish("mytopic3", "Hello mqtt");
      client.publish("mytopic3", "Hello mqtt");
      client.publish("mytopic3", "Hello mqtt");
      client.publish("mytopic3", "Hello mqtt");
    }
  });
});
client.on("message", function (topic, message) {
  // message is Buffer
  console.log(message.toString());
  // client.end();
});
