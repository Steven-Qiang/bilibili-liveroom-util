/**
 * @file: index.js
 * @description: index.js
 * @package: bilibili_live
 * @create: 2021-03-21 09:45:36
 * @author: qiangmouren (2962051004@qq.com)
 * -----
 * @last-modified: 2021-03-21 10:20:27
 * -----
 */
const util = require('util');
const Live = require('./Live');

(async () => {
    /** @description 直播间ID 一般出现在URL中 如 https://live.bilibili.com/22845214 */
    const live_id = 22845214;
    const live = new Live(live_id);

    live.WS_AUTH_TOKEN_ERROR_CALLBACK = function (data) {
        console.log('连接弹幕服务器成功', data);
    }
    live.WS_AUTH_TOKEN_ERROR_CALLBACK = function (data) {
        console.log('弹幕服务器连接失败', data);
    }
    live.WS_ON_CLOSE_CALLBACK = function (data) {
        console.log('WEBSOCKET连接关闭');
    }
    live.WS_OP_HEARTBEAT_REPLY_CALLBACK = function (data) {
        console.log('在线人数', data.count);
    }
    live.WS_MESSAGE_DANMAKU_CALLBACK = function (data) {
        console.log('接收弹幕消息', data);
    }
    live.WS_MESSAGE_SEND_GIFT_CALLBACK = function (data) {
        console.log('接收礼物消息', data);
    }
    live.WS_LIVE_EVENT_CALLBACK = function (data) {
        console.log('直播间事件', data);
    }
    live.WS_PK_EVENT_CALLBACK = function (data) {
        console.log('直播PK事件', data);
    }
    live.WS_HOT_ROOM_NOTIFY_CALLBACK = function (data) {
        console.log('热点房间推荐', data);
    }
    
    await live.loadedRoomInitAPI();

    const stream = live.getStream();
    console.log('获取直播流', util.inspect(stream, { depth: null }));
    
})();