'use strict';

// Listの情報は以下の感じ
// {
//     "items": [
//         {
//         	"createdTime": "Sun Dec 13 16:17:42 UTC 2020",
//         	"href": "/v2/householdlists/ca999999-1bd4-4fb6-a862-４ff４aaa７７７７b/items/1dd99999-9999-4b22-a11c-321dbe0ea123",
//         	"id": "1dd99999-9999-4b22-a11c-321dbe0ea123",
//         	"status": "active",
//         	"updatedTime": "Sun Dec 13 16:17:42 UTC 2020",
//         	"value": "ほげほげ",
//         	"version": 1
//         }
// 	],
// 	"links": null,
// 	"listId": "ca514964-1bd4-4fb6-a862-1fb3fea2799b",
// 	"name": "リスト名称",
// 	"state": "active",
// 	"version": 1
// }

module.exports = class ListManager {
    /**
     * コンストラクタ
     * @param {*} handlerInput handlerInput
     */
    constructor(handlerInput){
        this._listClient = handlerInput.serviceClientFactory.getListManagementServiceClient();
    }

    /**
     * リストオブジェクトの配列を取得する
     * リストオブジェクトは以下
     * name: リスト名
     * listId: リストのid
     * state: 'active'とか
     * statusMap: リスト要素オブジェクトの配列
     * version: だいたい1
     */
    async getLists(){
        let lists;
        lists = await this._listClient.getListsMetadata();
        console.log(`lists ${JSON.stringify(lists)}`);
        return lists.lists;
    }

    /**
     * リスト名からIDを取得する
     * 取得できなかった場合は返却値なし(nullかundefined)
     * @param {string} listName 
     */
    async getListIdByName(listName){
        let lists = await this.getLists();
        console.log(`リスト全部取得した結果\n${lists}`);
        for(let list of lists){
            if(list.name === listName){
                console.log("listName:" + listName + "で見つかったリスト" + list.listId);
                return list.listId;
            }
        }
    }

    /**
     * アクティブ状態にあるリストを取得する
     * ※アクティブ以外に何があるか分かっていない
     * @param {*} listId リストid
     */
    async getActiveList(listId){
        return await this._listClient.getList(listId,'active');
    }

    /**
     * リストid,アイテムidをキーにしてリスト内のアイテムを取得する
     * @param {*} listId リストid
     * @param {*} itemId アイテムid
     */
    async getListItem(listId,itemId){
        return await this._listClient.getListItem(listId,itemId);
    }

    /**
     * リストを新規作成する
     * @param {*} listName 作成するリストの名称
     */
    async createList(listName){
        let createListRequest = {
            'name': listName,
            'state': 'active'
        };
        await this._listClient.createList(createListRequest); 
    }

    /**
     * リスト内にアイテムを新規作成する
     * @param {*} listId リストid
     * @param {*} itemName 作成するアイテムの名称
     */
    async createListItem(listId,itemName){
        let createListItemRequest = {
            'value': itemName,
            'status': 'active'
        };
        await this._listClient.createListItem(listId, createListItemRequest);          
    }

    /**
     * リストを削除する
     * @param {*} listId リストid
     */
    async deleteList(listId){
        await  this._listClient.deleteList(listId);
    }
}