/* Generated from Java with JSweet 2.0.0-rc1 - http://www.jsweet.org */
interface JQueryMouseEventObject extends JQueryInputEventObject {
    button : number;

    clientX : number;

    clientY : number;

    offsetX : number;

    offsetY : number;

    pageX : number;

    pageY : number;

    screenX : number;

    screenY : number;
}

/**
 * The interface used to construct jQuery events (with $.Event). It is
 * defined separately instead of inline in JQueryStatic to allow
 * overriding the construction function with specific strings
 * returning specific event objects.
 * @class
 * @extends Object
 */
interface JQueryEventConstructor {
    (name : string, eventProperties : any) : JQueryEventObject;

    (name : string) : JQueryEventObject;
}

/**
 * Interface for the JQuery deferred, part of callbacks
 * @class
 * @extends *
 */
interface JQueryDeferred<T> extends JQueryGenericPromise<T> {
    /**
     * Determine the current state of a Deferred object.
     * @return {string}
     */
    state() : string;

    /**
     * Add handlers to be called when the Deferred object is either resolved or rejected.
     * 
     * @param alwaysCallbacks1 A function, or array of functions, that is called when the Deferred is resolved or rejected.
     * @param alwaysCallbacks2 Optional additional functions, or arrays of functions, that are called when the Deferred is resolved or rejected.
     * @param {*} alwaysCallback1
     * @param {Array} alwaysCallbacksN
     * @return {*}
     */
    always(alwaysCallback1 : JQueryPromiseCallback<any>, ...alwaysCallbacksN : any[]) : JQueryDeferred<T>;

    /**
     * Add handlers to be called when the Deferred object is resolved.
     * 
     * @param doneCallbacks1 A function, or array of functions, that are called when the Deferred is resolved.
     * @param doneCallbacks2 Optional additional functions, or arrays of functions, that are called when the Deferred is resolved.
     * @param {*} doneCallback1
     * @param {Array} doneCallbackN
     * @return {*}
     */
    done(doneCallback1 : JQueryPromiseCallback<T>, ...doneCallbackN : any[]) : JQueryDeferred<T>;

    /**
     * Add handlers to be called when the Deferred object is rejected.
     * 
     * @param failCallbacks1 A function, or array of functions, that are called when the Deferred is rejected.
     * @param failCallbacks2 Optional additional functions, or arrays of functions, that are called when the Deferred is rejected.
     * @param {*} failCallback1
     * @param {Array} failCallbacksN
     * @return {*}
     */
    fail(failCallback1 : JQueryPromiseCallback<any>, ...failCallbacksN : any[]) : JQueryDeferred<T>;

    /**
     * Add handlers to be called when the Deferred object generates progress notifications.
     * 
     * @param progressCallbacks A function, or array of functions, to be called when the Deferred generates progress notifications.
     * @param {*} progressCallback1
     * @param {Array} progressCallbackN
     * @return {*}
     */
    progress(progressCallback1 : JQueryPromiseCallback<any>, ...progressCallbackN : any[]) : JQueryDeferred<T>;

    /**
     * Call the progressCallbacks on a Deferred object with the given args.
     * 
     * @param {Array} args Optional arguments that are passed to the progressCallbacks.
     * @param {*} value
     * @return {*}
     */
    notify(value : any, ...args : any[]) : JQueryDeferred<T>;

    /**
     * Call the progressCallbacks on a Deferred object with the given context and args.
     * 
     * @param {*} context Context passed to the progressCallbacks as the this object.
     * @param args Optional arguments that are passed to the progressCallbacks.
     * @param {Array} value
     * @return {*}
     */
    notifyWith(context : any, value : any[]) : JQueryDeferred<T>;

    /**
     * Reject a Deferred object and call any failCallbacks with the given args.
     * 
     * @param {Array} args Optional arguments that are passed to the failCallbacks.
     * @param {*} value
     * @return {*}
     */
    reject(value : any, ...args : any[]) : JQueryDeferred<T>;

    /**
     * Reject a Deferred object and call any failCallbacks with the given context and args.
     * 
     * @param {*} context Context passed to the failCallbacks as the this object.
     * @param args An optional array of arguments that are passed to the failCallbacks.
     * @param {Array} value
     * @return {*}
     */
    rejectWith(context : any, value : any[]) : JQueryDeferred<T>;

    /**
     * Resolve a Deferred object and call any doneCallbacks with the given args.
     * 
     * @param {*} value First argument passed to doneCallbacks.
     * @param {Array} args Optional subsequent arguments that are passed to the doneCallbacks.
     * @return {*}
     */
    resolve(value : T, ...args : any[]) : JQueryDeferred<T>;

    /**
     * Resolve a Deferred object and call any doneCallbacks with the given context and args.
     * 
     * @param {*} context Context passed to the doneCallbacks as the this object.
     * @param args An optional array of arguments that are passed to the doneCallbacks.
     * @param {Array} value
     * @return {*}
     */
    resolveWith(context : any, value : T[]) : JQueryDeferred<T>;

    /**
     * Return a Deferred's Promise object.
     * 
     * @param {*} target Object onto which the promise methods have to be attached
     * @return {*}
     */
    promise(target : any) : JQueryPromise<T>;

    pipe(doneFilter : (p1: any) => any, failFilter : (p1: any) => any, progressFilter : (p1: any) => any) : JQueryPromise<any>;

    /**
     * Add handlers to be called when the Deferred object is either resolved or rejected.
     * 
     * @param alwaysCallbacks1 A function, or array of functions, that is called when the Deferred is resolved or rejected.
     * @param alwaysCallbacks2 Optional additional functions, or arrays of functions, that are called when the Deferred is resolved or rejected.
     * @return {*}
     */
    always() : JQueryDeferred<T>;

    /**
     * Add handlers to be called when the Deferred object is resolved.
     * 
     * @param doneCallbacks1 A function, or array of functions, that are called when the Deferred is resolved.
     * @param doneCallbacks2 Optional additional functions, or arrays of functions, that are called when the Deferred is resolved.
     * @return {*}
     */
    done() : JQueryDeferred<T>;

    /**
     * Add handlers to be called when the Deferred object is rejected.
     * 
     * @param failCallbacks1 A function, or array of functions, that are called when the Deferred is rejected.
     * @param failCallbacks2 Optional additional functions, or arrays of functions, that are called when the Deferred is rejected.
     * @return {*}
     */
    fail() : JQueryDeferred<T>;

    /**
     * Add handlers to be called when the Deferred object generates progress notifications.
     * 
     * @param progressCallbacks A function, or array of functions, to be called when the Deferred generates progress notifications.
     * @return {*}
     */
    progress() : JQueryDeferred<T>;

    /**
     * Call the progressCallbacks on a Deferred object with the given args.
     * 
     * @param args Optional arguments that are passed to the progressCallbacks.
     * @return {*}
     */
    notify() : JQueryDeferred<T>;

    /**
     * Call the progressCallbacks on a Deferred object with the given context and args.
     * 
     * @param {*} context Context passed to the progressCallbacks as the this object.
     * @param args Optional arguments that are passed to the progressCallbacks.
     * @return {*}
     */
    notifyWith(context : any) : JQueryDeferred<T>;

    /**
     * Reject a Deferred object and call any failCallbacks with the given args.
     * 
     * @param args Optional arguments that are passed to the failCallbacks.
     * @return {*}
     */
    reject() : JQueryDeferred<T>;

    /**
     * Reject a Deferred object and call any failCallbacks with the given context and args.
     * 
     * @param {*} context Context passed to the failCallbacks as the this object.
     * @param args An optional array of arguments that are passed to the failCallbacks.
     * @return {*}
     */
    rejectWith(context : any) : JQueryDeferred<T>;

    /**
     * Resolve a Deferred object and call any doneCallbacks with the given args.
     * 
     * @param value First argument passed to doneCallbacks.
     * @param args Optional subsequent arguments that are passed to the doneCallbacks.
     * @return {*}
     */
    resolve() : JQueryDeferred<T>;

    /**
     * Resolve a Deferred object and call any doneCallbacks with the given context and args.
     * 
     * @param {*} context Context passed to the doneCallbacks as the this object.
     * @param args An optional array of arguments that are passed to the doneCallbacks.
     * @return {*}
     */
    resolveWith(context : any) : JQueryDeferred<T>;

    /**
     * Return a Deferred's Promise object.
     * 
     * @param target Object onto which the promise methods have to be attached
     * @return {*}
     */
    promise() : JQueryPromise<T>;

    pipe(doneFilter : (p1: any) => any, failFilter : (p1: any) => any) : JQueryPromise<any>;

    pipe(doneFilter : (p1: any) => any) : JQueryPromise<any>;

    pipe() : JQueryPromise<any>;

    /**
     * Add handlers to be called when the Deferred object is either resolved or rejected.
     * 
     * @param alwaysCallbacks1 A function, or array of functions, that is called when the Deferred is resolved or rejected.
     * @param alwaysCallbacks2 Optional additional functions, or arrays of functions, that are called when the Deferred is resolved or rejected.
     * @param {Array} alwaysCallback1
     * @param {Array} alwaysCallbacksN
     * @return {*}
     */
    always(alwaysCallback1 : JQueryPromiseCallback<any>[], ...alwaysCallbacksN : any[]) : JQueryDeferred<T>;

    /**
     * Add handlers to be called when the Deferred object is either resolved or rejected.
     * 
     * @param alwaysCallbacks1 A function, or array of functions, that is called when the Deferred is resolved or rejected.
     * @param alwaysCallbacks2 Optional additional functions, or arrays of functions, that are called when the Deferred is resolved or rejected.
     * @param {Array} alwaysCallback1
     * @param {Array} alwaysCallbacksN
     * @return {*}
     */
    always(alwaysCallback1 : JQueryPromiseCallback<any>[], ...alwaysCallbacksN : any[]) : JQueryDeferred<T>;

    /**
     * Add handlers to be called when the Deferred object is either resolved or rejected.
     * 
     * @param alwaysCallbacks1 A function, or array of functions, that is called when the Deferred is resolved or rejected.
     * @param alwaysCallbacks2 Optional additional functions, or arrays of functions, that are called when the Deferred is resolved or rejected.
     * @param {*} alwaysCallback1
     * @param {Array} alwaysCallbacksN
     * @return {*}
     */
    always(alwaysCallback1 : JQueryPromiseCallback<any>, ...alwaysCallbacksN : any[]) : JQueryDeferred<T>;

    /**
     * Add handlers to be called when the Deferred object is resolved.
     * 
     * @param doneCallbacks1 A function, or array of functions, that are called when the Deferred is resolved.
     * @param doneCallbacks2 Optional additional functions, or arrays of functions, that are called when the Deferred is resolved.
     * @param {Array} doneCallback1
     * @param {Array} doneCallbackN
     * @return {*}
     */
    done(doneCallback1 : JQueryPromiseCallback<T>[], ...doneCallbackN : any[]) : JQueryDeferred<T>;

    /**
     * Add handlers to be called when the Deferred object is resolved.
     * 
     * @param doneCallbacks1 A function, or array of functions, that are called when the Deferred is resolved.
     * @param doneCallbacks2 Optional additional functions, or arrays of functions, that are called when the Deferred is resolved.
     * @param {Array} doneCallback1
     * @param {Array} doneCallbackN
     * @return {*}
     */
    done(doneCallback1 : JQueryPromiseCallback<T>[], ...doneCallbackN : any[]) : JQueryDeferred<T>;

    /**
     * Add handlers to be called when the Deferred object is resolved.
     * 
     * @param doneCallbacks1 A function, or array of functions, that are called when the Deferred is resolved.
     * @param doneCallbacks2 Optional additional functions, or arrays of functions, that are called when the Deferred is resolved.
     * @param {*} doneCallback1
     * @param {Array} doneCallbackN
     * @return {*}
     */
    done(doneCallback1 : JQueryPromiseCallback<T>, ...doneCallbackN : any[]) : JQueryDeferred<T>;

    /**
     * Add handlers to be called when the Deferred object is rejected.
     * 
     * @param failCallbacks1 A function, or array of functions, that are called when the Deferred is rejected.
     * @param failCallbacks2 Optional additional functions, or arrays of functions, that are called when the Deferred is rejected.
     * @param {Array} failCallback1
     * @param {Array} failCallbacksN
     * @return {*}
     */
    fail(failCallback1 : JQueryPromiseCallback<any>[], ...failCallbacksN : any[]) : JQueryDeferred<T>;

    /**
     * Add handlers to be called when the Deferred object is rejected.
     * 
     * @param failCallbacks1 A function, or array of functions, that are called when the Deferred is rejected.
     * @param failCallbacks2 Optional additional functions, or arrays of functions, that are called when the Deferred is rejected.
     * @param {Array} failCallback1
     * @param {Array} failCallbacksN
     * @return {*}
     */
    fail(failCallback1 : JQueryPromiseCallback<any>[], ...failCallbacksN : any[]) : JQueryDeferred<T>;

    /**
     * Add handlers to be called when the Deferred object is rejected.
     * 
     * @param failCallbacks1 A function, or array of functions, that are called when the Deferred is rejected.
     * @param failCallbacks2 Optional additional functions, or arrays of functions, that are called when the Deferred is rejected.
     * @param {*} failCallback1
     * @param {Array} failCallbacksN
     * @return {*}
     */
    fail(failCallback1 : JQueryPromiseCallback<any>, ...failCallbacksN : any[]) : JQueryDeferred<T>;

    /**
     * Add handlers to be called when the Deferred object generates progress notifications.
     * 
     * @param progressCallbacks A function, or array of functions, to be called when the Deferred generates progress notifications.
     * @param {*} progressCallback1
     * @param {Array} progressCallbackN
     * @return {*}
     */
    progress(progressCallback1 : JQueryPromiseCallback<any>, ...progressCallbackN : any[]) : JQueryDeferred<T>;

    /**
     * Add handlers to be called when the Deferred object generates progress notifications.
     * 
     * @param progressCallbacks A function, or array of functions, to be called when the Deferred generates progress notifications.
     * @param {Array} progressCallback1
     * @param {Array} progressCallbackN
     * @return {*}
     */
    progress(progressCallback1 : JQueryPromiseCallback<any>[], ...progressCallbackN : any[]) : JQueryDeferred<T>;

    /**
     * Add handlers to be called when the Deferred object generates progress notifications.
     * 
     * @param progressCallbacks A function, or array of functions, to be called when the Deferred generates progress notifications.
     * @param {Array} progressCallback1
     * @param {Array} progressCallbackN
     * @return {*}
     */
    progress(progressCallback1 : JQueryPromiseCallback<any>[], ...progressCallbackN : any[]) : JQueryDeferred<T>;

    /**
     * Add handlers to be called when the Deferred object is either resolved or rejected.
     * 
     * @param alwaysCallbacks1 A function, or array of functions, that is called when the Deferred is resolved or rejected.
     * @param alwaysCallbacks2 Optional additional functions, or arrays of functions, that are called when the Deferred is resolved or rejected.
     * @param {*} alwaysCallback1
     * @param {Array} alwaysCallbacksN
     * @return {*}
     */
    always(alwaysCallback1 : JQueryPromiseCallback<any>, ...alwaysCallbacksN : JQueryPromiseCallback<any>[]) : JQueryDeferred<T>;

    /**
     * Add handlers to be called when the Deferred object is resolved.
     * 
     * @param doneCallbacks1 A function, or array of functions, that are called when the Deferred is resolved.
     * @param doneCallbacks2 Optional additional functions, or arrays of functions, that are called when the Deferred is resolved.
     * @param {*} doneCallback1
     * @param {Array} doneCallbackN
     * @return {*}
     */
    done(doneCallback1 : JQueryPromiseCallback<T>, ...doneCallbackN : JQueryPromiseCallback<T>[]) : JQueryDeferred<T>;

    /**
     * Add handlers to be called when the Deferred object is rejected.
     * 
     * @param failCallbacks1 A function, or array of functions, that are called when the Deferred is rejected.
     * @param failCallbacks2 Optional additional functions, or arrays of functions, that are called when the Deferred is rejected.
     * @param {*} failCallback1
     * @param {Array} failCallbacksN
     * @return {*}
     */
    fail(failCallback1 : JQueryPromiseCallback<any>, ...failCallbacksN : JQueryPromiseCallback<any>[]) : JQueryDeferred<T>;

    /**
     * Add handlers to be called when the Deferred object generates progress notifications.
     * 
     * @param progressCallbacks A function, or array of functions, to be called when the Deferred generates progress notifications.
     * @param {*} progressCallback1
     * @param {Array} progressCallbackN
     * @return {*}
     */
    progress(progressCallback1 : JQueryPromiseCallback<any>, ...progressCallbackN : JQueryPromiseCallback<any>[]) : JQueryDeferred<T>;

    /**
     * Add handlers to be called when the Deferred object is either resolved or rejected.
     * 
     * @param alwaysCallbacks1 A function, or array of functions, that is called when the Deferred is resolved or rejected.
     * @param alwaysCallbacks2 Optional additional functions, or arrays of functions, that are called when the Deferred is resolved or rejected.
     * @param {Array} alwaysCallback1
     * @param {Array} alwaysCallbacksN
     * @return {*}
     */
    always(alwaysCallback1 : JQueryPromiseCallback<any>[], ...alwaysCallbacksN : JQueryPromiseCallback<any>[][]) : JQueryDeferred<T>;

    /**
     * Add handlers to be called when the Deferred object is either resolved or rejected.
     * 
     * @param alwaysCallbacks1 A function, or array of functions, that is called when the Deferred is resolved or rejected.
     * @param alwaysCallbacks2 Optional additional functions, or arrays of functions, that are called when the Deferred is resolved or rejected.
     * @param {Array} alwaysCallback1
     * @param {Array} alwaysCallbacksN
     * @return {*}
     */
    always(alwaysCallback1 : JQueryPromiseCallback<any>[], ...alwaysCallbacksN : JQueryPromiseCallback<any>[]) : JQueryDeferred<T>;

    /**
     * Add handlers to be called when the Deferred object is either resolved or rejected.
     * 
     * @param alwaysCallbacks1 A function, or array of functions, that is called when the Deferred is resolved or rejected.
     * @param alwaysCallbacks2 Optional additional functions, or arrays of functions, that are called when the Deferred is resolved or rejected.
     * @param {*} alwaysCallback1
     * @param {Array} alwaysCallbacksN
     * @return {*}
     */
    always(alwaysCallback1 : JQueryPromiseCallback<any>, ...alwaysCallbacksN : JQueryPromiseCallback<any>[][]) : JQueryDeferred<T>;

    /**
     * Add handlers to be called when the Deferred object is resolved.
     * 
     * @param doneCallbacks1 A function, or array of functions, that are called when the Deferred is resolved.
     * @param doneCallbacks2 Optional additional functions, or arrays of functions, that are called when the Deferred is resolved.
     * @param {Array} doneCallback1
     * @param {Array} doneCallbackN
     * @return {*}
     */
    done(doneCallback1 : JQueryPromiseCallback<T>[], ...doneCallbackN : JQueryPromiseCallback<T>[][]) : JQueryDeferred<T>;

    /**
     * Add handlers to be called when the Deferred object is resolved.
     * 
     * @param doneCallbacks1 A function, or array of functions, that are called when the Deferred is resolved.
     * @param doneCallbacks2 Optional additional functions, or arrays of functions, that are called when the Deferred is resolved.
     * @param {Array} doneCallback1
     * @param {Array} doneCallbackN
     * @return {*}
     */
    done(doneCallback1 : JQueryPromiseCallback<T>[], ...doneCallbackN : JQueryPromiseCallback<T>[]) : JQueryDeferred<T>;

    /**
     * Add handlers to be called when the Deferred object is resolved.
     * 
     * @param doneCallbacks1 A function, or array of functions, that are called when the Deferred is resolved.
     * @param doneCallbacks2 Optional additional functions, or arrays of functions, that are called when the Deferred is resolved.
     * @param {*} doneCallback1
     * @param {Array} doneCallbackN
     * @return {*}
     */
    done(doneCallback1 : JQueryPromiseCallback<T>, ...doneCallbackN : JQueryPromiseCallback<T>[][]) : JQueryDeferred<T>;

    /**
     * Add handlers to be called when the Deferred object is rejected.
     * 
     * @param failCallbacks1 A function, or array of functions, that are called when the Deferred is rejected.
     * @param failCallbacks2 Optional additional functions, or arrays of functions, that are called when the Deferred is rejected.
     * @param {Array} failCallback1
     * @param {Array} failCallbacksN
     * @return {*}
     */
    fail(failCallback1 : JQueryPromiseCallback<any>[], ...failCallbacksN : JQueryPromiseCallback<any>[][]) : JQueryDeferred<T>;

    /**
     * Add handlers to be called when the Deferred object is rejected.
     * 
     * @param failCallbacks1 A function, or array of functions, that are called when the Deferred is rejected.
     * @param failCallbacks2 Optional additional functions, or arrays of functions, that are called when the Deferred is rejected.
     * @param {Array} failCallback1
     * @param {Array} failCallbacksN
     * @return {*}
     */
    fail(failCallback1 : JQueryPromiseCallback<any>[], ...failCallbacksN : JQueryPromiseCallback<any>[]) : JQueryDeferred<T>;

    /**
     * Add handlers to be called when the Deferred object is rejected.
     * 
     * @param failCallbacks1 A function, or array of functions, that are called when the Deferred is rejected.
     * @param failCallbacks2 Optional additional functions, or arrays of functions, that are called when the Deferred is rejected.
     * @param {*} failCallback1
     * @param {Array} failCallbacksN
     * @return {*}
     */
    fail(failCallback1 : JQueryPromiseCallback<any>, ...failCallbacksN : JQueryPromiseCallback<any>[][]) : JQueryDeferred<T>;

    /**
     * Add handlers to be called when the Deferred object generates progress notifications.
     * 
     * @param progressCallbacks A function, or array of functions, to be called when the Deferred generates progress notifications.
     * @param {*} progressCallback1
     * @param {Array} progressCallbackN
     * @return {*}
     */
    progress(progressCallback1 : JQueryPromiseCallback<any>, ...progressCallbackN : JQueryPromiseCallback<any>[][]) : JQueryDeferred<T>;

    /**
     * Add handlers to be called when the Deferred object generates progress notifications.
     * 
     * @param progressCallbacks A function, or array of functions, to be called when the Deferred generates progress notifications.
     * @param {Array} progressCallback1
     * @param {Array} progressCallbackN
     * @return {*}
     */
    progress(progressCallback1 : JQueryPromiseCallback<any>[], ...progressCallbackN : JQueryPromiseCallback<any>[][]) : JQueryDeferred<T>;

    /**
     * Add handlers to be called when the Deferred object generates progress notifications.
     * 
     * @param progressCallbacks A function, or array of functions, to be called when the Deferred generates progress notifications.
     * @param {Array} progressCallback1
     * @param {Array} progressCallbackN
     * @return {*}
     */
    progress(progressCallback1 : JQueryPromiseCallback<any>[], ...progressCallbackN : JQueryPromiseCallback<any>[]) : JQueryDeferred<T>;
}

interface JQueryPromiseOperator<T, U> {
    (callback1 : JQueryPromiseCallback<T>, ...callbacksN : any[]) : JQueryPromise<U>;

    (callback1 : JQueryPromiseCallback<T>[], ...callbacksN : any[]) : JQueryPromise<U>;

    (callback1 : JQueryPromiseCallback<T>[], ...callbacksN : any[]) : JQueryPromise<U>;

    (callback1 : JQueryPromiseCallback<T>, ...callbacksN : any[]) : JQueryPromise<U>;

    (callback1 : JQueryPromiseCallback<T>, ...callbacksN : JQueryPromiseCallback<any>[]) : JQueryPromise<U>;

    (callback1 : JQueryPromiseCallback<T>[], ...callbacksN : JQueryPromiseCallback<any>[]) : JQueryPromise<U>;

    (callback1 : JQueryPromiseCallback<T>[], ...callbacksN : JQueryPromiseCallback<any>[][]) : JQueryPromise<U>;

    (callback1 : JQueryPromiseCallback<T>, ...callbacksN : JQueryPromiseCallback<any>[][]) : JQueryPromise<U>;
}

/**
 * The jQuery instance members
 * @class
 * @extends Object
 */
interface JQuery {
    /**
     * Register a handler to be called when Ajax requests complete. This is an AjaxEvent.
     * 
     * @param {*} handler The function to be invoked.
     * @return {*}
     */
    ajaxComplete(handler : (p1: JQueryEventObject, p2: XMLHttpRequest, p3: any) => any) : JQuery;

    /**
     * Register a handler to be called when Ajax requests complete with an error. This is an Ajax Event.
     * 
     * @param {*} handler The function to be invoked.
     * @return {*}
     */
    ajaxError(handler : (p1: JQueryEventObject, p2: JQueryXHR, p3: JQueryAjaxSettings, p4: any) => any) : JQuery;

    /**
     * Attach a function to be executed before an Ajax request is sent. This is an Ajax Event.
     * 
     * @param {*} handler The function to be invoked.
     * @return {*}
     */
    ajaxSend(handler : (p1: JQueryEventObject, p2: JQueryXHR, p3: JQueryAjaxSettings) => any) : JQuery;

    /**
     * Register a handler to be called when the first Ajax request begins. This is an Ajax Event.
     * 
     * @param {*} handler The function to be invoked.
     * @return {*}
     */
    ajaxStart(handler : () => any) : JQuery;

    /**
     * Register a handler to be called when all Ajax requests have completed. This is an Ajax Event.
     * 
     * @param {*} handler The function to be invoked.
     * @return {*}
     */
    ajaxStop(handler : () => any) : JQuery;

    /**
     * Attach a function to be executed whenever an Ajax request completes successfully. This is an Ajax Event.
     * 
     * @param {*} handler The function to be invoked.
     * @return {*}
     */
    ajaxSuccess(handler : (p1: JQueryEventObject, p2: XMLHttpRequest, p3: JQueryAjaxSettings) => any) : JQuery;

    /**
     * Load data from the server and place the returned HTML into the matched element.
     * 
     * @param {string} url A string containing the URL to which the request is sent.
     * @param {string} data A plain object or string that is sent to the server with the request.
     * @param {*} complete A callback function that is executed when the request completes.
     * @return {*}
     */
    load(url : string, data : string, complete : (p1: string, p2: string, p3: XMLHttpRequest) => any) : JQuery;

    /**
     * Encode a set of form elements as a string for submission.
     * @return {string}
     */
    serialize() : string;

    /**
     * Encode a set of form elements as an array of names and values.
     * @return {Array}
     */
    serializeArray() : JQuerySerializeArrayElement[];

    /**
     * Adds the specified class(es) to each of the set of matched elements.
     * 
     * @param {string} className One or more space-separated classes to be added to the class attribute of each matched element.
     * @return {*}
     */
    addClass(className : string) : JQuery;

    /**
     * Adds the specified class(es) to each of the set of matched elements.
     * 
     * @param function A function returning one or more space-separated class names to be added to the existing class name(s). Receives the index position of the element in the set and the existing class name(s) as arguments. Within the function, this refers to the current element in the set.
     * @param {*} func
     * @return {*}
     */
    addClass(func : (p1: number, p2: string) => string) : JQuery;

    /**
     * Add the previous set of elements on the stack to the current set, optionally filtered by a selector.
     * @param {string} selector
     * @return {*}
     */
    addBack(selector : string) : JQuery;

    /**
     * Get the value of an attribute for the first element in the set of matched elements.
     * 
     * @param {string} attributeName The name of the attribute to get.
     * @return {string}
     */
    attr(attributeName : string) : string;

    /**
     * Set one or more attributes for the set of matched elements.
     * 
     * @param {string} attributeName The name of the attribute to set.
     * @param {string} value A value to set for the attribute.
     * @return {*}
     */
    attr(attributeName : string, value : string) : JQuery;

    /**
     * Set one or more attributes for the set of matched elements.
     * 
     * @param {string} attributeName The name of the attribute to set.
     * @param {*} func A function returning the value to set. this is the current element. Receives the index position of the element in the set and the old attribute value as arguments.
     * @return {*}
     */
    attr(attributeName : string, func : (p1: number, p2: string) => string) : JQuery;

    /**
     * Set one or more attributes for the set of matched elements.
     * 
     * @param {*} attributes An object of attribute-value pairs to set.
     * @return {*}
     */
    attr(attributes : any) : JQuery;

    /**
     * Determine whether any of the matched elements are assigned the given class.
     * 
     * @param {string} className The class name to search for.
     * @return {boolean}
     */
    hasClass(className : string) : boolean;

    /**
     * Get the HTML contents of the first element in the set of matched elements.
     * @return {string}
     */
    html() : string;

    /**
     * Set the HTML contents of each element in the set of matched elements.
     * 
     * @param {string} htmlString A string of HTML to set as the content of each matched element.
     * @return {*}
     */
    html(htmlString : string) : JQuery;

    /**
     * Set the HTML contents of each element in the set of matched elements.
     * 
     * @param {*} func A function returning the HTML content to set. Receives the index position of the element in the set and the old HTML value as arguments. jQuery empties the element before calling the function; use the oldhtml argument to reference the previous content. Within the function, this refers to the current element in the set.
     * @return {*}
     */
    html(func : (p1: number, p2: string) => string) : JQuery;

    /**
     * Get the value of a property for the first element in the set of matched elements.
     * 
     * @param {string} propertyName The name of the property to get.
     * @return {*}
     */
    prop(propertyName : string) : any;

    /**
     * Set one or more properties for the set of matched elements.
     * 
     * @param {string} propertyName The name of the property to set.
     * @param {string} value A value to set for the property.
     * @return {*}
     */
    prop(propertyName : string, value : string) : JQuery;

    /**
     * Set one or more properties for the set of matched elements.
     * 
     * @param {*} properties An object of property-value pairs to set.
     * @return {*}
     */
    prop(properties : any) : JQuery;

    /**
     * Set one or more properties for the set of matched elements.
     * 
     * @param {string} propertyName The name of the property to set.
     * @param {*} func A function returning the value to set. Receives the index position of the element in the set and the old property value as arguments. Within the function, the keyword this refers to the current element.
     * @return {*}
     */
    prop(propertyName : string, func : (p1: number, p2: any) => any) : JQuery;

    /**
     * Remove an attribute from each element in the set of matched elements.
     * 
     * @param {string} attributeName An attribute to remove; as of version 1.7, it can be a space-separated list of attributes.
     * @return {*}
     */
    removeAttr(attributeName : string) : JQuery;

    /**
     * Remove a single class, multiple classes, or all classes from each element in the set of matched elements.
     * 
     * @param {string} className One or more space-separated classes to be removed from the class attribute of each matched element.
     * @return {*}
     */
    removeClass(className : string) : JQuery;

    /**
     * Remove a single class, multiple classes, or all classes from each element in the set of matched elements.
     * 
     * @param function A function returning one or more space-separated class names to be removed. Receives the index position of the element in the set and the old class value as arguments.
     * @param {*} func
     * @return {*}
     */
    removeClass(func : (p1: number, p2: string) => string) : JQuery;

    /**
     * Remove a property for the set of matched elements.
     * 
     * @param {string} propertyName The name of the property to remove.
     * @return {*}
     */
    removeProp(propertyName : string) : JQuery;

    /**
     * Add or remove one or more classes from each element in the set of matched elements, depending on either the class's presence or the value of the switch argument.
     * 
     * @param {string} className One or more class names (separated by spaces) to be toggled for each element in the matched set.
     * @param {boolean} swtch A Boolean (not just truthy/falsy) value to determine whether the class should be added or removed.
     * @return {*}
     */
    toggleClass(className : string, swtch : boolean) : JQuery;

    /**
     * Add or remove one or more classes from each element in the set of matched elements, depending on either the class's presence or the value of the switch argument.
     * 
     * @param {boolean} swtch A boolean value to determine whether the class should be added or removed.
     * @return {*}
     */
    toggleClass(swtch : boolean) : JQuery;

    /**
     * Add or remove one or more classes from each element in the set of matched elements, depending on either the class's presence or the value of the switch argument.
     * 
     * @param {*} func A function that returns class names to be toggled in the class attribute of each element in the matched set. Receives the index position of the element in the set, the old class value, and the switch as arguments.
     * @param {boolean} swtch A boolean value to determine whether the class should be added or removed.
     * @return {*}
     */
    toggleClass(func : (p1: number, p2: string, p3: boolean) => string, swtch : boolean) : JQuery;

    /**
     * Get the current value of the first element in the set of matched elements.
     * @return {*}
     */
    val() : any;

    /**
     * Set the value of each element in the set of matched elements.
     * 
     * @param {string} value A string of text, an array of strings or number corresponding to the value of each matched element to set as selected/checked.
     * @return {*}
     */
    val(value : string) : JQuery;

    /**
     * Set the value of each element in the set of matched elements.
     * 
     * @param {*} func A function returning the value to set. this is the current element. Receives the index position of the element in the set and the old value as arguments.
     * @return {*}
     */
    val(func : (p1: number, p2: string) => string) : JQuery;

    /**
     * Get the value of style properties for the first element in the set of matched elements.
     * 
     * @param {string} propertyName A CSS property.
     * @return {string}
     */
    css(propertyName : string) : string;

    /**
     * Set one or more CSS properties for the set of matched elements.
     * 
     * @param {string} propertyName A CSS property name.
     * @param {string} value A value to set for the property.
     * @return {*}
     */
    css(propertyName : string, value : string) : JQuery;

