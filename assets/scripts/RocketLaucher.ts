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
import InGame from "./InGame";
import GameSetting from "./GameSetting";
import Rocket from "./Rocket";

const ROCKET_POOL_DEFAULT_SIZE = 10;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Canvas)
    canvas: cc.Canvas = null;

    @property(cc.Prefab)
    rocketPrefab: cc.Prefab = null;

    rotateSpeed: number;
    angle: number;
    rocketPool: cc.NodePool;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.init();
        this.node.getChildByName("RocketNose").setLocalZOrder(this.node.getLocalZOrder() - 1);
    }

    init () {
        let gameSetting = this.canvas.node.getComponent(InGame).gameSetting.getComponent(GameSetting);
        this.rotateSpeed = gameSetting.rocketLaucherRotateSpeed;
        this.angle = this.node.rotation;

        this.rocketPool = new cc.NodePool("Rocket");
        for (let i = 0; i < ROCKET_POOL_DEFAULT_SIZE; i++) {
            let rocket = cc.instantiate(this.rocketPrefab);
            this.rocketPool.put(rocket);
        }        

    }

    start () {
        this.schedule(this.spawnRocket, 3);
    }

    update (dt) {
        this.aim(dt);
    }

    aim (dt: number) {
        let target = this.canvas.node.getComponent(InGame).player;
        let direction = target.position.add(this.node.position.mul(-1));
        direction.normalizeSelf();

        let radian = Math.atan2(direction.y, direction.x);

        let angle = radian * 180 / Math.PI;

        this.angle = angle;
        this.node.rotation = -this.angle;
    }

    createRocket () : cc.Node {
        let rocket: cc.Node = null;
        if (this.rocketPool.size() > 0) {
            rocket = this.rocketPool.get();
        } else {
            rocket = cc.instantiate(this.rocketPrefab);
        }

        return rocket;
    }

    spawnRocket () {
        let rocket = this.createRocket();
        this.canvas.node.addChild(rocket);
        rocket.getComponent(Rocket).canvas = this.canvas;
        rocket.getComponent(Rocket).init();

        let rocketPos = this.node.convertToWorldSpaceAR(this.node.getChildByName("RocketNose").position);
        rocketPos = this.canvas.node.convertToNodeSpaceAR(rocketPos);
        rocket.position = rocketPos;
        rocket.getComponent(Rocket).location = rocketPos;

        rocket.getComponent(Rocket).target = this.canvas.node.getComponent(InGame).player;
    }
}
