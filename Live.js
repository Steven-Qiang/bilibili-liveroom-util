/**
 * @file: Live.js
 * @description: Live.js
 * @create: 2021-03-21 03:17:34
 * @author: qiangmouren (2962051004@qq.com)
 * -----
 * @last-modified: 2021-03-21 10:20:57
 * -----
 */

const ws = require('ws');
const request = require('request-promise-native');
class Live {
    constructor(live_id,) {
        this.request = {
            headers: {
                'referrer': 'https://live.bilibili.com/',
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.104 Safari/537.36'
            }
        };
        this.config = {
            cid: live_id,
            switchCount: 0,
            downgrade: 0,
            useType: 1
        };
        this.state = {
            hostServer: {
                port: -1,
                host: '',
                hostServerList: [{ host: '', port: -1, wssPort: -1, wsPort: -1 }]
            }
        };
    }
    getHostServer () {
        return this.state.hostServer;
    }
    initialize () {
        return Promise.all([this.initRoomPlayInfo(), this.requestDanmuServerApi()]);
    }
    loadedRoomInitAPI () {
        const WS_OP_USER_AUTHENTICATION = 7;
        const WS_PACKAGE_HEADER_TOTAL_LENGTH = 16;
        const WS_PACKAGE_OFFSET = 0;
        const WS_OP_MESSAGE = 5;
        const WS_OP_HEARTBEAT_REPLY = 3;
        const WS_HEADER_OFFSET = 4;
        const WS_BODY_PROTOCOL_VERSION_DEFLATE = 2;
        const WS_AUTH_OK = 0;
        const WS_AUTH_TOKEN_ERROR = -101;
        const WS_OP_HEARTBEAT = 2;
        const WS_OP_CONNECT_SUCCESS = 8;
        const PROTOCOL_API_HTTPS = 'https:';
        const PROTOCOL_WEBSOCKET_DEFAULT = 'ws:';
        const WEBSOCKET_SECURITY_PORT = 7172;

        return this.initialize().then((() => {

            this.config.server = this.getHostServer().host;
            this.config.hostList = this.getHostServer().hostServerList.map((function (e) {
                return e.host;
            }));
            this.config.socketToken = this.getHostServer().token;

            this.config.protocol = {
                api: PROTOCOL_API_HTTPS,
                websocket: PROTOCOL_WEBSOCKET_DEFAULT,
                port: this.getHostServer().hostServerList[0].wssPort || WEBSOCKET_SECURITY_PORT
            };

            this.config.protocol.port = this.getHostServer().hostServerList[0].wsPort;
            const _url = this.config.protocol.websocket + '//' + (this.config.server || 'broadcastlv.chat.bilibili.com') + ':' + (this.config.protocol.port || 2243) + '/sub';
            const _customAuthParam = [
                { type: 'string', key: 'platform', value: 'web' },
                { type: 'string', key: 'clientver', value: '2.6.36' },
                { type: 'number', key: 'type', value: 2 },
                { type: 'string', key: 'key', value: this.state.hostServer.token }
            ];
            let HEART_BEAT_INTERVAL;
            var n = {
                aid: 0,
                from: -1,
                heartBeatInterval: 30,
                protover: 2,
                retry: true,
                retryConnectCount: 3,
                retryInterval: 0,
                retryMaxCount: 0,
                retryRoundInterval: 4,
                retryThreadCount: 10,
                retryconnectTimeout: 10000,
                customAuthParam: _customAuthParam,
                rid: this.config.rid,
                uid: this.config.uid,
                url: _url,
                urlList: ['wss://tx-bj-live-comet-02.chat.bilibili.com:443/sub', 'wss://tx-gz-live-comet-01.chat.bilibili.com:443/sub', 'wss://broadcastlv.chat.bilibili.com:443/sub']
            };

            this._ws = new ws(n.url);

            var wsBinaryHeaderList = [
                { name: 'Header Length', key: 'headerLen', bytes: 2, offset: 4, value: 16 },
                { name: 'Protocol Version', key: 'ver', bytes: 2, offset: 6, value: 1 },
                { name: 'Operation', key: 'op', bytes: 4, offset: 8, value: 1 },
                { name: 'Sequence Id', key: 'seq', bytes: 4, offset: 12, value: 1 }
            ];
            var authInfo = {
                origin: '',
                encode: ''
            };

            var mergeArrayBuffer = (e, t) => {
                var n = new Uint8Array(e),
                    i = new Uint8Array(t),
                    r = new Uint8Array(n.byteLength + i.byteLength);
                return r.set(n, 0),
                    r.set(i, n.byteLength),
                    r.buffer;
            };
            var getDecoder = function () {
                return TextDecoder ? new TextDecoder : {
                    decode: function (e) {
                        return decodeURIComponent(window.escape(String.fromCharCode.apply(String, new Uint8Array(e))));
                    }
                };
            };
            var getEncoder = function () {
                return TextEncoder ? new TextEncoder : {
                    encode: function (e) {
                        for (var t = new ArrayBuffer(e.length), n = new Uint8Array(t), i = 0, r = e.length; i < r; i++) {
                            n[i] = e.charCodeAt(i);

                        }
                        return t;
                    }
                };
            };
            var __r = function r () {
                this.mode = 0,
                    this.last = !1,
                    this.wrap = 0,
                    this.havedict = !1,
                    this.flags = 0,
                    this.dmax = 0,
                    this.check = 0,
                    this.total = 0,
                    this.head = null,
                    this.wbits = 0,
                    this.wsize = 0,
                    this.whave = 0,
                    this.wnext = 0,
                    this.window = null,
                    this.hold = 0,
                    this.bits = 0,
                    this.length = 0,
                    this.offset = 0,
                    this.extra = 0,
                    this.lencode = null,
                    this.distcode = null,
                    this.lenbits = 0,
                    this.distbits = 0,
                    this.ncode = 0,
                    this.nlen = 0,
                    this.ndist = 0,
                    this.have = 0,
                    this.next = null,
                    this.lens = new Uint16Array(320),
                    this.work = new Uint16Array(288),
                    this.lendyn = null,
                    this.distdyn = null,
                    this.sane = 0,
                    this.back = 0,
                    this.was = 0;
            };
            var __s = function s (e, t) {
                function o (e) {
                    var t;
                    return e && e.state ? (t = e.state,
                        e.total_in = e.total_out = t.total = 0,
                        e.msg = '',
                        t.wrap && (e.adler = 1 & t.wrap),
                        t.mode = 1,
                        t.last = 0,
                        t.havedict = 0,
                        t.dmax = 32768,
                        t.head = null,
                        t.hold = 0,
                        t.bits = 0,
                        t.lencode = t.lendyn = new Int32Array(852),
                        t.distcode = t.distdyn = new Int32Array(592),
                        t.sane = 1,
                        t.back = -1,
                        0) : -2;
                }
                function a (e) {
                    var t;
                    return e && e.state ? ((t = e.state).wsize = 0,
                        t.whave = 0,
                        t.wnext = 0,
                        o(e)) : -2;
                }
                var n,
                    i;
                return e && e.state ? (i = e.state,
                    t < 0 ? (n = 0,
                        t = -t) : (n = 1 + (t >> 4),
                            t < 48 && (t &= 15)),
                    t && (t < 8 || 15 < t) ? -2 : (null !== i.window && i.wbits !== t && (i.window = null),
                        i.wrap = n,
                        i.wbits = t,
                        a(e))) : -2;
            };
            var __inflateInit2 = function l (e, t) {
                var n,
                    i;
                return e ? (i = new __r,
                    (e.state = i).window = null,
                    (n = __s(e, t)) !== 0 && (e.state = null),
                    n) : -2;
            };
            var __inflateGetHeader = function (e, t) {
                var n;
                return e && e.state ? 0 == (2 & (n = e.state).wrap) ? E : ((n.head = t).done = !1,
                    0) : -2;
            };
            var __inflateSetDictionary = function (e, t) {
                var n,
                    i = t.length;
                return e && e.state ? 0 !== (n = e.state).wrap && 11 !== n.mode ? E : 11 === n.mode && p(1, t, i, 0) !== n.check ? -3 : u(e, t, i, i) ? (n.mode = 31,
                    -4) : (n.havedict = 1,
                        0) : -2;
            };
            var __string2buf = function (e) {
                var t,
                    n,
                    i,
                    o,
                    a,
                    s = e.length,
                    l = 0;
                for (o = 0; o < s; o++) {
                    55296 == (64512 & (n = e.charCodeAt(o))) && o + 1 < s && 56320 == (64512 & (i = e.charCodeAt(o + 1))) && (n = 65536 + (n - 55296 << 10) + (i - 56320),
                        o++),
                        l += n < 128 ? 1 : n < 2048 ? 2 : n < 65536 ? 3 : 4;

                }
                for (t = new Uint8Array(l),
                    o = a = 0; a < l; o++) {
                    55296 == (64512 & (n = e.charCodeAt(o))) && o + 1 < s && 56320 == (64512 & (i = e.charCodeAt(o + 1))) && (n = 65536 + (n - 55296 << 10) + (i - 56320),
                        o++),
                        t[a++] = n < 128 ? n : (t[a++] = n < 2048 ? 192 | n >>> 6 : (t[a++] = n < 65536 ? 224 | n >>> 12 : (t[a++] = 240 | n >>> 18,
                            128 | n >>> 12 & 63),
                            128 | n >>> 6 & 63),
                            128 | 63 & n);

                }
                return t;
            };
            var __u = function () {
                this.input = null,
                    this.next_in = 0,
                    this.avail_in = 0,
                    this.total_in = 0,
                    this.output = null,
                    this.next_out = 0,
                    this.avail_out = 0,
                    this.total_out = 0,
                    this.msg = '',
                    this.state = null,
                    this.data_type = 2,
                    this.adler = 0;
            };
            var __d = function () {
                this.text = 0,
                    this.time = 0,
                    this.xflags = 0,
                    this.os = 0,
                    this.extra = null,
                    this.extra_len = 0,
                    this.name = '',
                    this.comment = '',
                    this.hcrc = 0,
                    this.done = !1;
            };
            var Z_OK = 0;
            var l = {
                Z_NO_FLUSH: 0,
                Z_PARTIAL_FLUSH: 1,
                Z_SYNC_FLUSH: 2,
                Z_FULL_FLUSH: 3,
                Z_FINISH: 4,
                Z_BLOCK: 5,
                Z_TREES: 6,
                Z_OK: 0,
                Z_STREAM_END: 1,
                Z_NEED_DICT: 2,
                Z_ERRNO: -1,
                Z_STREAM_ERROR: -2,
                Z_DATA_ERROR: -3,
                Z_BUF_ERROR: -5,
                Z_NO_COMPRESSION: 0,
                Z_BEST_SPEED: 1,
                Z_BEST_COMPRESSION: 9,
                Z_DEFAULT_COMPRESSION: -1,
                Z_FILTERED: 1,
                Z_HUFFMAN_ONLY: 2,
                Z_RLE: 3,
                Z_FIXED: 4,
                Z_DEFAULT_STRATEGY: 0,
                Z_BINARY: 0,
                Z_TEXT: 1,
                Z_UNKNOWN: 2,
                Z_DEFLATED: 8
            };
            var __i = function (e) {
                if (!(this instanceof __i)) {
                    return new __i(e);
                }

                this.options = Object.assign({
                    chunkSize: 16384,
                    windowBits: 0,
                    to: ''
                }, e || {});
                var t = this.options;
                t.raw && 0 <= t.windowBits && t.windowBits < 16 && (t.windowBits = -t.windowBits,
                    0 === t.windowBits && (t.windowBits = -15)),
                    !(0 <= t.windowBits && t.windowBits < 16) || e && e.windowBits || (t.windowBits += 32),
                    15 < t.windowBits && t.windowBits < 48 && 0 == (15 & t.windowBits) && (t.windowBits |= 15),
                    this.err = 0,
                    this.msg = '',
                    this.ended = !1,
                    this.chunks = [],
                    this.strm = new __u,
                    this.strm.avail_out = 0;
                var n = __inflateInit2(this.strm, t.windowBits);
                if (n !== Z_OK) {
                    throw new Error(c[n]);
                }

                if (this.header = new __d,
                    __inflateGetHeader(this.strm, this.header),
                    t.dictionary && ('string' == typeof t.dictionary ? t.dictionary = __string2buf(t.dictionary) : '[object ArrayBuffer]' === h.call(t.dictionary) && (t.dictionary = new Uint8Array(t.dictionary)),
                        t.raw && (n = __inflateSetDictionary(this.strm, t.dictionary)) !== Z_OK)) {
                    throw new Error(c[n])
                }

            };
            var __y = function (e, t) {
                var n,
                    i,
                    r,
                    o,
                    a,
                    s,
                    l,
                    c,
                    u,
                    d,
                    h,
                    f,
                    p,
                    v,
                    y,
                    g,
                    m,
                    _,
                    b,
                    E,
                    S,
                    T,
                    w,
                    C,
                    A;
                n = e.state,
                    i = e.next_in,
                    C = e.input,
                    r = i + (e.avail_in - 5),
                    o = e.next_out,
                    A = e.output,
                    a = o - (t - e.avail_out),
                    s = o + (e.avail_out - 257),
                    l = n.dmax,
                    c = n.wsize,
                    u = n.whave,
                    d = n.wnext,
                    h = n.window,
                    f = n.hold,
                    p = n.bits,
                    v = n.lencode,
                    y = n.distcode,
                    g = (1 << n.lenbits) - 1,
                    m = (1 << n.distbits) - 1;
                e:
                do {
                    p < 15 && (f += C[i++] << p,
                        p += 8,
                        f += C[i++] << p,
                        p += 8),
                        _ = v[f & g];
                    t:
                    for (; ;) {
                        if (f >>>= b = _ >>> 24,
                            p -= b,
                            0 == (b = _ >>> 16 & 255)) {
                            A[o++] = 65535 & _;
                        }
                        else {
                            if (!(16 & b)) {
                                if (0 == (64 & b)) {
                                    _ = v[(65535 & _) + (f & (1 << b) - 1)];
                                    continue t;
                                }

                                if (32 & b) {
                                    n.mode = 12;
                                    break e;
                                }

                                e.msg = 'invalid literal/length code',
                                    n.mode = 30;
                                break e;
                            }

                            E = 65535 & _,
                                (b &= 15) && (p < b && (f += C[i++] << p,
                                    p += 8),
                                    E += f & (1 << b) - 1,
                                    f >>>= b,
                                    p -= b),
                                p < 15 && (f += C[i++] << p,
                                    p += 8,
                                    f += C[i++] << p,
                                    p += 8),
                                _ = y[f & m];
                            n:
                            for (; ;) {
                                if (f >>>= b = _ >>> 24,
                                    p -= b,
                                    !(16 & (b = _ >>> 16 & 255))) {
                                    if (0 == (64 & b)) {
                                        _ = y[(65535 & _) + (f & (1 << b) - 1)];
                                        continue n;
                                    }

                                    e.msg = 'invalid distance code',
                                        n.mode = 30;
                                    break e;
                                }

                                if (S = 65535 & _,
                                    p < (b &= 15) && (f += C[i++] << p,
                                        (p += 8) < b && (f += C[i++] << p,
                                            p += 8)),
                                    l < (S += f & (1 << b) - 1)) {
                                    e.msg = 'invalid distance too far back',
                                        n.mode = 30;
                                    break e;
                                }

                                if (f >>>= b,
                                    p -= b,
                                    (b = o - a) < S) {
                                    if (u < (b = S - b) && n.sane) {
                                        e.msg = 'invalid distance too far back',
                                            n.mode = 30;
                                        break e;
                                    }

                                    if (w = h,
                                        (T = 0) === d) {
                                        if (T += c - b,
                                            b < E) {
                                            for (E -= b; A[o++] = h[T++],
                                                --b;) {

                                            }
                                            T = o - S,
                                                w = A;
                                        }
                                    }
                                    else if (d < b) {
                                        if (T += c + d - b,
                                            (b -= d) < E) {
                                            for (E -= b; A[o++] = h[T++],
                                                --b;) {

                                            }
                                            if (T = 0,
                                                d < E) {
                                                for (E -= b = d; A[o++] = h[T++],
                                                    --b;) {

                                                }
                                                T = o - S,
                                                    w = A;
                                            }
                                        }
                                    }
                                    else if (T += d - b,
                                        b < E) {
                                        for (E -= b; A[o++] = h[T++],
                                            --b;) {

                                        }
                                        T = o - S,
                                            w = A;
                                    }

                                    for (; 2 < E;) {
                                        A[o++] = w[T++],
                                            A[o++] = w[T++],
                                            A[o++] = w[T++],
                                            E -= 3;

                                    }
                                    E && (A[o++] = w[T++],
                                        1 < E && (A[o++] = w[T++]));
                                }
                                else {
                                    for (T = o - S; A[o++] = A[T++],
                                        A[o++] = A[T++],
                                        A[o++] = A[T++],
                                        2 < (E -= 3);) {

                                    }
                                    E && (A[o++] = A[T++],
                                        1 < E && (A[o++] = A[T++]));
                                }
                                break;
                            }
                        }
                        break;
                    }
                } while (i < r && o < s);
                i -= E = p >> 3,
                    f &= (1 << (p -= E << 3)) - 1,
                    e.next_in = i,
                    e.next_out = o,
                    e.avail_in = i < r ? r - i + 5 : 5 - (i - r),
                    e.avail_out = o < s ? s - o + 257 : 257 - (o - s),
                    n.hold = f,
                    n.bits = p;
            };

            var a = (function () {
                var n = {};
                var i = 'undefined' != typeof Uint8Array && 'undefined' != typeof Uint16Array && 'undefined' != typeof Int32Array;
                n.assign = function (e) {
                    for (var t, n, i = Array.prototype.slice.call(arguments, 1); i.length;) {
                        var r = i.shift();
                        if (r) {
                            if ('object' != typeof r) {
                                throw new TypeError(r + 'must be non-object');
                            }

                            for (var o in r) {
                                t = r,
                                    n = o,
                                    Object.prototype.hasOwnProperty.call(t, n) && (e[o] = r[o])
                            }
                        }

                    }
                    return e;
                }
                    ,
                    n.shrinkBuf = function (e, t) {
                        return e.length === t ? e : e.subarray ? e.subarray(0, t) : (e.length = t,
                            e);
                    };
                var r = {
                    arraySet: function (e, t, n, i, r) {
                        if (t.subarray && e.subarray) {
                            e.set(t.subarray(n, n + i), r);
                        }
                        else {
                            for (var o = 0; o < i; o++) {
                                e[r + o] = t[n + o]
                            }
                        }
                    },
                    flattenChunks: function (e) {
                        var t,
                            n,
                            i,
                            r,
                            o,
                            a;
                        for (t = i = 0,
                            n = e.length; t < n; t++) {
                            i += e[t].length;

                        }
                        for (a = new Uint8Array(i),
                            t = r = 0,
                            n = e.length; t < n; t++) {
                            o = e[t],
                                a.set(o, r),
                                r += o.length;

                        }
                        return a;
                    }
                },
                    o = {
                        arraySet: function (e, t, n, i, r) {
                            for (var o = 0; o < i; o++) {
                                e[r + o] = t[n + o]
                            }
                        },
                        flattenChunks: function (e) {
                            return [].concat.apply([], e);
                        }
                    };
                n.setTyped = function (e) {
                    e ? (n.Buf8 = Uint8Array,
                        n.Buf16 = Uint16Array,
                        n.Buf32 = Int32Array,
                        n.assign(n, r)) : (n.Buf8 = Array,
                            n.Buf16 = Array,
                            n.Buf32 = Array,
                            n.assign(n, o));
                }
                    ,
                    n.setTyped(i);

                return n;
            })();
            __i.prototype.push = function (e, t) {
                var binstring2buf = function (e) {
                    for (var t = new Uint8Array(e.length), n = 0, i = t.length; n < i; n++) {
                        t[n] = e.charCodeAt(n);

                    }
                    return t;
                };
                var inflateSetDictionary = function (e, t) {
                    var m = 1,
                        _ = 2,
                        b = 0,
                        E = -2,
                        S = 1,
                        T = 852,
                        w = 592,
                        C = !0;
                    var n,
                        i = t.length;
                    return e && e.state ? 0 !== (n = e.state).wrap && 11 !== n.mode ? E : 11 === n.mode && p(1, t, i, 0) !== n.check ? -3 : u(e, t, i, i) ? (n.mode = 31,
                        -4) : (n.havedict = 1,
                            b) : E;
                };
                var inflate = function (e, t) {
                    var g = function (e, t, n, l, c, u, d, h) {
                        var f,
                            p,
                            v,
                            y,
                            g,
                            m,
                            _,
                            b,
                            E,
                            S = h.bits,
                            T = 0,
                            w = 0,
                            C = 0,
                            A = 0,
                            k = 0,
                            x = 0,
                            L = 0,
                            R = 0,
                            I = 0,
                            P = 0,
                            M = null,
                            D = 0,
                            O = new Uint16Array(16),
                            N = new Uint16Array(16),
                            U = null,
                            B = 0;
                        for (T = 0; T <= 15; T++) {
                            O[T] = 0;

                        }
                        for (w = 0; w < l; w++) {
                            O[t[n + w]]++;

                        }
                        for (k = S, A = 15; 1 <= A && 0 === O[A]; A--) {

                        }
                        if (A < k && (k = A), 0 === A) {
                            return c[u++] = 20971520, c[u++] = 20971520, h.bits = 1, 0;
                        }

                        for (C = 1; C < A && 0 === O[C]; C++) {

                        }
                        for (k < C && (k = C), T = R = 1; T <= 15; T++) {
                            if (R <<= 1, (R -= O[T]) < 0) {
                                return -1;

                            }
                        }

                        if (0 < R && (0 === e || 1 !== A)) {
                            return -1;
                        }

                        for (N[1] = 0, T = 1; T < 15; T++) {
                            N[T + 1] = N[T] + O[T];

                        }
                        for (w = 0; w < l; w++) {
                            0 !== t[n + w] && (d[N[t[n + w]]++] = w);

                        }
                        if (m = 0 === e ? (M = U = d, 19) : 1 === e ? (M = r, D -= 257, U = o, B -= 257, 256) : (M = a, U = s, -1), T = C, g = u, L = w = P = 0, v = -1, y = (I = 1 << (x = k)) - 1, 1 === e && 852 < I || 2 === e && 592 < I) {
                            return 1;
                        }

                        for (; ;) {
                            for (_ = T - L, E = d[w] < m ? (b = 0, d[w]) : d[w] > m ? (b = U[B + d[w]], M[D + d[w]]) : (b = 96, 0), f = 1 << T - L, C = p = 1 << x; c[g + (P >> L) + (p -= f)] = _ << 24 | b << 16 | E | 0, 0 !== p;) {

                            }
                            for (f = 1 << T - 1; P & f;) {
                                f >>= 1;

                            }
                            if (0 !== f ? (P &= f - 1, P += f) : P = 0, w++, 0 == --O[T]) {
                                if (T === A) {
                                    break;
                                }

                                T = t[n + d[w]];
                            }

                            if (k < T && (P & y) !== v) {
                                for (0 === L && (L = k), g += C, R = 1 << (x = T - L); x + L < A && !((R -= O[x + L]) <= 0);) {
                                    x++, R <<= 1;

                                }
                                if (I += 1 << x, 1 === e && 852 < I || 2 === e && 592 < I) {
                                    return 1;
                                }

                                c[v = P & y] = k << 24 | x << 16 | g - u | 0;
                            }

                        }
                        return 0 !== P && (c[g + P] = T - L << 24 | 64 << 16 | 0), h.bits = k, 0;
                    };
                    var m = 1,
                        _ = 2,
                        b = 0,
                        E = -2,
                        S = 1,
                        T = 852,
                        w = 592,
                        C = !0;
                    var n,
                        r,
                        o,
                        a,
                        s,
                        l,
                        d,
                        h,
                        T,
                        w,
                        C,
                        A,
                        k,
                        x,
                        L,
                        R,
                        I,
                        P,
                        M,
                        D,
                        O,
                        N,
                        U,
                        B,
                        F = 0,
                        z = new Uint8Array(4),
                        j = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15];
                    var f = {
                        arraySet: function (e, t, n, i, r) {
                            if (t.subarray && e.subarray) {
                                e.set(t.subarray(n, n + i), r);
                            }
                            else {
                                for (var o = 0; o < i; o++) {
                                    e[r + o] = t[n + o]
                                }
                            }
                        },
                        flattenChunks: function (e) {
                            var t,
                                n,
                                i,
                                r,
                                o,
                                a;
                            for (t = i = 0,
                                n = e.length; t < n; t++) {
                                i += e[t].length;

                            }
                            for (a = new Uint8Array(i),
                                t = r = 0,
                                n = e.length; t < n; t++) {
                                o = e[t],
                                    a.set(o, r),
                                    r += o.length;

                            }
                            return a;
                        }
                    };
                    function u (e, t, n, i) {
                        var r,
                            o = e.state;
                        return null === o.window && (o.wsize = 1 << o.wbits,
                            o.wnext = 0,
                            o.whave = 0,
                            o.window = new Uint8Array(o.wsize)),
                            i >= o.wsize ? (f.arraySet(o.window, t, n - o.wsize, o.wsize, 0),
                                o.wnext = 0,
                                o.whave = o.wsize) : (i < (r = o.wsize - o.wnext) && (r = i),
                                    f.arraySet(o.window, t, n - i, r, o.wnext),
                                    (i -= r) ? (f.arraySet(o.window, t, n - i, i, 0),
                                        o.wnext = i,
                                        o.whave = o.wsize) : (o.wnext += r,
                                            o.wnext === o.wsize && (o.wnext = 0),
                                            o.whave < o.wsize && (o.whave += r))),
                            0;
                    }
                    var v = (function () {
                        var i = function () {
                            for (var e, t = [], n = 0; n < 256; n++) {
                                e = n;
                                for (var i = 0; i < 8; i++) {
                                    e = 1 & e ? 3988292384 ^ e >>> 1 : e >>> 1;

                                }
                                t[n] = e;
                            }
                            return t;
                        }();
                        return function (e, t, n, r) {
                            var o = i,
                                a = r + n;
                            e ^= -1;
                            for (var s = r; s < a; s++) {
                                e = e >>> 8 ^ o[255 & (e ^ t[s])];

                            }
                            return -1 ^ e;
                        };
                    })();
                    var p = function (e, t, n, i) {
                        for (var r = 65535 & e | 0, o = e >>> 16 & 65535 | 0, a = 0; 0 !== n;) {
                            for (n -= a = 2e3 < n ? 2e3 : n; o = o + (r = r + t[i++] | 0) | 0,
                                --a;) {

                            }
                            r %= 65521,
                                o %= 65521;
                        }
                        return r | o << 16 | 0;
                    };
                    var g = (function () {
                        'use strict';
                        var r = [3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31, 35, 43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258, 0, 0],
                            o = [16, 16, 16, 16, 16, 16, 16, 16, 17, 17, 17, 17, 18, 18, 18, 18, 19, 19, 19, 19, 20, 20, 20, 20, 21, 21, 21, 21, 16, 72, 78],
                            a = [1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193, 257, 385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145, 8193, 12289, 16385, 24577, 0, 0],
                            s = [16, 16, 16, 16, 17, 17, 18, 18, 19, 19, 20, 20, 21, 21, 22, 22, 23, 23, 24, 24, 25, 25, 26, 26, 27, 27, 28, 28, 29, 29, 64, 64];
                        return function (e, t, n, l, c, u, d, h) {
                            var f,
                                p,
                                v,
                                y,
                                g,
                                m,
                                _,
                                b,
                                E,
                                S = h.bits,
                                T = 0,
                                w = 0,
                                C = 0,
                                A = 0,
                                k = 0,
                                x = 0,
                                L = 0,
                                R = 0,
                                I = 0,
                                P = 0,
                                M = null,
                                D = 0,
                                O = new Uint16Array(16),
                                N = new Uint16Array(16),
                                U = null,
                                B = 0;
                            for (T = 0; T <= 15; T++) {
                                O[T] = 0;

                            }
                            for (w = 0; w < l; w++) {
                                O[t[n + w]]++;

                            }
                            for (k = S,
                                A = 15; 1 <= A && 0 === O[A]; A--) {

                            }
                            if (A < k && (k = A),
                                0 === A) {
                                return c[u++] = 20971520,
                                    c[u++] = 20971520,
                                    h.bits = 1,
                                    0;
                            }

                            for (C = 1; C < A && 0 === O[C]; C++) {

                            }
                            for (k < C && (k = C),
                                T = R = 1; T <= 15; T++) {
                                if (R <<= 1,
                                    (R -= O[T]) < 0) {
                                    return -1;

                                }
                            }

                            if (0 < R && (0 === e || 1 !== A)) {
                                return -1;
                            }

                            for (N[1] = 0,
                                T = 1; T < 15; T++) {
                                N[T + 1] = N[T] + O[T];

                            }
                            for (w = 0; w < l; w++) {
                                0 !== t[n + w] && (d[N[t[n + w]]++] = w);

                            }
                            if (m = 0 === e ? (M = U = d,
                                19) : 1 === e ? (M = r,
                                    D -= 257,
                                    U = o,
                                    B -= 257,
                                    256) : (M = a,
                                        U = s,
                                        -1),
                                T = C,
                                g = u,
                                L = w = P = 0,
                                v = -1,
                                y = (I = 1 << (x = k)) - 1,
                                1 === e && 852 < I || 2 === e && 592 < I) {
                                return 1;
                            }

                            for (; ;) {
                                for (_ = T - L,
                                    E = d[w] < m ? (b = 0,
                                        d[w]) : d[w] > m ? (b = U[B + d[w]],
                                            M[D + d[w]]) : (b = 96,
                                                0),
                                    f = 1 << T - L,
                                    C = p = 1 << x; c[g + (P >> L) + (p -= f)] = _ << 24 | b << 16 | E | 0,
                                    0 !== p;) {

                                }
                                for (f = 1 << T - 1; P & f;) {
                                    f >>= 1;

                                }
                                if (0 !== f ? (P &= f - 1,
                                    P += f) : P = 0,
                                    w++,
                                    0 == --O[T]) {
                                    if (T === A) {
                                        break;
                                    }

                                    T = t[n + d[w]];
                                }

                                if (k < T && (P & y) !== v) {
                                    for (0 === L && (L = k),
                                        g += C,
                                        R = 1 << (x = T - L); x + L < A && !((R -= O[x + L]) <= 0);) {
                                        x++,
                                            R <<= 1;

                                    }
                                    if (I += 1 << x,
                                        1 === e && 852 < I || 2 === e && 592 < I) {
                                        return 1;
                                    }

                                    c[v = P & y] = k << 24 | x << 16 | g - u | 0;
                                }

                            }
                            return 0 !== P && (c[g + P] = T - L << 24 | 64 << 16 | 0),
                                h.bits = k,
                                0;
                        };
                    })();
                    function c (e) {
                        if (C) {
                            var t;
                            for (d = new Int32Array(512),
                                h = new Int32Array(32),
                                t = 0; t < 144;) {
                                e.lens[t++] = 8;

                            }
                            for (; t < 256;) {
                                e.lens[t++] = 9;

                            }
                            for (; t < 280;) {
                                e.lens[t++] = 7;

                            }
                            for (; t < 288;) {
                                e.lens[t++] = 8;

                            }
                            for (g(m, e.lens, 0, 288, d, 0, e.work, {
                                bits: 9
                            }),
                                t = 0; t < 32;) {
                                e.lens[t++] = 5;

                            }
                            g(_, e.lens, 0, 32, h, 0, e.work, {
                                bits: 5
                            }),
                                C = !1;
                        }

                        e.lencode = d,
                            e.lenbits = 9,
                            e.distcode = h,
                            e.distbits = 5;
                    }
                    function i (e) {
                        return (e >>> 24 & 255) + (e >>> 8 & 65280) + ((65280 & e) << 8) + ((255 & e) << 24);
                    }
                    if (!e || !e.state || !e.output || !e.input && 0 !== e.avail_in) {
                        return E;
                    }

                    12 === (n = e.state).mode && (n.mode = 13),
                        s = e.next_out,
                        o = e.output,
                        d = e.avail_out,
                        a = e.next_in,
                        r = e.input,
                        l = e.avail_in,
                        h = n.hold,
                        T = n.bits,
                        w = l,
                        C = d,
                        N = 0;
                    e:
                    for (; ;) {
                        switch (n.mode) {
                            case S:
                                if (0 === n.wrap) {
                                    n.mode = 13;
                                    break;
                                }

                                for (; T < 16;) {
                                    if (0 === l) {
                                        break e;
                                    }

                                    l--,
                                        h += r[a++] << T,
                                        T += 8;
                                }
                                if (2 & n.wrap && 35615 === h) {
                                    z[n.check = 0] = 255 & h,
                                        z[1] = h >>> 8 & 255,
                                        n.check = v(n.check, z, 2, 0),
                                        T = h = 0,
                                        n.mode = 2;
                                    break;
                                }

                                if (n.flags = 0,
                                    n.head && (n.head.done = !1),
                                    !(1 & n.wrap) || (((255 & h) << 8) + (h >> 8)) % 31) {
                                    e.msg = 'incorrect header check',
                                        n.mode = 30;
                                    break;
                                }

                                if (8 != (15 & h)) {
                                    e.msg = 'unknown compression method',
                                        n.mode = 30;
                                    break;
                                }

                                if (T -= 4,
                                    O = 8 + (15 & (h >>>= 4)),
                                    0 === n.wbits) {
                                    n.wbits = O;
                                }
                                else if (O > n.wbits) {
                                    e.msg = 'invalid window size',
                                        n.mode = 30;
                                    break;
                                }

                                n.dmax = 1 << O,
                                    e.adler = n.check = 1,
                                    n.mode = 512 & h ? 10 : 12,
                                    T = h = 0;
                                break;
                            case 2:
                                for (; T < 16;) {
                                    if (0 === l) {
                                        break e;
                                    }

                                    l--,
                                        h += r[a++] << T,
                                        T += 8;
                                }
                                if (n.flags = h,
                                    8 != (255 & n.flags)) {
                                    e.msg = 'unknown compression method',
                                        n.mode = 30;
                                    break;
                                }

                                if (57344 & n.flags) {
                                    e.msg = 'unknown header flags set',
                                        n.mode = 30;
                                    break;
                                }

                                n.head && (n.head.text = h >> 8 & 1),
                                    512 & n.flags && (z[0] = 255 & h,
                                        z[1] = h >>> 8 & 255,
                                        n.check = v(n.check, z, 2, 0)),
                                    T = h = 0,
                                    n.mode = 3;
                            case 3:
                                for (; T < 32;) {
                                    if (0 === l) {
                                        break e;
                                    }

                                    l--,
                                        h += r[a++] << T,
                                        T += 8;
                                }
                                n.head && (n.head.time = h),
                                    512 & n.flags && (z[0] = 255 & h,
                                        z[1] = h >>> 8 & 255,
                                        z[2] = h >>> 16 & 255,
                                        z[3] = h >>> 24 & 255,
                                        n.check = v(n.check, z, 4, 0)),
                                    T = h = 0,
                                    n.mode = 4;
                            case 4:
                                for (; T < 16;) {
                                    if (0 === l) {
                                        break e;
                                    }

                                    l--,
                                        h += r[a++] << T,
                                        T += 8;
                                }
                                n.head && (n.head.xflags = 255 & h,
                                    n.head.os = h >> 8),
                                    512 & n.flags && (z[0] = 255 & h,
                                        z[1] = h >>> 8 & 255,
                                        n.check = v(n.check, z, 2, 0)),
                                    T = h = 0,
                                    n.mode = 5;
                            case 5:
                                if (1024 & n.flags) {
                                    for (; T < 16;) {
                                        if (0 === l) {
                                            break e;
                                        }

                                        l--,
                                            h += r[a++] << T,
                                            T += 8;
                                    }
                                    n.length = h,
                                        n.head && (n.head.extra_len = h),
                                        512 & n.flags && (z[0] = 255 & h,
                                            z[1] = h >>> 8 & 255,
                                            n.check = v(n.check, z, 2, 0)),
                                        T = h = 0;
                                }
                                else {
                                    n.head && (n.head.extra = null);
                                }
                                n.mode = 6;
                            case 6:
                                if (1024 & n.flags && (l < (A = n.length) && (A = l),
                                    A && (n.head && (O = n.head.extra_len - n.length,
                                        n.head.extra || (n.head.extra = new Array(n.head.extra_len)),
                                        f.arraySet(n.head.extra, r, a, A, O)),
                                        512 & n.flags && (n.check = v(n.check, r, A, a)),
                                        l -= A,
                                        a += A,
                                        n.length -= A),
                                    n.length)) {
                                    break e;
                                }

                                n.length = 0,
                                    n.mode = 7;
                            case 7:
                                if (2048 & n.flags) {
                                    if (0 === l) {
                                        break e;
                                    }

                                    for (A = 0; O = r[a + A++],
                                        n.head && O && n.length < 65536 && (n.head.name += String.fromCharCode(O)),
                                        O && A < l;) {

                                    }
                                    if (512 & n.flags && (n.check = v(n.check, r, A, a)),
                                        l -= A,
                                        a += A,
                                        O) {
                                        break e;
                                    }
                                }
                                else {
                                    n.head && (n.head.name = null);
                                }
                                n.length = 0,
                                    n.mode = 8;
                            case 8:
                                if (4096 & n.flags) {
                                    if (0 === l) {
                                        break e;
                                    }

                                    for (A = 0; O = r[a + A++],
                                        n.head && O && n.length < 65536 && (n.head.comment += String.fromCharCode(O)),
                                        O && A < l;) {

                                    }
                                    if (512 & n.flags && (n.check = v(n.check, r, A, a)),
                                        l -= A,
                                        a += A,
                                        O) {
                                        break e;
                                    }
                                }
                                else {
                                    n.head && (n.head.comment = null);
                                }
                                n.mode = 9;
                            case 9:
                                if (512 & n.flags) {
                                    for (; T < 16;) {
                                        if (0 === l) {
                                            break e;
                                        }

                                        l--,
                                            h += r[a++] << T,
                                            T += 8;
                                    }
                                    if (h !== (65535 & n.check)) {
                                        e.msg = 'header crc mismatch',
                                            n.mode = 30;
                                        break;
                                    }

                                    T = h = 0;
                                }

                                n.head && (n.head.hcrc = n.flags >> 9 & 1,
                                    n.head.done = !0),
                                    e.adler = n.check = 0,
                                    n.mode = 12;
                                break;
                            case 10:
                                for (; T < 32;) {
                                    if (0 === l) {
                                        break e;
                                    }

                                    l--,
                                        h += r[a++] << T,
                                        T += 8;
                                }
                                e.adler = n.check = i(h),
                                    T = h = 0,
                                    n.mode = 11;
                            case 11:
                                if (0 === n.havedict) {
                                    return e.next_out = s,
                                        e.avail_out = d,
                                        e.next_in = a,
                                        e.avail_in = l,
                                        n.hold = h,
                                        n.bits = T,
                                        2;
                                }

                                e.adler = n.check = 1,
                                    n.mode = 12;
                            case 12:
                                if (5 === t || 6 === t) {
                                    break e;
                                }

                            case 13:
                                if (n.last) {
                                    h >>>= 7 & T,
                                        T -= 7 & T,
                                        n.mode = 27;
                                    break;
                                }

                                for (; T < 3;) {
                                    if (0 === l) {
                                        break e;
                                    }

                                    l--,
                                        h += r[a++] << T,
                                        T += 8;
                                }
                                switch (n.last = 1 & h,
                                T -= 1,
                                3 & (h >>>= 1)) {
                                    case 0:
                                        n.mode = 14;
                                        break;
                                    case 1:
                                        if (c(n),
                                            n.mode = 20,
                                            6 !== t) {
                                            break;
                                        }

                                        h >>>= 2,
                                            T -= 2;
                                        break e;
                                    case 2:
                                        n.mode = 17;
                                        break;
                                    case 3:
                                        e.msg = 'invalid block type',
                                            n.mode = 30;
                                }
                                h >>>= 2,
                                    T -= 2;
                                break;
                            case 14:
                                for (h >>>= 7 & T,
                                    T -= 7 & T; T < 32;) {
                                    if (0 === l) {
                                        break e;
                                    }

                                    l--,
                                        h += r[a++] << T,
                                        T += 8;
                                }
                                if ((65535 & h) != (h >>> 16 ^ 65535)) {
                                    e.msg = 'invalid stored block lengths';
                                    n.mode = 30;
                                    break;
                                }

                                if (n.length = 65535 & h,
                                    T = h = 0,
                                    n.mode = 15,
                                    6 === t) {
                                    break e;
                                }

                            case 15:
                                n.mode = 16;
                            case 16:
                                if (A = n.length) {
                                    if (l < A && (A = l),
                                        d < A && (A = d),
                                        0 === A) {
                                        break e;
                                    }

                                    f.arraySet(o, r, a, A, s),
                                        l -= A,
                                        a += A,
                                        d -= A,
                                        s += A,
                                        n.length -= A;
                                    break;
                                }

                                n.mode = 12;
                                break;
                            case 17:
                                for (; T < 14;) {
                                    if (0 === l) {
                                        break e;
                                    }

                                    l--,
                                        h += r[a++] << T,
                                        T += 8;
                                }
                                if (n.nlen = 257 + (31 & h),
                                    h >>>= 5,
                                    T -= 5,
                                    n.ndist = 1 + (31 & h),
                                    h >>>= 5,
                                    T -= 5,
                                    n.ncode = 4 + (15 & h),
                                    h >>>= 4,
                                    T -= 4,
                                    286 < n.nlen || 30 < n.ndist) {
                                    e.msg = 'too many length or distance symbols',
                                        n.mode = 30;
                                    break;
                                }

                                n.have = 0,
                                    n.mode = 18;
                            case 18:
                                for (; n.have < n.ncode;) {
                                    for (; T < 3;) {
                                        if (0 === l) {
                                            break e;
                                        }

                                        l--,
                                            h += r[a++] << T,
                                            T += 8;
                                    }
                                    n.lens[j[n.have++]] = 7 & h,
                                        h >>>= 3,
                                        T -= 3;
                                }
                                for (; n.have < 19;) {
                                    n.lens[j[n.have++]] = 0;

                                }
                                if (n.lencode = n.lendyn,
                                    n.lenbits = 7,
                                    U = {
                                        bits: n.lenbits
                                    },
                                    N = g(0, n.lens, 0, 19, n.lencode, 0, n.work, U),
                                    n.lenbits = U.bits,
                                    N) {
                                    e.msg = 'invalid code lengths set',
                                        n.mode = 30;
                                    break;
                                }

                                n.have = 0,
                                    n.mode = 19;
                            case 19:
                                for (; n.have < n.nlen + n.ndist;) {
                                    for (; R = (F = n.lencode[h & (1 << n.lenbits) - 1]) >>> 16 & 255,
                                        I = 65535 & F,
                                        !((L = F >>> 24) <= T);) {
                                        if (0 === l) {
                                            break e;
                                        }

                                        l--,
                                            h += r[a++] << T,
                                            T += 8;
                                    }
                                    if (I < 16) {
                                        h >>>= L,
                                            T -= L,
                                            n.lens[n.have++] = I;
                                    }
                                    else {
                                        if (16 === I) {
                                            for (B = L + 2; T < B;) {
                                                if (0 === l) {
                                                    break e;
                                                }

                                                l--,
                                                    h += r[a++] << T,
                                                    T += 8;
                                            }
                                            if (h >>>= L,
                                                T -= L,
                                                0 === n.have) {
                                                e.msg = 'invalid bit length repeat',
                                                    n.mode = 30;
                                                break;
                                            }

                                            O = n.lens[n.have - 1],
                                                A = 3 + (3 & h),
                                                h >>>= 2,
                                                T -= 2;
                                        }
                                        else if (17 === I) {
                                            for (B = L + 3; T < B;) {
                                                if (0 === l) {
                                                    break e;
                                                }

                                                l--,
                                                    h += r[a++] << T,
                                                    T += 8;
                                            }
                                            T -= L,
                                                O = 0,
                                                A = 3 + (7 & (h >>>= L)),
                                                h >>>= 3,
                                                T -= 3;
                                        }
                                        else {
                                            for (B = L + 7; T < B;) {
                                                if (0 === l) {
                                                    break e;
                                                }

                                                l--,
                                                    h += r[a++] << T,
                                                    T += 8;
                                            }
                                            T -= L,
                                                O = 0,
                                                A = 11 + (127 & (h >>>= L)),
                                                h >>>= 7,
                                                T -= 7;
                                        }
                                        if (n.have + A > n.nlen + n.ndist) {
                                            e.msg = 'invalid bit length repeat',
                                                n.mode = 30;
                                            break;
                                        }

                                        for (; A--;) {
                                            n.lens[n.have++] = O
                                        }
                                    }
                                }
                                if (30 === n.mode) {
                                    break;
                                }

                                if (0 === n.lens[256]) {
                                    e.msg = 'invalid code -- missing end-of-block',
                                        n.mode = 30;
                                    break;
                                }

                                if (n.lenbits = 9,
                                    U = {
                                        bits: n.lenbits
                                    },
                                    N = g(m, n.lens, 0, n.nlen, n.lencode, 0, n.work, U),
                                    n.lenbits = U.bits,
                                    N) {
                                    e.msg = 'invalid literal/lengths set',
                                        n.mode = 30;
                                    break;
                                }

                                if (n.distbits = 6,
                                    n.distcode = n.distdyn,
                                    U = {
                                        bits: n.distbits
                                    },
                                    N = g(_, n.lens, n.nlen, n.ndist, n.distcode, 0, n.work, U),
                                    n.distbits = U.bits,
                                    N) {
                                    e.msg = 'invalid distances set',
                                        n.mode = 30;
                                    break;
                                }

                                if (n.mode = 20,
                                    6 === t) {
                                    break e;
                                }

                            case 20:
                                n.mode = 21;
                            case 21:
                                if (6 <= l && 258 <= d) {
                                    e.next_out = s,
                                        e.avail_out = d,
                                        e.next_in = a,
                                        e.avail_in = l,
                                        n.hold = h,
                                        n.bits = T,
                                        __y(e, C),
                                        s = e.next_out,
                                        o = e.output,
                                        d = e.avail_out,
                                        a = e.next_in,
                                        r = e.input,
                                        l = e.avail_in,
                                        h = n.hold,
                                        T = n.bits,
                                        12 === n.mode && (n.back = -1);
                                    break;
                                }

                                for (n.back = 0; R = (F = n.lencode[h & (1 << n.lenbits) - 1]) >>> 16 & 255,
                                    I = 65535 & F,
                                    !((L = F >>> 24) <= T);) {
                                    if (0 === l) {
                                        break e;
                                    }

                                    l--,
                                        h += r[a++] << T,
                                        T += 8;
                                }
                                if (R && 0 == (240 & R)) {
                                    for (P = L,
                                        M = R,
                                        D = I; R = (F = n.lencode[D + ((h & (1 << P + M) - 1) >> P)]) >>> 16 & 255,
                                        I = 65535 & F,
                                        !(P + (L = F >>> 24) <= T);) {
                                        if (0 === l) {
                                            break e;
                                        }

                                        l--,
                                            h += r[a++] << T,
                                            T += 8;
                                    }
                                    h >>>= P,
                                        T -= P,
                                        n.back += P;
                                }

                                if (h >>>= L,
                                    T -= L,
                                    n.back += L,
                                    n.length = I,
                                    0 === R) {
                                    n.mode = 26;
                                    break;
                                }

                                if (32 & R) {
                                    n.back = -1,
                                        n.mode = 12;
                                    break;
                                }

                                if (64 & R) {
                                    e.msg = 'invalid literal/length code',
                                        n.mode = 30;
                                    break;
                                }

                                n.extra = 15 & R,
                                    n.mode = 22;
                            case 22:
                                if (n.extra) {
                                    for (B = n.extra; T < B;) {
                                        if (0 === l) {
                                            break e;
                                        }

                                        l--,
                                            h += r[a++] << T,
                                            T += 8;
                                    }
                                    n.length += h & (1 << n.extra) - 1,
                                        h >>>= n.extra,
                                        T -= n.extra,
                                        n.back += n.extra;
                                }

                                n.was = n.length,
                                    n.mode = 23;
                            case 23:
                                for (; R = (F = n.distcode[h & (1 << n.distbits) - 1]) >>> 16 & 255,
                                    I = 65535 & F,
                                    !((L = F >>> 24) <= T);) {
                                    if (0 === l) {
                                        break e;
                                    }

                                    l--,
                                        h += r[a++] << T,
                                        T += 8;
                                }
                                if (0 == (240 & R)) {
                                    for (P = L,
                                        M = R,
                                        D = I; R = (F = n.distcode[D + ((h & (1 << P + M) - 1) >> P)]) >>> 16 & 255,
                                        I = 65535 & F,
                                        !(P + (L = F >>> 24) <= T);) {
                                        if (0 === l) {
                                            break e;
                                        }

                                        l--,
                                            h += r[a++] << T,
                                            T += 8;
                                    }
                                    h >>>= P,
                                        T -= P,
                                        n.back += P;
                                }

                                if (h >>>= L,
                                    T -= L,
                                    n.back += L,
                                    64 & R) {
                                    e.msg = 'invalid distance code',
                                        n.mode = 30;
                                    break;
                                }

                                n.offset = I,
                                    n.extra = 15 & R,
                                    n.mode = 24;
                            case 24:
                                if (n.extra) {
                                    for (B = n.extra; T < B;) {
                                        if (0 === l) {
                                            break e;
                                        }

                                        l--,
                                            h += r[a++] << T,
                                            T += 8;
                                    }
                                    n.offset += h & (1 << n.extra) - 1,
                                        h >>>= n.extra,
                                        T -= n.extra,
                                        n.back += n.extra;
                                }

                                if (n.offset > n.dmax) {
                                    e.msg = 'invalid distance too far back',
                                        n.mode = 30;
                                    break;
                                }

                                n.mode = 25;
                            case 25:
                                if (0 === d) {
                                    break e;
                                }

                                if (A = C - d,
                                    n.offset > A) {
                                    if ((A = n.offset - A) > n.whave && n.sane) {
                                        e.msg = 'invalid distance too far back',
                                            n.mode = 30;
                                        break;
                                    }

                                    k = A > n.wnext ? (A -= n.wnext,
                                        n.wsize - A) : n.wnext - A,
                                        A > n.length && (A = n.length),
                                        x = n.window;
                                }
                                else {
                                    x = o,
                                        k = s - n.offset,
                                        A = n.length;
                                }
                                for (d < A && (A = d),
                                    d -= A,
                                    n.length -= A; o[s++] = x[k++],
                                    --A;) {

                                }
                                0 === n.length && (n.mode = 21);
                                break;
                            case 26:
                                if (0 === d) {
                                    break e;
                                }

                                o[s++] = n.length,
                                    d--,
                                    n.mode = 21;
                                break;
                            case 27:
                                if (n.wrap) {
                                    for (; T < 32;) {
                                        if (0 === l) {
                                            break e;
                                        }

                                        l--,
                                            h |= r[a++] << T,
                                            T += 8;
                                    }
                                    if (C -= d,
                                        e.total_out += C,
                                        n.total += C,
                                        C && (e.adler = n.check = n.flags ? v(n.check, o, C, s - C) : p(n.check, o, C, s - C)),
                                        C = d,
                                        (n.flags ? h : i(h)) !== n.check) {
                                        e.msg = 'incorrect data check',
                                            n.mode = 30;
                                        break;
                                    }

                                    T = h = 0;
                                }

                                n.mode = 28;
                            case 28:
                                if (n.wrap && n.flags) {
                                    for (; T < 32;) {
                                        if (0 === l) {
                                            break e;
                                        }

                                        l--,
                                            h += r[a++] << T,
                                            T += 8;
                                    }
                                    if (h !== (4294967295 & n.total)) {
                                        e.msg = 'incorrect length check',
                                            n.mode = 30;
                                        break;
                                    }

                                    T = h = 0;
                                }

                                n.mode = 29;
                            case 29:
                                N = 1;
                                break e;
                            case 30:
                                N = -3;
                                break e;
                            case 31:
                                return -4;
                            case 32:
                            default:
                                return E;
                        }
                    }
                    return e.next_out = s,
                        e.avail_out = d,
                        e.next_in = a,
                        e.avail_in = l,
                        n.hold = h,
                        n.bits = T,
                        (n.wsize || C !== e.avail_out && n.mode < 30 && (n.mode < 27 || 4 !== t)) && u(e, e.output, e.next_out, C - e.avail_out) ? (n.mode = 31,
                            -4) : (w -= e.avail_in,
                                C -= e.avail_out,
                                e.total_in += w,
                                e.total_out += C,
                                n.total += C,
                                n.wrap && C && (e.adler = n.check = n.flags ? v(n.check, o, C, e.next_out - C) : p(n.check, o, C, e.next_out - C)),
                                e.data_type = n.bits + (n.last ? 64 : 0) + (12 === n.mode ? 128 : 0) + (20 === n.mode || 15 === n.mode ? 256 : 0),
                                (0 === w && 0 === C || 4 === t) && N === b && (N = -5),
                                N);
                };
                var inflateEnd = function (e) {
                    if (!e || !e.state) {
                        return -2;
                    }

                    var t = e.state;
                    return t.window && (t.window = null),
                        e.state = null,
                        0;
                };
                var h = Object.prototype.toString;
                var n,
                    i,
                    r,
                    c,
                    u,
                    d = this.strm,
                    f = this.options.chunkSize,
                    p = this.options.dictionary,
                    v = !1;
                if (this.ended) {
                    return !1;
                }

                i = t === ~~t ? t : !0 === t ? l.Z_FINISH : l.Z_NO_FLUSH,
                    'string' == typeof e ? d.input = binstring2buf(e) : '[object ArrayBuffer]' === h.call(e) ? d.input = new Uint8Array(e) : d.input = e,
                    d.next_in = 0,
                    d.avail_in = d.input.length;
                do {
                    if (0 === d.avail_out && (d.output = new Uint8Array(f),
                        d.next_out = 0,
                        d.avail_out = f),
                        (n = inflate(d, l.Z_NO_FLUSH)) === l.Z_NEED_DICT && p && (n = inflateSetDictionary(this.strm, p)),
                        n === l.Z_BUF_ERROR && !0 === v && (n = l.Z_OK,
                            v = !1),
                        n !== l.Z_STREAM_END && n !== l.Z_OK) {
                        return this.onEnd(n),
                            !(this.ended = !0);
                    }

                    d.next_out && (0 !== d.avail_out && n !== l.Z_STREAM_END && (0 !== d.avail_in || i !== l.Z_FINISH && i !== l.Z_SYNC_FLUSH) || ('string' === this.options.to ? (r = s.utf8border(d.output, d.next_out),
                        c = d.next_out - r,
                        u = s.buf2string(d.output, r),
                        d.next_out = c,
                        d.avail_out = f - c,
                        c && a.arraySet(d.output, d.output, r, c, 0),
                        this.onData(u)) : this.onData(a.shrinkBuf(d.output, d.next_out)))),
                        0 === d.avail_in && 0 === d.avail_out && (v = !0);
                } while ((0 < d.avail_in || 0 === d.avail_out) && n !== l.Z_STREAM_END);
                return n === l.Z_STREAM_END && (i = l.Z_FINISH),
                    i === l.Z_FINISH ? (n = inflateEnd(this.strm),
                        this.onEnd(n),
                        this.ended = !0,
                        n === l.Z_OK) : i !== l.Z_SYNC_FLUSH || (this.onEnd(l.Z_OK),
                            !(d.avail_out = 0));
            };

            __i.prototype.onData = function (e) {
                this.chunks.push(e);
            };
            __i.prototype.onEnd = function (e) {
                e === l.Z_OK && ('string' === this.options.to ? this.result = this.chunks.join('') : this.result = a.flattenChunks(this.chunks)),
                    this.chunks = [],
                    this.err = e,
                    this.msg = this.strm.msg;
            };

            var __a = function r (e, t) {
                var n = new __i(t);
                if (n.push(e, !0), n.err) {
                    throw n.msg || c[n.err];
                }

                return n.result;
            };

            var encoder;
            var decoder;
            var convertToArrayBuffer = (e, t) => {
                encoder || (encoder = getEncoder());
                var n = new ArrayBuffer(WS_PACKAGE_HEADER_TOTAL_LENGTH),
                    r = new DataView(n, WS_PACKAGE_OFFSET),
                    a = encoder.encode(e);
                return r.setInt32(WS_PACKAGE_OFFSET, WS_PACKAGE_HEADER_TOTAL_LENGTH + a.byteLength),
                    wsBinaryHeaderList[2].value = t,
                    wsBinaryHeaderList.forEach((function (e) {
                        4 === e.bytes ? r.setInt32(e.offset, e.value) : 2 === e.bytes && r.setInt16(e.offset, e.value);
                    }
                    )),

                    mergeArrayBuffer(n, a);
            };

            var convertToObject = function (e) {
                var t = new DataView(e, 0, e.length),
                    n = {
                        body: []
                    };
                if (n.packetLen = t.getInt32(WS_PACKAGE_OFFSET),
                    wsBinaryHeaderList.forEach((function (e) {
                        4 === e.bytes ? n[e.key] = t.getInt32(e.offset) : 2 === e.bytes && (n[e.key] = t.getInt16(e.offset));
                    }
                    )),
                    n.packetLen < e.byteLength && convertToObject(e.slice(0, n.packetLen)),
                    decoder || (decoder = getDecoder()),
                    !n.op || WS_OP_MESSAGE !== n.op && n.op !== WS_OP_CONNECT_SUCCESS) {
                    n.op && WS_OP_HEARTBEAT_REPLY === n.op && (n.body = {
                        count: t.getInt32(WS_PACKAGE_HEADER_TOTAL_LENGTH)
                    });
                }
                else {
                    for (var r = WS_PACKAGE_OFFSET, s = n.packetLen, l = '', c = ''; r < e.byteLength; r += s) {
                        s = t.getInt32(r),
                            l = t.getInt16(r + WS_HEADER_OFFSET);
                        try {
                            if (n.ver === WS_BODY_PROTOCOL_VERSION_DEFLATE) {
                                var u = e.slice(r + l, r + s),
                                    d = __a(new Uint8Array(u));
                                c = convertToObject(d.buffer).body;
                            }
                            else {
                                var h = decoder.decode(e.slice(r + l, r + s));
                                c = 0 !== h.length ? JSON.parse(h) : null;
                            }
                            c && n.body.push(c);
                        }
                        catch (t) {
                            console.error('decode body error:', e, n, t);
                        }
                    }
                }
                return n;
            };

            this._ws.on('open', () => {
                var e,
                    r = {
                        protover: 2,
                        roomid: this.config.rid,
                        uid: this.config.uid
                    };

                n.aid && (r.aid = parseInt(n.aid, 10)),
                    n.from > 0 && (r.from = parseInt(n.from, 10) || 7);

                for (var o = 0; o < n.customAuthParam.length; o++) {
                    var a = n.customAuthParam[o];
                    var s = a.type || 'string';
                    switch (void 0 !== r[a.key] && console.error('Token has the same key already! 【' + a.key + '】'),
                    a.key.toString() && a.value.toString() || console.error('Invalid customAuthParam, missing key or value! 【' + a.key + '】-【' + a.value + '】'),
                    s) {
                        case 'string':
                            r[a.key] = a.value;
                            break;
                        case 'number':
                            r[a.key] = parseInt(a.value, 10);
                            break;
                        case 'boolean':
                            r[a.key] = !!r[a.value];
                            break;
                        default:
                            return void console.error('Unsupported customAuthParam type!【' + s + '】');
                    }
                }
                e = convertToArrayBuffer(JSON.stringify(r), WS_OP_USER_AUTHENTICATION);
                authInfo.origin = r;
                authInfo.encode = e;

                setTimeout((() => {
                    this._ws.send(e);
                }), 0);

            });

            var heartBeat = () => {
                clearTimeout(HEART_BEAT_INTERVAL);
                var t = convertToArrayBuffer({}, WS_OP_HEARTBEAT);
                this._ws.send(t),
                    HEART_BEAT_INTERVAL = setTimeout((function () {
                        heartBeat();
                    }
                    ), 1e3 * n.heartBeatInterval);
            };
            var onMessageReply = (e, t) => {
                try {
                    e instanceof Array ? e.forEach((function (e) {
                        onMessageReply(e, t);
                    })) : e instanceof Object && 'function' == typeof this.onReceivedMessage && this.onReceivedMessage(e, t);
                }
                catch (e) {
                    console.error('On Message Resolve Error: ', e);
                }
            };
            this._ws.on('message', (data) => {
                var t = this;
                try {
                    const buff = Buffer.from(data);
                    let uint8Array = new Uint8Array(buff.length);
                    for (let counter = 0; counter < buff.length; counter++) {
                        uint8Array[counter] = buff[counter];
                    }
                    var n = convertToObject(uint8Array.buffer);
                    if (n instanceof Array) {
                        n.forEach((function (e) {
                            t.onMessage(e);
                        }));
                    }
                    else if (n instanceof Object) {
                        switch (n.op) {
                            case WS_OP_HEARTBEAT_REPLY:
                                this.WS_OP_HEARTBEAT_REPLY_CALLBACK && this.WS_OP_HEARTBEAT_REPLY_CALLBACK(n.body);
                                break;
                            case WS_OP_MESSAGE:
                                onMessageReply(n.body, n.seq);
                                break;
                            case WS_OP_CONNECT_SUCCESS:
                                if (0 !== n.body.length && n.body[0]) {
                                    switch (n.body[0].code) {
                                        case WS_AUTH_OK:
                                            this.WS_AUTH_OK_CALLBACK && this.WS_AUTH_OK_CALLBACK(n.body);
                                            heartBeat();
                                            break;
                                        case WS_AUTH_TOKEN_ERROR:
                                            this.WS_AUTH_TOKEN_ERROR_CALLBACK && this.WS_AUTH_TOKEN_ERROR_CALLBACK(n.body);
                                            break;
                                        default:
                                            this.WS_ON_CLOSE_CALLBACK && this.WS_ON_CLOSE_CALLBACK(n.body);
                                    }
                                } else {
                                    heartBeat();
                                }
                        }
                    }

                }
                catch (e) {
                    console.error('WebSocket Error: ', e);
                }
                return this;
            });
        }));
    }
    /** 
     * @description 获取直播流 
     */
    getStream () {

        if (!this.config.room_play_info) throw new Error('请先调用loadedRoomInitAPI方法');
        // if (!this.config.room_play_info.playurl_info) throw new Error('该直播间已关闭');

        const _map = {};
        const stream = this.config.room_play_info.playurl_info.playurl.stream;
        for (const iterator of stream) {
            _map[iterator.protocol_name] = iterator.format.map(format_data => {
                return format_data.codec.map(codec_data => {
                    return codec_data.url_info.map(url_info_data => {
                        return {
                            accept_qn: codec_data.accept_qn,
                            current_qn: codec_data.current_qn,
                            codec_name: codec_data.codec_name,
                            format_name: format_data.format_name,
                            stream: url_info_data.host + codec_data.base_url + url_info_data.extra,
                        }
                    })
                }).flat();
            }).flat();
        }
        return _map;
    }
    initRoomPlayInfo () {
        return request({
            qs: {
                room_id: this.config.cid,
                no_playurl: '0',
                mask: '1',
                qn: '0',
                platform: 'web',
                protocol: '0,1',
                format: '0,2',
                codec: '0,1'
            },
            headers: { ...this.request.headers },
            url: 'https://api.live.bilibili.com/xlive/web-room/v2/index/getRoomPlayInfo',
            json: true
        }).then(x => {
            if (x.code !== 0) {
                throw new Error(x.message)
            }

            this.config.cid = x.data.room_id;
            this.config.rid = x.data.room_id;
            this.config.uid = x.data.uid;
            this.config.room_play_info = x.data;

            if (!this.config.room_play_info.playurl_info) throw new Error('该直播间已关闭');
        });
    }
    requestDanmuServerApi () {
        return request({
            qs: { type: 0, id: this.config.cid },
            headers: { ...this.request.headers },
            url: 'https://api.live.bilibili.com/xlive/web-room/v1/index/getDanmuInfo',
            json: true
        }).then(x => {
            this.setServerHost(x.data);
        });
    }
    setServerHost (e) {
        if (this.state.hostServer.port = e.port,
            this.state.hostServer.host = e.host,
            this.state.hostServer.token = e.token,
            '[object Array]' === Object.prototype.toString.call(e.host_list)) {
            var t = e.host_list.map((function (e) {
                return {
                    host: e.host,
                    port: e.port,
                    wsPort: e.ws_port,
                    wssPort: e.wss_port
                };
            }
            ));
            this.state.hostServer.hostServerList = t.slice();
        }
    }
    onReceivedMessage (body, seq) {
        if (body instanceof Array) {
            body.forEach(((e) => {
                this.onReceivedMessage(e);
            }));
            return;
        }

        const STATE_STRING = {
            DANMAKU_BORDER_COLOR: '66FFFF',
            WS_MESSAGE_DANMAKU: 'DANMU_MSG',
            WS_MESSAGE_SYS_MSG: 'SYS_MSG',
            WS_MESSAGE_SYS_GIFT: 'SYS_GIFT',
            WS_MESSAGE_GUARD_MSG: 'GUARD_MSG',
            WS_MESSAGE_SEND_GIFT: 'SEND_GIFT',
            WS_MESSAGE_LIVE: 'LIVE',
            WS_MESSAGE_PREPARING: 'PREPARING',
            WS_MESSAGE_END: 'END',
            WS_MESSAGE_CLOSE: 'CLOSE',
            WS_MESSAGE_BLOCK: 'BLOCK',
            WS_MESSAGE_ROUND: 'ROUND',
            WS_MESSAGE_WELCOME: 'WELCOME',
            WS_MESSAGE_REFRESH: 'REFRESH',
            WS_ACTIVITY_RED_PACKET: 'ACTIVITY_RED_PACKET',
            WS_ROOM_LIMIT: 'ROOM_LIMIT',
            WS_PK_PRE: 'PK_PRE',
            WS_PK_END: 'PK_END',
            WS_PK_SETTLE: 'PK_SETTLE',
            WS_PK_MIC_END: 'PK_MIC_END',
            HOT_ROOM_NOTIFY: 'HOT_ROOM_NOTIFY',
            L_LIVE: 'live',
            L_PREPARING: 'preparing',
            L_END: 'end',
            L_CLOSE: 'close',
            L_BLOCK: 'block',
            L_PRE_ROUND: 'pre-round',
            L_ROUND: 'round',
            L_ERROR: 'error',
            V_PLAY: 'player-state-play',
            V_PAUSE: 'player-state-pause',
            PROTOCOL_API_HTTP: 'http:',
            PROTOCOL_API_HTTPS: 'https:',
            PROTOCOL_WEBSOCKET_DEFAULT: 'ws:',
            PROTOCOL_WEBSOCKET_SECURITY: 'wss:',
            LOCAL_STORAGE_VOLUME: 'videoVolume',
            LOCAL_STORAGE_VOLUME_HOME: 'homeVideoVolume',
            DANMAKU_TYPE_CSS: 'div',
            DANMAKU_TYPE_CANVAS: 'canvas',
            CALLBACK_INITIALIZED: 'initialized',
            CALLBACK_PLAYER_STATE_CHANGE: 'playerStateChange',
            CALLBACK_LIVE_STATE_CHANGE: 'liveStateChange',
            CALLBACK_START_PLAY_ROUND: 'startPlayRound',
            CALLBACK_VIDEO_STATE_CHANGE: 'videoStateChange',
            CALLBACK_FULL_SCREEN_CHANGE: 'fullscreenChange',
            CALLBACK_PLAYING: 'playing',
            CALLBACK_PAUSED: 'paused',
            CALLBACK_SWITCH_LINE: 'switchLine',
            CALLBACK_SWITCH_QUALITY: 'switchQuality',
            SWITCH_QUALITY_NOT_LOGIN: 'switchQualityNotLogin',
            CALLBACK_WEB_FULLSCREEN: 'webFullscreen',
            CALLBACK_FEED_BACK_CLICK: 'feedBackClick',
            CALLBACK_BLOCK_SETTING_CLICK: 'blockSettingClick',
            CALLBACK_SET: 'set',
            CALLBACK_INIT_DANMAKU: 'initDanmaku',
            CALLBACK_ADD_DANMAKU: 'addDanmaku',
            CALLBACK_SEND_DANMAKU: 'sendDanmaku',
            CALLBACK_RECEIVE_ONLINE_COUNT: 'receiveOnlineCount',
            CALLBACK_RECEIVE_MESSAGE: 'receiveMessage',
            CALLBACK_USER_LOGIN: 'userLogin',
            CALLBACK_GIFT_PACKAGE_CLICK: 'giftPackageClick',
            CALLBACK_SEND_GIFT: 'sendGift',
            CALLBACK_GUID_CHANGE: 'guidChange',
            CALLBACK_RELOAD: 'reload',
            SET_COMPONENT_DANMAKU: 'danmaku',
            SET_COMPONENT_BLOCK: 'block',
            SET_COMPONENT_GIFT: 'gift',
            SET_COMPONENT_MASK: 'mask',
            CALLBACK_FIRST_LOADED_API_PLAYER: 'firstLoadedAPIPlayer',
            CALLBACK_FIRST_LOADED_API_PLAYURL: 'firstLoadedAPIPlayurl',
            CALLBACK_FIRST_LOAD_START: 'firstLoadStart',
            CALLBACK_FIRST_LOADED_META_DATA: 'firstLoadedMetaData',
            CALLBACK_FIRST_PLAYING: 'firstPlaying',
            ENTER_THE_ROOM: 'enterTheRoom',
            CALLBACK_OPERABLE_ELEMENTS_CHANGE: 'operableElementsChange',
            AUTO_PLAY: 'autoPlay',
            BILIBILI_PLAYER_SHOW_TIP_BASE_TIME: 'bilibiliPlayerShowTipBaseTime',
            RECOMMEND: 'recommend',
            RECOMMEND_MOVE: 'move',
            RECOMMEND_CLICK: 'click',
            RECOMMEND_NOLIVE: 'nolive',
            RECOMMEND_SHOW: 'show',
            MOCK_SOCKET: 'mockSocket',
            CALLBACK_DANMAKU_MASK_CHANGE: 'danmakuMaskChange',
            CALLBACK_DANMAKU_MASK_STATUS_CHANGE: 'danmakuMaskStatusChange',
            PLAY_TAG: 'PLAY_TAG',
            PLAY_PROGRESS_BAR: 'PLAY_PROGRESS_BAR'
        };

        var _checkCmdPermission = function (e) {
            var t = {
                danmaku: !1,
                callback: !1
            }
                , n = !1;
            if ("[object String]" !== Object.prototype.toString.call(e))
                return {
                    shouldIgnore: t,
                    hasCheckNum: n,
                    type: ""
                };
            var i = e.split(":")
                , r = i[0];
            if (1 !== i.length)
                switch (n = !0,
                parseInt(i[4], 10)) {
                    case 0:
                        t.danmaku = !1,
                            t.callback = !1;
                        break;
                    case 1:
                        t.danmaku = !1,
                            t.callback = !0;
                        break;
                    case 2:
                        t.danmaku = !0,
                            t.callback = !1;
                        break;
                    case 3:
                        t.danmaku = !0,
                            t.callback = !0
                }
            return {
                type: r,
                shouldIgnore: t,
                hasCheckNum: n
            }
        }
        var n = this,
            i = this,
            r = n.config,
            o = n.state,
            s = !0;
        var e = {};
        e.PLAYER_HOME = 0
        e.HOME_PLAYER_MSG = [STATE_STRING.WS_MESSAGE_DANMAKU, STATE_STRING.WS_ROOM_LIMIT];

        e.DANMAKU_GIFT_666 = 7;
        e.DANMAKU_GIFT_233 = 8;
        e.DANMAKU_GIFT_FFF = 13;


        if (body && body instanceof Object) {
            body.msg;
            if (r.useType === e.PLAYER_HOME && -1 === e.HOME_PLAYER_MSG.indexOf(body.cmd)) {
                return;
            }

            var p = _checkCmdPermission(body.cmd),
                v = p.type,
                y = p.shouldIgnore;
            switch (p.hasCheckNum && (body.cmd = v), body.cmd) {
                /** 普通弹幕 */
                case STATE_STRING.WS_MESSAGE_DANMAKU: {
                    var g = body.info;
                    var m = {
                        mode: g[0][1],
                        size: g[0][2],
                        color: g[0][3],
                        dmid: g[0][5],
                        text: g[1],
                        ignore: false, // parseInt(g[2][0], 10) === r.uid && g[0][5].toString() === a,
                        type: parseInt(g[0][9], 10) || 0
                    };
                    var _ = {
                        stime: -1,
                        mode: m.mode,
                        size: m.size,
                        color: m.color,
                        date: Date.now(),
                        uid: g[2][0],
                        dmid: m.dmid,
                        text: m.text,
                        uname: g[2][1],
                        user: {
                            level: g[4][0],
                            rank: g[2][5],
                            verify: !!g[2][6]
                        },
                        checkInfo: {
                            ts: g[9].ts,
                            ct: g[9].ct
                        },
                        type: m.type
                    };
                    this.WS_MESSAGE_DANMAKU_CALLBACK && this.WS_MESSAGE_DANMAKU_CALLBACK(_)
                    break;
                }
                /** 礼物 */
                case STATE_STRING.WS_MESSAGE_SEND_GIFT: {
                    this.WS_MESSAGE_SEND_GIFT_CALLBACK && this.WS_MESSAGE_SEND_GIFT_CALLBACK(body.data)
                    break;
                }
                /** 热点房间 */
                case STATE_STRING.HOT_ROOM_NOTIFY: {
                    this.WS_HOT_ROOM_NOTIFY_CALLBACK && this.WS_HOT_ROOM_NOTIFY_CALLBACK(body.data)
                    break;
                }
                /** 直播间PK */
                case STATE_STRING.WS_PK_PRE: // 准备PK
                case STATE_STRING.WS_PK_END: // PK结束
                case STATE_STRING.WS_PK_SETTLE: // PK结算
                case STATE_STRING.WS_PK_MIC_END: // PK麦克风关闭
                    {
                        this.WS_PK_EVENT_CALLBACK && this.WS_PK_EVENT_CALLBACK(body.data)
                        break;
                    }
                /** 直播事件 */
                case STATE_STRING.WS_MESSAGE_LIVE: // 开播【欢迎语】
                case STATE_STRING.WS_MESSAGE_ROUND: // 开始PK回合
                case STATE_STRING.WS_MESSAGE_PREPARING: // 	下播【结束语】
                case STATE_STRING.WS_MESSAGE_CLOSE: // 关闭直播
                case STATE_STRING.WS_MESSAGE_END: // 结束直播
                case STATE_STRING.WS_ROOM_LIMIT: // 直播被限制
                case STATE_STRING.WS_MESSAGE_BLOCK: // 禁止发送弹幕
                case STATE_STRING.WS_MESSAGE_REFRESH: // 直播数据刷新
                case STATE_STRING.PLAY_TAG: // 直播标签变更事件
                case STATE_STRING.PLAY_PROGRESS_BAR: // 播放进度条事件
                    {
                        this.WS_LIVE_EVENT_CALLBACK && this.WS_LIVE_EVENT_CALLBACK(body.data)
                        break;
                    }
            }
        }
    }
}

module.exports = Live;