    /**
     * Set one or more CSS properties for the set of matched elements.
     * 
     * @param {string} propertyName A CSS property name.
     * @param {*} value A function returning the value to set. this is the current element. Receives the index position of the element in the set and the old value as arguments.
     * @return {*}
     */
    css(propertyName : string, value : (p1: number, p2: string) => string) : JQuery;

    /**
     * Set one or more CSS properties for the set of matched elements.
     * 
     * @param {*} properties An object of property-value pairs to set.
     * @return {*}
     */
    css(properties : any) : JQuery;

    /**
     * Get the current computed height for the first element in the set of matched elements.
     * @return {number}
     */
    height() : number;

    /**
     * Set the CSS height of every matched element.
     * 
     * @param {number} value An integer representing the number of pixels, or an integer with an optional unit of measure appended (as a string).
     * @return {*}
     */
    height(value : number) : JQuery;

    /**
     * Set the CSS height of every matched element.
     * 
     * @param {*} func A function returning the height to set. Receives the index position of the element in the set and the old height as arguments. Within the function, this refers to the current element in the set.
     * @return {*}
     */
    height(func : (p1: number, p2: number) => number) : JQuery;

    /**
     * Get the current computed height for the first element in the set of matched elements, including padding but not border.
     * @return {number}
     */
    innerHeight() : number;

    /**
     * Sets the inner height on elements in the set of matched elements, including padding but not border.
     * 
     * @param value An integer representing the number of pixels, or an integer along with an optional unit of measure appended (as a string).
     * @param {number} height
     * @return {*}
     */
    innerHeight(height : number) : JQuery;

    /**
     * Get the current computed width for the first element in the set of matched elements, including padding but not border.
     * @return {number}
     */
    innerWidth() : number;

    /**
     * Sets the inner width on elements in the set of matched elements, including padding but not border.
     * 
     * @param value An integer representing the number of pixels, or an integer along with an optional unit of measure appended (as a string).
     * @param {number} width
     * @return {*}
     */
    innerWidth(width : number) : JQuery;

    /**
     * Get the current coordinates of the first element in the set of matched elements, relative to the document.
     * @return {*}
     */
    offset() : JQueryCoordinates;

    /**
     * An object containing the properties top and left, which are integers indicating the new top and left coordinates for the elements.
     * 
     * @param {*} coordinates An object containing the properties top and left, which are integers indicating the new top and left coordinates for the elements.
     * @return {*}
     */
    offset(coordinates : JQueryCoordinates) : JQuery;

    /**
     * An object containing the properties top and left, which are integers indicating the new top and left coordinates for the elements.
     * 
     * @param {*} func A function to return the coordinates to set. Receives the index of the element in the collection as the first argument and the current coordinates as the second argument. The function should return an object with the new top and left properties.
     * @return {*}
     */
    offset(func : (p1: number, p2: JQueryCoordinates) => JQueryCoordinates) : JQuery;

    /**
     * Get the current computed height for the first element in the set of matched elements, including padding, border, and optionally margin. Returns an integer (without "px") representation of the value or null if called on an empty set of elements.
     * 
     * @param {boolean} includeMargin A Boolean indicating whether to include the element's margin in the calculation.
     * @return {number}
     */
    outerHeight(includeMargin : boolean) : number;

    /**
     * Sets the outer height on elements in the set of matched elements, including padding and border.
     * 
     * @param value An integer representing the number of pixels, or an integer along with an optional unit of measure appended (as a string).
     * @param {number} height
     * @return {*}
     */
    outerHeight(height : number) : JQuery;

    /**
     * Get the current computed width for the first element in the set of matched elements, including padding and border.
     * 
     * @param {boolean} includeMargin A Boolean indicating whether to include the element's margin in the calculation.
     * @return {number}
     */
    outerWidth(includeMargin : boolean) : number;

    /**
     * Sets the outer width on elements in the set of matched elements, including padding and border.
     * 
     * @param value An integer representing the number of pixels, or an integer along with an optional unit of measure appended (as a string).
     * @param {number} width
     * @return {*}
     */
    outerWidth(width : number) : JQuery;

    /**
     * Get the current coordinates of the first element in the set of matched elements, relative to the offset parent.
     * @return {*}
     */
    position() : JQueryCoordinates;

    /**
     * Get the current horizontal position of the scroll bar for the first element in the set of matched elements or set the horizontal position of the scroll bar for every matched element.
     * @return {number}
     */
    scrollLeft() : number;

    /**
     * Set the current horizontal position of the scroll bar for each of the set of matched elements.
     * 
     * @param {number} value An integer indicating the new position to set the scroll bar to.
     * @return {*}
     */
    scrollLeft(value : number) : JQuery;

    /**
     * Get the current vertical position of the scroll bar for the first element in the set of matched elements or set the vertical position of the scroll bar for every matched element.
     * @return {number}
     */
    scrollTop() : number;

    /**
     * Set the current vertical position of the scroll bar for each of the set of matched elements.
     * 
     * @param {number} value An integer indicating the new position to set the scroll bar to.
     * @return {*}
     */
    scrollTop(value : number) : JQuery;

    /**
     * Get the current computed width for the first element in the set of matched elements.
     * @return {number}
     */
    width() : number;

    /**
     * Set the CSS width of each element in the set of matched elements.
     * 
     * @param {number} value An integer representing the number of pixels, or an integer along with an optional unit of measure appended (as a string).
     * @return {*}
     */
    width(value : number) : JQuery;

    /**
     * Set the CSS width of each element in the set of matched elements.
     * 
     * @param {*} func A function returning the width to set. Receives the index position of the element in the set and the old width as arguments. Within the function, this refers to the current element in the set.
     * @return {*}
     */
    width(func : (p1: number, p2: number) => number) : JQuery;

    /**
     * Remove from the queue all items that have not yet been run.
     * 
     * @param {string} queueName A string containing the name of the queue. Defaults to fx, the standard effects queue.
     * @return {*}
     */
    clearQueue(queueName : string) : JQuery;

    /**
     * Store arbitrary data associated with the matched elements.
     * 
     * @param {string} key A string naming the piece of data to set.
     * @param {*} value The new data value; it can be any Javascript type including Array or Object.
     * @return {*}
     */
    data(key : string, value : any) : JQuery;

    /**
     * Return the value at the named data store for the first element in the jQuery collection, as set by data(name, value) or by an HTML5 data-* attribute.
     * 
     * @param {string} key Name of the data stored.
     * @return {*}
     */
    data(key : string) : any;

    /**
     * Store arbitrary data associated with the matched elements.
     * 
     * @param {JQuery.Obj} obj An object of key-value pairs of data to update.
     * @return {*}
     */
    data(obj : any) : JQuery;

    /**
     * Return the value at the named data store for the first element in the jQuery collection, as set by data(name, value) or by an HTML5 data-* attribute.
     * @return {*}
     */
    data() : any;

    /**
     * Execute the next function on the queue for the matched elements.
     * 
     * @param {string} queueName A string containing the name of the queue. Defaults to fx, the standard effects queue.
     * @return {*}
     */
    dequeue(queueName : string) : JQuery;

    /**
     * Remove a previously-stored piece of data.
     * 
     * @param {string} name A string naming the piece of data to delete or space-separated string naming the pieces of data to delete.
     * @return {*}
     */
    removeData(name : string) : JQuery;

    /**
     * Remove a previously-stored piece of data.
     * 
     * @param {Array} list An array of strings naming the pieces of data to delete.
     * @return {*}
     */
    removeData(list : string[]) : JQuery;

    /**
     * Remove all previously-stored piece of data.
     * @return {*}
     */
    removeData() : JQuery;

    /**
     * Return a Promise object to observe when all actions of a certain type bound to the collection, queued or not, have finished.
     * 
     * @param {string} type The type of queue that needs to be observed. (default: fx)
     * @param {*} target Object onto which the promise methods have to be attached
     * @return {*}
     */
    promise(type : string, target : any) : JQueryPromise<any>;

    /**
     * Perform a custom animation of a set of CSS properties.
     * 
     * @param {*} properties An object of CSS properties and values that the animation will move toward.
     * @param {string} duration A string or number determining how long the animation will run.
     * @param {Function} complete A function to call once the animation is complete.
     * @return {*}
     */
    animate(properties : any, duration : string, complete : Function) : JQuery;

    /**
     * Perform a custom animation of a set of CSS properties.
     * 
     * @param {*} properties An object of CSS properties and values that the animation will move toward.
     * @param {string} duration A string or number determining how long the animation will run.
     * @param {string} easing A string indicating which easing function to use for the transition. (default: swing)
     * @param {Function} complete A function to call once the animation is complete.
     * @return {*}
     */
    animate(properties : any, duration : string, easing : string, complete : Function) : JQuery;

    /**
     * Perform a custom animation of a set of CSS properties.
     * 
     * @param {*} properties An object of CSS properties and values that the animation will move toward.
     * @param {*} options A map of additional options to pass to the method.
     * @return {*}
     */
    animate(properties : any, options : JQueryAnimationOptions) : JQuery;

    /**
     * Set a timer to delay execution of subsequent items in the queue.
     * 
     * @param {number} duration An integer indicating the number of milliseconds to delay execution of the next item in the queue.
     * @param {string} queueName A string containing the name of the queue. Defaults to fx, the standard effects queue.
     * @return {*}
     */
    delay(duration : number, queueName : string) : JQuery;

    /**
     * Display the matched elements by fading them to opaque.
     * 
     * @param {number} duration A string or number determining how long the animation will run.
     * @param {Function} complete A function to call once the animation is complete.
     * @return {*}
     */
    fadeIn(duration : number, complete : Function) : JQuery;

    /**
     * Display the matched elements by fading them to opaque.
     * 
     * @param {number} duration A string or number determining how long the animation will run.
     * @param {string} easing A string indicating which easing function to use for the transition.
     * @param {Function} complete A function to call once the animation is complete.
     * @return {*}
     */
    fadeIn(duration : number, easing : string, complete : Function) : JQuery;

    /**
     * Display the matched elements by fading them to opaque.
     * 
     * @param {*} options A map of additional options to pass to the method.
     * @return {*}
     */
    fadeIn(options : JQueryAnimationOptions) : JQuery;

    /**
     * Hide the matched elements by fading them to transparent.
     * 
     * @param {number} duration A string or number determining how long the animation will run.
     * @param {Function} complete A function to call once the animation is complete.
     * @return {*}
     */
    fadeOut(duration : number, complete : Function) : JQuery;

    /**
     * Hide the matched elements by fading them to transparent.
     * 
     * @param {number} duration A string or number determining how long the animation will run.
     * @param {string} easing A string indicating which easing function to use for the transition.
     * @param {Function} complete A function to call once the animation is complete.
     * @return {*}
     */
    fadeOut(duration : number, easing : string, complete : Function) : JQuery;

    /**
     * Hide the matched elements by fading them to transparent.
     * 
     * @param {*} options A map of additional options to pass to the method.
     * @return {*}
     */
    fadeOut(options : JQueryAnimationOptions) : JQuery;

    /**
     * Adjust the opacity of the matched elements.
     * 
     * @param {string} duration A string or number determining how long the animation will run.
     * @param {number} opacity A number between 0 and 1 denoting the target opacity.
     * @param {Function} complete A function to call once the animation is complete.
     * @return {*}
     */
    fadeTo(duration : string, opacity : number, complete : Function) : JQuery;

    /**
     * Adjust the opacity of the matched elements.
     * 
     * @param {string} duration A string or number determining how long the animation will run.
     * @param {number} opacity A number between 0 and 1 denoting the target opacity.
     * @param {string} easing A string indicating which easing function to use for the transition.
     * @param {Function} complete A function to call once the animation is complete.
     * @return {*}
     */
    fadeTo(duration : string, opacity : number, easing : string, complete : Function) : JQuery;

    /**
     * Display or hide the matched elements by animating their opacity.
     * 
     * @param {number} duration A string or number determining how long the animation will run.
     * @param {Function} complete A function to call once the animation is complete.
     * @return {*}
     */
    fadeToggle(duration : number, complete : Function) : JQuery;

    /**
     * Display or hide the matched elements by animating their opacity.
     * 
     * @param {number} duration A string or number determining how long the animation will run.
     * @param {string} easing A string indicating which easing function to use for the transition.
     * @param {Function} complete A function to call once the animation is complete.
     * @return {*}
     */
    fadeToggle(duration : number, easing : string, complete : Function) : JQuery;

    /**
     * Display or hide the matched elements by animating their opacity.
     * 
     * @param {*} options A map of additional options to pass to the method.
     * @return {*}
     */
    fadeToggle(options : JQueryAnimationOptions) : JQuery;

    /**
     * Stop the currently-running animation, remove all queued animations, and complete all animations for the matched elements.
     * 
     * @param {string} queue The name of the queue in which to stop animations.
     * @return {*}
     */
    finish(queue : string) : JQuery;

    /**
     * Hide the matched elements.
     * 
     * @param {number} duration A string or number determining how long the animation will run.
     * @param {Function} complete A function to call once the animation is complete.
     * @return {*}
     */
    hide(duration : number, complete : Function) : JQuery;

    /**
     * Hide the matched elements.
     * 
     * @param {number} duration A string or number determining how long the animation will run.
     * @param {string} easing A string indicating which easing function to use for the transition.
     * @param {Function} complete A function to call once the animation is complete.
     * @return {*}
     */
    hide(duration : number, easing : string, complete : Function) : JQuery;

    /**
     * Hide the matched elements.
     * 
     * @param {*} options A map of additional options to pass to the method.
     * @return {*}
     */
    hide(options : JQueryAnimationOptions) : JQuery;

    /**
     * Display the matched elements.
     * 
     * @param {number} duration A string or number determining how long the animation will run.
     * @param {Function} complete A function to call once the animation is complete.
     * @return {*}
     */
    show(duration : number, complete : Function) : JQuery;

    /**
     * Display the matched elements.
     * 
     * @param {number} duration A string or number determining how long the animation will run.
     * @param {string} easing A string indicating which easing function to use for the transition.
     * @param {Function} complete A function to call once the animation is complete.
     * @return {*}
     */
    show(duration : number, easing : string, complete : Function) : JQuery;

    /**
     * Display the matched elements.
     * 
     * @param {*} options A map of additional options to pass to the method.
     * @return {*}
     */
    show(options : JQueryAnimationOptions) : JQuery;

    /**
     * Display the matched elements with a sliding motion.
     * 
     * @param {number} duration A string or number determining how long the animation will run.
     * @param {Function} complete A function to call once the animation is complete.
     * @return {*}
     */
    slideDown(duration : number, complete : Function) : JQuery;

    /**
     * Display the matched elements with a sliding motion.
     * 
     * @param {number} duration A string or number determining how long the animation will run.
     * @param {string} easing A string indicating which easing function to use for the transition.
     * @param {Function} complete A function to call once the animation is complete.
     * @return {*}
     */
    slideDown(duration : number, easing : string, complete : Function) : JQuery;

    /**
     * Display the matched elements with a sliding motion.
     * 
     * @param {*} options A map of additional options to pass to the method.
     * @return {*}
     */
    slideDown(options : JQueryAnimationOptions) : JQuery;

    /**
     * Display or hide the matched elements with a sliding motion.
     * 
     * @param {number} duration A string or number determining how long the animation will run.
     * @param {Function} complete A function to call once the animation is complete.
     * @return {*}
     */
    slideToggle(duration : number, complete : Function) : JQuery;

    /**
     * Display or hide the matched elements with a sliding motion.
     * 
     * @param {number} duration A string or number determining how long the animation will run.
     * @param {string} easing A string indicating which easing function to use for the transition.
     * @param {Function} complete A function to call once the animation is complete.
     * @return {*}
     */
    slideToggle(duration : number, easing : string, complete : Function) : JQuery;

    /**
     * Display or hide the matched elements with a sliding motion.
     * 
     * @param {*} options A map of additional options to pass to the method.
     * @return {*}
     */
    slideToggle(options : JQueryAnimationOptions) : JQuery;

    /**
     * Hide the matched elements with a sliding motion.
     * 
     * @param {number} duration A string or number determining how long the animation will run.
     * @param {Function} complete A function to call once the animation is complete.
     * @return {*}
     */
    slideUp(duration : number, complete : Function) : JQuery;

    /**
     * Hide the matched elements with a sliding motion.
     * 
     * @param {number} duration A string or number determining how long the animation will run.
     * @param {string} easing A string indicating which easing function to use for the transition.
     * @param {Function} complete A function to call once the animation is complete.
     * @return {*}
     */
    slideUp(duration : number, easing : string, complete : Function) : JQuery;

    /**
     * Hide the matched elements with a sliding motion.
     * 
     * @param {*} options A map of additional options to pass to the method.
     * @return {*}
     */
    slideUp(options : JQueryAnimationOptions) : JQuery;

    /**
     * Stop the currently-running animation on the matched elements.
     * 
     * @param {boolean} clearQueue A Boolean indicating whether to remove queued animation as well. Defaults to false.
     * @param {boolean} jumpToEnd A Boolean indicating whether to complete the current animation immediately. Defaults to false.
     * @return {*}
     */
    stop(clearQueue : boolean, jumpToEnd : boolean) : JQuery;

    /**
     * Stop the currently-running animation on the matched elements.
     * 
     * @param {string} queue The name of the queue in which to stop animations.
     * @param {boolean} clearQueue A Boolean indicating whether to remove queued animation as well. Defaults to false.
     * @param {boolean} jumpToEnd A Boolean indicating whether to complete the current animation immediately. Defaults to false.
     * @return {*}
     */
    stop(queue : string, clearQueue : boolean, jumpToEnd : boolean) : JQuery;

    /**
     * Display or hide the matched elements.
     * 
     * @param {number} duration A string or number determining how long the animation will run.
     * @param {Function} complete A function to call once the animation is complete.
     * @return {*}
     */
    toggle(duration : number, complete : Function) : JQuery;

    /**
     * Display or hide the matched elements.
     * 
     * @param {number} duration A string or number determining how long the animation will run.
     * @param {string} easing A string indicating which easing function to use for the transition.
     * @param {Function} complete A function to call once the animation is complete.
     * @return {*}
     */
    toggle(duration : number, easing : string, complete : Function) : JQuery;

    /**
     * Display or hide the matched elements.
     * 
     * @param {*} options A map of additional options to pass to the method.
     * @return {*}
     */
    toggle(options : JQueryAnimationOptions) : JQuery;

    /**
     * Display or hide the matched elements.
     * 
     * @param {boolean} showOrHide A Boolean indicating whether to show or hide the elements.
     * @return {*}
     */
    toggle(showOrHide : boolean) : JQuery;

    /**
     * Attach a handler to an event for the elements.
     * 
     * @param {string} eventType A string containing one or more DOM event types, such as "click" or "submit," or custom event names.
     * @param {*} eventData An object containing data that will be passed to the event handler.
     * @param {*} handler A function to execute each time the event is triggered.
     * @return {*}
     */
    bind(eventType : string, eventData : any, handler : (p1: JQueryEventObject) => any) : JQuery;

    /**
     * Attach a handler to an event for the elements.
     * 
     * @param {string} eventType A string containing one or more DOM event types, such as "click" or "submit," or custom event names.
     * @param {*} handler A function to execute each time the event is triggered.
     * @return {*}
     */
    bind(eventType : string, handler : (p1: JQueryEventObject) => any) : JQuery;

    /**
     * Attach a handler to an event for the elements.
     * 
     * @param {string} eventType A string containing one or more DOM event types, such as "click" or "submit," or custom event names.
     * @param {*} eventData An object containing data that will be passed to the event handler.
     * @param {boolean} preventBubble Setting the third argument to false will attach a function that prevents the default action from occurring and stops the event from bubbling. The default is true.
     * @return {*}
     */
    bind(eventType : string, eventData : any, preventBubble : boolean) : JQuery;

    /**
     * Attach a handler to an event for the elements.
     * 
     * @param {string} eventType A string containing one or more DOM event types, such as "click" or "submit," or custom event names.
     * @param {boolean} preventBubble Setting the third argument to false will attach a function that prevents the default action from occurring and stops the event from bubbling. The default is true.
     * @return {*}
     */
    bind(eventType : string, preventBubble : boolean) : JQuery;

    /**
     * Attach a handler to an event for the elements.
     * 
     * @param {*} events An object containing one or more DOM event types and functions to execute for them.
     * @return {*}
     */
    bind(events : any) : JQuery;

    /**
     * Trigger the "blur" event on an element
     * @return {*}
     */
    blur() : JQuery;

    /**
     * Bind an event handler to the "blur" JavaScript event
     * 
     * @param {*} handler A function to execute each time the event is triggered.
     * @return {*}
     */
    blur(handler : (p1: JQueryEventObject) => any) : JQuery;

    /**
     * Bind an event handler to the "blur" JavaScript event
     * 
     * @param {*} eventData An object containing data that will be passed to the event handler.
     * @param {*} handler A function to execute each time the event is triggered.
     * @return {*}
     */
    blur(eventData : any, handler : (p1: JQueryEventObject) => any) : JQuery;

    /**
     * Trigger the "change" event on an element.
     * @return {*}
     */
    change() : JQuery;

    /**
     * Bind an event handler to the "change" JavaScript event
     * 
     * @param {*} handler A function to execute each time the event is triggered.
     * @return {*}
     */
    change(handler : (p1: JQueryEventObject) => any) : JQuery;

    /**
     * Bind an event handler to the "change" JavaScript event
     * 
     * @param {*} eventData An object containing data that will be passed to the event handler.
     * @param {*} handler A function to execute each time the event is triggered.
     * @return {*}
     */
    change(eventData : any, handler : (p1: JQueryEventObject) => any) : JQuery;

    /**
     * Trigger the "click" event on an element.
     * @return {*}
     */
    click() : JQuery;

    /**
     * Bind an event handler to the "click" JavaScript event
     * 
     * @param eventData An object containing data that will be passed to the event handler.
     * @param {*} handler
     * @return {*}
     */
    click(handler : (p1: JQueryEventObject) => any) : JQuery;

    /**
     * Bind an event handler to the "click" JavaScript event
     * 
     * @param {*} eventData An object containing data that will be passed to the event handler.
     * @param {*} handler A function to execute each time the event is triggered.
     * @return {*}
     */
    click(eventData : any, handler : (p1: JQueryEventObject) => any) : JQuery;

    /**
     * Trigger the "contextmenu" event on an element.
     * @return {*}
     */
    contextmenu() : JQuery;

    /**
     * Bind an event handler to the "contextmenu" JavaScript event.
     * 
     * @param {*} handler A function to execute when the event is triggered.
     * @return {*}
     */
    contextmenu(handler : (p1: JQueryMouseEventObject) => any) : JQuery;

    /**
     * Bind an event handler to the "contextmenu" JavaScript event.
     * 
     * @param {*} eventData An object containing data that will be passed to the event handler.
     * @param {*} handler A function to execute when the event is triggered.
     * @return {*}
     */
    contextmenu(eventData : any, handler : (p1: JQueryMouseEventObject) => any) : JQuery;

    /**
     * Trigger the "dblclick" event on an element.
     * @return {*}
     */
    dblclick() : JQuery;

    /**
     * Bind an event handler to the "dblclick" JavaScript event
     * 
     * @param {*} handler A function to execute each time the event is triggered.
     * @return {*}
     */
    dblclick(handler : (p1: JQueryEventObject) => any) : JQuery;

    /**
     * Bind an event handler to the "dblclick" JavaScript event
     * 
     * @param {*} eventData An object containing data that will be passed to the event handler.
     * @param {*} handler A function to execute each time the event is triggered.
     * @return {*}
     */
    dblclick(eventData : any, handler : (p1: JQueryEventObject) => any) : JQuery;

    delegate(selector : any, eventType : string, handler : (p1: JQueryEventObject) => any) : JQuery;

    delegate(selector : any, eventType : string, eventData : any, handler : (p1: JQueryEventObject) => any) : JQuery;

    /**
     * Trigger the "focus" event on an element.
     * @return {*}
     */
    focus() : JQuery;

    /**
     * Bind an event handler to the "focus" JavaScript event
     * 
     * @param {*} handler A function to execute each time the event is triggered.
     * @return {*}
     */
    focus(handler : (p1: JQueryEventObject) => any) : JQuery;

    /**
     * Bind an event handler to the "focus" JavaScript event
     * 
     * @param {*} eventData An object containing data that will be passed to the event handler.
     * @param {*} handler A function to execute each time the event is triggered.
     * @return {*}
     */
    focus(eventData : any, handler : (p1: JQueryEventObject) => any) : JQuery;

    /**
     * Trigger the "focusin" event on an element.
     * @return {*}
     */
    focusin() : JQuery;

    /**
     * Bind an event handler to the "focusin" JavaScript event
     * 
     * @param {*} handler A function to execute each time the event is triggered.
     * @return {*}
     */
    focusin(handler : (p1: JQueryEventObject) => any) : JQuery;

    /**
     * Bind an event handler to the "focusin" JavaScript event
     * 
     * @param {*} eventData An object containing data that will be passed to the event handler.
     * @param {*} handler A function to execute each time the event is triggered.
     * @return {*}
     */
    focusin(eventData : any, handler : (p1: JQueryEventObject) => any) : JQuery;

    /**
     * Trigger the "focusout" event on an element.
     * @return {*}
     */
    focusout() : JQuery;

    /**
     * Bind an event handler to the "focusout" JavaScript event
     * 
     * @param {*} handler A function to execute each time the event is triggered.
     * @return {*}
     */
    focusout(handler : (p1: JQueryEventObject) => any) : JQuery;

    /**
     * Bind an event handler to the "focusout" JavaScript event
     * 
     * @param {*} eventData An object containing data that will be passed to the event handler.
     * @param {*} handler A function to execute each time the event is triggered.
     * @return {*}
     */
    focusout(eventData : any, handler : (p1: JQueryEventObject) => any) : JQuery;

    /**
     * Bind two handlers to the matched elements, to be executed when the mouse pointer enters and leaves the elements.
     * 
     * @param {*} handlerIn A function to execute when the mouse pointer enters the element.
     * @param {*} handlerOut A function to execute when the mouse pointer leaves the element.
     * @return {*}
     */
    hover(handlerIn : (p1: JQueryEventObject) => any, handlerOut : (p1: JQueryEventObject) => any) : JQuery;

    /**
     * Bind a single handler to the matched elements, to be executed when the mouse pointer enters or leaves the elements.
     * 
     * @param {*} handlerInOut A function to execute when the mouse pointer enters or leaves the element.
     * @return {*}
     */
    hover(handlerInOut : (p1: JQueryEventObject) => any) : JQuery;

    /**
     * Trigger the "keydown" event on an element.
     * @return {*}
     */
    keydown() : JQuery;

    /**
     * Bind an event handler to the "keydown" JavaScript event
     * 
     * @param {*} handler A function to execute each time the event is triggered.
     * @return {*}
     */
    keydown(handler : (p1: JQueryKeyEventObject) => any) : JQuery;

    /**
     * Bind an event handler to the "keydown" JavaScript event
     * 
     * @param {*} eventData An object containing data that will be passed to the event handler.
     * @param {*} handler A function to execute each time the event is triggered.
     * @return {*}
     */
    keydown(eventData : any, handler : (p1: JQueryKeyEventObject) => any) : JQuery;

    /**
     * Trigger the "keypress" event on an element.
     * @return {*}
     */
    keypress() : JQuery;

    /**
     * Bind an event handler to the "keypress" JavaScript event
     * 
     * @param {*} handler A function to execute each time the event is triggered.
     * @return {*}
     */
    keypress(handler : (p1: JQueryKeyEventObject) => any) : JQuery;

    /**
     * Bind an event handler to the "keypress" JavaScript event
     * 
     * @param {*} eventData An object containing data that will be passed to the event handler.
     * @param {*} handler A function to execute each time the event is triggered.
     * @return {*}
     */
    keypress(eventData : any, handler : (p1: JQueryKeyEventObject) => any) : JQuery;

    /**
     * Trigger the "keyup" event on an element.
     * @return {*}
     */
    keyup() : JQuery;

    /**
     * Bind an event handler to the "keyup" JavaScript event
     * 
     * @param {*} handler A function to execute each time the event is triggered.
     * @return {*}
     */
    keyup(handler : (p1: JQueryKeyEventObject) => any) : JQuery;

    /**
     * Bind an event handler to the "keyup" JavaScript event
     * 
     * @param {*} eventData An object containing data that will be passed to the event handler.
     * @param {*} handler A function to execute each time the event is triggered.
     * @return {*}
     */
    keyup(eventData : any, handler : (p1: JQueryKeyEventObject) => any) : JQuery;

    /**
     * Bind an event handler to the "load" JavaScript event.
     * 
     * @param {*} handler A function to execute when the event is triggered.
     * @return {*}
     */
    load(handler : (p1: JQueryEventObject) => any) : JQuery;

    /**
     * Bind an event handler to the "load" JavaScript event.
     * 
     * @param {*} eventData An object containing data that will be passed to the event handler.
     * @param {*} handler A function to execute when the event is triggered.
     * @return {*}
     */
    load(eventData : any, handler : (p1: JQueryEventObject) => any) : JQuery;

    /**
     * Trigger the "mousedown" event on an element.
     * @return {*}
     */
    mousedown() : JQuery;

    /**
     * Bind an event handler to the "mousedown" JavaScript event.
     * 
     * @param {*} handler A function to execute when the event is triggered.
     * @return {*}
     */
    mousedown(handler : (p1: JQueryMouseEventObject) => any) : JQuery;

    /**
     * Bind an event handler to the "mousedown" JavaScript event.
     * 
     * @param {*} eventData An object containing data that will be passed to the event handler.
     * @param {*} handler A function to execute when the event is triggered.
     * @return {*}
     */
    mousedown(eventData : any, handler : (p1: JQueryMouseEventObject) => any) : JQuery;

    /**
     * Trigger the "mouseenter" event on an element.
     * @return {*}
     */
    mouseenter() : JQuery;

    /**
     * Bind an event handler to be fired when the mouse enters an element.
     * 
     * @param {*} handler A function to execute when the event is triggered.
     * @return {*}
     */
    mouseenter(handler : (p1: JQueryMouseEventObject) => any) : JQuery;

    /**
     * Bind an event handler to be fired when the mouse enters an element.
     * 
     * @param {*} eventData An object containing data that will be passed to the event handler.
     * @param {*} handler A function to execute when the event is triggered.
     * @return {*}
     */
    mouseenter(eventData : any, handler : (p1: JQueryMouseEventObject) => any) : JQuery;

    /**
     * Trigger the "mouseleave" event on an element.
     * @return {*}
     */
    mouseleave() : JQuery;

    /**
     * Bind an event handler to be fired when the mouse leaves an element.
     * 
     * @param {*} handler A function to execute when the event is triggered.
     * @return {*}
     */
    mouseleave(handler : (p1: JQueryMouseEventObject) => any) : JQuery;

    /**
     * Bind an event handler to be fired when the mouse leaves an element.
     * 
     * @param {*} eventData An object containing data that will be passed to the event handler.
     * @param {*} handler A function to execute when the event is triggered.
     * @return {*}
     */
    mouseleave(eventData : any, handler : (p1: JQueryMouseEventObject) => any) : JQuery;

    /**
     * Trigger the "mousemove" event on an element.
     * @return {*}
     */
    mousemove() : JQuery;

    /**
     * Bind an event handler to the "mousemove" JavaScript event.
     * 
     * @param {*} handler A function to execute when the event is triggered.
     * @return {*}
     */
    mousemove(handler : (p1: JQueryMouseEventObject) => any) : JQuery;

    /**
     * Bind an event handler to the "mousemove" JavaScript event.
     * 
     * @param {*} eventData An object containing data that will be passed to the event handler.
     * @param {*} handler A function to execute when the event is triggered.
     * @return {*}
     */
    mousemove(eventData : any, handler : (p1: JQueryMouseEventObject) => any) : JQuery;

    /**
     * Trigger the "mouseout" event on an element.
     * @return {*}
     */
    mouseout() : JQuery;

    /**
     * Bind an event handler to the "mouseout" JavaScript event.
     * 
     * @param {*} handler A function to execute when the event is triggered.
     * @return {*}
     */
    mouseout(handler : (p1: JQueryMouseEventObject) => any) : JQuery;

    /**
     * Bind an event handler to the "mouseout" JavaScript event.
     * 
     * @param {*} eventData An object containing data that will be passed to the event handler.
     * @param {*} handler A function to execute when the event is triggered.
     * @return {*}
     */
    mouseout(eventData : any, handler : (p1: JQueryMouseEventObject) => any) : JQuery;

    /**
     * Trigger the "mouseover" event on an element.
     * @return {*}
     */
    mouseover() : JQuery;

    /**
     * Bind an event handler to the "mouseover" JavaScript event.
     * 
     * @param {*} handler A function to execute when the event is triggered.
     * @return {*}
     */
    mouseover(handler : (p1: JQueryMouseEventObject) => any) : JQuery;

    /**
     * Bind an event handler to the "mouseover" JavaScript event.
     * 
     * @param {*} eventData An object containing data that will be passed to the event handler.
     * @param {*} handler A function to execute when the event is triggered.
     * @return {*}
     */
    mouseover(eventData : any, handler : (p1: JQueryMouseEventObject) => any) : JQuery;

    /**
     * Trigger the "mouseup" event on an element.
     * @return {*}
     */
    mouseup() : JQuery;

    /**
     * Bind an event handler to the "mouseup" JavaScript event.
     * 
     * @param {*} handler A function to execute when the event is triggered.
     * @return {*}
     */
    mouseup(handler : (p1: JQueryMouseEventObject) => any) : JQuery;

