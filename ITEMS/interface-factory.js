const fs = require('fs');
const path = require('path');
const {changeCase} = require('carnival-toolbox');

const BOS=require("../core/bos.js").INITIALIZE;

//console.log("HERE",BOS.COMMANDS)

module.exports=class BOS_Interface{
  constructor(interfaceName,appendObject){
    this.interfaceName=interfaceName;
    this.MAIN_HOOK=null;
    this.CONTEXT_HOOK=null;
    this.EXITCODE=0;
    this.SETUP=require(
      BOS.PathTo("system","interfaces",interfaceName,"setup.js")
    );
    this.INIT=require(
      BOS.PathTo("system","interfaces",interfaceName,"init.js")
    );
    this.LOOP=require(
      BOS.PathTo("system","interfaces",interfaceName,"loop.js")
    );
    BOS.Update(appendObject, this);
  }
  set CONTEXT(hook){
    this.CONTEXT_HOOK=hook;
    this.LOAD_COMMANDS();
  }
  get CONTEXT(){
    return this.CONTEXT_HOOK;
  }
  LOAD_COMMANDS(){
    for(var name in BOS.COMMANDS){
      if(BOS.COMMANDS[name].interfaces.hasOwnProperty(this.interfaceName)){
        BOS.COMMANDS[name].INCLUDE_TO(this.CONTEXT, this.interfaceName);
      }
    }
  }
  set MAIN(hook){
    this.MAIN_HOOK=hook;
    this.LOAD_EVENTS();
  }
  get MAIN(){
    return this.MAIN_HOOK;
  }
  LOAD_EVENTS(){
    const eventScripts=fs.readdirSync(
      BOS.PathTo("system","interfaces",this.interfaceName)
    ).filter(
      (script)=>script.startsWith("on-")&&script.endsWith(".js")
    )
    for(var script of eventScripts){
      const scriptMethodName=changeCase(
        path.basename(script,".js")
      ).from(
        "kebabcase"
      ).to(
        "snakecasecabs"
      ).GO;
      const eventName=path.basename(script,".js").split("-")[1];
      this[
        scriptMethodName
      ]=require(
        BOS.PathTo("system","interfaces",this.interfaceName, script)
      );
      this.MAIN.on(eventName, this[scriptMethodName](this));
    }
  }
};
