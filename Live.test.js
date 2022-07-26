/**
 * @file: Live.test.js
 * @description: Live.test.js
 * @package: bilibili-liveroom-util
 * @create: 2021-03-21 10:18:45
 * @author: qiangmouren (2962051004@qq.com)
 * -----
 * @last-modified: 2022-07-26 02:06:11
 * -----
 */

const util = require('util');

const Live = require('./Live');

(async () => {
  /** @description 直播间ID 一般出现在URL中 如 https://live.bilibili.com/22845214 */
  const live_id = 1942240;
  const live = await new Live(live_id);

  live.on('WS_AUTH_TOKEN_ERROR', (data) => console.log('连接弹幕服务器成功', data));
  live.on('WS_AUTH_TOKEN_ERROR', (data) => console.log('弹幕服务器连接失败', data));
  live.on('WS_ON_CLOSE', (data) => console.log('WEBSOCKET连接关闭'));
  live.on('WS_OP_HEARTBEAT_REPLY', ({ count }) => console.log('在线人数', count));
  live.on('WS_MESSAGE_DANMAKU', (data) => console.log('接收弹幕消息', data));
  live.on('WS_MESSAGE_SEND_GIFT', (data) => console.log('接收礼物消息', data));
  live.on('WS_LIVE_EVENT', (data) => console.log('直播间事件', data));
  live.on('WS_PK_EVENT', (data) => console.log('直播PK事件', data));
  live.on('WS_HOT_ROOM_NOTIFY', (data) => console.log('热点房间推荐', data));

  const stream = live.getStream();
  console.log('获取直播流', util.inspect(stream, { depth: null }));
})();