    /**
     * Bind an event handler to the "mouseup" JavaScript event.
     * 
     * @param {*} eventData An object containing data that will be passed to the event handler.
     * @param {*} handler A function to execute when the event is triggered.
     * @return {*}
     */
    mouseup(eventData : any, handler : (p1: JQueryMouseEventObject) => any) : JQuery;

    /**
     * Remove an event handler.
     * @return {*}
     */
    off() : JQuery;

    /**
     * Remove an event handler.
     * 
     * @param {string} events One or more space-separated event types and optional namespaces, or just namespaces, such as "click", "keydown.myPlugin", or ".myPlugin".
     * @param {string} selector A selector which should match the one originally passed to .on() when attaching event handlers.
     * @param {*} handler A handler function previously attached for the event(s), or the special value false.
     * @return {*}
     */
    off(events : string, selector : string, handler : (p1: JQueryEventObject) => any) : JQuery;

    /**
     * Remove an event handler.
     * 
     * @param {string} events One or more space-separated event types and optional namespaces, or just namespaces, such as "click", "keydown.myPlugin", or ".myPlugin".
     * @param {*} handler A handler function previously attached for the event(s), or the special value false. Takes handler with extra args that can be attached with on().
     * @return {*}
     */
    off(events : string, handler : (p1: JQueryEventObject, p2: any) => any) : JQuery;

    /**
     * Remove an event handler.
     * 
     * @param {string} events One or more space-separated event types and optional namespaces, or just namespaces, such as "click", "keydown.myPlugin", or ".myPlugin".
     * @param {*} handler A handler function previously attached for the event(s), or the special value false.
     * @return {*}
     */
    off(events : string, handler : (p1: JQueryEventObject) => any) : JQuery;

    /**
     * Remove an event handler.
     * 
     * @param {JQuery.Events} events An object where the string keys represent one or more space-separated event types and optional namespaces, and the values represent handler functions previously attached for the event(s).
     * @param {string} selector A selector which should match the one originally passed to .on() when attaching event handlers.
     * @return {*}
     */
    off(events : any, selector : string) : JQuery;

    /**
     * Attach an event handler function for one or more events to the selected elements.
     * 
     * @param {string} events One or more space-separated event types and optional namespaces, such as "click" or "keydown.myPlugin".
     * @param {*} handler A function to execute when the event is triggered. The value false is also allowed as a shorthand for a function that simply does return false. Rest parameter args is for optional parameters passed to jQuery.trigger(). Note that the actual parameters on the event handler function must be marked as optional (? syntax).
     * @return {*}
     */
    on(events : string, handler : (p1: JQueryEventObject, p2: any) => any) : JQuery;

    /**
     * Attach an event handler function for one or more events to the selected elements.
     * 
     * @param {string} events One or more space-separated event types and optional namespaces, such as "click" or "keydown.myPlugin".
     * @param {*} data Data to be passed to the handler in event.data when an event is triggered.
     * @param {*} handler A function to execute when the event is triggered. The value false is also allowed as a shorthand for a function that simply does return false.
     * @return {*}
     */
    on(events : string, data : any, handler : (p1: JQueryEventObject, p2: any) => any) : JQuery;

    /**
     * Attach an event handler function for one or more events to the selected elements.
     * 
     * @param {string} events One or more space-separated event types and optional namespaces, such as "click" or "keydown.myPlugin".
     * @param {string} selector A selector string to filter the descendants of the selected elements that trigger the event. If the selector is null or omitted, the event is always triggered when it reaches the selected element.
     * @param {*} handler A function to execute when the event is triggered. The value false is also allowed as a shorthand for a function that simply does return false.
     * @return {*}
     */
    on(events : string, selector : string, handler : (p1: JQueryEventObject, p2: any) => any) : JQuery;

    /**
     * Attach an event handler function for one or more events to the selected elements.
     * 
     * @param {string} events One or more space-separated event types and optional namespaces, such as "click" or "keydown.myPlugin".
     * @param {string} selector A selector string to filter the descendants of the selected elements that trigger the event. If the selector is null or omitted, the event is always triggered when it reaches the selected element.
     * @param {*} data Data to be passed to the handler in event.data when an event is triggered.
     * @param {*} handler A function to execute when the event is triggered. The value false is also allowed as a shorthand for a function that simply does return false.
     * @return {*}
     */
    on(events : string, selector : string, data : any, handler : (p1: JQueryEventObject, p2: any) => any) : JQuery;

    /**
     * Attach an event handler function for one or more events to the selected elements.
     * 
     * @param {JQuery.Events} events An object in which the string keys represent one or more space-separated event types and optional namespaces, and the values represent a handler function to be called for the event(s).
     * @param {string} selector A selector string to filter the descendants of the selected elements that will call the handler. If the selector is null or omitted, the handler is always called when it reaches the selected element.
     * @param {*} data Data to be passed to the handler in event.data when an event occurs.
     * @return {*}
     */
    on(events : any, selector : string, data : any) : JQuery;

    /**
     * Attach an event handler function for one or more events to the selected elements.
     * 
     * @param {JQuery.Events} events An object in which the string keys represent one or more space-separated event types and optional namespaces, and the values represent a handler function to be called for the event(s).
     * @param {*} data Data to be passed to the handler in event.data when an event occurs.
     * @return {*}
     */
    on(events : any, data : any) : JQuery;

    /**
     * Attach a handler to an event for the elements. The handler is executed at most once per element per event type.
     * 
     * @param {string} events A string containing one or more JavaScript event types, such as "click" or "submit," or custom event names.
     * @param {*} handler A function to execute at the time the event is triggered.
     * @return {*}
     */
    one(events : string, handler : (p1: JQueryEventObject) => any) : JQuery;

    /**
     * Attach a handler to an event for the elements. The handler is executed at most once per element per event type.
     * 
     * @param {string} events A string containing one or more JavaScript event types, such as "click" or "submit," or custom event names.
     * @param {*} data An object containing data that will be passed to the event handler.
     * @param {*} handler A function to execute at the time the event is triggered.
     * @return {*}
     */
    one(events : string, data : any, handler : (p1: JQueryEventObject) => any) : JQuery;

    /**
     * Attach a handler to an event for the elements. The handler is executed at most once per element per event type.
     * 
     * @param {string} events One or more space-separated event types and optional namespaces, such as "click" or "keydown.myPlugin".
     * @param {string} selector A selector string to filter the descendants of the selected elements that trigger the event. If the selector is null or omitted, the event is always triggered when it reaches the selected element.
     * @param {*} handler A function to execute when the event is triggered. The value false is also allowed as a shorthand for a function that simply does return false.
     * @return {*}
     */
    one(events : string, selector : string, handler : (p1: JQueryEventObject) => any) : JQuery;

    /**
     * Attach a handler to an event for the elements. The handler is executed at most once per element per event type.
     * 
     * @param {string} events One or more space-separated event types and optional namespaces, such as "click" or "keydown.myPlugin".
     * @param {string} selector A selector string to filter the descendants of the selected elements that trigger the event. If the selector is null or omitted, the event is always triggered when it reaches the selected element.
     * @param {*} data Data to be passed to the handler in event.data when an event is triggered.
     * @param {*} handler A function to execute when the event is triggered. The value false is also allowed as a shorthand for a function that simply does return false.
     * @return {*}
     */
    one(events : string, selector : string, data : any, handler : (p1: JQueryEventObject) => any) : JQuery;

    /**
     * Attach a handler to an event for the elements. The handler is executed at most once per element per event type.
     * 
     * @param {JQuery.Events} events An object in which the string keys represent one or more space-separated event types and optional namespaces, and the values represent a handler function to be called for the event(s).
     * @param {string} selector A selector string to filter the descendants of the selected elements that will call the handler. If the selector is null or omitted, the handler is always called when it reaches the selected element.
     * @param {*} data Data to be passed to the handler in event.data when an event occurs.
     * @return {*}
     */
    one(events : any, selector : string, data : any) : JQuery;

    /**
     * Attach a handler to an event for the elements. The handler is executed at most once per element per event type.
     * 
     * @param {JQuery.Events} events An object in which the string keys represent one or more space-separated event types and optional namespaces, and the values represent a handler function to be called for the event(s).
     * @param {*} data Data to be passed to the handler in event.data when an event occurs.
     * @return {*}
     */
    one(events : any, data : any) : JQuery;

    /**
     * Specify a function to execute when the DOM is fully loaded.
     * 
     * @param {*} handler A function to execute after the DOM is ready.
     * @return {*}
     */
    ready(handler : (p1: JQueryStatic) => any) : JQuery;

    /**
     * Trigger the "resize" event on an element.
     * @return {*}
     */
    resize() : JQuery;

    /**
     * Bind an event handler to the "resize" JavaScript event.
     * 
     * @param {*} handler A function to execute each time the event is triggered.
     * @return {*}
     */
    resize(handler : (p1: JQueryEventObject) => any) : JQuery;

    /**
     * Bind an event handler to the "resize" JavaScript event.
     * 
     * @param {*} eventData An object containing data that will be passed to the event handler.
     * @param {*} handler A function to execute each time the event is triggered.
     * @return {*}
     */
    resize(eventData : any, handler : (p1: JQueryEventObject) => any) : JQuery;

    /**
     * Trigger the "scroll" event on an element.
     * @return {*}
     */
    scroll() : JQuery;

    /**
     * Bind an event handler to the "scroll" JavaScript event.
     * 
     * @param {*} handler A function to execute each time the event is triggered.
     * @return {*}
     */
    scroll(handler : (p1: JQueryEventObject) => any) : JQuery;

    /**
     * Bind an event handler to the "scroll" JavaScript event.
     * 
     * @param {*} eventData An object containing data that will be passed to the event handler.
     * @param {*} handler A function to execute each time the event is triggered.
     * @return {*}
     */
    scroll(eventData : any, handler : (p1: JQueryEventObject) => any) : JQuery;

    /**
     * Trigger the "select" event on an element.
     * @return {*}
     */
    select() : JQuery;

    /**
     * Bind an event handler to the "select" JavaScript event.
     * 
     * @param {*} handler A function to execute each time the event is triggered.
     * @return {*}
     */
    select(handler : (p1: JQueryEventObject) => any) : JQuery;

    /**
     * Bind an event handler to the "select" JavaScript event.
     * 
     * @param {*} eventData An object containing data that will be passed to the event handler.
     * @param {*} handler A function to execute each time the event is triggered.
     * @return {*}
     */
    select(eventData : any, handler : (p1: JQueryEventObject) => any) : JQuery;

    /**
     * Trigger the "submit" event on an element.
     * @return {*}
     */
    submit() : JQuery;

    /**
     * Bind an event handler to the "submit" JavaScript event
     * 
     * @param {*} handler A function to execute each time the event is triggered.
     * @return {*}
     */
    submit(handler : (p1: JQueryEventObject) => any) : JQuery;

    /**
     * Bind an event handler to the "submit" JavaScript event
     * 
     * @param {*} eventData An object containing data that will be passed to the event handler.
     * @param {*} handler A function to execute each time the event is triggered.
     * @return {*}
     */
    submit(eventData : any, handler : (p1: JQueryEventObject) => any) : JQuery;

    /**
     * Execute all handlers and behaviors attached to the matched elements for the given event type.
     * 
     * @param {string} eventType A string containing a JavaScript event type, such as click or submit.
     * @param {Array} extraParameters Additional parameters to pass along to the event handler.
     * @return {*}
     */
    trigger(eventType : string, extraParameters : any[]) : JQuery;

    /**
     * Execute all handlers and behaviors attached to the matched elements for the given event type.
     * 
     * @param {*} event A jQuery.Event object.
     * @param {Array} extraParameters Additional parameters to pass along to the event handler.
     * @return {*}
     */
    trigger(event : JQueryEventObject, extraParameters : any[]) : JQuery;

    /**
     * Execute all handlers attached to an element for an event.
     * 
     * @param {string} eventType A string containing a JavaScript event type, such as click or submit.
     * @param {Array} extraParameters An array of additional parameters to pass along to the event handler.
     * @return {*}
     */
    triggerHandler(eventType : string, ...extraParameters : any[]) : any;

    /**
     * Execute all handlers attached to an element for an event.
     * 
     * @param {*} event A jQuery.Event object.
     * @param {Array} extraParameters An array of additional parameters to pass along to the event handler.
     * @return {*}
     */
    triggerHandler(event : JQueryEventObject, ...extraParameters : any[]) : any;

    /**
     * Remove a previously-attached event handler from the elements.
     * 
     * @param {string} eventType A string containing a JavaScript event type, such as click or submit.
     * @param {*} handler The function that is to be no longer executed.
     * @return {*}
     */
    unbind(eventType : string, handler : (p1: JQueryEventObject) => any) : JQuery;

    /**
     * Remove a previously-attached event handler from the elements.
     * 
     * @param {string} eventType A string containing a JavaScript event type, such as click or submit.
     * @param {boolean} fls Unbinds the corresponding 'return false' function that was bound using .bind( eventType, false ).
     * @return {*}
     */
    unbind(eventType : string, fls : boolean) : JQuery;

    /**
     * Remove a previously-attached event handler from the elements.
     * 
     * @param {*} evt A JavaScript event object as passed to an event handler.
     * @return {*}
     */
    unbind(evt : any) : JQuery;

    /**
     * Remove a handler from the event for all elements which match the current selector, based upon a specific set of root elements.
     * @return {*}
     */
    undelegate() : JQuery;

    /**
     * Remove a handler from the event for all elements which match the current selector, based upon a specific set of root elements.
     * 
     * @param {string} selector A selector which will be used to filter the event results.
     * @param {string} eventType A string containing a JavaScript event type, such as "click" or "keydown"
     * @param {*} handler A function to execute at the time the event is triggered.
     * @return {*}
     */
    undelegate(selector : string, eventType : string, handler : (p1: JQueryEventObject) => any) : JQuery;

    /**
     * Remove a handler from the event for all elements which match the current selector, based upon a specific set of root elements.
     * 
     * @param {string} selector A selector which will be used to filter the event results.
     * @param {*} events An object of one or more event types and previously bound functions to unbind from them.
     * @return {*}
     */
    undelegate(selector : string, events : any) : JQuery;

    /**
     * Remove a handler from the event for all elements which match the current selector, based upon a specific set of root elements.
     * 
     * @param {string} namespace A string containing a namespace to unbind all events from.
     * @return {*}
     */
    undelegate(namespace : string) : JQuery;

    /**
     * Bind an event handler to the "unload" JavaScript event. (DEPRECATED from v1.8)
     * 
     * @param {*} handler A function to execute when the event is triggered.
     * @return {*}
     */
    unload(handler : (p1: JQueryEventObject) => any) : JQuery;

    /**
     * Bind an event handler to the "unload" JavaScript event. (DEPRECATED from v1.8)
     * 
     * @param {*} eventData A plain object of data that will be passed to the event handler.
     * @param {*} handler A function to execute when the event is triggered.
     * @return {*}
     */
    unload(eventData : any, handler : (p1: JQueryEventObject) => any) : JQuery;

    /**
     * The DOM node context originally passed to jQuery(); if none was passed then context will likely be the document. (DEPRECATED from v1.10)
     */
    context : Element;

    jquery : string;

    /**
     * Bind an event handler to the "error" JavaScript event. (DEPRECATED from v1.8)
     * 
     * @param {*} handler A function to execute when the event is triggered.
     * @return {*}
     */
    error(handler : (p1: JQueryEventObject) => any) : JQuery;

    /**
     * Bind an event handler to the "error" JavaScript event. (DEPRECATED from v1.8)
     * 
     * @param {*} eventData A plain object of data that will be passed to the event handler.
     * @param {*} handler A function to execute when the event is triggered.
     * @return {*}
     */
    error(eventData : any, handler : (p1: JQueryEventObject) => any) : JQuery;

    /**
     * Add a collection of DOM elements onto the jQuery stack.
     * 
     * @param {Array} elements An array of elements to push onto the stack and make into a new jQuery object.
     * @return {*}
     */
    pushStack(elements : any[]) : JQuery;

    /**
     * Add a collection of DOM elements onto the jQuery stack.
     * 
     * @param {Array} elements An array of elements to push onto the stack and make into a new jQuery object.
     * @param {string} name The name of a jQuery method that generated the array of elements.
     * @param {Array} arguments The arguments that were passed in to the jQuery method (for serialization).
     * @return {*}
     */
    pushStack(elements : any[], name : string, __arguments : any[]) : JQuery;

    /**
     * Insert content, specified by the parameter, after each element in the set of matched elements.
     * 
     * param content1 HTML string, DOM element, DocumentFragment, array of elements, or jQuery object to insert after each element in the set of matched elements.
     * param content2 One or more additional DOM elements, arrays of elements, HTML strings, or jQuery objects to insert after each element in the set of matched elements.
     * @param {*} content1
     * @param {Array} content2
     * @return {*}
     */
    after(content1 : any, ...content2 : any[]) : JQuery;

    /**
     * Insert content, specified by the parameter, after each element in the set of matched elements.
     * 
     * param func A function that returns an HTML string, DOM element(s), or jQuery object to insert after each element in the set of matched elements. Receives the index position of the element in the set as an argument. Within the function, this refers to the current element in the set.
     * @param {*} func
     * @return {*}
     */
    after(func : (p1: number, p2: string) => string) : JQuery;

    /**
     * Insert content, specified by the parameter, to the end of each element in the set of matched elements.
     * 
     * param content1 DOM element, DocumentFragment, array of elements, HTML string, or jQuery object to insert at the end of each element in the set of matched elements.
     * param content2 One or more additional DOM elements, arrays of elements, HTML strings, or jQuery objects to insert at the end of each element in the set of matched elements.
     * @param {*} content1
     * @param {Array} content2
     * @return {*}
     */
    append(content1 : any, ...content2 : any[]) : JQuery;

    /**
     * Insert content, specified by the parameter, to the end of each element in the set of matched elements.
     * 
     * param func A function that returns an HTML string, DOM element(s), or jQuery object to insert at the end of each element in the set of matched elements. Receives the index position of the element in the set and the old HTML value of the element as arguments. Within the function, this refers to the current element in the set.
     * @param {*} func
     * @return {*}
     */
    append(func : (p1: number, p2: string) => string) : JQuery;

    /**
     * Insert every element in the set of matched elements to the end of the target.
     * 
     * @param {*} target A selector, element, HTML string, array of elements, or jQuery object; the matched set of elements will be inserted at the end of the element(s) specified by this parameter.
     * @return {*}
     */
    appendTo(target : any) : JQuery;

    /**
     * Insert content, specified by the parameter, before each element in the set of matched elements.
     * 
     * param content1 HTML string, DOM element, DocumentFragment, array of elements, or jQuery object to insert before each element in the set of matched elements.
     * param content2 One or more additional DOM elements, arrays of elements, HTML strings, or jQuery objects to insert before each element in the set of matched elements.
     * @param {*} content1
     * @param {Array} content2
     * @return {*}
     */
    before(content1 : any, ...content2 : any[]) : JQuery;

    /**
     * Insert content, specified by the parameter, before each element in the set of matched elements.
     * 
     * param func A function that returns an HTML string, DOM element(s), or jQuery object to insert before each element in the set of matched elements. Receives the index position of the element in the set as an argument. Within the function, this refers to the current element in the set.
     * @param {*} func
     * @return {*}
     */
    before(func : (p1: number, p2: string) => string) : JQuery;

    /**
     * Create a deep copy of the set of matched elements.
     * 
     * param withDataAndEvents A Boolean indicating whether event handlers and data should be copied along with the elements. The default value is false.
     * param deepWithDataAndEvents A Boolean indicating whether event handlers and data for all children of the cloned element should be copied. By default its value matches the first argument's value (which defaults to false).
     * @param {boolean} withDataAndEvents
     * @param {boolean} deepWithDataAndEvents
     * @return {*}
     */
    clone(withDataAndEvents : boolean, deepWithDataAndEvents : boolean) : JQuery;

    /**
     * Remove the set of matched elements from the DOM.
     * 
     * param selector A selector expression that filters the set of matched elements to be removed.
     * @param {string} selector
     * @return {*}
     */
    detach(selector : string) : JQuery;

    /**
     * Remove all child nodes of the set of matched elements from the DOM.
     * @return {*}
     */
    empty() : JQuery;

    /**
     * Insert every element in the set of matched elements after the target.
     * 
     * param target A selector, element, array of elements, HTML string, or jQuery object; the matched set of elements will be inserted after the element(s) specified by this parameter.
     * @param {*} target
     * @return {*}
     */
    insertAfter(target : any) : JQuery;

    /**
     * Insert every element in the set of matched elements before the target.
     * 
     * param target A selector, element, array of elements, HTML string, or jQuery object; the matched set of elements will be inserted before the element(s) specified by this parameter.
     * @param {*} target
     * @return {*}
     */
    insertBefore(target : any) : JQuery;

    /**
     * Insert content, specified by the parameter, to the beginning of each element in the set of matched elements.
     * 
     * param content1 DOM element, DocumentFragment, array of elements, HTML string, or jQuery object to insert at the beginning of each element in the set of matched elements.
     * param content2 One or more additional DOM elements, arrays of elements, HTML strings, or jQuery objects to insert at the beginning of each element in the set of matched elements.
     * @param {*} content1
     * @param {Array} content2
     * @return {*}
     */
    prepend(content1 : any, ...content2 : any[]) : JQuery;

    /**
     * Insert content, specified by the parameter, to the beginning of each element in the set of matched elements.
     * 
     * param func A function that returns an HTML string, DOM element(s), or jQuery object to insert at the beginning of each element in the set of matched elements. Receives the index position of the element in the set and the old HTML value of the element as arguments. Within the function, this refers to the current element in the set.
     * @param {*} func
     * @return {*}
     */
    prepend(func : (p1: number, p2: string) => string) : JQuery;

    /**
     * Insert every element in the set of matched elements to the beginning of the target.
     * 
     * @param {*} target A selector, element, HTML string, array of elements, or jQuery object; the matched set of elements will be inserted at the beginning of the element(s) specified by this parameter.
     * @return {*}
     */
    prependTo(target : any) : JQuery;

    /**
     * Remove the set of matched elements from the DOM.
     * 
     * @param {string} selector A selector expression that filters the set of matched elements to be removed.
     * @return {*}
     */
    remove(selector : string) : JQuery;

    /**
     * Replace each target element with the set of matched elements.
     * 
     * @param {*} target A selector string, jQuery object, DOM element, or array of elements indicating which element(s) to replace.
     * @return {*}
     */
    replaceAll(target : any) : JQuery;

    /**
     * Replace each element in the set of matched elements with the provided new content and return the set of elements that was removed.
     * 
     * param newContent The content to insert. May be an HTML string, DOM element, array of DOM elements, or jQuery object.
     * @param {*} newContent
     * @return {*}
     */
    replaceWith(newContent : any) : JQuery;

    /**
     * Replace each element in the set of matched elements with the provided new content and return the set of elements that was removed.
     * 
     * param func A function that returns content with which to replace the set of matched elements.
     * @param {*} func
     * @return {*}
     */
    replaceWith(func : () => Element) : JQuery;

    /**
     * Get the combined text contents of each element in the set of matched elements, including their descendants.
     * @return {string}
     */
    text() : string;

    /**
     * Set the content of each element in the set of matched elements to the specified text.
     * 
     * @param {string} text The text to set as the content of each matched element. When Number or Boolean is supplied, it will be converted to a String representation.
     * @return {*}
     */
    text(text : string) : JQuery;

    /**
     * Set the content of each element in the set of matched elements to the specified text.
     * 
     * @param {*} func A function returning the text content to set. Receives the index position of the element in the set and the old text value as arguments.
     * @return {*}
     */
    text(func : (p1: number, p2: string) => string) : JQuery;

    /**
     * Retrieve all the elements contained in the jQuery set, as an array.
     * @name toArray
     * @return {Array}
     */
    toArray() : HTMLElement[];

    /**
     * Remove the parents of the set of matched elements from the DOM, leaving the matched elements in their place.
     * @return {*}
     */
    unwrap() : JQuery;

    /**
     * Wrap an HTML structure around each element in the set of matched elements.
     * 
     * @param {*} wrappingElement A selector, element, HTML string, or jQuery object specifying the structure to wrap around the matched elements.
     * @return {*}
     */
    wrap(wrappingElement : JQuery) : JQuery;

    /**
     * Wrap an HTML structure around each element in the set of matched elements.
     * 
     * @param {*} func A callback function returning the HTML content or jQuery object to wrap around the matched elements. Receives the index position of the element in the set as an argument. Within the function, this refers to the current element in the set.
     * @return {*}
     */
    wrap(func : (p1: number) => string) : JQuery;

    /**
     * Wrap an HTML structure around all elements in the set of matched elements.
     * 
     * @param {*} wrappingElement A selector, element, HTML string, or jQuery object specifying the structure to wrap around the matched elements.
     * @return {*}
     */
    wrapAll(wrappingElement : JQuery) : JQuery;

    wrapAll(func : (p1: number) => string) : JQuery;

    /**
     * Wrap an HTML structure around the content of each element in the set of matched elements.
     * 
     * @param {*} wrappingElement An HTML snippet, selector expression, jQuery object, or DOM element specifying the structure to wrap around the content of the matched elements.
     * @return {*}
     */
    wrapInner(wrappingElement : JQuery) : JQuery;

    /**
     * Wrap an HTML structure around the content of each element in the set of matched elements.
     * 
     * @param {*} func A callback function which generates a structure to wrap around the content of the matched elements. Receives the index position of the element in the set as an argument. Within the function, this refers to the current element in the set.
     * @return {*}
     */
    wrapInner(func : (p1: number) => string) : JQuery;

    /**
     * Iterate over a jQuery object, executing a function for each matched element.
     * 
     * @param {*} func A function to execute for each matched element.
     * @return {*}
     */
    each(func : (p1: number, p2: Element) => any) : JQuery;

    /**
     * Retrieve one of the elements matched by the jQuery object.
     * 
     * @param {number} index A zero-based integer indicating which element to retrieve.
     * @return {HTMLElement}
     */
    get(index : number) : HTMLElement;

    /**
     * Retrieve the elements matched by the jQuery object.
     * @alias toArray
     * @return {Array}
     */
    get() : HTMLElement[];

    /**
     * Search for a given element from among the matched elements.
     * @return {number}
     */
    index() : number;

    /**
     * Search for a given element from among the matched elements.
     * 
     * @param {string} selector A selector representing a jQuery collection in which to look for an element.
     * @return {number}
     */
    index(selector : string) : number;

    /**
     * The number of elements in the jQuery object.
     */
    length : number;

    /**
     * A selector representing selector passed to jQuery(), if any, when creating the original set.
     * version deprecated: 1.7, removed: 1.9
     */
    selector : string;

    [index : string]: any;

    [index : number]: HTMLElement;

    /**
     * Add elements to the set of matched elements.
     * 
     * @param {string} selector A string representing a selector expression to find additional elements to add to the set of matched elements.
     * @param {Element} context The point in the document at which the selector should begin matching; similar to the context argument of the $(selector, context) method.
     * @return {*}
     */
    add(selector : string, context : Element) : JQuery;

    /**
     * Add elements to the set of matched elements.
     * 
     * @param {Array} elements One or more elements to add to the set of matched elements.
     * @return {*}
     */
    add(...elements : Element[]) : JQuery;

    /**
     * Add elements to the set of matched elements.
     * 
     * @param {string} html An HTML fragment to add to the set of matched elements.
     * @return {*}
     */
    add(html : string) : JQuery;

    /**
     * Add elements to the set of matched elements.
     * 
     * @param {*} obj An existing jQuery object to add to the set of matched elements.
     * @return {*}
     */
    add(obj : JQuery) : JQuery;

    /**
     * Get the children of each element in the set of matched elements, optionally filtered by a selector.
     * 
     * @param {string} selector A string containing a selector expression to match elements against.
     * @return {*}
     */
    children(selector : string) : JQuery;

    /**
     * For each element in the set, get the first element that matches the selector by testing the element itself and traversing up through its ancestors in the DOM tree.
     * 
     * @param {string} selector A string containing a selector expression to match elements against.
     * @return {*}
     */
    closest(selector : string) : JQuery;

    /**
     * For each element in the set, get the first element that matches the selector by testing the element itself and traversing up through its ancestors in the DOM tree.
     * 
     * @param {string} selector A string containing a selector expression to match elements against.
     * @param {Element} context A DOM element within which a matching element may be found. If no context is passed in then the context of the jQuery set will be used instead.
     * @return {*}
     */
    closest(selector : string, context : Element) : JQuery;

    /**
     * For each element in the set, get the first element that matches the selector by testing the element itself and traversing up through its ancestors in the DOM tree.
     * 
     * @param {*} obj A jQuery object to match elements against.
     * @return {*}
     */
    closest(obj : JQuery) : JQuery;

    /**
     * For each element in the set, get the first element that matches the selector by testing the element itself and traversing up through its ancestors in the DOM tree.
     * 
     * @param {Element} element An element to match elements against.
     * @return {*}
     */
    closest(element : Element) : JQuery;

    /**
     * Get an array of all the elements and selectors matched against the current element up through the DOM tree.
     * 
     * @param {*} selectors An array or string containing a selector expression to match elements against (can also be a jQuery object).
     * @param {Element} context A DOM element within which a matching element may be found. If no context is passed in then the context of the jQuery set will be used instead.
     * @return {Array}
     */
    closest(selectors : any, context : Element) : any[];

    /**
     * Get the children of each element in the set of matched elements, including text and comment nodes.
     * @return {*}
     */
    contents() : JQuery;

    /**
     * End the most recent filtering operation in the current chain and return the set of matched elements to its previous state.
     * @return {*}
     */
    end() : JQuery;

    /**
     * Reduce the set of matched elements to the one at the specified index.
     * 
     * @param {number} index An integer indicating the 0-based position of the element. OR An integer indicating the position of the element, counting backwards from the last element in the set.
     * 
     * @return {*}
     */
    eq(index : number) : JQuery;

    /**
     * Reduce the set of matched elements to those that match the selector or pass the function's test.
     * 
     * @param {string} selector A string containing a selector expression to match the current set of elements against.
     * @return {*}
     */
    filter(selector : string) : JQuery;

    /**
     * Reduce the set of matched elements to those that match the selector or pass the function's test.
     * 
     * @param {*} func A function used as a test for each element in the set. this is the current DOM element.
     * @return {*}
     */
    filter(func : (p1: number, p2: Element) => any) : JQuery;

    /**
     * Reduce the set of matched elements to those that match the selector or pass the function's test.
     * 
     * @param {Element} element An element to match the current set of elements against.
     * @return {*}
     */
    filter(element : Element) : JQuery;

    /**
     * Reduce the set of matched elements to those that match the selector or pass the function's test.
     * 
     * @param {*} obj An existing jQuery object to match the current set of elements against.
     * @return {*}
     */
    filter(obj : JQuery) : JQuery;

    /**
     * Get the descendants of each element in the current set of matched elements, filtered by a selector, jQuery object, or element.
     * 
     * @param {string} selector A string containing a selector expression to match elements against.
     * @return {*}
     */
    find(selector : string) : JQuery;

    /**
     * Get the descendants of each element in the current set of matched elements, filtered by a selector, jQuery object, or element.
     * 
     * @param {Element} element An element to match elements against.
     * @return {*}
     */
    find(element : Element) : JQuery;

    /**
     * Get the descendants of each element in the current set of matched elements, filtered by a selector, jQuery object, or element.
     * 
     * @param {*} obj A jQuery object to match elements against.
     * @return {*}
     */
    find(obj : JQuery) : JQuery;

    /**
     * Reduce the set of matched elements to the first in the set.
     * @return {*}
     */
    first() : JQuery;

    /**
     * Reduce the set of matched elements to those that have a descendant that matches the selector or DOM element.
     * 
     * @param {string} selector A string containing a selector expression to match elements against.
     * @return {*}
     */
    has(selector : string) : JQuery;

    /**
     * Reduce the set of matched elements to those that have a descendant that matches the selector or DOM element.
     * 
     * @param {Element} contained A DOM element to match elements against.
     * @return {*}
     */
    has(contained : Element) : JQuery;

    /**
     * Check the current matched set of elements against a selector, element, or jQuery object and return true if at least one of these elements matches the given arguments.
     * 
     * @param {string} selector A string containing a selector expression to match elements against.
     * @return {boolean}
     */
    is(selector : string) : boolean;

    /**
     * Check the current matched set of elements against a selector, element, or jQuery object and return true if at least one of these elements matches the given arguments.
     * 
     * @param {*} func A function used as a test for the set of elements. It accepts one argument, index, which is the element's index in the jQuery collection.Within the function, this refers to the current DOM element.
     * @return {boolean}
     */
    is(func : (p1: number, p2: Element) => boolean) : boolean;

    /**
     * Check the current matched set of elements against a selector, element, or jQuery object and return true if at least one of these elements matches the given arguments.
     * 
     * @param {*} obj An existing jQuery object to match the current set of elements against.
     * @return {boolean}
     */
    is(obj : JQuery) : boolean;

    /**
     * Check the current matched set of elements against a selector, element, or jQuery object and return true if at least one of these elements matches the given arguments.
     * 
     * @param {*} elements One or more elements to match the current set of elements against.
     * @return {boolean}
     */
    is(elements : any) : boolean;

    /**
     * Reduce the set of matched elements to the final one in the set.
     * @return {*}
     */
    last() : JQuery;

    /**
     * Pass each element in the current matched set through a function, producing a new jQuery object containing the return values.
     * 
     * @param {*} callback A function object that will be invoked for each element in the current set.
     * @return {*}
     */
    map(callback : (p1: number, p2: Element) => any) : JQuery;

