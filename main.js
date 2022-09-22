import { genModule } from "@proxtx/combine/combine.js";
import { genCombine } from "@proxtx/combine-rest/request.js";
import config from "@proxtx/config";

const bundler = await genCombine(
  config.u_websocket_client_receiver.bundlerUrl + "/api/",
  "bundler",
  genModule
);

export let transmitters = [];

const generateTransmitters = async () => {
  let ids = (await bundler.listClients()).clients;
  for (let id of ids) {
    transmitters.push(new Transmitter(id));
  }
};

class Transmitter {
  constructor(id) {
    this.id = id;
  }

  async request(data) {
    return (await bundler.request(this.id, data)).result;
  }
}

await generateTransmitters();
