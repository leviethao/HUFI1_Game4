// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

  static normalize(vec: cc.Vec2) : cc.Vec2 {
    let leng = Math.sqrt(vec.x * vec.x + vec.y * vec.y);
    return new cc.Vec2(vec.x / leng, vec.y / leng);
  }

  static add (vec: cc.Vec2, vec2: cc.Vec2) : cc.Vec2 {
    return new cc.Vec2(vec.x + vec2.x, vec.y + vec2.y);
  }

}