    /**
     * Get the immediately following sibling of each element in the set of matched elements. If a selector is provided, it retrieves the next sibling only if it matches that selector.
     * 
     * @param {string} selector A string containing a selector expression to match elements against.
     * @return {*}
     */
    next(selector : string) : JQuery;

    /**
     * Get all following siblings of each element in the set of matched elements, optionally filtered by a selector.
     * 
     * @param {string} selector A string containing a selector expression to match elements against.
     * @return {*}
     */
    nextAll(selector : string) : JQuery;

    /**
     * Get all following siblings of each element up to but not including the element matched by the selector, DOM node, or jQuery object passed.
     * 
     * @param {string} selector A string containing a selector expression to indicate where to stop matching following sibling elements.
     * @param {string} filter A string containing a selector expression to match elements against.
     * @return {*}
     */
    nextUntil(selector : string, filter : string) : JQuery;

    /**
     * Get all following siblings of each element up to but not including the element matched by the selector, DOM node, or jQuery object passed.
     * 
     * @param {Element} element A DOM node or jQuery object indicating where to stop matching following sibling elements.
     * @param {string} filter A string containing a selector expression to match elements against.
     * @return {*}
     */
    nextUntil(element : Element, filter : string) : JQuery;

    /**
     * Get all following siblings of each element up to but not including the element matched by the selector, DOM node, or jQuery object passed.
     * 
     * @param {*} obj A DOM node or jQuery object indicating where to stop matching following sibling elements.
     * @param {string} filter A string containing a selector expression to match elements against.
     * @return {*}
     */
    nextUntil(obj : JQuery, filter : string) : JQuery;

    /**
     * Remove elements from the set of matched elements.
     * 
     * @param {string} selector A string containing a selector expression to match elements against.
     * @return {*}
     */
    not(selector : string) : JQuery;

    /**
     * Remove elements from the set of matched elements.
     * 
     * @param {*} func A function used as a test for each element in the set. this is the current DOM element.
     * @return {*}
     */
    not(func : (p1: number, p2: Element) => boolean) : JQuery;

    /**
     * Remove elements from the set of matched elements.
     * 
     * @param {Element} elements One or more DOM elements to remove from the matched set.
     * @return {*}
     */
    not(elements : Element) : JQuery;

    /**
     * Remove elements from the set of matched elements.
     * 
     * @param {*} obj An existing jQuery object to match the current set of elements against.
     * @return {*}
     */
    not(obj : JQuery) : JQuery;

    /**
     * Get the closest ancestor element that is positioned.
     * @return {*}
     */
    offsetParent() : JQuery;

    /**
     * Get the parent of each element in the current set of matched elements, optionally filtered by a selector.
     * 
     * @param {string} selector A string containing a selector expression to match elements against.
     * @return {*}
     */
    parent(selector : string) : JQuery;

    /**
     * Get the ancestors of each element in the current set of matched elements, optionally filtered by a selector.
     * 
     * @param {string} selector A string containing a selector expression to match elements against.
     * @return {*}
     */
    parents(selector : string) : JQuery;

    /**
     * Get the ancestors of each element in the current set of matched elements, up to but not including the element matched by the selector, DOM node, or jQuery object.
     * 
     * @param {string} selector A string containing a selector expression to indicate where to stop matching ancestor elements.
     * @param {string} filter A string containing a selector expression to match elements against.
     * @return {*}
     */
    parentsUntil(selector : string, filter : string) : JQuery;

    /**
     * Get the ancestors of each element in the current set of matched elements, up to but not including the element matched by the selector, DOM node, or jQuery object.
     * 
     * @param {Element} element A DOM node or jQuery object indicating where to stop matching ancestor elements.
     * @param {string} filter A string containing a selector expression to match elements against.
     * @return {*}
     */
    parentsUntil(element : Element, filter : string) : JQuery;

    /**
     * Get the ancestors of each element in the current set of matched elements, up to but not including the element matched by the selector, DOM node, or jQuery object.
     * 
     * @param {*} obj A DOM node or jQuery object indicating where to stop matching ancestor elements.
     * @param {string} filter A string containing a selector expression to match elements against.
     * @return {*}
     */
    parentsUntil(obj : JQuery, filter : string) : JQuery;

    /**
     * Get the immediately preceding sibling of each element in the set of matched elements, optionally filtered by a selector.
     * 
     * @param {string} selector A string containing a selector expression to match elements against.
     * @return {*}
     */
    prev(selector : string) : JQuery;

    /**
     * Get all preceding siblings of each element in the set of matched elements, optionally filtered by a selector.
     * 
     * @param {string} selector A string containing a selector expression to match elements against.
     * @return {*}
     */
    prevAll(selector : string) : JQuery;

    /**
     * Get all preceding siblings of each element up to but not including the element matched by the selector, DOM node, or jQuery object.
     * 
     * @param {string} selector A string containing a selector expression to indicate where to stop matching preceding sibling elements.
     * @param {string} filter A string containing a selector expression to match elements against.
     * @return {*}
     */
    prevUntil(selector : string, filter : string) : JQuery;

    /**
     * Get all preceding siblings of each element up to but not including the element matched by the selector, DOM node, or jQuery object.
     * 
     * @param {Element} element A DOM node or jQuery object indicating where to stop matching preceding sibling elements.
     * @param {string} filter A string containing a selector expression to match elements against.
     * @return {*}
     */
    prevUntil(element : Element, filter : string) : JQuery;

    /**
     * Get all preceding siblings of each element up to but not including the element matched by the selector, DOM node, or jQuery object.
     * 
     * @param {*} obj A DOM node or jQuery object indicating where to stop matching preceding sibling elements.
     * @param {string} filter A string containing a selector expression to match elements against.
     * @return {*}
     */
    prevUntil(obj : JQuery, filter : string) : JQuery;

    /**
     * Get the siblings of each element in the set of matched elements, optionally filtered by a selector.
     * 
     * @param {string} selector A string containing a selector expression to match elements against.
     * @return {*}
     */
    siblings(selector : string) : JQuery;

    /**
     * Reduce the set of matched elements to a subset specified by a range of indices.
     * 
     * @param {number} start An integer indicating the 0-based position at which the elements begin to be selected. If negative, it indicates an offset from the end of the set.
     * @param {number} end An integer indicating the 0-based position at which the elements stop being selected. If negative, it indicates an offset from the end of the set. If omitted, the range continues until the end of the set.
     * @return {*}
     */
    slice(start : number, end : number) : JQuery;

    /**
     * Show the queue of functions to be executed on the matched elements.
     * 
     * @param {string} queueName A string containing the name of the queue. Defaults to fx, the standard effects queue.
     * @return {Array}
     */
    queue(queueName : string) : any[];

    /**
     * Manipulate the queue of functions to be executed, once for each matched element.
     * 
     * @param {Array} newQueue An array of functions to replace the current queue contents.
     * @return {*}
     */
    queue(newQueue : Function[]) : JQuery;

    /**
     * Manipulate the queue of functions to be executed, once for each matched element.
     * 
     * @param {Function} callback The new function to add to the queue, with a function to call that will dequeue the next item.
     * @return {*}
     */
    queue(callback : Function) : JQuery;

    /**
     * Manipulate the queue of functions to be executed, once for each matched element.
     * 
     * @param {string} queueName A string containing the name of the queue. Defaults to fx, the standard effects queue.
     * @param {Array} newQueue An array of functions to replace the current queue contents.
     * @return {*}
     */
    queue(queueName : string, newQueue : Function[]) : JQuery;

    /**
     * Manipulate the queue of functions to be executed, once for each matched element.
     * 
     * @param {string} queueName A string containing the name of the queue. Defaults to fx, the standard effects queue.
     * @param {Function} callback The new function to add to the queue, with a function to call that will dequeue the next item.
     * @return {*}
     */
    queue(queueName : string, callback : Function) : JQuery;

    /**
     * Load data from the server and place the returned HTML into the matched element.
     * 
     * @param {string} url A string containing the URL to which the request is sent.
     * @param {string} data A plain object or string that is sent to the server with the request.
     * @param complete A callback function that is executed when the request completes.
     * @return {*}
     */
    load(url : string, data : string) : JQuery;

    /**
     * Load data from the server and place the returned HTML into the matched element.
     * 
     * @param {string} url A string containing the URL to which the request is sent.
     * @param data A plain object or string that is sent to the server with the request.
     * @param complete A callback function that is executed when the request completes.
     * @return {*}
     */
    load(url : string) : JQuery;

    /**
     * Add the previous set of elements on the stack to the current set, optionally filtered by a selector.
     * @return {*}
     */
    addBack() : JQuery;

    /**
     * Remove a single class, multiple classes, or all classes from each element in the set of matched elements.
     * 
     * @param className One or more space-separated classes to be removed from the class attribute of each matched element.
     * @return {*}
     */
    removeClass() : JQuery;

    /**
     * Add or remove one or more classes from each element in the set of matched elements, depending on either the class's presence or the value of the switch argument.
     * 
     * @param {string} className One or more class names (separated by spaces) to be toggled for each element in the matched set.
     * @param swtch A Boolean (not just truthy/falsy) value to determine whether the class should be added or removed.
     * @return {*}
     */
    toggleClass(className : string) : JQuery;

    /**
     * Add or remove one or more classes from each element in the set of matched elements, depending on either the class's presence or the value of the switch argument.
     * 
     * @param swtch A boolean value to determine whether the class should be added or removed.
     * @return {*}
     */
    toggleClass() : JQuery;

    /**
     * Add or remove one or more classes from each element in the set of matched elements, depending on either the class's presence or the value of the switch argument.
     * 
     * @param {*} func A function that returns class names to be toggled in the class attribute of each element in the matched set. Receives the index position of the element in the set, the old class value, and the switch as arguments.
     * @param swtch A boolean value to determine whether the class should be added or removed.
     * @return {*}
     */
    toggleClass(func : (p1: number, p2: string, p3: boolean) => string) : JQuery;

    /**
     * Get the current computed height for the first element in the set of matched elements, including padding, border, and optionally margin. Returns an integer (without "px") representation of the value or null if called on an empty set of elements.
     * 
     * @param includeMargin A Boolean indicating whether to include the element's margin in the calculation.
     * @return {number}
     */
    outerHeight() : number;

    /**
     * Get the current computed width for the first element in the set of matched elements, including padding and border.
     * 
     * @param includeMargin A Boolean indicating whether to include the element's margin in the calculation.
     * @return {number}
     */
    outerWidth() : number;

    /**
     * Remove from the queue all items that have not yet been run.
     * 
     * @param queueName A string containing the name of the queue. Defaults to fx, the standard effects queue.
     * @return {*}
     */
    clearQueue() : JQuery;

    /**
     * Execute the next function on the queue for the matched elements.
     * 
     * @param queueName A string containing the name of the queue. Defaults to fx, the standard effects queue.
     * @return {*}
     */
    dequeue() : JQuery;

    /**
     * Return a Promise object to observe when all actions of a certain type bound to the collection, queued or not, have finished.
     * 
     * @param {string} type The type of queue that needs to be observed. (default: fx)
     * @param target Object onto which the promise methods have to be attached
     * @return {*}
     */
    promise(type : string) : JQueryPromise<any>;

    /**
     * Return a Promise object to observe when all actions of a certain type bound to the collection, queued or not, have finished.
     * 
     * @param type The type of queue that needs to be observed. (default: fx)
     * @param target Object onto which the promise methods have to be attached
     * @return {*}
     */
    promise() : JQueryPromise<any>;

    /**
     * Perform a custom animation of a set of CSS properties.
     * 
     * @param {*} properties An object of CSS properties and values that the animation will move toward.
     * @param {string} duration A string or number determining how long the animation will run.
     * @param complete A function to call once the animation is complete.
     * @return {*}
     */
    animate(properties : any, duration : string) : JQuery;

    /**
     * Perform a custom animation of a set of CSS properties.
     * 
     * @param {*} properties An object of CSS properties and values that the animation will move toward.
     * @param duration A string or number determining how long the animation will run.
     * @param complete A function to call once the animation is complete.
     * @return {*}
     */
    animate(properties : any) : JQuery;

    /**
     * Perform a custom animation of a set of CSS properties.
     * 
     * @param {*} properties An object of CSS properties and values that the animation will move toward.
     * @param {string} duration A string or number determining how long the animation will run.
     * @param {string} easing A string indicating which easing function to use for the transition. (default: swing)
     * @param complete A function to call once the animation is complete.
     * @return {*}
     */
    animate(properties : any, duration : string, easing : string) : JQuery;

    /**
     * Set a timer to delay execution of subsequent items in the queue.
     * 
     * @param {number} duration An integer indicating the number of milliseconds to delay execution of the next item in the queue.
     * @param queueName A string containing the name of the queue. Defaults to fx, the standard effects queue.
     * @return {*}
     */
    delay(duration : number) : JQuery;

    /**
     * Display the matched elements by fading them to opaque.
     * 
     * @param {number} duration A string or number determining how long the animation will run.
     * @param complete A function to call once the animation is complete.
     * @return {*}
     */
    fadeIn(duration : number) : JQuery;

    /**
     * Display the matched elements by fading them to opaque.
     * 
     * @param duration A string or number determining how long the animation will run.
     * @param complete A function to call once the animation is complete.
     * @return {*}
     */
    fadeIn() : JQuery;

    /**
     * Display the matched elements by fading them to opaque.
     * 
     * @param {number} duration A string or number determining how long the animation will run.
     * @param {string} easing A string indicating which easing function to use for the transition.
     * @param complete A function to call once the animation is complete.
     * @return {*}
     */
    fadeIn(duration : number, easing : string) : JQuery;

    /**
     * Hide the matched elements by fading them to transparent.
     * 
     * @param {number} duration A string or number determining how long the animation will run.
     * @param complete A function to call once the animation is complete.
     * @return {*}
     */
    fadeOut(duration : number) : JQuery;

    /**
     * Hide the matched elements by fading them to transparent.
     * 
     * @param duration A string or number determining how long the animation will run.
     * @param complete A function to call once the animation is complete.
     * @return {*}
     */
    fadeOut() : JQuery;

    /**
     * Hide the matched elements by fading them to transparent.
     * 
     * @param {number} duration A string or number determining how long the animation will run.
     * @param {string} easing A string indicating which easing function to use for the transition.
     * @param complete A function to call once the animation is complete.
     * @return {*}
     */
    fadeOut(duration : number, easing : string) : JQuery;

    /**
     * Adjust the opacity of the matched elements.
     * 
     * @param {string} duration A string or number determining how long the animation will run.
     * @param {number} opacity A number between 0 and 1 denoting the target opacity.
     * @param complete A function to call once the animation is complete.
     * @return {*}
     */
    fadeTo(duration : string, opacity : number) : JQuery;

    /**
     * Adjust the opacity of the matched elements.
     * 
     * @param {string} duration A string or number determining how long the animation will run.
     * @param {number} opacity A number between 0 and 1 denoting the target opacity.
     * @param {string} easing A string indicating which easing function to use for the transition.
     * @param complete A function to call once the animation is complete.
     * @return {*}
     */
    fadeTo(duration : string, opacity : number, easing : string) : JQuery;

    /**
     * Display or hide the matched elements by animating their opacity.
     * 
     * @param {number} duration A string or number determining how long the animation will run.
     * @param complete A function to call once the animation is complete.
     * @return {*}
     */
    fadeToggle(duration : number) : JQuery;

    /**
     * Display or hide the matched elements by animating their opacity.
     * 
     * @param duration A string or number determining how long the animation will run.
     * @param complete A function to call once the animation is complete.
     * @return {*}
     */
    fadeToggle() : JQuery;

    /**
     * Display or hide the matched elements by animating their opacity.
     * 
     * @param {number} duration A string or number determining how long the animation will run.
     * @param {string} easing A string indicating which easing function to use for the transition.
     * @param complete A function to call once the animation is complete.
     * @return {*}
     */
    fadeToggle(duration : number, easing : string) : JQuery;

    /**
     * Stop the currently-running animation, remove all queued animations, and complete all animations for the matched elements.
     * 
     * @param queue The name of the queue in which to stop animations.
     * @return {*}
     */
    finish() : JQuery;

    /**
     * Hide the matched elements.
     * 
     * @param {number} duration A string or number determining how long the animation will run.
     * @param complete A function to call once the animation is complete.
     * @return {*}
     */
    hide(duration : number) : JQuery;

    /**
     * Hide the matched elements.
     * 
     * @param duration A string or number determining how long the animation will run.
     * @param complete A function to call once the animation is complete.
     * @return {*}
     */
    hide() : JQuery;

    /**
     * Hide the matched elements.
     * 
     * @param {number} duration A string or number determining how long the animation will run.
     * @param {string} easing A string indicating which easing function to use for the transition.
     * @param complete A function to call once the animation is complete.
     * @return {*}
     */
    hide(duration : number, easing : string) : JQuery;

    /**
     * Display the matched elements.
     * 
     * @param {number} duration A string or number determining how long the animation will run.
     * @param complete A function to call once the animation is complete.
     * @return {*}
     */
    show(duration : number) : JQuery;

    /**
     * Display the matched elements.
     * 
     * @param duration A string or number determining how long the animation will run.
     * @param complete A function to call once the animation is complete.
     * @return {*}
     */
    show() : JQuery;

    /**
     * Display the matched elements.
     * 
     * @param {number} duration A string or number determining how long the animation will run.
     * @param {string} easing A string indicating which easing function to use for the transition.
     * @param complete A function to call once the animation is complete.
     * @return {*}
     */
    show(duration : number, easing : string) : JQuery;

    /**
     * Display the matched elements with a sliding motion.
     * 
     * @param {number} duration A string or number determining how long the animation will run.
     * @param complete A function to call once the animation is complete.
     * @return {*}
     */
    slideDown(duration : number) : JQuery;

    /**
     * Display the matched elements with a sliding motion.
     * 
     * @param duration A string or number determining how long the animation will run.
     * @param complete A function to call once the animation is complete.
     * @return {*}
     */
    slideDown() : JQuery;

    /**
     * Display the matched elements with a sliding motion.
     * 
     * @param {number} duration A string or number determining how long the animation will run.
     * @param {string} easing A string indicating which easing function to use for the transition.
     * @param complete A function to call once the animation is complete.
     * @return {*}
     */
    slideDown(duration : number, easing : string) : JQuery;

    /**
     * Display or hide the matched elements with a sliding motion.
     * 
     * @param {number} duration A string or number determining how long the animation will run.
     * @param complete A function to call once the animation is complete.
     * @return {*}
     */
    slideToggle(duration : number) : JQuery;

    /**
     * Display or hide the matched elements with a sliding motion.
     * 
     * @param duration A string or number determining how long the animation will run.
     * @param complete A function to call once the animation is complete.
     * @return {*}
     */
    slideToggle() : JQuery;

    /**
     * Display or hide the matched elements with a sliding motion.
     * 
     * @param {number} duration A string or number determining how long the animation will run.
     * @param {string} easing A string indicating which easing function to use for the transition.
     * @param complete A function to call once the animation is complete.
     * @return {*}
     */
    slideToggle(duration : number, easing : string) : JQuery;

    /**
     * Hide the matched elements with a sliding motion.
     * 
     * @param {number} duration A string or number determining how long the animation will run.
     * @param complete A function to call once the animation is complete.
     * @return {*}
     */
    slideUp(duration : number) : JQuery;

    /**
     * Hide the matched elements with a sliding motion.
     * 
     * @param duration A string or number determining how long the animation will run.
     * @param complete A function to call once the animation is complete.
     * @return {*}
     */
    slideUp() : JQuery;

    /**
     * Hide the matched elements with a sliding motion.
     * 
     * @param {number} duration A string or number determining how long the animation will run.
     * @param {string} easing A string indicating which easing function to use for the transition.
     * @param complete A function to call once the animation is complete.
     * @return {*}
     */
    slideUp(duration : number, easing : string) : JQuery;

    /**
     * Stop the currently-running animation on the matched elements.
     * 
     * @param {boolean} clearQueue A Boolean indicating whether to remove queued animation as well. Defaults to false.
     * @param jumpToEnd A Boolean indicating whether to complete the current animation immediately. Defaults to false.
     * @return {*}
     */
    stop(clearQueue : boolean) : JQuery;

    /**
     * Stop the currently-running animation on the matched elements.
     * 
     * @param clearQueue A Boolean indicating whether to remove queued animation as well. Defaults to false.
     * @param jumpToEnd A Boolean indicating whether to complete the current animation immediately. Defaults to false.
     * @return {*}
     */
    stop() : JQuery;

    /**
     * Stop the currently-running animation on the matched elements.
     * 
     * @param {string} queue The name of the queue in which to stop animations.
     * @param {boolean} clearQueue A Boolean indicating whether to remove queued animation as well. Defaults to false.
     * @param jumpToEnd A Boolean indicating whether to complete the current animation immediately. Defaults to false.
     * @return {*}
     */
    stop(queue : string, clearQueue : boolean) : JQuery;

    /**
     * Stop the currently-running animation on the matched elements.
     * 
     * @param {string} queue The name of the queue in which to stop animations.
     * @param clearQueue A Boolean indicating whether to remove queued animation as well. Defaults to false.
     * @param jumpToEnd A Boolean indicating whether to complete the current animation immediately. Defaults to false.
     * @return {*}
     */
    stop(queue : string) : JQuery;

    /**
     * Display or hide the matched elements.
     * 
     * @param {number} duration A string or number determining how long the animation will run.
     * @param complete A function to call once the animation is complete.
     * @return {*}
     */
    toggle(duration : number) : JQuery;

    /**
     * Display or hide the matched elements.
     * 
     * @param duration A string or number determining how long the animation will run.
     * @param complete A function to call once the animation is complete.
     * @return {*}
     */
    toggle() : JQuery;

    /**
     * Display or hide the matched elements.
     * 
     * @param {number} duration A string or number determining how long the animation will run.
     * @param {string} easing A string indicating which easing function to use for the transition.
     * @param complete A function to call once the animation is complete.
     * @return {*}
     */
    toggle(duration : number, easing : string) : JQuery;

    /**
     * Bind an event handler to the "blur" JavaScript event
     * 
     * @param {*} eventData An object containing data that will be passed to the event handler.
     * @param handler A function to execute each time the event is triggered.
     * @return {*}
     */
    blur(eventData : any) : JQuery;

    /**
     * Bind an event handler to the "change" JavaScript event
     * 
     * @param {*} eventData An object containing data that will be passed to the event handler.
     * @param handler A function to execute each time the event is triggered.
     * @return {*}
     */
    change(eventData : any) : JQuery;

    /**
     * Bind an event handler to the "click" JavaScript event
     * 
     * @param {*} eventData An object containing data that will be passed to the event handler.
     * @param handler A function to execute each time the event is triggered.
     * @return {*}
     */
    click(eventData : any) : JQuery;

    /**
     * Bind an event handler to the "dblclick" JavaScript event
     * 
     * @param {*} eventData An object containing data that will be passed to the event handler.
     * @param handler A function to execute each time the event is triggered.
     * @return {*}
     */
    dblclick(eventData : any) : JQuery;

    /**
     * Bind an event handler to the "focus" JavaScript event
     * 
     * @param {*} eventData An object containing data that will be passed to the event handler.
     * @param handler A function to execute each time the event is triggered.
     * @return {*}
     */
    focus(eventData : any) : JQuery;

    /**
     * Bind an event handler to the "keydown" JavaScript event
     * 
     * @param {*} eventData An object containing data that will be passed to the event handler.
     * @param handler A function to execute each time the event is triggered.
     * @return {*}
     */
    keydown(eventData : any) : JQuery;

    /**
     * Bind an event handler to the "keypress" JavaScript event
     * 
     * @param {*} eventData An object containing data that will be passed to the event handler.
     * @param handler A function to execute each time the event is triggered.
     * @return {*}
     */
    keypress(eventData : any) : JQuery;

    /**
     * Bind an event handler to the "keyup" JavaScript event
     * 
     * @param {*} eventData An object containing data that will be passed to the event handler.
     * @param handler A function to execute each time the event is triggered.
     * @return {*}
     */
    keyup(eventData : any) : JQuery;

    /**
     * Bind an event handler to the "load" JavaScript event.
     * 
     * @param {*} eventData An object containing data that will be passed to the event handler.
     * @param handler A function to execute when the event is triggered.
     * @return {*}
     */
    load(eventData : any) : JQuery;

    /**
     * Bind an event handler to the "load" JavaScript event.
     * 
     * @param eventData An object containing data that will be passed to the event handler.
     * @param handler A function to execute when the event is triggered.
     * @return {*}
     */
    load() : JQuery;

    /**
     * Remove an event handler.
     * 
     * @param {string} events One or more space-separated event types and optional namespaces, or just namespaces, such as "click", "keydown.myPlugin", or ".myPlugin".
     * @param {string} selector A selector which should match the one originally passed to .on() when attaching event handlers.
     * @param handler A handler function previously attached for the event(s), or the special value false.
     * @return {*}
     */
    off(events : string, selector : string) : JQuery;

    /**
     * Remove an event handler.
     * 
     * @param {string} events One or more space-separated event types and optional namespaces, or just namespaces, such as "click", "keydown.myPlugin", or ".myPlugin".
     * @param selector A selector which should match the one originally passed to .on() when attaching event handlers.
     * @param handler A handler function previously attached for the event(s), or the special value false.
     * @return {*}
     */
    off(events : string) : JQuery;

    /**
     * Remove an event handler.
     * 
     * @param {JQuery.Events} events An object where the string keys represent one or more space-separated event types and optional namespaces, and the values represent handler functions previously attached for the event(s).
     * @param selector A selector which should match the one originally passed to .on() when attaching event handlers.
     * @return {*}
     */
    off(events : any) : JQuery;

    /**
     * Attach an event handler function for one or more events to the selected elements.
     * 
     * @param {JQuery.Events} events An object in which the string keys represent one or more space-separated event types and optional namespaces, and the values represent a handler function to be called for the event(s).
     * @param {string} selector A selector string to filter the descendants of the selected elements that will call the handler. If the selector is null or omitted, the handler is always called when it reaches the selected element.
     * @param data Data to be passed to the handler in event.data when an event occurs.
     * @return {*}
     */
    on(events : any, selector : string) : JQuery;

    /**
     * Attach an event handler function for one or more events to the selected elements.
     * 
     * @param {JQuery.Events} events An object in which the string keys represent one or more space-separated event types and optional namespaces, and the values represent a handler function to be called for the event(s).
     * @param selector A selector string to filter the descendants of the selected elements that will call the handler. If the selector is null or omitted, the handler is always called when it reaches the selected element.
     * @param data Data to be passed to the handler in event.data when an event occurs.
     * @return {*}
     */
    on(events : any) : JQuery;

    /**
     * Attach a handler to an event for the elements. The handler is executed at most once per element per event type.
     * 
     * @param {JQuery.Events} events An object in which the string keys represent one or more space-separated event types and optional namespaces, and the values represent a handler function to be called for the event(s).
     * @param {string} selector A selector string to filter the descendants of the selected elements that will call the handler. If the selector is null or omitted, the handler is always called when it reaches the selected element.
     * @param data Data to be passed to the handler in event.data when an event occurs.
     * @return {*}
     */
    one(events : any, selector : string) : JQuery;

    /**
     * Attach a handler to an event for the elements. The handler is executed at most once per element per event type.
     * 
     * @param {JQuery.Events} events An object in which the string keys represent one or more space-separated event types and optional namespaces, and the values represent a handler function to be called for the event(s).
     * @param selector A selector string to filter the descendants of the selected elements that will call the handler. If the selector is null or omitted, the handler is always called when it reaches the selected element.
     * @param data Data to be passed to the handler in event.data when an event occurs.
     * @return {*}
     */
    one(events : any) : JQuery;

    /**
     * Bind an event handler to the "submit" JavaScript event
     * 
     * @param {*} eventData An object containing data that will be passed to the event handler.
     * @param handler A function to execute each time the event is triggered.
     * @return {*}
     */
    submit(eventData : any) : JQuery;

    /**
     * Execute all handlers and behaviors attached to the matched elements for the given event type.
     * 
     * @param {string} eventType A string containing a JavaScript event type, such as click or submit.
     * @param extraParameters Additional parameters to pass along to the event handler.
     * @return {*}
     */
    trigger(eventType : string) : JQuery;

    /**
     * Execute all handlers and behaviors attached to the matched elements for the given event type.
     * 
     * @param {*} event A jQuery.Event object.
     * @param extraParameters Additional parameters to pass along to the event handler.
     * @return {*}
     */
    trigger(event : JQueryEventObject) : JQuery;

    /**
     * Remove a previously-attached event handler from the elements.
     * 
     * @param {string} eventType A string containing a JavaScript event type, such as click or submit.
     * @param handler The function that is to be no longer executed.
     * @return {*}
     */
    unbind(eventType : string) : JQuery;

    /**
     * Remove a previously-attached event handler from the elements.
     * 
     * @param eventType A string containing a JavaScript event type, such as click or submit.
     * @param handler The function that is to be no longer executed.
     * @return {*}
     */
    unbind() : JQuery;

    /**
     * Remove a handler from the event for all elements which match the current selector, based upon a specific set of root elements.
     * 
     * @param {string} selector A selector which will be used to filter the event results.
     * @param {string} eventType A string containing a JavaScript event type, such as "click" or "keydown"
     * @param handler A function to execute at the time the event is triggered.
     * @return {*}
     */
    undelegate(selector : string, eventType : string) : JQuery;

    /**
     * Bind an event handler to the "unload" JavaScript event. (DEPRECATED from v1.8)
     * 
     * @param {*} eventData A plain object of data that will be passed to the event handler.
     * @param handler A function to execute when the event is triggered.
     * @return {*}
     */
    unload(eventData : any) : JQuery;

    /**
     * Bind an event handler to the "unload" JavaScript event. (DEPRECATED from v1.8)
     * 
     * @param eventData A plain object of data that will be passed to the event handler.
     * @param handler A function to execute when the event is triggered.
     * @return {*}
     */
    unload() : JQuery;

    /**
     * Create a deep copy of the set of matched elements.
     * 
     * param withDataAndEvents A Boolean indicating whether event handlers and data should be copied along with the elements. The default value is false.
     * param deepWithDataAndEvents A Boolean indicating whether event handlers and data for all children of the cloned element should be copied. By default its value matches the first argument's value (which defaults to false).
     * @param {boolean} withDataAndEvents
     * @return {*}
     */
    clone(withDataAndEvents : boolean) : JQuery;

    /**
     * Create a deep copy of the set of matched elements.
     * 
     * param withDataAndEvents A Boolean indicating whether event handlers and data should be copied along with the elements. The default value is false.
     * param deepWithDataAndEvents A Boolean indicating whether event handlers and data for all children of the cloned element should be copied. By default its value matches the first argument's value (which defaults to false).
     * @return {*}
     */
    clone() : JQuery;

    /**
     * Remove the set of matched elements from the DOM.
     * 
     * param selector A selector expression that filters the set of matched elements to be removed.
     * @return {*}
     */
    detach() : JQuery;

    /**
     * Remove the set of matched elements from the DOM.
     * 
     * @param selector A selector expression that filters the set of matched elements to be removed.
     * @return {*}
     */
    remove() : JQuery;

    /**
     * Get the children of each element in the set of matched elements, optionally filtered by a selector.
     * 
     * @param selector A string containing a selector expression to match elements against.
     * @return {*}
     */
    children() : JQuery;

    /**
     * Get an array of all the elements and selectors matched against the current element up through the DOM tree.
     * 
     * @param {*} selectors An array or string containing a selector expression to match elements against (can also be a jQuery object).
     * @param context A DOM element within which a matching element may be found. If no context is passed in then the context of the jQuery set will be used instead.
     * @return {Array}
     */
    closest(selectors : any) : any[];

    /**
     * Get the immediately following sibling of each element in the set of matched elements. If a selector is provided, it retrieves the next sibling only if it matches that selector.
     * 
     * @param selector A string containing a selector expression to match elements against.
     * @return {*}
     */
    next() : JQuery;

    /**
     * Get all following siblings of each element in the set of matched elements, optionally filtered by a selector.
     * 
     * @param selector A string containing a selector expression to match elements against.
     * @return {*}
     */
    nextAll() : JQuery;

    /**
     * Get all following siblings of each element up to but not including the element matched by the selector, DOM node, or jQuery object passed.
     * 
     * @param {string} selector A string containing a selector expression to indicate where to stop matching following sibling elements.
     * @param filter A string containing a selector expression to match elements against.
     * @return {*}
     */
    nextUntil(selector : string) : JQuery;

    /**
     * Get all following siblings of each element up to but not including the element matched by the selector, DOM node, or jQuery object passed.
     * 
     * @param selector A string containing a selector expression to indicate where to stop matching following sibling elements.
     * @param filter A string containing a selector expression to match elements against.
     * @return {*}
     */
    nextUntil() : JQuery;

    /**
     * Get all following siblings of each element up to but not including the element matched by the selector, DOM node, or jQuery object passed.
     * 
     * @param {Element} element A DOM node or jQuery object indicating where to stop matching following sibling elements.
     * @param filter A string containing a selector expression to match elements against.
     * @return {*}
     */
    nextUntil(element : Element) : JQuery;

    /**
     * Get all following siblings of each element up to but not including the element matched by the selector, DOM node, or jQuery object passed.
     * 
     * @param {*} obj A DOM node or jQuery object indicating where to stop matching following sibling elements.
     * @param filter A string containing a selector expression to match elements against.
     * @return {*}
     */
    nextUntil(obj : JQuery) : JQuery;

