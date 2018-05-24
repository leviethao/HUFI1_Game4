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
import Circle from "./Circle";
@ccclass
export default class NewClass extends cc.Component {

    @property
    circleRadius: number = 0;

    @property
    playerRadius: number = 0;

    @property
    gravity: number = 0;

    @property
    playerMoveSpeed: number = 0;

    @property
    playerJumpSpeed: number = 0;

    @property
    foodLaucherRotateSpeed: number = 0;

    @property
    rocketLaucherRotateSpeed: number = 0;

    @property
    foodSpeed: number = 0;

    @property
    spawnFoodInterval: number = 0;

    @property
    rocketSpeed: number = 0;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    // update (dt) {}
}
