const {debug} = require('carnival-toolbox');

module.exports=class BOS_Command{
  constructor(name){
    this.name=name;
    this.interfaces={};
    this.CONTEXT={};
  }
  USAGE(interfaceName){
    return {
      interfaceName:interfaceName,
      interfaces:this.interfaces,
      get DEFINE(){
        if(
          !this.interfaces.hasOwnProperty(this.interfaceName)
        )this.interfaces[this.interfaceName]={get:()=>null,set:(x)=>null};
        return {
          interfaceName:this.interfaceName,
          interfaces:this.interfaces,
          set METHOD(funct){
            this.GET=()=>funct;
          },
          set SET(funct){
            this.interfaces[this.interfaceName].set=funct;
          },
          set GET(funct){
            this.interfaces[this.interfaceName].get=funct;
          }
        }
      },
      get LOAD(){
        return this.interfaces[this.interfaceName];
      }
    }
  }
  INCLUDE_TO(context, interfaceName){
    this.CONTEXT[interfaceName]=context;
    debug.log(`---including command ${this.name} as usage by ${interfaceName} in context`)
    Object.defineProperty(
      context,
      this.name,
      this.USAGE(interfaceName).LOAD
    );
  }
}