    /**
     * Get the parent of each element in the current set of matched elements, optionally filtered by a selector.
     * 
     * @param selector A string containing a selector expression to match elements against.
     * @return {*}
     */
    parent() : JQuery;

    /**
     * Get the ancestors of each element in the current set of matched elements, optionally filtered by a selector.
     * 
     * @param selector A string containing a selector expression to match elements against.
     * @return {*}
     */
    parents() : JQuery;

    /**
     * Get the ancestors of each element in the current set of matched elements, up to but not including the element matched by the selector, DOM node, or jQuery object.
     * 
     * @param {string} selector A string containing a selector expression to indicate where to stop matching ancestor elements.
     * @param filter A string containing a selector expression to match elements against.
     * @return {*}
     */
    parentsUntil(selector : string) : JQuery;

    /**
     * Get the ancestors of each element in the current set of matched elements, up to but not including the element matched by the selector, DOM node, or jQuery object.
     * 
     * @param selector A string containing a selector expression to indicate where to stop matching ancestor elements.
     * @param filter A string containing a selector expression to match elements against.
     * @return {*}
     */
    parentsUntil() : JQuery;

    /**
     * Get the ancestors of each element in the current set of matched elements, up to but not including the element matched by the selector, DOM node, or jQuery object.
     * 
     * @param {Element} element A DOM node or jQuery object indicating where to stop matching ancestor elements.
     * @param filter A string containing a selector expression to match elements against.
     * @return {*}
     */
    parentsUntil(element : Element) : JQuery;

    /**
     * Get the ancestors of each element in the current set of matched elements, up to but not including the element matched by the selector, DOM node, or jQuery object.
     * 
     * @param {*} obj A DOM node or jQuery object indicating where to stop matching ancestor elements.
     * @param filter A string containing a selector expression to match elements against.
     * @return {*}
     */
    parentsUntil(obj : JQuery) : JQuery;

    /**
     * Get the immediately preceding sibling of each element in the set of matched elements, optionally filtered by a selector.
     * 
     * @param selector A string containing a selector expression to match elements against.
     * @return {*}
     */
    prev() : JQuery;

    /**
     * Get all preceding siblings of each element in the set of matched elements, optionally filtered by a selector.
     * 
     * @param selector A string containing a selector expression to match elements against.
     * @return {*}
     */
    prevAll() : JQuery;

    /**
     * Get all preceding siblings of each element up to but not including the element matched by the selector, DOM node, or jQuery object.
     * 
     * @param {string} selector A string containing a selector expression to indicate where to stop matching preceding sibling elements.
     * @param filter A string containing a selector expression to match elements against.
     * @return {*}
     */
    prevUntil(selector : string) : JQuery;

    /**
     * Get all preceding siblings of each element up to but not including the element matched by the selector, DOM node, or jQuery object.
     * 
     * @param selector A string containing a selector expression to indicate where to stop matching preceding sibling elements.
     * @param filter A string containing a selector expression to match elements against.
     * @return {*}
     */
    prevUntil() : JQuery;

    /**
     * Get all preceding siblings of each element up to but not including the element matched by the selector, DOM node, or jQuery object.
     * 
     * @param {Element} element A DOM node or jQuery object indicating where to stop matching preceding sibling elements.
     * @param filter A string containing a selector expression to match elements against.
     * @return {*}
     */
    prevUntil(element : Element) : JQuery;

    /**
     * Get all preceding siblings of each element up to but not including the element matched by the selector, DOM node, or jQuery object.
     * 
     * @param {*} obj A DOM node or jQuery object indicating where to stop matching preceding sibling elements.
     * @param filter A string containing a selector expression to match elements against.
     * @return {*}
     */
    prevUntil(obj : JQuery) : JQuery;

    /**
     * Get the siblings of each element in the set of matched elements, optionally filtered by a selector.
     * 
     * @param selector A string containing a selector expression to match elements against.
     * @return {*}
     */
    siblings() : JQuery;

    /**
     * Reduce the set of matched elements to a subset specified by a range of indices.
     * 
     * @param {number} start An integer indicating the 0-based position at which the elements begin to be selected. If negative, it indicates an offset from the end of the set.
     * @param end An integer indicating the 0-based position at which the elements stop being selected. If negative, it indicates an offset from the end of the set. If omitted, the range continues until the end of the set.
     * @return {*}
     */
    slice(start : number) : JQuery;

    /**
     * Show the queue of functions to be executed on the matched elements.
     * 
     * @param queueName A string containing the name of the queue. Defaults to fx, the standard effects queue.
     * @return {Array}
     */
    queue() : any[];

    /**
     * Specify a function to execute when the DOM is fully loaded.
     * 
     * @param {*} handler A function to execute after the DOM is ready.
     * @return {*}
     */
    ready(handler : () => any) : JQuery;

    /**
     * Load data from the server and place the returned HTML into the matched element.
     * 
     * @param {string} url A string containing the URL to which the request is sent.
     * @param {*} data A plain object or string that is sent to the server with the request.
     * @param {*} complete A callback function that is executed when the request completes.
     * @return {*}
     */
    load(url : string, data : any, complete : (p1: string, p2: string, p3: XMLHttpRequest) => any) : JQuery;

    /**
     * Set one or more attributes for the set of matched elements.
     * 
     * @param {string} attributeName The name of the attribute to set.
     * @param {number} value A value to set for the attribute.
     * @return {*}
     */
    attr(attributeName : string, value : number) : JQuery;

    /**
     * Set one or more attributes for the set of matched elements.
     * 
     * @param {string} attributeName The name of the attribute to set.
     * @param {*} func A function returning the value to set. this is the current element. Receives the index position of the element in the set and the old attribute value as arguments.
     * @return {*}
     */
    attr(attributeName : string, func : (p1: number, p2: string) => number) : JQuery;

    /**
     * Set one or more properties for the set of matched elements.
     * 
     * @param {string} propertyName The name of the property to set.
     * @param {number} value A value to set for the property.
     * @return {*}
     */
    prop(propertyName : string, value : number) : JQuery;

    /**
     * Set one or more properties for the set of matched elements.
     * 
     * @param {string} propertyName The name of the property to set.
     * @param {boolean} value A value to set for the property.
     * @return {*}
     */
    prop(propertyName : string, value : boolean) : JQuery;

    /**
     * Set the value of each element in the set of matched elements.
     * 
     * @param {Array} value A string of text, an array of strings or number corresponding to the value of each matched element to set as selected/checked.
     * @return {*}
     */
    val(value : string[]) : JQuery;

    /**
     * Set the value of each element in the set of matched elements.
     * 
     * @param {number} value A string of text, an array of strings or number corresponding to the value of each matched element to set as selected/checked.
     * @return {*}
     */
    val(value : number) : JQuery;

    /**
     * Set one or more CSS properties for the set of matched elements.
     * 
     * @param {string} propertyName A CSS property name.
     * @param {number} value A value to set for the property.
     * @return {*}
     */
    css(propertyName : string, value : number) : JQuery;

    /**
     * Set one or more CSS properties for the set of matched elements.
     * 
     * @param {string} propertyName A CSS property name.
     * @param {*} value A function returning the value to set. this is the current element. Receives the index position of the element in the set and the old value as arguments.
     * @return {*}
     */
    css(propertyName : string, value : (p1: number, p2: string) => number) : JQuery;

    /**
     * Set the CSS height of every matched element.
     * 
     * @param {string} value An integer representing the number of pixels, or an integer with an optional unit of measure appended (as a string).
     * @return {*}
     */
    height(value : string) : JQuery;

    /**
     * Set the CSS height of every matched element.
     * 
     * @param {*} func A function returning the height to set. Receives the index position of the element in the set and the old height as arguments. Within the function, this refers to the current element in the set.
     * @return {*}
     */
    height(func : (p1: number, p2: number) => string) : JQuery;

    /**
     * Sets the inner height on elements in the set of matched elements, including padding but not border.
     * 
     * @param value An integer representing the number of pixels, or an integer along with an optional unit of measure appended (as a string).
     * @param {string} height
     * @return {*}
     */
    innerHeight(height : string) : JQuery;

    /**
     * Sets the inner width on elements in the set of matched elements, including padding but not border.
     * 
     * @param value An integer representing the number of pixels, or an integer along with an optional unit of measure appended (as a string).
     * @param {string} width
     * @return {*}
     */
    innerWidth(width : string) : JQuery;

    /**
     * Sets the outer height on elements in the set of matched elements, including padding and border.
     * 
     * @param value An integer representing the number of pixels, or an integer along with an optional unit of measure appended (as a string).
     * @param {string} height
     * @return {*}
     */
    outerHeight(height : string) : JQuery;

    /**
     * Sets the outer width on elements in the set of matched elements, including padding and border.
     * 
     * @param value An integer representing the number of pixels, or an integer along with an optional unit of measure appended (as a string).
     * @param {string} width
     * @return {*}
     */
    outerWidth(width : string) : JQuery;

    /**
     * Set the CSS width of each element in the set of matched elements.
     * 
     * @param {string} value An integer representing the number of pixels, or an integer along with an optional unit of measure appended (as a string).
     * @return {*}
     */
    width(value : string) : JQuery;

    /**
     * Set the CSS width of each element in the set of matched elements.
     * 
     * @param {*} func A function returning the width to set. Receives the index position of the element in the set and the old width as arguments. Within the function, this refers to the current element in the set.
     * @return {*}
     */
    width(func : (p1: number, p2: number) => string) : JQuery;

    /**
     * Perform a custom animation of a set of CSS properties.
     * 
     * @param {*} properties An object of CSS properties and values that the animation will move toward.
     * @param {number} duration A string or number determining how long the animation will run.
     * @param {Function} complete A function to call once the animation is complete.
     * @return {*}
     */
    animate(properties : any, duration : number, complete : Function) : JQuery;

    /**
     * Perform a custom animation of a set of CSS properties.
     * 
     * @param {*} properties An object of CSS properties and values that the animation will move toward.
     * @param {number} duration A string or number determining how long the animation will run.
     * @param {string} easing A string indicating which easing function to use for the transition. (default: swing)
     * @param {Function} complete A function to call once the animation is complete.
     * @return {*}
     */
    animate(properties : any, duration : number, easing : string, complete : Function) : JQuery;

    /**
     * Display the matched elements by fading them to opaque.
     * 
     * @param {string} duration A string or number determining how long the animation will run.
     * @param {Function} complete A function to call once the animation is complete.
     * @return {*}
     */
    fadeIn(duration : string, complete : Function) : JQuery;

    /**
     * Display the matched elements by fading them to opaque.
     * 
     * @param {string} duration A string or number determining how long the animation will run.
     * @param {string} easing A string indicating which easing function to use for the transition.
     * @param {Function} complete A function to call once the animation is complete.
     * @return {*}
     */
    fadeIn(duration : string, easing : string, complete : Function) : JQuery;

    /**
     * Hide the matched elements by fading them to transparent.
     * 
     * @param {string} duration A string or number determining how long the animation will run.
     * @param {Function} complete A function to call once the animation is complete.
     * @return {*}
     */
    fadeOut(duration : string, complete : Function) : JQuery;

    /**
     * Hide the matched elements by fading them to transparent.
     * 
     * @param {string} duration A string or number determining how long the animation will run.
     * @param {string} easing A string indicating which easing function to use for the transition.
     * @param {Function} complete A function to call once the animation is complete.
     * @return {*}
     */
    fadeOut(duration : string, easing : string, complete : Function) : JQuery;

    /**
     * Adjust the opacity of the matched elements.
     * 
     * @param {number} duration A string or number determining how long the animation will run.
     * @param {number} opacity A number between 0 and 1 denoting the target opacity.
     * @param {Function} complete A function to call once the animation is complete.
     * @return {*}
     */
    fadeTo(duration : number, opacity : number, complete : Function) : JQuery;

    /**
     * Adjust the opacity of the matched elements.
     * 
     * @param {number} duration A string or number determining how long the animation will run.
     * @param {number} opacity A number between 0 and 1 denoting the target opacity.
     * @param {string} easing A string indicating which easing function to use for the transition.
     * @param {Function} complete A function to call once the animation is complete.
     * @return {*}
     */
    fadeTo(duration : number, opacity : number, easing : string, complete : Function) : JQuery;

    /**
     * Display or hide the matched elements by animating their opacity.
     * 
     * @param {string} duration A string or number determining how long the animation will run.
     * @param {Function} complete A function to call once the animation is complete.
     * @return {*}
     */
    fadeToggle(duration : string, complete : Function) : JQuery;

    /**
     * Display or hide the matched elements by animating their opacity.
     * 
     * @param {string} duration A string or number determining how long the animation will run.
     * @param {string} easing A string indicating which easing function to use for the transition.
     * @param {Function} complete A function to call once the animation is complete.
     * @return {*}
     */
    fadeToggle(duration : string, easing : string, complete : Function) : JQuery;

    /**
     * Hide the matched elements.
     * 
     * @param {string} duration A string or number determining how long the animation will run.
     * @param {Function} complete A function to call once the animation is complete.
     * @return {*}
     */
    hide(duration : string, complete : Function) : JQuery;

    /**
     * Hide the matched elements.
     * 
     * @param {string} duration A string or number determining how long the animation will run.
     * @param {string} easing A string indicating which easing function to use for the transition.
     * @param {Function} complete A function to call once the animation is complete.
     * @return {*}
     */
    hide(duration : string, easing : string, complete : Function) : JQuery;

    /**
     * Display the matched elements.
     * 
     * @param {string} duration A string or number determining how long the animation will run.
     * @param {Function} complete A function to call once the animation is complete.
     * @return {*}
     */
    show(duration : string, complete : Function) : JQuery;

    /**
     * Display the matched elements.
     * 
     * @param {string} duration A string or number determining how long the animation will run.
     * @param {string} easing A string indicating which easing function to use for the transition.
     * @param {Function} complete A function to call once the animation is complete.
     * @return {*}
     */
    show(duration : string, easing : string, complete : Function) : JQuery;

    /**
     * Display the matched elements with a sliding motion.
     * 
     * @param {string} duration A string or number determining how long the animation will run.
     * @param {Function} complete A function to call once the animation is complete.
     * @return {*}
     */
    slideDown(duration : string, complete : Function) : JQuery;

    /**
     * Display the matched elements with a sliding motion.
     * 
     * @param {string} duration A string or number determining how long the animation will run.
     * @param {string} easing A string indicating which easing function to use for the transition.
     * @param {Function} complete A function to call once the animation is complete.
     * @return {*}
     */
    slideDown(duration : string, easing : string, complete : Function) : JQuery;

    /**
     * Display or hide the matched elements with a sliding motion.
     * 
     * @param {string} duration A string or number determining how long the animation will run.
     * @param {Function} complete A function to call once the animation is complete.
     * @return {*}
     */
    slideToggle(duration : string, complete : Function) : JQuery;

    /**
     * Display or hide the matched elements with a sliding motion.
     * 
     * @param {string} duration A string or number determining how long the animation will run.
     * @param {string} easing A string indicating which easing function to use for the transition.
     * @param {Function} complete A function to call once the animation is complete.
     * @return {*}
     */
    slideToggle(duration : string, easing : string, complete : Function) : JQuery;

    /**
     * Hide the matched elements with a sliding motion.
     * 
     * @param {string} duration A string or number determining how long the animation will run.
     * @param {Function} complete A function to call once the animation is complete.
     * @return {*}
     */
    slideUp(duration : string, complete : Function) : JQuery;

    /**
     * Hide the matched elements with a sliding motion.
     * 
     * @param {string} duration A string or number determining how long the animation will run.
     * @param {string} easing A string indicating which easing function to use for the transition.
     * @param {Function} complete A function to call once the animation is complete.
     * @return {*}
     */
    slideUp(duration : string, easing : string, complete : Function) : JQuery;

    /**
     * Display or hide the matched elements.
     * 
     * @param {string} duration A string or number determining how long the animation will run.
     * @param {Function} complete A function to call once the animation is complete.
     * @return {*}
     */
    toggle(duration : string, complete : Function) : JQuery;

    /**
     * Display or hide the matched elements.
     * 
     * @param {string} duration A string or number determining how long the animation will run.
     * @param {string} easing A string indicating which easing function to use for the transition.
     * @param {Function} complete A function to call once the animation is complete.
     * @return {*}
     */
    toggle(duration : string, easing : string, complete : Function) : JQuery;

    /**
     * Execute all handlers and behaviors attached to the matched elements for the given event type.
     * 
     * @param {string} eventType A string containing a JavaScript event type, such as click or submit.
     * @param {*} extraParameters Additional parameters to pass along to the event handler.
     * @return {*}
     */
    trigger(eventType : string, extraParameters : any) : JQuery;

    /**
     * Execute all handlers and behaviors attached to the matched elements for the given event type.
     * 
     * @param {*} event A jQuery.Event object.
     * @param {*} extraParameters Additional parameters to pass along to the event handler.
     * @return {*}
     */
    trigger(event : JQueryEventObject, extraParameters : any) : JQuery;

    /**
     * Insert content, specified by the parameter, after each element in the set of matched elements.
     * 
     * param func A function that returns an HTML string, DOM element(s), or jQuery object to insert after each element in the set of matched elements. Receives the index position of the element in the set as an argument. Within the function, this refers to the current element in the set.
     * @param {*} func
     * @return {*}
     */
    after(func : (p1: number, p2: string) => JQuery) : JQuery;

    /**
     * Insert content, specified by the parameter, after each element in the set of matched elements.
     * 
     * param func A function that returns an HTML string, DOM element(s), or jQuery object to insert after each element in the set of matched elements. Receives the index position of the element in the set as an argument. Within the function, this refers to the current element in the set.
     * @param {*} func
     * @return {*}
     */
    after(func : (p1: number, p2: string) => Element) : JQuery;

    /**
     * Insert content, specified by the parameter, to the end of each element in the set of matched elements.
     * 
     * param func A function that returns an HTML string, DOM element(s), or jQuery object to insert at the end of each element in the set of matched elements. Receives the index position of the element in the set and the old HTML value of the element as arguments. Within the function, this refers to the current element in the set.
     * @param {*} func
     * @return {*}
     */
    append(func : (p1: number, p2: string) => JQuery) : JQuery;

    /**
     * Insert content, specified by the parameter, to the end of each element in the set of matched elements.
     * 
     * param func A function that returns an HTML string, DOM element(s), or jQuery object to insert at the end of each element in the set of matched elements. Receives the index position of the element in the set and the old HTML value of the element as arguments. Within the function, this refers to the current element in the set.
     * @param {*} func
     * @return {*}
     */
    append(func : (p1: number, p2: string) => Element) : JQuery;

    /**
     * Insert content, specified by the parameter, before each element in the set of matched elements.
     * 
     * param func A function that returns an HTML string, DOM element(s), or jQuery object to insert before each element in the set of matched elements. Receives the index position of the element in the set as an argument. Within the function, this refers to the current element in the set.
     * @param {*} func
     * @return {*}
     */
    before(func : (p1: number, p2: string) => JQuery) : JQuery;

    /**
     * Insert content, specified by the parameter, before each element in the set of matched elements.
     * 
     * param func A function that returns an HTML string, DOM element(s), or jQuery object to insert before each element in the set of matched elements. Receives the index position of the element in the set as an argument. Within the function, this refers to the current element in the set.
     * @param {*} func
     * @return {*}
     */
    before(func : (p1: number, p2: string) => Element) : JQuery;

    /**
     * Insert content, specified by the parameter, to the beginning of each element in the set of matched elements.
     * 
     * param func A function that returns an HTML string, DOM element(s), or jQuery object to insert at the beginning of each element in the set of matched elements. Receives the index position of the element in the set and the old HTML value of the element as arguments. Within the function, this refers to the current element in the set.
     * @param {*} func
     * @return {*}
     */
    prepend(func : (p1: number, p2: string) => JQuery) : JQuery;

    /**
     * Insert content, specified by the parameter, to the beginning of each element in the set of matched elements.
     * 
     * param func A function that returns an HTML string, DOM element(s), or jQuery object to insert at the beginning of each element in the set of matched elements. Receives the index position of the element in the set and the old HTML value of the element as arguments. Within the function, this refers to the current element in the set.
     * @param {*} func
     * @return {*}
     */
    prepend(func : (p1: number, p2: string) => Element) : JQuery;

    /**
     * Replace each element in the set of matched elements with the provided new content and return the set of elements that was removed.
     * 
     * param func A function that returns content with which to replace the set of matched elements.
     * @param {*} func
     * @return {*}
     */
    replaceWith(func : () => JQuery) : JQuery;

    /**
     * Set the content of each element in the set of matched elements to the specified text.
     * 
     * @param {number} text The text to set as the content of each matched element. When Number or Boolean is supplied, it will be converted to a String representation.
     * @return {*}
     */
    text(text : number) : JQuery;

    /**
     * Set the content of each element in the set of matched elements to the specified text.
     * 
     * @param {boolean} text The text to set as the content of each matched element. When Number or Boolean is supplied, it will be converted to a String representation.
     * @return {*}
     */
    text(text : boolean) : JQuery;

    /**
     * Wrap an HTML structure around each element in the set of matched elements.
     * 
     * @param {string} wrappingElement A selector, element, HTML string, or jQuery object specifying the structure to wrap around the matched elements.
     * @return {*}
     */
    wrap(wrappingElement : string) : JQuery;

    /**
     * Wrap an HTML structure around each element in the set of matched elements.
     * 
     * @param {Element} wrappingElement A selector, element, HTML string, or jQuery object specifying the structure to wrap around the matched elements.
     * @return {*}
     */
    wrap(wrappingElement : Element) : JQuery;

    /**
     * Wrap an HTML structure around each element in the set of matched elements.
     * 
     * @param {*} func A callback function returning the HTML content or jQuery object to wrap around the matched elements. Receives the index position of the element in the set as an argument. Within the function, this refers to the current element in the set.
     * @return {*}
     */
    wrap(func : (p1: number) => JQuery) : JQuery;

    /**
     * Wrap an HTML structure around all elements in the set of matched elements.
     * 
     * @param {Element} wrappingElement A selector, element, HTML string, or jQuery object specifying the structure to wrap around the matched elements.
     * @return {*}
     */
    wrapAll(wrappingElement : Element) : JQuery;

    /**
     * Wrap an HTML structure around all elements in the set of matched elements.
     * 
     * @param {string} wrappingElement A selector, element, HTML string, or jQuery object specifying the structure to wrap around the matched elements.
     * @return {*}
     */
    wrapAll(wrappingElement : string) : JQuery;

    /**
     * Wrap an HTML structure around the content of each element in the set of matched elements.
     * 
     * @param {string} wrappingElement An HTML snippet, selector expression, jQuery object, or DOM element specifying the structure to wrap around the content of the matched elements.
     * @return {*}
     */
    wrapInner(wrappingElement : string) : JQuery;

    /**
     * Wrap an HTML structure around the content of each element in the set of matched elements.
     * 
     * @param {Element} wrappingElement An HTML snippet, selector expression, jQuery object, or DOM element specifying the structure to wrap around the content of the matched elements.
     * @return {*}
     */
    wrapInner(wrappingElement : Element) : JQuery;

    /**
     * Search for a given element from among the matched elements.
     * 
     * @param {*} selector A selector representing a jQuery collection in which to look for an element.
     * @return {number}
     */
    index(selector : JQuery) : number;

    /**
     * Search for a given element from among the matched elements.
     * 
     * @param {Element} selector A selector representing a jQuery collection in which to look for an element.
     * @return {number}
     */
    index(selector : Element) : number;

    /**
     * Remove elements from the set of matched elements.
     * 
     * @param {Array} elements One or more DOM elements to remove from the matched set.
     * @return {*}
     */
    not(elements : Element[]) : JQuery;

    /**
     * Load data from the server and place the returned HTML into the matched element.
     * 
     * @param {string} url A string containing the URL to which the request is sent.
     * @param {*} data A plain object or string that is sent to the server with the request.
     * @param complete A callback function that is executed when the request completes.
     * @return {*}
     */
    load(url : string, data : any) : JQuery;

    /**
     * Perform a custom animation of a set of CSS properties.
     * 
     * @param {*} properties An object of CSS properties and values that the animation will move toward.
     * @param {number} duration A string or number determining how long the animation will run.
     * @param complete A function to call once the animation is complete.
     * @return {*}
     */
    animate(properties : any, duration : number) : JQuery;

    /**
     * Perform a custom animation of a set of CSS properties.
     * 
     * @param {*} properties An object of CSS properties and values that the animation will move toward.
     * @param {number} duration A string or number determining how long the animation will run.
     * @param {string} easing A string indicating which easing function to use for the transition. (default: swing)
     * @param complete A function to call once the animation is complete.
     * @return {*}
     */
    animate(properties : any, duration : number, easing : string) : JQuery;

    /**
     * Display the matched elements by fading them to opaque.
     * 
     * @param {string} duration A string or number determining how long the animation will run.
     * @param complete A function to call once the animation is complete.
     * @return {*}
     */
    fadeIn(duration : string) : JQuery;

    /**
     * Display the matched elements by fading them to opaque.
     * 
     * @param {string} duration A string or number determining how long the animation will run.
     * @param {string} easing A string indicating which easing function to use for the transition.
     * @param complete A function to call once the animation is complete.
     * @return {*}
     */
    fadeIn(duration : string, easing : string) : JQuery;

    /**
     * Hide the matched elements by fading them to transparent.
     * 
     * @param {string} duration A string or number determining how long the animation will run.
     * @param complete A function to call once the animation is complete.
     * @return {*}
     */
    fadeOut(duration : string) : JQuery;

    /**
     * Hide the matched elements by fading them to transparent.
     * 
     * @param {string} duration A string or number determining how long the animation will run.
     * @param {string} easing A string indicating which easing function to use for the transition.
     * @param complete A function to call once the animation is complete.
     * @return {*}
     */
    fadeOut(duration : string, easing : string) : JQuery;

    /**
     * Adjust the opacity of the matched elements.
     * 
     * @param {number} duration A string or number determining how long the animation will run.
     * @param {number} opacity A number between 0 and 1 denoting the target opacity.
     * @param complete A function to call once the animation is complete.
     * @return {*}
     */
    fadeTo(duration : number, opacity : number) : JQuery;

    /**
     * Adjust the opacity of the matched elements.
     * 
     * @param {number} duration A string or number determining how long the animation will run.
     * @param {number} opacity A number between 0 and 1 denoting the target opacity.
     * @param {string} easing A string indicating which easing function to use for the transition.
     * @param complete A function to call once the animation is complete.
     * @return {*}
     */
    fadeTo(duration : number, opacity : number, easing : string) : JQuery;

    /**
     * Display or hide the matched elements by animating their opacity.
     * 
     * @param {string} duration A string or number determining how long the animation will run.
     * @param complete A function to call once the animation is complete.
     * @return {*}
     */
    fadeToggle(duration : string) : JQuery;

    /**
     * Display or hide the matched elements by animating their opacity.
     * 
     * @param {string} duration A string or number determining how long the animation will run.
     * @param {string} easing A string indicating which easing function to use for the transition.
     * @param complete A function to call once the animation is complete.
     * @return {*}
     */
    fadeToggle(duration : string, easing : string) : JQuery;

    /**
     * Hide the matched elements.
     * 
     * @param {string} duration A string or number determining how long the animation will run.
     * @param complete A function to call once the animation is complete.
     * @return {*}
     */
    hide(duration : string) : JQuery;

    /**
     * Hide the matched elements.
     * 
     * @param {string} duration A string or number determining how long the animation will run.
     * @param {string} easing A string indicating which easing function to use for the transition.
     * @param complete A function to call once the animation is complete.
     * @return {*}
     */
    hide(duration : string, easing : string) : JQuery;

    /**
     * Display the matched elements.
     * 
     * @param {string} duration A string or number determining how long the animation will run.
     * @param complete A function to call once the animation is complete.
     * @return {*}
     */
    show(duration : string) : JQuery;

    /**
     * Display the matched elements.
     * 
     * @param {string} duration A string or number determining how long the animation will run.
     * @param {string} easing A string indicating which easing function to use for the transition.
     * @param complete A function to call once the animation is complete.
     * @return {*}
     */
    show(duration : string, easing : string) : JQuery;

    /**
     * Display the matched elements with a sliding motion.
     * 
     * @param {string} duration A string or number determining how long the animation will run.
     * @param complete A function to call once the animation is complete.
     * @return {*}
     */
    slideDown(duration : string) : JQuery;

    /**
     * Display the matched elements with a sliding motion.
     * 
     * @param {string} duration A string or number determining how long the animation will run.
     * @param {string} easing A string indicating which easing function to use for the transition.
     * @param complete A function to call once the animation is complete.
     * @return {*}
     */
    slideDown(duration : string, easing : string) : JQuery;

    /**
     * Display or hide the matched elements with a sliding motion.
     * 
     * @param {string} duration A string or number determining how long the animation will run.
     * @param complete A function to call once the animation is complete.
     * @return {*}
     */
    slideToggle(duration : string) : JQuery;

    /**
     * Display or hide the matched elements with a sliding motion.
     * 
     * @param {string} duration A string or number determining how long the animation will run.
     * @param {string} easing A string indicating which easing function to use for the transition.
     * @param complete A function to call once the animation is complete.
     * @return {*}
     */
    slideToggle(duration : string, easing : string) : JQuery;

    /**
     * Hide the matched elements with a sliding motion.
     * 
     * @param {string} duration A string or number determining how long the animation will run.
     * @param complete A function to call once the animation is complete.
     * @return {*}
     */
    slideUp(duration : string) : JQuery;

    /**
     * Hide the matched elements with a sliding motion.
     * 
     * @param {string} duration A string or number determining how long the animation will run.
     * @param {string} easing A string indicating which easing function to use for the transition.
     * @param complete A function to call once the animation is complete.
     * @return {*}
     */
    slideUp(duration : string, easing : string) : JQuery;

    /**
     * Display or hide the matched elements.
     * 
     * @param {string} duration A string or number determining how long the animation will run.
     * @param complete A function to call once the animation is complete.
     * @return {*}
     */
    toggle(duration : string) : JQuery;

    /**
     * Display or hide the matched elements.
     * 
     * @param {string} duration A string or number determining how long the animation will run.
     * @param {string} easing A string indicating which easing function to use for the transition.
     * @param complete A function to call once the animation is complete.
     * @return {*}
     */
    toggle(duration : string, easing : string) : JQuery;
}

interface JQuerySupport {
    ajax? : boolean;

    boxModel? : boolean;

    changeBubbles? : boolean;

    checkClone? : boolean;

    checkOn? : boolean;

    cors? : boolean;

    cssFloat? : boolean;

    hrefNormalized? : boolean;

    htmlSerialize? : boolean;

    leadingWhitespace? : boolean;

    noCloneChecked? : boolean;

    noCloneEvent? : boolean;

    opacity? : boolean;

    optDisabled? : boolean;

    optSelected? : boolean;

    scriptEval() : boolean;

    style? : boolean;

    submitBubbles? : boolean;

    tbody? : boolean;
}

/**
 * Elements in the array returned by serializeArray()
 * @class
 * @extends Object
 */
interface JQuerySerializeArrayElement {
    name : string;

    value : string;
}

/**
 * Interface for the JQuery callback
 * @class
 * @extends Object
 */
interface JQueryCallback {
    /**
     * Add a callback or a collection of callbacks to a callback list.
     * 
     * @param {Function} callbacks A function, or array of functions, that are to be added to the callback list.
     * @return {*}
     */
    add(callbacks : Function) : JQueryCallback;

    /**
     * Add a callback or a collection of callbacks to a callback list.
     * 
     * @param {Array} callbacks A function, or array of functions, that are to be added to the callback list.
     * @return {*}
     */
    add(callbacks : Function[]) : JQueryCallback;

    /**
     * Disable a callback list from doing anything more.
     * @return {*}
     */
    disable() : JQueryCallback;

    /**
     * Determine if the callbacks list has been disabled.
     * @return {boolean}
     */
    disabled() : boolean;

    /**
     * Remove all of the callbacks from a list.
     * @return {*}
     */
    empty() : JQueryCallback;

    /**
     * Call all of the callbacks with the given arguments
     * 
     * @param {Array} arguments The argument or list of arguments to pass back to the callback list.
     * @return {*}
     */
    fire(...__arguments : any[]) : JQueryCallback;

    /**
     * Determine if the callbacks have already been called at least once.
     * @return {boolean}
     */
    fired() : boolean;

    /**
     * Call all callbacks in a list with the given context and arguments.
     * 
     * @param {*} context A reference to the context in which the callbacks in the list should be fired.
     * @param arguments An argument, or array of arguments, to pass to the callbacks in the list.
     * @param {Array} args
     * @return {*}
     */
    fireWith(context : any, args : any[]) : JQueryCallback;

    /**
     * Determine whether a supplied callback is in a list
     * 
     * @param {Function} callback The callback to search for.
     * @return {boolean}
     */
    has(callback : Function) : boolean;

    /**
     * Lock a callback list in its current state.
     * @return {*}
     */
    lock() : JQueryCallback;

    /**
     * Determine if the callbacks list has been locked.
     * @return {boolean}
     */
    locked() : boolean;

    /**
     * Remove a callback or a collection of callbacks from a callback list.
     * 
     * @param {Function} callbacks A function, or array of functions, that are to be removed from the callback list.
     * @return {*}
     */
    remove(callbacks : Function) : JQueryCallback;

    /**
     * Remove a callback or a collection of callbacks from a callback list.
     * 
     * @param {Array} callbacks A function, or array of functions, that are to be removed from the callback list.
     * @return {*}
     */
    remove(callbacks : Function[]) : JQueryCallback;

