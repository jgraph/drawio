(function () {
    var t = {};
  
    function e(t, e, n, r) {
      if (r === void 0) {
        r = function r(t) {
          return t;
        };
      }
  
      return t * r(.5 - e * (.5 - n));
    }
  
    function n(t, e) {
      return [t[0] + e[0], t[1] + e[1]];
    }
  
    function r(t, e) {
      return [t[0] - e[0], t[1] - e[1]];
    }
  
    function i(t, e) {
      return [t[0] * e, t[1] * e];
    }
  
    function u(t) {
      return [t[1], -t[0]];
    }
  
    function o(t, e) {
      return t[0] * e[0] + t[1] * e[1];
    }
  
    function l(t, e) {
      return t[0] === e[0] && t[1] === e[1];
    }
  
    function s(t, e) {
      return function (t) {
        return t[0] * t[0] + t[1] * t[1];
      }(r(t, e));
    }
  
    function c(t) {
      return function (t, e) {
        return [t[0] / e, t[1] / e];
      }(t, function (t) {
        return Math.hypot(t[0], t[1]);
      }(t));
    }
  
    function h(t, e) {
      return Math.hypot(t[1] - e[1], t[0] - e[0]);
    }
  
    function f(t, e, n) {
      var r = Math.sin(n),
          i = Math.cos(n),
          u = t[0] - e[0],
          o = t[1] - e[1],
          l = u * r + o * i;
      return [u * i - o * r + e[0], l + e[1]];
    }
  
    function p(t, e, u) {
      return n(t, i(r(e, t), u));
    }
  
    function a(t, e, r) {
      return n(t, i(e, r));
    }
  
    t.g = window;
    var g = Math.min,
        v = Math.PI,
        d = v + 1e-4;
  
    function M(t, v) {
      if (v === void 0) {
        v = {};
      }
  
      return function (t, l) {
        if (l === void 0) {
          l = {};
        }
  
        var _l = l,
            _l$size = _l.size,
            h = _l$size === void 0 ? 16 : _l$size,
            _l$smoothing = _l.smoothing,
            v = _l$smoothing === void 0 ? .5 : _l$smoothing,
            _l$thinning = _l.thinning,
            M = _l$thinning === void 0 ? .5 : _l$thinning,
            _l$simulatePressure = _l.simulatePressure,
            m = _l$simulatePressure === void 0 ? !0 : _l$simulatePressure,
            _l$easing = _l.easing,
            y = _l$easing === void 0 ? function (t) {
          return t;
        } : _l$easing,
            _l$start = _l.start,
            w = _l$start === void 0 ? {} : _l$start,
            _l$end = _l.end,
            P = _l$end === void 0 ? {} : _l$end,
            _l$last = _l.last,
            F = _l$last === void 0 ? !1 : _l$last,
            _w$cap = w.cap,
            b = _w$cap === void 0 ? !0 : _w$cap,
            _w$taper = w.taper,
            L = _w$taper === void 0 ? 0 : _w$taper,
            _w$easing = w.easing,
            j = _w$easing === void 0 ? function (t) {
          return t * (2 - t);
        } : _w$easing,
            _P$cap = P.cap,
            S = _P$cap === void 0 ? !0 : _P$cap,
            _P$taper = P.taper,
            k = _P$taper === void 0 ? 0 : _P$taper,
            _P$easing = P.easing,
            x = _P$easing === void 0 ? function (t) {
          return --t * t * t + 1;
        } : _P$easing;
        if (0 === t.length || h <= 0) return [];
        var z,
            A = t[t.length - 1].runningLength,
            T = Math.pow(h * v, 2),
            I = [],
            Q = [],
            Z = t.slice(0, 10).reduce(function (t, e) {
          var n = e.pressure;
  
          if (m) {
            var _r = g(1, e.distance / h),
                _i = g(1, 1 - _r);
  
            n = g(1, t + .275 * _r * (_i - t));
          }
  
          return (t + n) / 2;
        }, t[0].pressure),
            q = e(h, M, t[t.length - 1].pressure, y),
            B = t[0].vector,
            C = t[0].point,
            D = C,
            E = C,
            G = D;
  
        for (var _l2 = 0; _l2 < t.length; _l2++) {
          var _c = t[_l2].pressure,
              _t$_l = t[_l2],
              _a = _t$_l.point,
              _v = _t$_l.vector,
              _w = _t$_l.distance,
              _P = _t$_l.runningLength;
          if (_l2 < t.length - 1 && A - _P < 3) continue;
  
          if (M) {
            if (m) {
              var _t = g(1, _w / h),
                  _e = g(1, 1 - _t);
  
              _c = g(1, Z + .275 * _t * (_e - Z));
            }
  
            q = e(h, M, _c, y);
          } else q = h / 2;
  
          void 0 === z && (z = q);
  
          var _F = _P < L ? j(_P / L) : 1,
              _b = A - _P < k ? x((A - _P) / k) : 1;
  
          if (q = Math.max(.01, q * Math.min(_F, _b)), _l2 === t.length - 1) {
            var _t2 = i(u(_v), q);
  
            I.push(r(_a, _t2)), Q.push(n(_a, _t2));
            continue;
          }
  
          var _S = t[_l2 + 1].vector,
              _H = o(_v, _S);
  
          if (_H < 0) {
            var _t3 = i(u(B), q);
  
            for (var _e2 = 1 / 13, _i2 = 0; _i2 <= 1; _i2 += _e2) {
              E = f(r(_a, _t3), _a, d * _i2), I.push(E), G = f(n(_a, _t3), _a, d * -_i2), Q.push(G);
            }
  
            C = E, D = G;
            continue;
          }
  
          var _J = i(u(p(_S, _v, _H)), q);
  
          E = r(_a, _J), (_l2 <= 1 || s(C, E) > T) && (I.push(E), C = E), G = n(_a, _J), (_l2 <= 1 || s(D, G) > T) && (Q.push(G), D = G), Z = _c, B = _v;
        }
  
        var H = t[0].point.slice(0, 2),
            J = t.length > 1 ? t[t.length - 1].point.slice(0, 2) : n(t[0].point, [1, 1]),
            K = [],
            N = [];
  
        if (1 === t.length) {
          if (!L && !k || F) {
            var _t4 = a(H, c(u(r(H, J))), -(z || q)),
                _e3 = [];
  
            for (var _n = 1 / 13, _r2 = _n; _r2 <= 1; _r2 += _n) {
              _e3.push(f(_t4, H, 2 * d * _r2));
            }
  
            return _e3;
          }
        } else {
          if (!(L || k && 1 === t.length)) if (b) for (var _t5 = 1 / 13, _e5 = _t5; _e5 <= 1; _e5 += _t5) {
            var _t6 = f(Q[0], H, d * _e5);
  
            K.push(_t6);
          } else {
            var _t7 = r(I[0], Q[0]),
                _e6 = i(_t7, .5),
                _u = i(_t7, .51);
  
            K.push(r(H, _e6), r(H, _u), n(H, _u), n(H, _e6));
          }
  
          var _e4 = u(function (t) {
            return [-t[0], -t[1]];
          }(t[t.length - 1].vector));
  
          if (k || L && 1 === t.length) N.push(J);else if (S) {
            var _t8 = a(J, _e4, q);
  
            for (var _e7 = 1 / 29, _n2 = _e7; _n2 < 1; _n2 += _e7) {
              N.push(f(_t8, J, 3 * d * _n2));
            }
          } else N.push(n(J, i(_e4, q)), n(J, i(_e4, .99 * q)), r(J, i(_e4, .99 * q)), r(J, i(_e4, q)));
        }
  
        return I.concat(N, Q.reverse(), K);
      }(function (t, e) {
        if (e === void 0) {
          e = {};
        }
  
        var i;
        var _e8 = e,
            _e8$streamline = _e8.streamline,
            u = _e8$streamline === void 0 ? .5 : _e8$streamline,
            _e8$size = _e8.size,
            o = _e8$size === void 0 ? 16 : _e8$size,
            _e8$last = _e8.last,
            s = _e8$last === void 0 ? !1 : _e8$last;
        if (0 === t.length) return [];
        var f = .15 + .85 * (1 - u),
            a = Array.isArray(t[0]) ? t : t.map(function (_ref) {
          var t = _ref.x,
              e = _ref.y,
              _ref$pressure = _ref.pressure,
              n = _ref$pressure === void 0 ? .5 : _ref$pressure;
          return [t, e, n];
        });
  
        if (2 === a.length) {
          var _t9 = a[1];
          a = a.slice(0, -1);
  
          for (var _e9 = 1; _e9 < 5; _e9++) {
            a.push(p(a[0], _t9, _e9 / 4));
          }
        }
  
        1 === a.length && (a = [].concat(a, [[].concat(n(a[0], [1, 1]), a[0].slice(2))]));
        var g = [{
          point: [a[0][0], a[0][1]],
          pressure: a[0][2] >= 0 ? a[0][2] : .25,
          vector: [1, 1],
          distance: 0,
          runningLength: 0
        }],
            v = !1,
            d = 0,
            M = g[0],
            m = a.length - 1;
  
        for (var _t10 = 1; _t10 < a.length; _t10++) {
          var _e10 = s && _t10 === m ? a[_t10].slice(0, 2) : p(M.point, a[_t10], f);
  
          if (l(M.point, _e10)) continue;
  
          var _n3 = h(_e10, M.point);
  
          if (d += _n3, _t10 < m && !v) {
            if (d < o) continue;
            v = !0;
          }
  
          M = {
            point: _e10,
            pressure: a[_t10][2] >= 0 ? a[_t10][2] : .5,
            vector: c(r(M.point, _e10)),
            distance: _n3,
            runningLength: d
          }, g.push(M);
        }
  
        return g[0].vector = (null == (i = g[1]) ? void 0 : i.vector) || [0, 0], g;
      }(t, v), v);
    }
  
    t.g.PerfectFreehand = {}, PerfectFreehand.getStroke = function (t, e) {
      return M(t, e);
    }, PerfectFreehand.getSvgPathFromStroke = function (t, e) {
      var n = M(t, e);
      var r = n.reduce(function (t, _ref2, r, i) {
        var e = _ref2[0],
            n = _ref2[1];
        var _i3 = i[(r + 1) % i.length],
            u = _i3[0],
            o = _i3[1];
        return t.push(e, n, (e + u) / 2, (n + o) / 2), t;
      }, ["M"].concat(n[0], ["Q"]));
      return r.push("Z"), r.join(" ");
    };
  })();