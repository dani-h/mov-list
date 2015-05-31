define(["require", "exports"], function (require, exports) {
    var SimpleEvent;
    (function (SimpleEvent) {
        var EventCls = (function () {
            function EventCls() {
                this.id = 0;
                this.events = {};
            }
            EventCls.prototype.register = function (eventname, callback) {
                var events_obj = this.events[eventname] || (this.events[eventname] = {});
                var id = this.generate_id();
                events_obj[id] = callback;
                return id;
            };
            EventCls.prototype.unregister = function (id) {
                for (var _i = 0, _a = Object.keys(this.events); _i < _a.length; _i++) {
                    var eventname = _a[_i];
                    if (id in this.events[eventname]) {
                        delete this.events[eventname][id];
                        return true;
                    }
                }
                return false;
            };
            EventCls.prototype.trigger = function (eventname) {
                var args = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    args[_i - 1] = arguments[_i];
                }
                if (this.events[eventname]) {
                    for (var _a = 0, _b = Object.keys(this.events[eventname]); _a < _b.length; _a++) {
                        var id = _b[_a];
                        this.events[eventname][id].call(this);
                    }
                }
            };
            EventCls.prototype.generate_id = function () {
                return "ID_" + this.id++;
            };
            return EventCls;
        })();
        SimpleEvent.EventCls = EventCls;
    })(SimpleEvent || (SimpleEvent = {}));
    return SimpleEvent;
});