    /**
     * Call all callbacks in a list with the given context and arguments.
     * 
     * @param {*} context A reference to the context in which the callbacks in the list should be fired.
     * @param arguments An argument, or array of arguments, to pass to the callbacks in the list.
     * @return {*}
     */
    fireWith(context : any) : JQueryCallback;

    /**
     * Call all callbacks in a list with the given context and arguments.
     * 
     * @param context A reference to the context in which the callbacks in the list should be fired.
     * @param arguments An argument, or array of arguments, to pass to the callbacks in the list.
     * @return {*}
     */
    fireWith() : JQueryCallback;
}

declare var jQuery : any;

declare var $ : any;

declare var jquery : any;


/**
 * Allows jQuery Promises to interop with non-jQuery promises
 * @class
 * @extends Object
 */
interface JQueryGenericPromise<T> {
    /**
     * Add handlers to be called when the Deferred object is resolved, rejected, or still in progress.
     * 
     * @param {*} doneFilter A function that is called when the Deferred is resolved.
     * @param {*} failFilter An optional function that is called when the Deferred is rejected.
     * @param {*} progressFilter
     * @return {*}
     */
    then<U>(doneFilter : (p1: T, p2: any) => U, failFilter : (p1: any) => any, progressFilter : (p1: any) => any) : JQueryPromise<U>;

    /**
     * Add handlers to be called when the Deferred object is resolved, rejected, or still in progress.
     * 
     * @param {*} doneFilter A function that is called when the Deferred is resolved.
     * @param {*} failFilter An optional function that is called when the Deferred is rejected.
     * @param {*} progressFilter
     * @return {*}
     */
    then(doneFilter : (p1: T, p2: any) => void, failFilter : (p1: any) => any, progressFilter : (p1: any) => any) : JQueryPromise<void>;

    /**
     * Add handlers to be called when the Deferred object is resolved, rejected, or still in progress.
     * 
     * @param {*} doneFilter A function that is called when the Deferred is resolved.
     * @param {*} failFilter An optional function that is called when the Deferred is rejected.
     * @return {*}
     */
    then<U>(doneFilter : (p1: T, p2: any) => U, failFilter : (p1: any) => any) : JQueryPromise<U>;

    /**
     * Add handlers to be called when the Deferred object is resolved, rejected, or still in progress.
     * 
     * @param {*} doneFilter A function that is called when the Deferred is resolved.
     * @param failFilter An optional function that is called when the Deferred is rejected.
     * @return {*}
     */
    then<U>(doneFilter : (p1: T, p2: any) => U) : JQueryPromise<U>;

    /**
     * Add handlers to be called when the Deferred object is resolved, rejected, or still in progress.
     * 
     * @param {*} doneFilter A function that is called when the Deferred is resolved.
     * @param {*} failFilter An optional function that is called when the Deferred is rejected.
     * @return {*}
     */
    then(doneFilter : (p1: T, p2: any) => void, failFilter : (p1: any) => any) : JQueryPromise<void>;

    /**
     * Add handlers to be called when the Deferred object is resolved, rejected, or still in progress.
     * 
     * @param {*} doneFilter A function that is called when the Deferred is resolved.
     * @param failFilter An optional function that is called when the Deferred is rejected.
     * @return {*}
     */
    then(doneFilter : (p1: T, p2: any) => void) : JQueryPromise<void>;

    /**
     * Add handlers to be called when the Deferred object is resolved, rejected, or still in progress.
     * 
     * @param {*} doneFilter A function that is called when the Deferred is resolved.
     * @param {*} failFilter An optional function that is called when the Deferred is rejected.
     * @param {*} progressFilter
     * @return {*}
     */
    then<U>(doneFilter : () => U, failFilter : (p1: any) => any, progressFilter : (p1: any) => any) : JQueryPromise<U>;

    /**
     * Add handlers to be called when the Deferred object is resolved, rejected, or still in progress.
     * 
     * @param {() => void} doneFilter A function that is called when the Deferred is resolved.
     * @param {*} failFilter An optional function that is called when the Deferred is rejected.
     * @param {*} progressFilter
     * @return {*}
     */
    then(doneFilter : () => void, failFilter : (p1: any) => any, progressFilter : (p1: any) => any) : JQueryPromise<void>;

    /**
     * Add handlers to be called when the Deferred object is resolved, rejected, or still in progress.
     * 
     * @param {*} doneFilter A function that is called when the Deferred is resolved.
     * @param {*} failFilter An optional function that is called when the Deferred is rejected.
     * @return {*}
     */
    then<U>(doneFilter : () => U, failFilter : (p1: any) => any) : JQueryPromise<U>;

    /**
     * Add handlers to be called when the Deferred object is resolved, rejected, or still in progress.
     * 
     * @param {*} doneFilter A function that is called when the Deferred is resolved.
     * @param failFilter An optional function that is called when the Deferred is rejected.
     * @return {*}
     */
    then<U>(doneFilter : () => U) : JQueryPromise<U>;

    /**
     * Add handlers to be called when the Deferred object is resolved, rejected, or still in progress.
     * 
     * @param {() => void} doneFilter A function that is called when the Deferred is resolved.
     * @param {*} failFilter An optional function that is called when the Deferred is rejected.
     * @return {*}
     */
    then(doneFilter : () => void, failFilter : (p1: any) => any) : JQueryPromise<void>;

    /**
     * Add handlers to be called when the Deferred object is resolved, rejected, or still in progress.
     * 
     * @param {() => void} doneFilter A function that is called when the Deferred is resolved.
     * @param failFilter An optional function that is called when the Deferred is rejected.
     * @return {*}
     */
    then(doneFilter : () => void) : JQueryPromise<void>;

    /**
     * Add handlers to be called when the Deferred object is resolved, rejected, or still in progress.
     * 
     * @param {*} doneFilter A function that is called when the Deferred is resolved.
     * @param {*} failFilter An optional function that is called when the Deferred is rejected.
     * @param {*} progressFilter
     * @return {*}
     */
    then<U>(doneFilter : (p1: T, p2: any) => JQueryPromise<U>, failFilter : (p1: any) => any, progressFilter : (p1: any) => any) : JQueryPromise<U>;

    /**
     * Add handlers to be called when the Deferred object is resolved, rejected, or still in progress.
     * 
     * @param {*} doneFilter A function that is called when the Deferred is resolved.
     * @param {*} failFilter An optional function that is called when the Deferred is rejected.
     * @return {*}
     */
    then<U>(doneFilter : (p1: T, p2: any) => JQueryPromise<U>, failFilter : (p1: any) => any) : JQueryPromise<U>;

    /**
     * Add handlers to be called when the Deferred object is resolved, rejected, or still in progress.
     * 
     * @param {*} doneFilter A function that is called when the Deferred is resolved.
     * @param failFilter An optional function that is called when the Deferred is rejected.
     * @return {*}
     */
    then<U>(doneFilter : (p1: T, p2: any) => JQueryPromise<U>) : JQueryPromise<U>;
}

/**
 * Interface of the JQuery extension of the W3C event object
 * @class
 * @extends Event
 */
interface BaseJQueryEventObject extends Event {
    currentTarget : Element;

    data : any;

    delegateTarget : Element;

    isDefaultPrevented() : boolean;

    isImmediatePropagationStopped() : boolean;

    isPropagationStopped() : boolean;

    namespace : string;

    originalEvent : Event;

    preventDefault();

    relatedTarget : Element;

    result : any;

    stopImmediatePropagation();

    stopPropagation();

    target : Element;

    pageX : number;

    pageY : number;

    which : number;

    metaKey : boolean;
}

/**
 * Interface for the jqXHR object
 * @class
 * @extends XMLHttpRequest
 */
interface JQueryXHR extends XMLHttpRequest {
    /**
     * The .overrideMimeType() method may be used in the beforeSend() callback function, for example, to modify the response content-type header. As of jQuery 1.5.1, the jqXHR object also contains the overrideMimeType() method (it was available in jQuery 1.4.x, as well, but was temporarily removed in jQuery 1.5).
     * @param {string} mimeType
     */
    overrideMimeType(mimeType : string);

    /**
     * Cancel the request.
     * 
     * @param {string} statusText A string passed as the textStatus parameter for the done callback. Default value: "canceled"
     */
    abort(statusText : string);

    /**
     * Incorporates the functionality of the .done() and .fail() methods, allowing (as of jQuery 1.8) the underlying Promise to be manipulated. Refer to deferred.then() for implementation details.
     * @param {*} doneCallback
     * @param {*} failCallback
     * @return {*}
     */
    then<R>(doneCallback : (p1: any, p2: string, p3: JQueryXHR) => R, failCallback : (p1: JQueryXHR, p2: string, p3: any) => void) : JQueryPromise<R>;

    /**
     * Property containing the parsed response if the response Content-Type is json
     */
    responseJSON? : any;

    /**
     * A function to be called if the request fails.
     * @param {*} xhr
     * @param {string} textStatus
     * @param {string} errorThrown
     */
    error(xhr : JQueryXHR, textStatus : string, errorThrown : string);

    /**
     * Determine the current state of a Deferred object.
     * @return {string}
     */
    state() : string;

    /**
     * Add handlers to be called when the Deferred object is either resolved or rejected.
     * 
     * @param alwaysCallbacks1 A function, or array of functions, that is called when the Deferred is resolved or rejected.
     * @param alwaysCallbacks2 Optional additional functions, or arrays of functions, that are called when the Deferred is resolved or rejected.
     * @param {*} alwaysCallback1
     * @param {Array} alwaysCallbacksN
     * @return {*}
     */
    always(alwaysCallback1 : JQueryPromiseCallback<any>, ...alwaysCallbacksN : any[]) : JQueryPromise<any>;

    /**
     * Add handlers to be called when the Deferred object is resolved.
     * 
     * @param doneCallbacks1 A function, or array of functions, that are called when the Deferred is resolved.
     * @param doneCallbacks2 Optional additional functions, or arrays of functions, that are called when the Deferred is resolved.
     * @param {*} doneCallback1
     * @param {Array} doneCallbackN
     * @return {*}
     */
    done(doneCallback1 : JQueryPromiseCallback<any>, ...doneCallbackN : any[]) : JQueryPromise<any>;

    /**
     * Add handlers to be called when the Deferred object is rejected.
     * 
     * @param failCallbacks1 A function, or array of functions, that are called when the Deferred is rejected.
     * @param failCallbacks2 Optional additional functions, or arrays of functions, that are called when the Deferred is rejected.
     * @param {*} failCallback1
     * @param {Array} failCallbacksN
     * @return {*}
     */
    fail(failCallback1 : JQueryPromiseCallback<any>, ...failCallbacksN : any[]) : JQueryPromise<any>;

    /**
     * Add handlers to be called when the Deferred object generates progress notifications.
     * 
     * @param progressCallbacks A function, or array of functions, to be called when the Deferred generates progress notifications.
     * @param {*} progressCallback1
     * @param {Array} progressCallbackN
     * @return {*}
     */
    progress(progressCallback1 : JQueryPromiseCallback<any>, ...progressCallbackN : any[]) : JQueryPromise<any>;

    pipe(doneFilter : (p1: any) => any, failFilter : (p1: any) => any, progressFilter : (p1: any) => any) : JQueryPromise<any>;

    /**
     * Return a Deferred's Promise object.
     * 
     * @param {*} target Object onto which the promise methods have to be attached
     * @return {*}
     */
    promise(target : any) : JQueryPromise<any>;

    /**
     * Cancel the request.
     * 
     * @param statusText A string passed as the textStatus parameter for the done callback. Default value: "canceled"
     */
    abort();

    /**
     * Incorporates the functionality of the .done() and .fail() methods, allowing (as of jQuery 1.8) the underlying Promise to be manipulated. Refer to deferred.then() for implementation details.
     * @param {*} doneCallback
     * @return {*}
     */
    then<R>(doneCallback : (p1: any, p2: string, p3: JQueryXHR) => R) : JQueryPromise<R>;

    /**
     * Add handlers to be called when the Deferred object is either resolved or rejected.
     * 
     * @param alwaysCallbacks1 A function, or array of functions, that is called when the Deferred is resolved or rejected.
     * @param alwaysCallbacks2 Optional additional functions, or arrays of functions, that are called when the Deferred is resolved or rejected.
     * @return {*}
     */
    always() : JQueryPromise<any>;

    /**
     * Add handlers to be called when the Deferred object is resolved.
     * 
     * @param doneCallbacks1 A function, or array of functions, that are called when the Deferred is resolved.
     * @param doneCallbacks2 Optional additional functions, or arrays of functions, that are called when the Deferred is resolved.
     * @return {*}
     */
    done() : JQueryPromise<any>;

    /**
     * Add handlers to be called when the Deferred object is rejected.
     * 
     * @param failCallbacks1 A function, or array of functions, that are called when the Deferred is rejected.
     * @param failCallbacks2 Optional additional functions, or arrays of functions, that are called when the Deferred is rejected.
     * @return {*}
     */
    fail() : JQueryPromise<any>;

    /**
     * Add handlers to be called when the Deferred object generates progress notifications.
     * 
     * @param progressCallbacks A function, or array of functions, to be called when the Deferred generates progress notifications.
     * @return {*}
     */
    progress() : JQueryPromise<any>;

    pipe(doneFilter : (p1: any) => any, failFilter : (p1: any) => any) : JQueryPromise<any>;

    pipe(doneFilter : (p1: any) => any) : JQueryPromise<any>;

    pipe() : JQueryPromise<any>;

    /**
     * Return a Deferred's Promise object.
     * 
     * @param target Object onto which the promise methods have to be attached
     * @return {*}
     */
    promise() : JQueryPromise<any>;

    /**
     * Incorporates the functionality of the .done() and .fail() methods, allowing (as of jQuery 1.8) the underlying Promise to be manipulated. Refer to deferred.then() for implementation details.
     * @param {*} doneCallback
     * @param {*} failCallback
     * @return {*}
     */
    then<R>(doneCallback : (p1: any, p2: string, p3: JQueryXHR) => JQueryPromise<R>, failCallback : (p1: JQueryXHR, p2: string, p3: any) => void) : JQueryPromise<R>;

    /**
     * Add handlers to be called when the Deferred object is either resolved or rejected.
     * 
     * @param alwaysCallbacks1 A function, or array of functions, that is called when the Deferred is resolved or rejected.
     * @param alwaysCallbacks2 Optional additional functions, or arrays of functions, that are called when the Deferred is resolved or rejected.
     * @param {Array} alwaysCallback1
     * @param {Array} alwaysCallbacksN
     * @return {*}
     */
    always(alwaysCallback1 : JQueryPromiseCallback<any>[], ...alwaysCallbacksN : any[]) : JQueryPromise<any>;

    /**
     * Add handlers to be called when the Deferred object is either resolved or rejected.
     * 
     * @param alwaysCallbacks1 A function, or array of functions, that is called when the Deferred is resolved or rejected.
     * @param alwaysCallbacks2 Optional additional functions, or arrays of functions, that are called when the Deferred is resolved or rejected.
     * @param {*} alwaysCallback1
     * @param {Array} alwaysCallbacksN
     * @return {*}
     */
    always(alwaysCallback1 : JQueryPromiseCallback<any>, ...alwaysCallbacksN : any[]) : JQueryPromise<any>;

    /**
     * Add handlers to be called when the Deferred object is either resolved or rejected.
     * 
     * @param alwaysCallbacks1 A function, or array of functions, that is called when the Deferred is resolved or rejected.
     * @param alwaysCallbacks2 Optional additional functions, or arrays of functions, that are called when the Deferred is resolved or rejected.
     * @param {Array} alwaysCallback1
     * @param {Array} alwaysCallbacksN
     * @return {*}
     */
    always(alwaysCallback1 : JQueryPromiseCallback<any>[], ...alwaysCallbacksN : any[]) : JQueryPromise<any>;

    /**
     * Add handlers to be called when the Deferred object is resolved.
     * 
     * @param doneCallbacks1 A function, or array of functions, that are called when the Deferred is resolved.
     * @param doneCallbacks2 Optional additional functions, or arrays of functions, that are called when the Deferred is resolved.
     * @param {*} doneCallback1
     * @param {Array} doneCallbackN
     * @return {*}
     */
    done(doneCallback1 : JQueryPromiseCallback<any>, ...doneCallbackN : any[]) : JQueryPromise<any>;

    /**
     * Add handlers to be called when the Deferred object is resolved.
     * 
     * @param doneCallbacks1 A function, or array of functions, that are called when the Deferred is resolved.
     * @param doneCallbacks2 Optional additional functions, or arrays of functions, that are called when the Deferred is resolved.
     * @param {Array} doneCallback1
     * @param {Array} doneCallbackN
     * @return {*}
     */
    done(doneCallback1 : JQueryPromiseCallback<any>[], ...doneCallbackN : any[]) : JQueryPromise<any>;

    /**
     * Add handlers to be called when the Deferred object is resolved.
     * 
     * @param doneCallbacks1 A function, or array of functions, that are called when the Deferred is resolved.
     * @param doneCallbacks2 Optional additional functions, or arrays of functions, that are called when the Deferred is resolved.
     * @param {Array} doneCallback1
     * @param {Array} doneCallbackN
     * @return {*}
     */
    done(doneCallback1 : JQueryPromiseCallback<any>[], ...doneCallbackN : any[]) : JQueryPromise<any>;

    /**
     * Add handlers to be called when the Deferred object is rejected.
     * 
     * @param failCallbacks1 A function, or array of functions, that are called when the Deferred is rejected.
     * @param failCallbacks2 Optional additional functions, or arrays of functions, that are called when the Deferred is rejected.
     * @param {*} failCallback1
     * @param {Array} failCallbacksN
     * @return {*}
     */
    fail(failCallback1 : JQueryPromiseCallback<any>, ...failCallbacksN : any[]) : JQueryPromise<any>;

    /**
     * Add handlers to be called when the Deferred object is rejected.
     * 
     * @param failCallbacks1 A function, or array of functions, that are called when the Deferred is rejected.
     * @param failCallbacks2 Optional additional functions, or arrays of functions, that are called when the Deferred is rejected.
     * @param {Array} failCallback1
     * @param {Array} failCallbacksN
     * @return {*}
     */
    fail(failCallback1 : JQueryPromiseCallback<any>[], ...failCallbacksN : any[]) : JQueryPromise<any>;

    /**
     * Add handlers to be called when the Deferred object is rejected.
     * 
     * @param failCallbacks1 A function, or array of functions, that are called when the Deferred is rejected.
     * @param failCallbacks2 Optional additional functions, or arrays of functions, that are called when the Deferred is rejected.
     * @param {Array} failCallback1
     * @param {Array} failCallbacksN
     * @return {*}
     */
    fail(failCallback1 : JQueryPromiseCallback<any>[], ...failCallbacksN : any[]) : JQueryPromise<any>;

    /**
     * Add handlers to be called when the Deferred object generates progress notifications.
     * 
     * @param progressCallbacks A function, or array of functions, to be called when the Deferred generates progress notifications.
     * @param {Array} progressCallback1
     * @param {Array} progressCallbackN
     * @return {*}
     */
    progress(progressCallback1 : JQueryPromiseCallback<any>[], ...progressCallbackN : any[]) : JQueryPromise<any>;

    /**
     * Add handlers to be called when the Deferred object generates progress notifications.
     * 
     * @param progressCallbacks A function, or array of functions, to be called when the Deferred generates progress notifications.
     * @param {Array} progressCallback1
     * @param {Array} progressCallbackN
     * @return {*}
     */
    progress(progressCallback1 : JQueryPromiseCallback<any>[], ...progressCallbackN : any[]) : JQueryPromise<any>;

    /**
     * Add handlers to be called when the Deferred object generates progress notifications.
     * 
     * @param progressCallbacks A function, or array of functions, to be called when the Deferred generates progress notifications.
     * @param {*} progressCallback1
     * @param {Array} progressCallbackN
     * @return {*}
     */
    progress(progressCallback1 : JQueryPromiseCallback<any>, ...progressCallbackN : any[]) : JQueryPromise<any>;

    /**
     * Incorporates the functionality of the .done() and .fail() methods, allowing (as of jQuery 1.8) the underlying Promise to be manipulated. Refer to deferred.then() for implementation details.
     * @param {*} doneCallback
     * @return {*}
     */
    then<R>(doneCallback : (p1: any, p2: string, p3: JQueryXHR) => JQueryPromise<R>) : JQueryPromise<R>;

    /**
     * Add handlers to be called when the Deferred object is either resolved or rejected.
     * 
     * @param alwaysCallbacks1 A function, or array of functions, that is called when the Deferred is resolved or rejected.
     * @param alwaysCallbacks2 Optional additional functions, or arrays of functions, that are called when the Deferred is resolved or rejected.
     * @param {*} alwaysCallback1
     * @param {Array} alwaysCallbacksN
     * @return {*}
     */
    always(alwaysCallback1 : JQueryPromiseCallback<any>, ...alwaysCallbacksN : JQueryPromiseCallback<any>[]) : JQueryPromise<any>;

    /**
     * Add handlers to be called when the Deferred object is resolved.
     * 
     * @param doneCallbacks1 A function, or array of functions, that are called when the Deferred is resolved.
     * @param doneCallbacks2 Optional additional functions, or arrays of functions, that are called when the Deferred is resolved.
     * @param {*} doneCallback1
     * @param {Array} doneCallbackN
     * @return {*}
     */
    done(doneCallback1 : JQueryPromiseCallback<any>, ...doneCallbackN : JQueryPromiseCallback<any>[]) : JQueryPromise<any>;

    /**
     * Add handlers to be called when the Deferred object is rejected.
     * 
     * @param failCallbacks1 A function, or array of functions, that are called when the Deferred is rejected.
     * @param failCallbacks2 Optional additional functions, or arrays of functions, that are called when the Deferred is rejected.
     * @param {*} failCallback1
     * @param {Array} failCallbacksN
     * @return {*}
     */
    fail(failCallback1 : JQueryPromiseCallback<any>, ...failCallbacksN : JQueryPromiseCallback<any>[]) : JQueryPromise<any>;

    /**
     * Add handlers to be called when the Deferred object generates progress notifications.
     * 
     * @param progressCallbacks A function, or array of functions, to be called when the Deferred generates progress notifications.
     * @param {*} progressCallback1
     * @param {Array} progressCallbackN
     * @return {*}
     */
    progress(progressCallback1 : JQueryPromiseCallback<any>, ...progressCallbackN : JQueryPromiseCallback<any>[]) : JQueryPromise<any>;

    /**
     * Add handlers to be called when the Deferred object is either resolved or rejected.
     * 
     * @param alwaysCallbacks1 A function, or array of functions, that is called when the Deferred is resolved or rejected.
     * @param alwaysCallbacks2 Optional additional functions, or arrays of functions, that are called when the Deferred is resolved or rejected.
     * @param {Array} alwaysCallback1
     * @param {Array} alwaysCallbacksN
     * @return {*}
     */
    always(alwaysCallback1 : JQueryPromiseCallback<any>[], ...alwaysCallbacksN : JQueryPromiseCallback<any>[]) : JQueryPromise<any>;

    /**
     * Add handlers to be called when the Deferred object is either resolved or rejected.
     * 
     * @param alwaysCallbacks1 A function, or array of functions, that is called when the Deferred is resolved or rejected.
     * @param alwaysCallbacks2 Optional additional functions, or arrays of functions, that are called when the Deferred is resolved or rejected.
     * @param {*} alwaysCallback1
     * @param {Array} alwaysCallbacksN
     * @return {*}
     */
    always(alwaysCallback1 : JQueryPromiseCallback<any>, ...alwaysCallbacksN : JQueryPromiseCallback<any>[][]) : JQueryPromise<any>;

    /**
     * Add handlers to be called when the Deferred object is either resolved or rejected.
     * 
     * @param alwaysCallbacks1 A function, or array of functions, that is called when the Deferred is resolved or rejected.
     * @param alwaysCallbacks2 Optional additional functions, or arrays of functions, that are called when the Deferred is resolved or rejected.
     * @param {Array} alwaysCallback1
     * @param {Array} alwaysCallbacksN
     * @return {*}
     */
    always(alwaysCallback1 : JQueryPromiseCallback<any>[], ...alwaysCallbacksN : JQueryPromiseCallback<any>[][]) : JQueryPromise<any>;

    /**
     * Add handlers to be called when the Deferred object is resolved.
     * 
     * @param doneCallbacks1 A function, or array of functions, that are called when the Deferred is resolved.
     * @param doneCallbacks2 Optional additional functions, or arrays of functions, that are called when the Deferred is resolved.
     * @param {*} doneCallback1
     * @param {Array} doneCallbackN
     * @return {*}
     */
    done(doneCallback1 : JQueryPromiseCallback<any>, ...doneCallbackN : JQueryPromiseCallback<any>[][]) : JQueryPromise<any>;

    /**
     * Add handlers to be called when the Deferred object is resolved.
     * 
     * @param doneCallbacks1 A function, or array of functions, that are called when the Deferred is resolved.
     * @param doneCallbacks2 Optional additional functions, or arrays of functions, that are called when the Deferred is resolved.
     * @param {Array} doneCallback1
     * @param {Array} doneCallbackN
     * @return {*}
     */
    done(doneCallback1 : JQueryPromiseCallback<any>[], ...doneCallbackN : JQueryPromiseCallback<any>[][]) : JQueryPromise<any>;

    /**
     * Add handlers to be called when the Deferred object is resolved.
     * 
     * @param doneCallbacks1 A function, or array of functions, that are called when the Deferred is resolved.
     * @param doneCallbacks2 Optional additional functions, or arrays of functions, that are called when the Deferred is resolved.
     * @param {Array} doneCallback1
     * @param {Array} doneCallbackN
     * @return {*}
     */
    done(doneCallback1 : JQueryPromiseCallback<any>[], ...doneCallbackN : JQueryPromiseCallback<any>[]) : JQueryPromise<any>;

    /**
     * Add handlers to be called when the Deferred object is rejected.
     * 
     * @param failCallbacks1 A function, or array of functions, that are called when the Deferred is rejected.
     * @param failCallbacks2 Optional additional functions, or arrays of functions, that are called when the Deferred is rejected.
     * @param {*} failCallback1
     * @param {Array} failCallbacksN
     * @return {*}
     */
    fail(failCallback1 : JQueryPromiseCallback<any>, ...failCallbacksN : JQueryPromiseCallback<any>[][]) : JQueryPromise<any>;

    /**
     * Add handlers to be called when the Deferred object is rejected.
     * 
     * @param failCallbacks1 A function, or array of functions, that are called when the Deferred is rejected.
     * @param failCallbacks2 Optional additional functions, or arrays of functions, that are called when the Deferred is rejected.
     * @param {Array} failCallback1
     * @param {Array} failCallbacksN
     * @return {*}
     */
    fail(failCallback1 : JQueryPromiseCallback<any>[], ...failCallbacksN : JQueryPromiseCallback<any>[][]) : JQueryPromise<any>;

    /**
     * Add handlers to be called when the Deferred object is rejected.
     * 
     * @param failCallbacks1 A function, or array of functions, that are called when the Deferred is rejected.
     * @param failCallbacks2 Optional additional functions, or arrays of functions, that are called when the Deferred is rejected.
     * @param {Array} failCallback1
     * @param {Array} failCallbacksN
     * @return {*}
     */
    fail(failCallback1 : JQueryPromiseCallback<any>[], ...failCallbacksN : JQueryPromiseCallback<any>[]) : JQueryPromise<any>;

    /**
     * Add handlers to be called when the Deferred object generates progress notifications.
     * 
     * @param progressCallbacks A function, or array of functions, to be called when the Deferred generates progress notifications.
     * @param {Array} progressCallback1
     * @param {Array} progressCallbackN
     * @return {*}
     */
    progress(progressCallback1 : JQueryPromiseCallback<any>[], ...progressCallbackN : JQueryPromiseCallback<any>[][]) : JQueryPromise<any>;

    /**
     * Add handlers to be called when the Deferred object generates progress notifications.
     * 
     * @param progressCallbacks A function, or array of functions, to be called when the Deferred generates progress notifications.
     * @param {Array} progressCallback1
     * @param {Array} progressCallbackN
     * @return {*}
     */
    progress(progressCallback1 : JQueryPromiseCallback<any>[], ...progressCallbackN : JQueryPromiseCallback<any>[]) : JQueryPromise<any>;

    /**
     * Add handlers to be called when the Deferred object generates progress notifications.
     * 
     * @param progressCallbacks A function, or array of functions, to be called when the Deferred generates progress notifications.
     * @param {*} progressCallback1
     * @param {Array} progressCallbackN
     * @return {*}
     */
    progress(progressCallback1 : JQueryPromiseCallback<any>, ...progressCallbackN : JQueryPromiseCallback<any>[][]) : JQueryPromise<any>;
}

interface JQueryParam {
    /**
     * Create a serialized representation of an array or object, suitable for use in a URL query string or Ajax request.
     * 
     * @param {*} obj An array or object to serialize.
     * @return {string}
     */
    (obj : any) : string;

    /**
     * Create a serialized representation of an array or object, suitable for use in a URL query string or Ajax request.
     * 
     * @param {*} obj An array or object to serialize.
     * @param {boolean} traditional A Boolean indicating whether to perform a traditional "shallow" serialization.
     * @return {string}
     */
    (obj : any, traditional : boolean) : string;
}

interface JQueryEventObject extends BaseJQueryEventObject {
    altKey : boolean;

    ctrlKey : boolean;

    metaKey : boolean;

    shiftKey : boolean;

    button : number;

    clientX : number;

    clientY : number;

    offsetX : number;

    offsetY : number;

    pageX : number;

    pageY : number;

    screenX : number;

    screenY : number;

    char : any;

    charCode : number;

    key : any;

    keyCode : number;
}

interface JQueryKeyEventObject extends JQueryInputEventObject {
    char : any;

    charCode : number;

    key : any;

    keyCode : number;
}

/**
 * Interface for the AJAX setting that will configure the AJAX request
 * @class
 * @extends Object
 */
interface JQueryAjaxSettings {
    /**
     * The content type sent in the request header that tells the server what kind of response it will accept in return. If the accepts setting needs modification, it is recommended to do so once in the $.ajaxSetup() method.
     */
    accepts? : any;

    /**
     * By default, all requests are sent asynchronously (i.e. this is set to true by default). If you need synchronous requests, set this option to false. Cross-domain requests and dataType: "jsonp" requests do not support synchronous operation. Note that synchronous requests may temporarily lock the browser, disabling any actions while the request is active. As of jQuery 1.8, the use of async: false with jqXHR ($.Deferred) is deprecated; you must use the success/error/complete callback options instead of the corresponding methods of the jqXHR object such as jqXHR.done() or the deprecated jqXHR.success().
     */
    async? : boolean;

    /**
     * A pre-request callback function that can be used to modify the jqXHR (in jQuery 1.4.x, XMLHTTPRequest) object before it is sent. Use this to set custom headers, etc. The jqXHR and settings objects are passed as arguments. This is an Ajax Event. Returning false in the beforeSend function will cancel the request. As of jQuery 1.5, the beforeSend option will be called regardless of the type of request.
     * @param {*} jqXHR
     * @param {*} settings
     * @return {*}
     */
    beforeSend(jqXHR : JQueryXHR, settings : JQueryAjaxSettings) : any;

    /**
     * If set to false, it will force requested pages not to be cached by the browser. Note: Setting cache to false will only work correctly with HEAD and GET requests. It works by appending "_={timestamp}" to the GET parameters. The parameter is not needed for other types of requests, except in IE8 when a POST is made to a URL that has already been requested by a GET.
     */
    cache? : boolean;

    /**
     * A function to be called when the request finishes (after success and error callbacks are executed). The function gets passed two arguments: The jqXHR (in jQuery 1.4.x, XMLHTTPRequest) object and a string categorizing the status of the request ("success", "notmodified", "error", "timeout", "abort", or "parsererror"). As of jQuery 1.5, the complete setting can accept an array of functions. Each function will be called in turn. This is an Ajax Event.
     * @param {*} jqXHR
     * @param {string} textStatus
     * @return {*}
     */
    complete(jqXHR : JQueryXHR, textStatus : string) : any;

    /**
     * An object of string/regular-expression pairs that determine how jQuery will parse the response, given its content type. (version added: 1.5)
     */
    contents? : any;

    /**
     * When sending data to the server, use this content type. Default is "application/x-www-form-urlencoded; charset=UTF-8", which is fine for most cases. If you explicitly pass in a content-type to $.ajax(), then it is always sent to the server (even if no data is sent). The W3C XMLHttpRequest specification dictates that the charset is always UTF-8; specifying another charset will not force the browser to change the encoding.
     */
    contentType? : any;

    /**
     * This object will be made the context of all Ajax-related callbacks. By default, the context is an object that represents the ajax settings used in the call ($.ajaxSettings merged with the settings passed to $.ajax).
     */
    context? : any;

    /**
     * An object containing dataType-to-dataType converters. Each converter's value is a function that returns the transformed value of the response. (version added: 1.5)
     */
    converters? : any;

    /**
     * If you wish to force a crossDomain request (such as JSONP) on the same domain, set the value of crossDomain to true. This allows, for example, server-side redirection to another domain. (version added: 1.5)
     */
    crossDomain? : boolean;

    /**
     * Data to be sent to the server. It is converted to a query string, if not already a string. It's appended to the url for GET-requests. See processData option to prevent this automatic processing. Object must be Key/Value pairs. If value is an Array, jQuery serializes multiple values with same key based on the value of the traditional setting (described below).
     */
    data? : any;

