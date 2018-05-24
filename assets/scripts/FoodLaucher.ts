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
import Food from "./Food";

const FOOD_POOL_DEFAULT_SIZE = 10;

@ccclass
export default class NewClass extends cc.Component {
    
    @property(cc.Canvas)
    canvas: cc.Canvas = null;

    @property(cc.Prefab)
    foodPrefab: cc.Prefab = null;

// LIFE-CYCLE CALLBACKS:
    rotateSpeed: number;
    foodPool: cc.NodePool;
    spawnFoodInterval: number;

    onLoad () {
        this.init();
        this.node.getChildByName("FoodNose").setLocalZOrder(this.node.getLocalZOrder() - 1);
    }

    init () {
        let gameSetting = this.canvas.node.getComponent(InGame).gameSetting.getComponent(GameSetting);
        this.rotateSpeed = gameSetting.foodLaucherRotateSpeed;

        this.foodPool = new cc.NodePool("Food");
        for (let i = 0; i < FOOD_POOL_DEFAULT_SIZE; i++) {
            let food = cc.instantiate(this.foodPrefab);
            this.foodPool.put(food);
        }

        this.spawnFoodInterval = gameSetting.spawnFoodInterval;
    }

    start () {
        //rotate forever
        this.node.runAction(cc.repeatForever(cc.rotateBy(1, this.rotateSpeed)));
        this.schedule(this.spawnFood, this.spawnFoodInterval);
    }

    // update (dt) {}

    createFood () : cc.Node {
        let food: cc.Node = null;
        if (this.foodPool.size() > 0) {
            food = this.foodPool.get();
        } else {
            food = cc.instantiate(this.foodPrefab);
        }

        return food;
    }

    spawnFood () {
        let food = this.createFood();
        this.canvas.node.addChild(food);

        food.getComponent(Food).canvas = this.canvas;
        food.getComponent(Food).init();

        let foodNosePos = this.node.convertToWorldSpaceAR(this.node.getChildByName("FoodNose").position);
        foodNosePos = this.canvas.node.convertToNodeSpaceAR(foodNosePos);
        food.position = foodNosePos;
        food.getComponent(Food).location = foodNosePos;

        let foodDirection = this.node.convertToWorldSpaceAR(this.node.getChildByName("FoodNose").position);
        foodDirection = this.canvas.node.convertToNodeSpaceAR(foodDirection);
        food.getComponent(Food).direction = foodDirection.normalize();
    }
}
