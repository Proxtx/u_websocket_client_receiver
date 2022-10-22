import { genModule } from "@proxtx/combine/combine.js";
import { genCombine } from "@proxtx/combine-rest/request.js";

export class Receiver {
  constructor(config) {
    this.config = config;

    (async () => {
      this.api = await genCombine(
        this.config.bundlerUrl + "/api/",
        "bundler",
        genModule
      );
    })();
  }

  async getTransmitters() {
    let transmitters = [];
    try {
      let ids = (await this.api.listClients()).clients;
      for (let id of ids) {
        transmitters.push(new Transmitter(id, this.api));
      }
    } catch (e) {
      console.log("Error while fetching WS clients:", e);
    }

    return transmitters;
  }
}

class Transmitter {
  constructor(id, api) {
    this.id = id;
    this.api = api;
  }

  async request(data) {
    return (await this.api.request(this.id, data)).result;
  }
}