    /**
     * A function to be used to handle the raw response data of XMLHttpRequest.This is a pre-filtering function to sanitize the response. You should return the sanitized data. The function accepts two arguments: The raw data returned from the server and the 'dataType' parameter.
     * @param {*} data
     * @param {*} ty
     * @return {*}
     */
    dataFilter(data : any, ty : any) : any;

    /**
     * The type of data that you're expecting back from the server. If none is specified, jQuery will try to infer it based on the MIME type of the response (an XML MIME type will yield XML, in 1.4 JSON will yield a JavaScript object, in 1.4 script will execute the script, and anything else will be returned as a string).
     */
    dataType? : string;

    /**
     * A function to be called if the request fails. The function receives three arguments: The jqXHR (in jQuery 1.4.x, XMLHttpRequest) object, a string describing the type of error that occurred and an optional exception object, if one occurred. Possible values for the second argument (besides null) are "timeout", "error", "abort", and "parsererror". When an HTTP error occurs, errorThrown receives the textual portion of the HTTP status, such as "Not Found" or "Internal Server Error." As of jQuery 1.5, the error setting can accept an array of functions. Each function will be called in turn. Note: This handler is not called for cross-domain script and cross-domain JSONP requests. This is an Ajax Event.
     * @param {*} jqXHR
     * @param {string} textStatus
     * @param {string} errorThrown
     * @return {*}
     */
    error(jqXHR : JQueryXHR, textStatus : string, errorThrown : string) : any;

    /**
     * Whether to trigger global Ajax event handlers for this request. The default is true. Set to false to prevent the global handlers like ajaxStart or ajaxStop from being triggered. This can be used to control various Ajax Events.
     */
    global? : boolean;

    /**
     * An object of additional header key/value pairs to send along with requests using the XMLHttpRequest transport. The header X-Requested-With: XMLHttpRequest is always added, but its default XMLHttpRequest value can be changed here. Values in the headers setting can also be overwritten from within the beforeSend function. (version added: 1.5)
     */
    headers? : any;

    /**
     * Allow the request to be successful only if the response has changed since the last request. This is done by checking the Last-Modified header. Default value is false, ignoring the header. In jQuery 1.4 this technique also checks the 'etag' specified by the server to catch unmodified data.
     */
    ifModified? : boolean;

    /**
     * Allow the current environment to be recognized as "local," (e.g. the filesystem), even if jQuery does not recognize it as such by default. The following protocols are currently recognized as local: file, *-extension, and widget. If the isLocal setting needs modification, it is recommended to do so once in the $.ajaxSetup() method. (version added: 1.5.1)
     */
    isLocal? : boolean;

    /**
     * Override the callback function name in a jsonp request. This value will be used instead of 'callback' in the 'callback=?' part of the query string in the url. So {jsonp:'onJSONPLoad'} would result in 'onJSONPLoad=?' passed to the server. As of jQuery 1.5, setting the jsonp option to false prevents jQuery from adding the "?callback" string to the URL or attempting to use "=?" for transformation. In this case, you should also explicitly set the jsonpCallback setting. For example, { jsonp: false, jsonpCallback: "callbackName" }
     */
    jsonp? : any;

    /**
     * Specify the callback function name for a JSONP request. This value will be used instead of the random name automatically generated by jQuery. It is preferable to let jQuery generate a unique name as it'll make it easier to manage the requests and provide callbacks and error handling. You may want to specify the callback when you want to enable better browser caching of GET requests. As of jQuery 1.5, you can also use a function for this setting, in which case the value of jsonpCallback is set to the return value of that function.
     */
    jsonpCallback? : any;

    /**
     * The HTTP method to use for the request (e.g. "POST", "GET", "PUT"). (version added: 1.9.0)
     */
    method? : string;

    /**
     * A mime type to override the XHR mime type. (version added: 1.5.1)
     */
    mimeType? : string;

    /**
     * A password to be used with XMLHttpRequest in response to an HTTP access authentication request.
     */
    password? : string;

    /**
     * By default, data passed in to the data option as an object (technically, anything other than a string) will be processed and transformed into a query string, fitting to the default content-type "application/x-www-form-urlencoded". If you want to send a DOMDocument, or other non-processed data, set this option to false.
     */
    processData? : boolean;

    /**
     * Only applies when the "script" transport is used (e.g., cross-domain requests with "jsonp" or "script" dataType and "GET" type). Sets the charset attribute on the script tag used in the request. Used when the character set on the local page is not the same as the one on the remote script.
     */
    scriptCharset? : string;

    /**
     * An object of numeric HTTP codes and functions to be called when the response has the corresponding code. f the request is successful, the status code functions take the same parameters as the success callback; if it results in an error (including 3xx redirect), they take the same parameters as the error callback. (version added: 1.5)
     */
    statusCode? : any;

    /**
     * A function to be called if the request succeeds. The function gets passed three arguments: The data returned from the server, formatted according to the dataType parameter; a string describing the status; and the jqXHR (in jQuery 1.4.x, XMLHttpRequest) object. As of jQuery 1.5, the success setting can accept an array of functions. Each function will be called in turn. This is an Ajax Event.
     * @param {*} data
     * @param {string} textStatus
     * @param {*} jqXHR
     * @return {*}
     */
    success(data : any, textStatus : string, jqXHR : JQueryXHR) : any;

    /**
     * Set a timeout (in milliseconds) for the request. This will override any global timeout set with $.ajaxSetup(). The timeout period starts at the point the $.ajax call is made; if several other requests are in progress and the browser has no connections available, it is possible for a request to time out before it can be sent. In jQuery 1.4.x and below, the XMLHttpRequest object will be in an invalid state if the request times out; accessing any object members may throw an exception. In Firefox 3.0+ only, script and JSONP requests cannot be cancelled by a timeout; the script will run even if it arrives after the timeout period.
     */
    timeout? : number;

    /**
     * Set this to true if you wish to use the traditional style of param serialization.
     */
    traditional? : boolean;

    /**
     * The type of request to make ("POST" or "GET"), default is "GET". Note: Other HTTP request methods, such as PUT and DELETE, can also be used here, but they are not supported by all browsers.
     */
    type? : string;

    /**
     * A string containing the URL to which the request is sent.
     */
    url? : string;

    /**
     * A username to be used with XMLHttpRequest in response to an HTTP access authentication request.
     */
    username? : string;

    /**
     * Callback for creating the XMLHttpRequest object. Defaults to the ActiveXObject when available (IE), the XMLHttpRequest otherwise. Override to provide your own implementation for XMLHttpRequest or enhancements to the factory.
     */
    xhr? : any;

    /**
     * An object of fieldName-fieldValue pairs to set on the native XHR object. For example, you can use it to set withCredentials to true for cross-domain requests if needed. In jQuery 1.5, the withCredentials property was not propagated to the native XHR and thus CORS requests requiring it would ignore this flag. For this reason, we recommend using jQuery 1.5.1+ should you require the use of it. (version added: 1.5.1)
     */
    xhrFields? : any;
}

/**
 * Interface for the JQuery promise/deferred callbacks
 * @class
 */
interface JQueryPromiseCallback<T> {
    (value : T, ...args : any[]);

    ();
}

interface JQueryEasingFunction {
    (percent : number) : number;
}

interface JQueryEasingFunctions {
    [name : string]: JQueryEasingFunction;

    linear : any;

    swing : any;
}

interface JQueryAnimationOptions {
    /**
     * A string or number determining how long the animation will run.
     */
    duration? : any;

    /**
     * A string indicating which easing function to use for the transition.
     */
    easing? : string;

    /**
     * A function to call once the animation is complete.
     */
    complete? : any;

    /**
     * A function to be called for each animated property of each animated element. This function provides an opportunity to modify the Tween object to change the value of the property before it is set.
     */
    step? : (p1: number, p2: any) => any;

    /**
     * A function to be called after each step of the animation, only once per animated element regardless of the number of animated properties. (version added: 1.8)
     */
    progress? : (p1: JQueryPromise<any>, p2: number, p3: number) => any;

    /**
     * A function to call when the animation begins. (version added: 1.8)
     */
    start? : (p1: JQueryPromise<any>) => any;

    /**
     * A function to be called when the animation completes (its Promise object is resolved). (version added: 1.8)
     */
    done? : (p1: JQueryPromise<any>, p2: boolean) => any;

    /**
     * A function to be called when the animation fails to complete (its Promise object is rejected). (version added: 1.8)
     */
    fail? : (p1: JQueryPromise<any>, p2: boolean) => any;

    /**
     * A function to be called when the animation completes or stops without completing (its Promise object is either resolved or rejected). (version added: 1.8)
     */
    always? : (p1: JQueryPromise<any>, p2: boolean) => any;

    /**
     * A Boolean indicating whether to place the animation in the effects queue. If false, the animation will begin immediately. As of jQuery 1.7, the queue option can also accept a string, in which case the animation is added to the queue represented by that string. When a custom queue name is used the animation does not automatically start; you must call .dequeue("queuename") to start it.
     */
    queue? : any;

    /**
     * A map of one or more of the CSS properties defined by the properties argument and their corresponding easing functions. (version added: 1.4)
     */
    specialEasing? : any;
}

interface JQueryInputEventObject extends BaseJQueryEventObject {
    altKey : boolean;

    ctrlKey : boolean;

    metaKey : boolean;

    shiftKey : boolean;
}

/**
 * Interface for the JQuery promise, part of callbacks
 * @class
 * @extends *
 */
interface JQueryPromise<T> extends JQueryGenericPromise<T> {
    /**
     * Determine the current state of a Deferred object.
     * @return {string}
     */
    state() : string;

    /**
     * Add handlers to be called when the Deferred object is either resolved or rejected.
     * 
     * @param alwaysCallbacks1 A function, or array of functions, that is called when the Deferred is resolved or rejected.
     * @param alwaysCallbacks2 Optional additional functions, or arrays of functions, that are called when the Deferred is resolved or rejected.
     * @param {*} alwaysCallback1
     * @param {Array} alwaysCallbacksN
     * @return {*}
     */
    always(alwaysCallback1 : JQueryPromiseCallback<any>, ...alwaysCallbacksN : any[]) : JQueryPromise<T>;

    /**
     * Add handlers to be called when the Deferred object is resolved.
     * 
     * @param doneCallbacks1 A function, or array of functions, that are called when the Deferred is resolved.
     * @param doneCallbacks2 Optional additional functions, or arrays of functions, that are called when the Deferred is resolved.
     * @param {*} doneCallback1
     * @param {Array} doneCallbackN
     * @return {*}
     */
    done(doneCallback1 : JQueryPromiseCallback<T>, ...doneCallbackN : any[]) : JQueryPromise<T>;

    /**
     * Add handlers to be called when the Deferred object is rejected.
     * 
     * @param failCallbacks1 A function, or array of functions, that are called when the Deferred is rejected.
     * @param failCallbacks2 Optional additional functions, or arrays of functions, that are called when the Deferred is rejected.
     * @param {*} failCallback1
     * @param {Array} failCallbacksN
     * @return {*}
     */
    fail(failCallback1 : JQueryPromiseCallback<any>, ...failCallbacksN : any[]) : JQueryPromise<T>;

    /**
     * Add handlers to be called when the Deferred object generates progress notifications.
     * 
     * @param progressCallbacks A function, or array of functions, to be called when the Deferred generates progress notifications.
     * @param {*} progressCallback1
     * @param {Array} progressCallbackN
     * @return {*}
     */
    progress(progressCallback1 : JQueryPromiseCallback<any>, ...progressCallbackN : any[]) : JQueryPromise<T>;

    pipe(doneFilter : (p1: any) => any, failFilter : (p1: any) => any, progressFilter : (p1: any) => any) : JQueryPromise<any>;

    /**
     * Return a Deferred's Promise object.
     * 
     * @param {*} target Object onto which the promise methods have to be attached
     * @return {*}
     */
    promise(target : any) : JQueryPromise<T>;

    /**
     * Add handlers to be called when the Deferred object is either resolved or rejected.
     * 
     * @param alwaysCallbacks1 A function, or array of functions, that is called when the Deferred is resolved or rejected.
     * @param alwaysCallbacks2 Optional additional functions, or arrays of functions, that are called when the Deferred is resolved or rejected.
     * @return {*}
     */
    always() : JQueryPromise<T>;

    /**
     * Add handlers to be called when the Deferred object is resolved.
     * 
     * @param doneCallbacks1 A function, or array of functions, that are called when the Deferred is resolved.
     * @param doneCallbacks2 Optional additional functions, or arrays of functions, that are called when the Deferred is resolved.
     * @return {*}
     */
    done() : JQueryPromise<T>;

    /**
     * Add handlers to be called when the Deferred object is rejected.
     * 
     * @param failCallbacks1 A function, or array of functions, that are called when the Deferred is rejected.
     * @param failCallbacks2 Optional additional functions, or arrays of functions, that are called when the Deferred is rejected.
     * @return {*}
     */
    fail() : JQueryPromise<T>;

    /**
     * Add handlers to be called when the Deferred object generates progress notifications.
     * 
     * @param progressCallbacks A function, or array of functions, to be called when the Deferred generates progress notifications.
     * @return {*}
     */
    progress() : JQueryPromise<T>;

    pipe(doneFilter : (p1: any) => any, failFilter : (p1: any) => any) : JQueryPromise<any>;

    pipe(doneFilter : (p1: any) => any) : JQueryPromise<any>;

    pipe() : JQueryPromise<any>;

    /**
     * Return a Deferred's Promise object.
     * 
     * @param target Object onto which the promise methods have to be attached
     * @return {*}
     */
    promise() : JQueryPromise<T>;

    /**
     * Add handlers to be called when the Deferred object is either resolved or rejected.
     * 
     * @param alwaysCallbacks1 A function, or array of functions, that is called when the Deferred is resolved or rejected.
     * @param alwaysCallbacks2 Optional additional functions, or arrays of functions, that are called when the Deferred is resolved or rejected.
     * @param {*} alwaysCallback1
     * @param {Array} alwaysCallbacksN
     * @return {*}
     */
    always(alwaysCallback1 : JQueryPromiseCallback<any>, ...alwaysCallbacksN : any[]) : JQueryPromise<T>;

    /**
     * Add handlers to be called when the Deferred object is either resolved or rejected.
     * 
     * @param alwaysCallbacks1 A function, or array of functions, that is called when the Deferred is resolved or rejected.
     * @param alwaysCallbacks2 Optional additional functions, or arrays of functions, that are called when the Deferred is resolved or rejected.
     * @param {Array} alwaysCallback1
     * @param {Array} alwaysCallbacksN
     * @return {*}
     */
    always(alwaysCallback1 : JQueryPromiseCallback<any>[], ...alwaysCallbacksN : any[]) : JQueryPromise<T>;

    /**
     * Add handlers to be called when the Deferred object is either resolved or rejected.
     * 
     * @param alwaysCallbacks1 A function, or array of functions, that is called when the Deferred is resolved or rejected.
     * @param alwaysCallbacks2 Optional additional functions, or arrays of functions, that are called when the Deferred is resolved or rejected.
     * @param {Array} alwaysCallback1
     * @param {Array} alwaysCallbacksN
     * @return {*}
     */
    always(alwaysCallback1 : JQueryPromiseCallback<any>[], ...alwaysCallbacksN : any[]) : JQueryPromise<T>;

    /**
     * Add handlers to be called when the Deferred object is resolved.
     * 
     * @param doneCallbacks1 A function, or array of functions, that are called when the Deferred is resolved.
     * @param doneCallbacks2 Optional additional functions, or arrays of functions, that are called when the Deferred is resolved.
     * @param {Array} doneCallback1
     * @param {Array} doneCallbackN
     * @return {*}
     */
    done(doneCallback1 : JQueryPromiseCallback<T>[], ...doneCallbackN : any[]) : JQueryPromise<T>;

    /**
     * Add handlers to be called when the Deferred object is resolved.
     * 
     * @param doneCallbacks1 A function, or array of functions, that are called when the Deferred is resolved.
     * @param doneCallbacks2 Optional additional functions, or arrays of functions, that are called when the Deferred is resolved.
     * @param {*} doneCallback1
     * @param {Array} doneCallbackN
     * @return {*}
     */
    done(doneCallback1 : JQueryPromiseCallback<T>, ...doneCallbackN : any[]) : JQueryPromise<T>;

    /**
     * Add handlers to be called when the Deferred object is resolved.
     * 
     * @param doneCallbacks1 A function, or array of functions, that are called when the Deferred is resolved.
     * @param doneCallbacks2 Optional additional functions, or arrays of functions, that are called when the Deferred is resolved.
     * @param {Array} doneCallback1
     * @param {Array} doneCallbackN
     * @return {*}
     */
    done(doneCallback1 : JQueryPromiseCallback<T>[], ...doneCallbackN : any[]) : JQueryPromise<T>;

    /**
     * Add handlers to be called when the Deferred object is rejected.
     * 
     * @param failCallbacks1 A function, or array of functions, that are called when the Deferred is rejected.
     * @param failCallbacks2 Optional additional functions, or arrays of functions, that are called when the Deferred is rejected.
     * @param {*} failCallback1
     * @param {Array} failCallbacksN
     * @return {*}
     */
    fail(failCallback1 : JQueryPromiseCallback<any>, ...failCallbacksN : any[]) : JQueryPromise<T>;

    /**
     * Add handlers to be called when the Deferred object is rejected.
     * 
     * @param failCallbacks1 A function, or array of functions, that are called when the Deferred is rejected.
     * @param failCallbacks2 Optional additional functions, or arrays of functions, that are called when the Deferred is rejected.
     * @param {Array} failCallback1
     * @param {Array} failCallbacksN
     * @return {*}
     */
    fail(failCallback1 : JQueryPromiseCallback<any>[], ...failCallbacksN : any[]) : JQueryPromise<T>;

    /**
     * Add handlers to be called when the Deferred object is rejected.
     * 
     * @param failCallbacks1 A function, or array of functions, that are called when the Deferred is rejected.
     * @param failCallbacks2 Optional additional functions, or arrays of functions, that are called when the Deferred is rejected.
     * @param {Array} failCallback1
     * @param {Array} failCallbacksN
     * @return {*}
     */
    fail(failCallback1 : JQueryPromiseCallback<any>[], ...failCallbacksN : any[]) : JQueryPromise<T>;

    /**
     * Add handlers to be called when the Deferred object generates progress notifications.
     * 
     * @param progressCallbacks A function, or array of functions, to be called when the Deferred generates progress notifications.
     * @param {Array} progressCallback1
     * @param {Array} progressCallbackN
     * @return {*}
     */
    progress(progressCallback1 : JQueryPromiseCallback<any>[], ...progressCallbackN : any[]) : JQueryPromise<T>;

    /**
     * Add handlers to be called when the Deferred object generates progress notifications.
     * 
     * @param progressCallbacks A function, or array of functions, to be called when the Deferred generates progress notifications.
     * @param {*} progressCallback1
     * @param {Array} progressCallbackN
     * @return {*}
     */
    progress(progressCallback1 : JQueryPromiseCallback<any>, ...progressCallbackN : any[]) : JQueryPromise<T>;

    /**
     * Add handlers to be called when the Deferred object generates progress notifications.
     * 
     * @param progressCallbacks A function, or array of functions, to be called when the Deferred generates progress notifications.
     * @param {Array} progressCallback1
     * @param {Array} progressCallbackN
     * @return {*}
     */
    progress(progressCallback1 : JQueryPromiseCallback<any>[], ...progressCallbackN : any[]) : JQueryPromise<T>;

    /**
     * Add handlers to be called when the Deferred object is either resolved or rejected.
     * 
     * @param alwaysCallbacks1 A function, or array of functions, that is called when the Deferred is resolved or rejected.
     * @param alwaysCallbacks2 Optional additional functions, or arrays of functions, that are called when the Deferred is resolved or rejected.
     * @param {*} alwaysCallback1
     * @param {Array} alwaysCallbacksN
     * @return {*}
     */
    always(alwaysCallback1 : JQueryPromiseCallback<any>, ...alwaysCallbacksN : JQueryPromiseCallback<any>[]) : JQueryPromise<T>;

    /**
     * Add handlers to be called when the Deferred object is resolved.
     * 
     * @param doneCallbacks1 A function, or array of functions, that are called when the Deferred is resolved.
     * @param doneCallbacks2 Optional additional functions, or arrays of functions, that are called when the Deferred is resolved.
     * @param {*} doneCallback1
     * @param {Array} doneCallbackN
     * @return {*}
     */
    done(doneCallback1 : JQueryPromiseCallback<T>, ...doneCallbackN : JQueryPromiseCallback<T>[]) : JQueryPromise<T>;

    /**
     * Add handlers to be called when the Deferred object is rejected.
     * 
     * @param failCallbacks1 A function, or array of functions, that are called when the Deferred is rejected.
     * @param failCallbacks2 Optional additional functions, or arrays of functions, that are called when the Deferred is rejected.
     * @param {*} failCallback1
     * @param {Array} failCallbacksN
     * @return {*}
     */
    fail(failCallback1 : JQueryPromiseCallback<any>, ...failCallbacksN : JQueryPromiseCallback<any>[]) : JQueryPromise<T>;

    /**
     * Add handlers to be called when the Deferred object generates progress notifications.
     * 
     * @param progressCallbacks A function, or array of functions, to be called when the Deferred generates progress notifications.
     * @param {*} progressCallback1
     * @param {Array} progressCallbackN
     * @return {*}
     */
    progress(progressCallback1 : JQueryPromiseCallback<any>, ...progressCallbackN : JQueryPromiseCallback<any>[]) : JQueryPromise<T>;

    /**
     * Add handlers to be called when the Deferred object is either resolved or rejected.
     * 
     * @param alwaysCallbacks1 A function, or array of functions, that is called when the Deferred is resolved or rejected.
     * @param alwaysCallbacks2 Optional additional functions, or arrays of functions, that are called when the Deferred is resolved or rejected.
     * @param {*} alwaysCallback1
     * @param {Array} alwaysCallbacksN
     * @return {*}
     */
    always(alwaysCallback1 : JQueryPromiseCallback<any>, ...alwaysCallbacksN : JQueryPromiseCallback<any>[][]) : JQueryPromise<T>;

    /**
     * Add handlers to be called when the Deferred object is either resolved or rejected.
     * 
     * @param alwaysCallbacks1 A function, or array of functions, that is called when the Deferred is resolved or rejected.
     * @param alwaysCallbacks2 Optional additional functions, or arrays of functions, that are called when the Deferred is resolved or rejected.
     * @param {Array} alwaysCallback1
     * @param {Array} alwaysCallbacksN
     * @return {*}
     */
    always(alwaysCallback1 : JQueryPromiseCallback<any>[], ...alwaysCallbacksN : JQueryPromiseCallback<any>[]) : JQueryPromise<T>;

    /**
     * Add handlers to be called when the Deferred object is either resolved or rejected.
     * 
     * @param alwaysCallbacks1 A function, or array of functions, that is called when the Deferred is resolved or rejected.
     * @param alwaysCallbacks2 Optional additional functions, or arrays of functions, that are called when the Deferred is resolved or rejected.
     * @param {Array} alwaysCallback1
     * @param {Array} alwaysCallbacksN
     * @return {*}
     */
    always(alwaysCallback1 : JQueryPromiseCallback<any>[], ...alwaysCallbacksN : JQueryPromiseCallback<any>[][]) : JQueryPromise<T>;

    /**
     * Add handlers to be called when the Deferred object is resolved.
     * 
     * @param doneCallbacks1 A function, or array of functions, that are called when the Deferred is resolved.
     * @param doneCallbacks2 Optional additional functions, or arrays of functions, that are called when the Deferred is resolved.
     * @param {Array} doneCallback1
     * @param {Array} doneCallbackN
     * @return {*}
     */
    done(doneCallback1 : JQueryPromiseCallback<T>[], ...doneCallbackN : JQueryPromiseCallback<T>[][]) : JQueryPromise<T>;

    /**
     * Add handlers to be called when the Deferred object is resolved.
     * 
     * @param doneCallbacks1 A function, or array of functions, that are called when the Deferred is resolved.
     * @param doneCallbacks2 Optional additional functions, or arrays of functions, that are called when the Deferred is resolved.
     * @param {*} doneCallback1
     * @param {Array} doneCallbackN
     * @return {*}
     */
    done(doneCallback1 : JQueryPromiseCallback<T>, ...doneCallbackN : JQueryPromiseCallback<T>[][]) : JQueryPromise<T>;

    /**
     * Add handlers to be called when the Deferred object is resolved.
     * 
     * @param doneCallbacks1 A function, or array of functions, that are called when the Deferred is resolved.
     * @param doneCallbacks2 Optional additional functions, or arrays of functions, that are called when the Deferred is resolved.
     * @param {Array} doneCallback1
     * @param {Array} doneCallbackN
     * @return {*}
     */
    done(doneCallback1 : JQueryPromiseCallback<T>[], ...doneCallbackN : JQueryPromiseCallback<T>[]) : JQueryPromise<T>;

    /**
     * Add handlers to be called when the Deferred object is rejected.
     * 
     * @param failCallbacks1 A function, or array of functions, that are called when the Deferred is rejected.
     * @param failCallbacks2 Optional additional functions, or arrays of functions, that are called when the Deferred is rejected.
     * @param {*} failCallback1
     * @param {Array} failCallbacksN
     * @return {*}
     */
    fail(failCallback1 : JQueryPromiseCallback<any>, ...failCallbacksN : JQueryPromiseCallback<any>[][]) : JQueryPromise<T>;

    /**
     * Add handlers to be called when the Deferred object is rejected.
     * 
     * @param failCallbacks1 A function, or array of functions, that are called when the Deferred is rejected.
     * @param failCallbacks2 Optional additional functions, or arrays of functions, that are called when the Deferred is rejected.
     * @param {Array} failCallback1
     * @param {Array} failCallbacksN
     * @return {*}
     */
    fail(failCallback1 : JQueryPromiseCallback<any>[], ...failCallbacksN : JQueryPromiseCallback<any>[]) : JQueryPromise<T>;

    /**
     * Add handlers to be called when the Deferred object is rejected.
     * 
     * @param failCallbacks1 A function, or array of functions, that are called when the Deferred is rejected.
     * @param failCallbacks2 Optional additional functions, or arrays of functions, that are called when the Deferred is rejected.
     * @param {Array} failCallback1
     * @param {Array} failCallbacksN
     * @return {*}
     */
    fail(failCallback1 : JQueryPromiseCallback<any>[], ...failCallbacksN : JQueryPromiseCallback<any>[][]) : JQueryPromise<T>;

    /**
     * Add handlers to be called when the Deferred object generates progress notifications.
     * 
     * @param progressCallbacks A function, or array of functions, to be called when the Deferred generates progress notifications.
     * @param {Array} progressCallback1
     * @param {Array} progressCallbackN
     * @return {*}
     */
    progress(progressCallback1 : JQueryPromiseCallback<any>[], ...progressCallbackN : JQueryPromiseCallback<any>[]) : JQueryPromise<T>;

    /**
     * Add handlers to be called when the Deferred object generates progress notifications.
     * 
     * @param progressCallbacks A function, or array of functions, to be called when the Deferred generates progress notifications.
     * @param {*} progressCallback1
     * @param {Array} progressCallbackN
     * @return {*}
     */
    progress(progressCallback1 : JQueryPromiseCallback<any>, ...progressCallbackN : JQueryPromiseCallback<any>[][]) : JQueryPromise<T>;

    /**
     * Add handlers to be called when the Deferred object generates progress notifications.
     * 
     * @param progressCallbacks A function, or array of functions, to be called when the Deferred generates progress notifications.
     * @param {Array} progressCallback1
     * @param {Array} progressCallbackN
     * @return {*}
     */
    progress(progressCallback1 : JQueryPromiseCallback<any>[], ...progressCallbackN : JQueryPromiseCallback<any>[][]) : JQueryPromise<T>;
}

/**
 * The interface used to specify coordinates.
 * @class
 * @extends Object
 */
interface JQueryCoordinates {
    left : number;

    top : number;
}

/**
 * Static members of jQuery (those on $ and jQuery themselves)
 * @class
 * @extends Object
 */
interface JQueryStatic {
    /**
     * Perform an asynchronous HTTP (Ajax) request.
     * 
     * @param {*} settings A set of key/value pairs that configure the Ajax request. All settings are optional. A default can be set for any option with $.ajaxSetup().
     * @return {*}
     */
    ajax(settings : JQueryAjaxSettings) : JQueryXHR;

    /**
     * Perform an asynchronous HTTP (Ajax) request.
     * 
     * @param {string} url A string containing the URL to which the request is sent.
     * @param {*} settings A set of key/value pairs that configure the Ajax request. All settings are optional. A default can be set for any option with $.ajaxSetup().
     * @return {*}
     */
    ajax(url : string, settings : JQueryAjaxSettings) : JQueryXHR;

    /**
     * Handle custom Ajax options or modify existing options before each request is sent and before they are processed by $.ajax().
     * 
     * @param {string} dataTypes An optional string containing one or more space-separated dataTypes
     * @param {*} handler A handler to set default values for future Ajax requests.
     */
    ajaxPrefilter(dataTypes : string, handler : (p1: any, p2: JQueryAjaxSettings, p3: JQueryXHR) => any);

    /**
     * Handle custom Ajax options or modify existing options before each request is sent and before they are processed by $.ajax().
     * 
     * @param {*} handler A handler to set default values for future Ajax requests.
     */
    ajaxPrefilter(handler : (p1: any, p2: JQueryAjaxSettings, p3: JQueryXHR) => any);

    ajaxSettings : JQueryAjaxSettings;

    /**
     * Set default values for future Ajax requests. Its use is not recommended.
     * 
     * @param {*} options A set of key/value pairs that configure the default Ajax request. All options are optional.
     */
    ajaxSetup(options : JQueryAjaxSettings);

    /**
     * Load data from the server using a HTTP GET request.
     * 
     * @param {string} url A string containing the URL to which the request is sent.
     * @param {*} success A callback function that is executed if the request succeeds.
     * @param {string} dataType The type of data expected from the server. Default: Intelligent Guess (xml, json, script, or html).
     * @return {*}
     */
    get(url : string, success : (p1: any, p2: string, p3: JQueryXHR) => any, dataType : string) : JQueryXHR;

    /**
     * Load data from the server using a HTTP GET request.
     * 
     * @param {string} url A string containing the URL to which the request is sent.
     * @param {*} data A plain object or string that is sent to the server with the request.
     * @param {*} success A callback function that is executed if the request succeeds.
     * @param {string} dataType The type of data expected from the server. Default: Intelligent Guess (xml, json, script, or html).
     * @return {*}
     */
    get(url : string, data : any, success : (p1: any, p2: string, p3: JQueryXHR) => any, dataType : string) : JQueryXHR;

    /**
     * Load data from the server using a HTTP GET request.
     * 
     * @param {*} settings The JQueryAjaxSettings to be used for the request
     * @return {*}
     */
    get(settings : JQueryAjaxSettings) : JQueryXHR;

    /**
     * Load JSON-encoded data from the server using a GET HTTP request.
     * 
     * @param {string} url A string containing the URL to which the request is sent.
     * @param {*} success A callback function that is executed if the request succeeds.
     * @return {*}
     */
    getJSON(url : string, success : (p1: any, p2: string, p3: JQueryXHR) => any) : JQueryXHR;

    /**
     * Load JSON-encoded data from the server using a GET HTTP request.
     * 
     * @param {string} url A string containing the URL to which the request is sent.
     * @param {*} data A plain object or string that is sent to the server with the request.
     * @param {*} success A callback function that is executed if the request succeeds.
     * @return {*}
     */
    getJSON(url : string, data : any, success : (p1: any, p2: string, p3: JQueryXHR) => any) : JQueryXHR;

    /**
     * Load a JavaScript file from the server using a GET HTTP request, then execute it.
     * 
     * @param {string} url A string containing the URL to which the request is sent.
     * @param {*} success A callback function that is executed if the request succeeds.
     * @return {*}
     */
    getScript(url : string, success : (p1: string, p2: string, p3: JQueryXHR) => any) : JQueryXHR;

    /**
     * Create a serialized representation of an array or object, suitable for use in a URL query string or Ajax request.
     */
    param : any;

    /**
     * Load data from the server using a HTTP POST request.
     * 
     * @param {string} url A string containing the URL to which the request is sent.
     * @param {*} success A callback function that is executed if the request succeeds. Required if dataType is provided, but can be null in that case.
     * @param {string} dataType The type of data expected from the server. Default: Intelligent Guess (xml, json, script, text, html).
     * @return {*}
     */
    post(url : string, success : (p1: any, p2: string, p3: JQueryXHR) => any, dataType : string) : JQueryXHR;

    /**
     * Load data from the server using a HTTP POST request.
     * 
     * @param {string} url A string containing the URL to which the request is sent.
     * @param {*} data A plain object or string that is sent to the server with the request.
     * @param {*} success A callback function that is executed if the request succeeds. Required if dataType is provided, but can be null in that case.
     * @param {string} dataType The type of data expected from the server. Default: Intelligent Guess (xml, json, script, text, html).
     * @return {*}
     */
    post(url : string, data : any, success : (p1: any, p2: string, p3: JQueryXHR) => any, dataType : string) : JQueryXHR;

    /**
     * Load data from the server using a HTTP POST request.
     * 
     * @param {*} settings The JQueryAjaxSettings to be used for the request
     * @return {*}
     */
    post(settings : JQueryAjaxSettings) : JQueryXHR;

