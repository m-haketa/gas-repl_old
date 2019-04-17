import {Server} from './server';
import {Tunnel} from './tunnel';
import {Clasp} from './clasp';
import {GasRepl} from './gas-repl';
import * as getPort from 'get-port';
import {EventEmitter} from 'events';

export class App {
  private event;
  private server;
  private tunnel;
  private clasp;
  private gasRepl;

  constructor() {
    this.event = new EventEmitter;
    this.server = new Server(this.event);
    this.clasp = new Clasp(this.event);
    this.tunnel = new Tunnel(this.event);
    this.gasRepl = new GasRepl(this.event, this.clasp);
  }

  start() {
    getPort()
    .then(port => {
      this.server.start(port)
      .then(express => {
        //console.log(`Express is listening on local port ${port}.`);
        this.tunnel.start(port)
        .then(tunnelUrl => {
          //console.log(`tunnel ${tunnelUrl} is open.`);
          this.gasRepl.start()
          .then(repl => this.clasp.start(tunnelUrl))
        });
      });
    });
    this.event.on('exit', (msg) => {
      console.log(msg);
      this.clasp.kill();
      this.tunnel.close();
      process.exit();
    });
  }
}