    /**
     * A multi-purpose callbacks list object that provides a powerful way to manage callback lists.
     * 
     * @param {string} flags An optional list of space-separated flags that change how the callback list behaves.
     * @return {*}
     */
    Callbacks(flags : string) : JQueryCallback;

    /**
     * Holds or releases the execution of jQuery's ready event.
     * 
     * @param {boolean} hold Indicates whether the ready hold is being requested or released
     */
    holdReady(hold : boolean);

    /**
     * Accepts a string containing a CSS selector which is then used to match a set of elements.
     * 
     * @param {string} selector A string containing a selector expression
     * @param {Element} context A DOM Element, Document, or jQuery to use as context
     * @return {*}
     */
    (selector : string, context : Element) : JQuery;

    /**
     * Accepts a string containing a CSS selector which is then used to match a set of elements.
     * 
     * @param {Element} element A DOM element to wrap in a jQuery object.
     * @return {*}
     */
    (element : Element) : JQuery;

    /**
     * Accepts a string containing a CSS selector which is then used to match a set of elements.
     * 
     * @param {Array} elementArray An array containing a set of DOM elements to wrap in a jQuery object.
     * @return {*}
     */
    (elementArray : Element[]) : JQuery;

    /**
     * Binds a function to be executed when the DOM has finished loading.
     * 
     * @param {*} callback A function to execute after the DOM is ready.
     * @return {*}
     */
    (callback : (p1: JQueryStatic) => any) : JQuery;

    /**
     * Accepts a string containing a CSS selector which is then used to match a set of elements.
     * 
     * @param {*} object A plain object to wrap in a jQuery object.
     * @return {*}
     */
    (object : any) : JQuery;

    /**
     * Accepts a string containing a CSS selector which is then used to match a set of elements.
     * 
     * @param {*} object An existing jQuery object to clone.
     * @return {*}
     */
    (object : JQuery) : JQuery;

    /**
     * Specify a function to execute when the DOM is fully loaded.
     * @return {*}
     */
    () : JQuery;

    /**
     * Creates DOM elements on the fly from the provided string of raw HTML.
     * 
     * @param {string} html A string of HTML to create on the fly. Note that this parses HTML, not XML.
     * @param {Document} ownerDocument A document in which the new elements will be created.
     * @return {*}
     */
    (html : string, ownerDocument : Document) : JQuery;

    /**
     * Creates DOM elements on the fly from the provided string of raw HTML.
     * 
     * @param {string} html A string defining a single, standalone, HTML element (e.g. <div/> or <div></div>).
     * @param {*} attributes An object of attributes, events, and methods to call on the newly-created element.
     * @return {*}
     */
    (html : string, attributes : any) : JQuery;

    /**
     * Relinquish jQuery's control of the $ variable.
     * 
     * @param {boolean} removeAll A Boolean indicating whether to remove all jQuery variables from the global scope (including jQuery itself).
     * @return {*}
     */
    noConflict(removeAll : boolean) : JQueryStatic;

    /**
     * Provides a way to execute callback functions based on one or more objects, usually Deferred objects that represent asynchronous events.
     * 
     * @param {Array} deferreds One or more Deferred objects, or plain JavaScript objects.
     * @return {*}
     */
    when<T>(...deferreds : any[]) : JQueryPromise<T>;

    /**
     * Hook directly into jQuery to override how particular CSS properties are retrieved or set, normalize CSS property naming, or create custom properties.
     */
    cssHooks : any;

    cssNumber : any;

    /**
     * Store arbitrary data associated with the specified element. Returns the value that was set.
     * 
     * @param {Element} element The DOM element to associate with the data.
     * @param {string} key A string naming the piece of data to set.
     * @param {*} value The new data value.
     * @return {*}
     */
    data<T>(element : Element, key : string, value : T) : T;

    /**
     * Returns value at named data store for the element, as set by jQuery.data(element, name, value), or the full data store for the element.
     * 
     * @param {Element} element The DOM element to associate with the data.
     * @param {string} key A string naming the piece of data to set.
     * @return {*}
     */
    data(element : Element, key : string) : any;

    /**
     * Returns value at named data store for the element, as set by jQuery.data(element, name, value), or the full data store for the element.
     * 
     * @param {Element} element The DOM element to associate with the data.
     * @return {*}
     */
    data(element : Element) : any;

    /**
     * Execute the next function on the queue for the matched element.
     * 
     * @param {Element} element A DOM element from which to remove and execute a queued function.
     * @param {string} queueName A string containing the name of the queue. Defaults to fx, the standard effects queue.
     */
    dequeue(element : Element, queueName : string);

    /**
     * Determine whether an element has any jQuery data associated with it.
     * 
     * @param {Element} element A DOM element to be checked for data.
     * @return {boolean}
     */
    hasData(element : Element) : boolean;

    /**
     * Show the queue of functions to be executed on the matched element.
     * 
     * @param {Element} element A DOM element to inspect for an attached queue.
     * @param {string} queueName A string containing the name of the queue. Defaults to fx, the standard effects queue.
     * @return {Array}
     */
    queue(element : Element, queueName : string) : any[];

    /**
     * Manipulate the queue of functions to be executed on the matched element.
     * 
     * @param {Element} element A DOM element where the array of queued functions is attached.
     * @param {string} queueName A string containing the name of the queue. Defaults to fx, the standard effects queue.
     * @param {Array} newQueue An array of functions to replace the current queue contents.
     * @return {*}
     */
    queue(element : Element, queueName : string, newQueue : Function[]) : JQuery;

    /**
     * Manipulate the queue of functions to be executed on the matched element.
     * 
     * @param {Element} element A DOM element on which to add a queued function.
     * @param {string} queueName A string containing the name of the queue. Defaults to fx, the standard effects queue.
     * @param {Function} callback The new function to add to the queue.
     * @return {*}
     */
    queue(element : Element, queueName : string, callback : Function) : JQuery;

    /**
     * Remove a previously-stored piece of data.
     * 
     * @param {Element} element A DOM element from which to remove data.
     * @param {string} name A string naming the piece of data to remove.
     * @return {*}
     */
    removeData(element : Element, name : string) : JQuery;

    /**
     * A constructor function that returns a chainable utility object with methods to register multiple callbacks into callback queues, invoke callback queues, and relay the success or failure state of any synchronous or asynchronous function.
     * 
     * @param {*} beforeStart A function that is called just before the constructor returns.
     * @return {*}
     */
    Deferred<T>(beforeStart : (p1: JQueryDeferred<T>) => any) : JQueryDeferred<T>;

    /**
     * Effects
     */
    easing : JQueryEasingFunctions;

    fx : any;

    /**
     * Takes a function and returns a new one that will always have a particular context.
     * 
     * @param {*} fnction The function whose context will be changed.
     * @param {*} context The object to which the context (this) of the function should be set.
     * @param {Array} additionalArguments Any number of arguments to be passed to the function referenced in the function argument.
     * @return {*}
     */
    proxy(fnction : (p1: any) => any, context : any, ...additionalArguments : any[]) : any;

    /**
     * Takes a function and returns a new one that will always have a particular context.
     * 
     * @param {*} context The object to which the context (this) of the function should be set.
     * @param {string} name The name of the function whose context will be changed (should be a property of the context object).
     * @param {Array} additionalArguments Any number of arguments to be passed to the function named in the name argument.
     * @return {*}
     */
    proxy(context : any, name : string, ...additionalArguments : any[]) : any;

    Event : any;

    /**
     * Takes a string and throws an exception containing it.
     * 
     * @param {*} message The message to send out.
     * @return {*}
     */
    error(message : any) : JQuery;

    expr : any;

    fn : any;

    isReady : boolean;

    support : JQuerySupport;

    /**
     * Check to see if a DOM element is a descendant of another DOM element.
     * 
     * @param {Element} container The DOM element that may contain the other element.
     * @param {Element} contained The DOM element that may be contained by (a descendant of) the other element.
     * @return {boolean}
     */
    contains(container : Element, contained : Element) : boolean;

    /**
     * A generic iterator function, which can be used to seamlessly iterate over both objects and arrays. Arrays and array-like objects with a length property (such as a function's arguments object) are iterated by numeric index, from 0 to length-1. Other objects are iterated via their named properties.
     * 
     * @param {Array} collection The object or array to iterate over.
     * @param {*} callback The function that will be executed on every object.
     * @return {*}
     */
    each<T>(collection : T[], callback : (p1: number, p2: T) => any) : any;

    /**
     * A generic iterator function, which can be used to seamlessly iterate over both objects and arrays. Arrays and array-like objects with a length property (such as a function's arguments object) are iterated by numeric index, from 0 to length-1. Other objects are iterated via their named properties.
     * 
     * @param {*} collection The object or array to iterate over.
     * @param {*} callback The function that will be executed on every object.
     * @return {*}
     */
    each(collection : any, callback : (p1: any, p2: any) => any) : any;

    /**
     * Merge the contents of two or more objects together into the first object.
     * 
     * @param {*} target An object that will receive the new properties if additional objects are passed in or that will extend the jQuery namespace if it is the sole argument.
     * @param {*} object1 An object containing additional properties to merge in.
     * @param {Array} objectN Additional objects containing properties to merge in.
     * @return {*}
     */
    extend(target : any, object1 : any, ...objectN : any[]) : any;

    /**
     * Merge the contents of two or more objects together into the first object.
     * 
     * @param {boolean} deep If true, the merge becomes recursive (aka. deep copy).
     * @param {*} target The object to extend. It will receive the new properties.
     * @param {*} object1 An object containing additional properties to merge in.
     * @param {Array} objectN Additional objects containing properties to merge in.
     * @return {*}
     */
    extend(deep : boolean, target : any, object1 : any, ...objectN : any[]) : any;

    /**
     * Execute some JavaScript code globally.
     * 
     * @param {string} code The JavaScript code to execute.
     * @return {*}
     */
    globalEval(code : string) : any;

    /**
     * Finds the elements of an array which satisfy a filter function. The original array is not affected.
     * 
     * @param {Array} array The array to search through.
     * @param {*} func The function to process each item against. The first argument to the function is the item, and the second argument is the index. The function should return a Boolean value.  this will be the global window object.
     * @param {boolean} invert If "invert" is false, or not provided, then the function returns an array consisting of all elements for which "callback" returns true. If "invert" is true, then the function returns an array consisting of all elements for which "callback" returns false.
     * @return {Array}
     */
    grep<T>(array : T[], func : (p1: T, p2: number) => boolean, invert : boolean) : T[];

    /**
     * Search for a specified value within an array and return its index (or -1 if not found).
     * 
     * @param {*} value The value to search for.
     * @param {Array} array An array through which to search.
     * @param {number} fromIndex he index of the array at which to begin the search. The default is 0, which will search the whole array.
     * @return {number}
     */
    inArray<T>(value : T, array : T[], fromIndex : number) : number;

    /**
     * Determine whether the argument is an array.
     * 
     * @param {*} obj Object to test whether or not it is an array.
     * @return {boolean}
     */
    isArray(obj : any) : boolean;

    /**
     * Check to see if an object is empty (contains no enumerable properties).
     * 
     * @param {*} obj The object that will be checked to see if it's empty.
     * @return {boolean}
     */
    isEmptyObject(obj : any) : boolean;

    /**
     * Determine if the argument passed is a Javascript function object.
     * 
     * @param {*} obj Object to test whether or not it is a function.
     * @return {boolean}
     */
    isFunction(obj : any) : boolean;

    /**
     * Determines whether its argument is a number.
     * 
     * @param obj The value to be tested.
     * @param {*} value
     * @return {boolean}
     */
    isNumeric(value : any) : boolean;

    /**
     * Check to see if an object is a plain object (created using "{}" or "new Object").
     * 
     * @param {*} obj The object that will be checked to see if it's a plain object.
     * @return {boolean}
     */
    isPlainObject(obj : any) : boolean;

    /**
     * Determine whether the argument is a window.
     * 
     * @param {*} obj Object to test whether or not it is a window.
     * @return {boolean}
     */
    isWindow(obj : any) : boolean;

    /**
     * Check to see if a DOM node is within an XML document (or is an XML document).
     * 
     * @param {Node} node he DOM node that will be checked to see if it's in an XML document.
     * @return {boolean}
     */
    isXMLDoc(node : Node) : boolean;

    /**
     * Convert an array-like object into a true JavaScript array.
     * 
     * @param {*} obj Any object to turn into a native Array.
     * @return {Array}
     */
    makeArray(obj : any) : any[];

    /**
     * Translate all items in an array or object to new array of items.
     * 
     * @param {Array} array The Array to translate.
     * @param {*} callback The function to process each item against. The first argument to the function is the array item, the second argument is the index in array The function can return any value. Within the function, this refers to the global (window) object.
     * @return {Array}
     */
    map<T, U>(array : T[], callback : (p1: T, p2: number) => U) : U[];

    /**
     * Translate all items in an array or object to new array of items.
     * 
     * @param {*} arrayOrObject The Array or Object to translate.
     * @param {*} callback The function to process each item against. The first argument to the function is the value; the second argument is the index or key of the array or object property. The function can return any value to add to the array. A returned array will be flattened into the resulting array. Within the function, this refers to the global (window) object.
     * @return {*}
     */
    map(arrayOrObject : any, callback : (p1: any, p2: any) => any) : any;

    /**
     * Merge the contents of two arrays together into the first array.
     * 
     * @param {Array} first The first array to merge, the elements of second added.
     * @param {Array} second The second array to merge into the first, unaltered.
     * @return {Array}
     */
    merge<T>(first : T[], second : T[]) : T[];

    /**
     * An empty function.
     * @return {*}
     */
    noop() : any;

    /**
     * Return a number representing the current time.
     * @return {number}
     */
    now() : number;

    /**
     * Takes a well-formed JSON string and returns the resulting JavaScript object.
     * 
     * @param {string} json The JSON string to parse.
     * @return {*}
     */
    parseJSON(json : string) : any;

    /**
     * Parses a string into an XML document.
     * 
     * @param {string} data a well-formed XML string to be parsed
     * @return {XMLDocument}
     */
    parseXML(data : string) : XMLDocument;

    /**
     * Remove the whitespace from the beginning and end of a string.
     * 
     * @param {string} str Remove the whitespace from the beginning and end of a string.
     * @return {string}
     */
    trim(str : string) : string;

    /**
     * Determine the internal JavaScript [[Class]] of an object.
     * 
     * @param {*} obj Object to get the internal JavaScript [[Class]] of.
     * @return {string}
     */
    type(obj : any) : string;

    /**
     * Sorts an array of DOM elements, in place, with the duplicates removed. Note that this only works on arrays of DOM elements, not strings or numbers.
     * 
     * @param {Array} array The Array of DOM elements.
     * @return {Array}
     */
    unique(array : Element[]) : Element[];

    /**
     * Parses a string into an array of DOM nodes.
     * 
     * @param {string} data HTML string to be parsed
     * @param {HTMLElement} context DOM element to serve as the context in which the HTML fragment will be created
     * @param {boolean} keepScripts A Boolean indicating whether to include scripts passed in the HTML string
     * @return {Array}
     */
    parseHTML(data : string, context : HTMLElement, keepScripts : boolean) : any[];

    /**
     * Parses a string into an array of DOM nodes.
     * 
     * @param {string} data HTML string to be parsed
     * @param {Document} context DOM element to serve as the context in which the HTML fragment will be created
     * @param {boolean} keepScripts A Boolean indicating whether to include scripts passed in the HTML string
     * @return {Array}
     */
    parseHTML(data : string, context : Document, keepScripts : boolean) : any[];

    /**
     * Perform an asynchronous HTTP (Ajax) request.
     * 
     * @param {string} url A string containing the URL to which the request is sent.
     * @param settings A set of key/value pairs that configure the Ajax request. All settings are optional. A default can be set for any option with $.ajaxSetup().
     * @return {*}
     */
    ajax(url : string) : JQueryXHR;

    /**
     * Load data from the server using a HTTP GET request.
     * 
     * @param {string} url A string containing the URL to which the request is sent.
     * @param {*} success A callback function that is executed if the request succeeds.
     * @param dataType The type of data expected from the server. Default: Intelligent Guess (xml, json, script, or html).
     * @return {*}
     */
    get(url : string, success : (p1: any, p2: string, p3: JQueryXHR) => any) : JQueryXHR;

    /**
     * Load data from the server using a HTTP GET request.
     * 
     * @param {string} url A string containing the URL to which the request is sent.
     * @param success A callback function that is executed if the request succeeds.
     * @param dataType The type of data expected from the server. Default: Intelligent Guess (xml, json, script, or html).
     * @return {*}
     */
    get(url : string) : JQueryXHR;

    /**
     * Load data from the server using a HTTP GET request.
     * 
     * @param {string} url A string containing the URL to which the request is sent.
     * @param {*} data A plain object or string that is sent to the server with the request.
     * @param {*} success A callback function that is executed if the request succeeds.
     * @param dataType The type of data expected from the server. Default: Intelligent Guess (xml, json, script, or html).
     * @return {*}
     */
    get(url : string, data : any, success : (p1: any, p2: string, p3: JQueryXHR) => any) : JQueryXHR;

    /**
     * Load data from the server using a HTTP GET request.
     * 
     * @param {string} url A string containing the URL to which the request is sent.
     * @param {*} data A plain object or string that is sent to the server with the request.
     * @param success A callback function that is executed if the request succeeds.
     * @param dataType The type of data expected from the server. Default: Intelligent Guess (xml, json, script, or html).
     * @return {*}
     */
    get(url : string, data : any) : JQueryXHR;

    /**
     * Load JSON-encoded data from the server using a GET HTTP request.
     * 
     * @param {string} url A string containing the URL to which the request is sent.
     * @param success A callback function that is executed if the request succeeds.
     * @return {*}
     */
    getJSON(url : string) : JQueryXHR;

    /**
     * Load JSON-encoded data from the server using a GET HTTP request.
     * 
     * @param {string} url A string containing the URL to which the request is sent.
     * @param {*} data A plain object or string that is sent to the server with the request.
     * @param success A callback function that is executed if the request succeeds.
     * @return {*}
     */
    getJSON(url : string, data : any) : JQueryXHR;

    /**
     * Load a JavaScript file from the server using a GET HTTP request, then execute it.
     * 
     * @param {string} url A string containing the URL to which the request is sent.
     * @param success A callback function that is executed if the request succeeds.
     * @return {*}
     */
    getScript(url : string) : JQueryXHR;

    /**
     * Load data from the server using a HTTP POST request.
     * 
     * @param {string} url A string containing the URL to which the request is sent.
     * @param {*} success A callback function that is executed if the request succeeds. Required if dataType is provided, but can be null in that case.
     * @param dataType The type of data expected from the server. Default: Intelligent Guess (xml, json, script, text, html).
     * @return {*}
     */
    post(url : string, success : (p1: any, p2: string, p3: JQueryXHR) => any) : JQueryXHR;

    /**
     * Load data from the server using a HTTP POST request.
     * 
     * @param {string} url A string containing the URL to which the request is sent.
     * @param success A callback function that is executed if the request succeeds. Required if dataType is provided, but can be null in that case.
     * @param dataType The type of data expected from the server. Default: Intelligent Guess (xml, json, script, text, html).
     * @return {*}
     */
    post(url : string) : JQueryXHR;

    /**
     * Load data from the server using a HTTP POST request.
     * 
     * @param {string} url A string containing the URL to which the request is sent.
     * @param {*} data A plain object or string that is sent to the server with the request.
     * @param {*} success A callback function that is executed if the request succeeds. Required if dataType is provided, but can be null in that case.
     * @param dataType The type of data expected from the server. Default: Intelligent Guess (xml, json, script, text, html).
     * @return {*}
     */
    post(url : string, data : any, success : (p1: any, p2: string, p3: JQueryXHR) => any) : JQueryXHR;

    /**
     * Load data from the server using a HTTP POST request.
     * 
     * @param {string} url A string containing the URL to which the request is sent.
     * @param {*} data A plain object or string that is sent to the server with the request.
     * @param success A callback function that is executed if the request succeeds. Required if dataType is provided, but can be null in that case.
     * @param dataType The type of data expected from the server. Default: Intelligent Guess (xml, json, script, text, html).
     * @return {*}
     */
    post(url : string, data : any) : JQueryXHR;

    /**
     * A multi-purpose callbacks list object that provides a powerful way to manage callback lists.
     * 
     * @param flags An optional list of space-separated flags that change how the callback list behaves.
     * @return {*}
     */
    Callbacks() : JQueryCallback;

    /**
     * Accepts a string containing a CSS selector which is then used to match a set of elements.
     * 
     * @param {string} selector A string containing a selector expression
     * @param context A DOM Element, Document, or jQuery to use as context
     * @return {*}
     */
    (selector : string) : JQuery;

    /**
     * Relinquish jQuery's control of the $ variable.
     * 
     * @param removeAll A Boolean indicating whether to remove all jQuery variables from the global scope (including jQuery itself).
     * @return {*}
     */
    noConflict() : JQueryStatic;

    /**
     * Execute the next function on the queue for the matched element.
     * 
     * @param {Element} element A DOM element from which to remove and execute a queued function.
     * @param queueName A string containing the name of the queue. Defaults to fx, the standard effects queue.
     */
    dequeue(element : Element);

    /**
     * Show the queue of functions to be executed on the matched element.
     * 
     * @param {Element} element A DOM element to inspect for an attached queue.
     * @param queueName A string containing the name of the queue. Defaults to fx, the standard effects queue.
     * @return {Array}
     */
    queue(element : Element) : any[];

    /**
     * Remove a previously-stored piece of data.
     * 
     * @param {Element} element A DOM element from which to remove data.
     * @param name A string naming the piece of data to remove.
     * @return {*}
     */
    removeData(element : Element) : JQuery;

    /**
     * A constructor function that returns a chainable utility object with methods to register multiple callbacks into callback queues, invoke callback queues, and relay the success or failure state of any synchronous or asynchronous function.
     * 
     * @param beforeStart A function that is called just before the constructor returns.
     * @return {*}
     */
    Deferred<T>() : JQueryDeferred<T>;

    /**
     * Merge the contents of two or more objects together into the first object.
     * 
     * @param {*} target An object that will receive the new properties if additional objects are passed in or that will extend the jQuery namespace if it is the sole argument.
     * @param object1 An object containing additional properties to merge in.
     * @param objectN Additional objects containing properties to merge in.
     * @return {*}
     */
    extend(target : any) : any;

    /**
     * Merge the contents of two or more objects together into the first object.
     * 
     * @param {boolean} deep If true, the merge becomes recursive (aka. deep copy).
     * @param {*} target The object to extend. It will receive the new properties.
     * @param object1 An object containing additional properties to merge in.
     * @param objectN Additional objects containing properties to merge in.
     * @return {*}
     */
    extend(deep : boolean, target : any) : any;

    /**
     * Finds the elements of an array which satisfy a filter function. The original array is not affected.
     * 
     * @param {Array} array The array to search through.
     * @param {*} func The function to process each item against. The first argument to the function is the item, and the second argument is the index. The function should return a Boolean value.  this will be the global window object.
     * @param invert If "invert" is false, or not provided, then the function returns an array consisting of all elements for which "callback" returns true. If "invert" is true, then the function returns an array consisting of all elements for which "callback" returns false.
     * @return {Array}
     */
    grep<T>(array : T[], func : (p1: T, p2: number) => boolean) : T[];

    /**
     * Search for a specified value within an array and return its index (or -1 if not found).
     * 
     * @param {*} value The value to search for.
     * @param {Array} array An array through which to search.
     * @param fromIndex he index of the array at which to begin the search. The default is 0, which will search the whole array.
     * @return {number}
     */
    inArray<T>(value : T, array : T[]) : number;

    /**
     * Parses a string into an array of DOM nodes.
     * 
     * @param {string} data HTML string to be parsed
     * @param {HTMLElement} context DOM element to serve as the context in which the HTML fragment will be created
     * @param keepScripts A Boolean indicating whether to include scripts passed in the HTML string
     * @return {Array}
     */
    parseHTML(data : string, context : HTMLElement) : any[];

    /**
     * Parses a string into an array of DOM nodes.
     * 
     * @param {string} data HTML string to be parsed
     * @param context DOM element to serve as the context in which the HTML fragment will be created
     * @param keepScripts A Boolean indicating whether to include scripts passed in the HTML string
     * @return {Array}
     */
    parseHTML(data : string) : any[];

    /**
     * Parses a string into an array of DOM nodes.
     * 
     * @param {string} data HTML string to be parsed
     * @param {Document} context DOM element to serve as the context in which the HTML fragment will be created
     * @param keepScripts A Boolean indicating whether to include scripts passed in the HTML string
     * @return {Array}
     */
    parseHTML(data : string, context : Document) : any[];

    /**
     * Binds a function to be executed when the DOM has finished loading.
     * 
     * @param {*} callback A function to execute after the DOM is ready.
     * @return {*}
     */
    (callback : () => any) : JQuery;

    /**
     * Finds the elements of an array which satisfy a filter function. The original array is not affected.
     * 
     * @param {Array} array The array to search through.
     * @param {*} func The function to process each item against. The first argument to the function is the item, and the second argument is the index. The function should return a Boolean value.  this will be the global window object.
     * @param {boolean} invert If "invert" is false, or not provided, then the function returns an array consisting of all elements for which "callback" returns true. If "invert" is true, then the function returns an array consisting of all elements for which "callback" returns false.
     * @return {Array}
     */
    grep<T>(array : T[], func : (p1: T) => boolean, invert : boolean) : T[];

    /**
     * Finds the elements of an array which satisfy a filter function. The original array is not affected.
     * 
     * @param {Array} array The array to search through.
     * @param {*} func The function to process each item against. The first argument to the function is the item, and the second argument is the index. The function should return a Boolean value.  this will be the global window object.
     * @param {boolean} invert If "invert" is false, or not provided, then the function returns an array consisting of all elements for which "callback" returns true. If "invert" is true, then the function returns an array consisting of all elements for which "callback" returns false.
     * @return {Array}
     */
    grep<T>(array : T[], func : () => boolean, invert : boolean) : T[];

    /**
     * Translate all items in an array or object to new array of items.
     * 
     * @param {Array} array The Array to translate.
     * @param {*} callback The function to process each item against. The first argument to the function is the array item, the second argument is the index in array The function can return any value. Within the function, this refers to the global (window) object.
     * @return {Array}
     */
    map<T, U>(array : T[], callback : (p1: T) => U) : U[];

    /**
     * Translate all items in an array or object to new array of items.
     * 
     * @param {Array} array The Array to translate.
     * @param {*} callback The function to process each item against. The first argument to the function is the array item, the second argument is the index in array The function can return any value. Within the function, this refers to the global (window) object.
     * @return {Array}
     */
    map<T, U>(array : T[], callback : () => U) : U[];

    /**
     * Translate all items in an array or object to new array of items.
     * 
     * @param {*} arrayOrObject The Array or Object to translate.
     * @param {*} callback The function to process each item against. The first argument to the function is the value; the second argument is the index or key of the array or object property. The function can return any value to add to the array. A returned array will be flattened into the resulting array. Within the function, this refers to the global (window) object.
     * @return {*}
     */
    map(arrayOrObject : any, callback : (p1: any) => any) : any;

    /**
     * Translate all items in an array or object to new array of items.
     * 
     * @param {*} arrayOrObject The Array or Object to translate.
     * @param {*} callback The function to process each item against. The first argument to the function is the value; the second argument is the index or key of the array or object property. The function can return any value to add to the array. A returned array will be flattened into the resulting array. Within the function, this refers to the global (window) object.
     * @return {*}
     */
    map(arrayOrObject : any, callback : () => any) : any;

    /**
     * Finds the elements of an array which satisfy a filter function. The original array is not affected.
     * 
     * @param {Array} array The array to search through.
     * @param {*} func The function to process each item against. The first argument to the function is the item, and the second argument is the index. The function should return a Boolean value.  this will be the global window object.
     * @param invert If "invert" is false, or not provided, then the function returns an array consisting of all elements for which "callback" returns true. If "invert" is true, then the function returns an array consisting of all elements for which "callback" returns false.
     * @return {Array}
     */
    grep<T>(array : T[], func : (p1: T) => boolean) : T[];

    /**
     * Finds the elements of an array which satisfy a filter function. The original array is not affected.
     * 
     * @param {Array} array The array to search through.
     * @param {*} func The function to process each item against. The first argument to the function is the item, and the second argument is the index. The function should return a Boolean value.  this will be the global window object.
     * @param invert If "invert" is false, or not provided, then the function returns an array consisting of all elements for which "callback" returns true. If "invert" is true, then the function returns an array consisting of all elements for which "callback" returns false.
     * @return {Array}
     */
    grep<T>(array : T[], func : () => boolean) : T[];

    /**
     * Load data from the server using a HTTP GET request.
     * 
     * @param {string} url A string containing the URL to which the request is sent.
     * @param {string} data A plain object or string that is sent to the server with the request.
     * @param {*} success A callback function that is executed if the request succeeds.
     * @param {string} dataType The type of data expected from the server. Default: Intelligent Guess (xml, json, script, or html).
     * @return {*}
     */
    get(url : string, data : string, success : (p1: any, p2: string, p3: JQueryXHR) => any, dataType : string) : JQueryXHR;

    /**
     * Load JSON-encoded data from the server using a GET HTTP request.
     * 
     * @param {string} url A string containing the URL to which the request is sent.
     * @param {string} data A plain object or string that is sent to the server with the request.
     * @param {*} success A callback function that is executed if the request succeeds.
     * @return {*}
     */
    getJSON(url : string, data : string, success : (p1: any, p2: string, p3: JQueryXHR) => any) : JQueryXHR;

    /**
     * Load data from the server using a HTTP POST request.
     * 
     * @param {string} url A string containing the URL to which the request is sent.
     * @param {string} data A plain object or string that is sent to the server with the request.
     * @param {*} success A callback function that is executed if the request succeeds. Required if dataType is provided, but can be null in that case.
     * @param {string} dataType The type of data expected from the server. Default: Intelligent Guess (xml, json, script, text, html).
     * @return {*}
     */
    post(url : string, data : string, success : (p1: any, p2: string, p3: JQueryXHR) => any, dataType : string) : JQueryXHR;

    /**
     * Accepts a string containing a CSS selector which is then used to match a set of elements.
     * 
     * @param {string} selector A string containing a selector expression
     * @param {*} context A DOM Element, Document, or jQuery to use as context
     * @return {*}
     */
    (selector : string, context : JQuery) : JQuery;

    /**
     * Provides a way to execute callback functions based on one or more objects, usually Deferred objects that represent asynchronous events.
     * 
     * @param {Array} deferreds One or more Deferred objects, or plain JavaScript objects.
     * @return {*}
     */
    when<T>(...deferreds : any[]) : JQueryPromise<T>;

    /**
     * Load data from the server using a HTTP GET request.
     * 
     * @param {string} url A string containing the URL to which the request is sent.
     * @param {string} data A plain object or string that is sent to the server with the request.
     * @param {*} success A callback function that is executed if the request succeeds.
     * @param dataType The type of data expected from the server. Default: Intelligent Guess (xml, json, script, or html).
     * @return {*}
     */
    get(url : string, data : string, success : (p1: any, p2: string, p3: JQueryXHR) => any) : JQueryXHR;

    /**
     * Load data from the server using a HTTP GET request.
     * 
     * @param {string} url A string containing the URL to which the request is sent.
     * @param {string} data A plain object or string that is sent to the server with the request.
     * @param success A callback function that is executed if the request succeeds.
     * @param dataType The type of data expected from the server. Default: Intelligent Guess (xml, json, script, or html).
     * @return {*}
     */
    get(url : string, data : string) : JQueryXHR;

    /**
     * Load JSON-encoded data from the server using a GET HTTP request.
     * 
     * @param {string} url A string containing the URL to which the request is sent.
     * @param {string} data A plain object or string that is sent to the server with the request.
     * @param success A callback function that is executed if the request succeeds.
     * @return {*}
     */
    getJSON(url : string, data : string) : JQueryXHR;

    /**
     * Load data from the server using a HTTP POST request.
     * 
     * @param {string} url A string containing the URL to which the request is sent.
     * @param {string} data A plain object or string that is sent to the server with the request.
     * @param {*} success A callback function that is executed if the request succeeds. Required if dataType is provided, but can be null in that case.
     * @param dataType The type of data expected from the server. Default: Intelligent Guess (xml, json, script, text, html).
     * @return {*}
     */
    post(url : string, data : string, success : (p1: any, p2: string, p3: JQueryXHR) => any) : JQueryXHR;

    /**
     * Load data from the server using a HTTP POST request.
     * 
     * @param {string} url A string containing the URL to which the request is sent.
     * @param {string} data A plain object or string that is sent to the server with the request.
     * @param success A callback function that is executed if the request succeeds. Required if dataType is provided, but can be null in that case.
     * @param dataType The type of data expected from the server. Default: Intelligent Guess (xml, json, script, text, html).
     * @return {*}
     */
    post(url : string, data : string) : JQueryXHR;

    /**
     * Provides a way to execute callback functions based on one or more objects, usually Deferred objects that represent asynchronous events.
     * 
     * @param {Array} deferreds One or more Deferred objects, or plain JavaScript objects.
     * @return {*}
     */
    when<T>(...deferreds : T[]) : JQueryPromise<T>;

    /**
     * Provides a way to execute callback functions based on one or more objects, usually Deferred objects that represent asynchronous events.
     * 
     * @param {Array} deferreds One or more Deferred objects, or plain JavaScript objects.
     * @return {*}
     */
    when<T>(...deferreds : JQueryPromise<T>[]) : JQueryPromise<T>;
}



declare module "jquery";
