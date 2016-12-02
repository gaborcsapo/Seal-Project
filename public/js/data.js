var files = [];

// sdata combines all data files and contains objects for each depth measurement
var sdata = [];

function dataPoint(data, depth, temp, sal) {
    this.ref = data.ref;
    this.PTT = data.PTT
    this.END_DATE = data.END_DATE;
    this.MAX_DBAR = data.MAX_DBAR;
    this.LAT = data.LAT;
    this.LON = data.LON;
    this.DBAR = depth;
    this.TEMP = temp;
    this.SAL = sal;
}

function createDataPoint(data){
    return new Promise(function (resolve, reject) {
        files.push(data);
        data.forEach(function(d) {

            // DELETE CAST TO NUMBER EVERYTHINg!!!!!!!!!!!!!!!!!
            d.LAT = Number(d.LAT);
            d.LON = Number(d.LON);
            // DELETE CAST TO NUMBER EVERYTHINg!!!!!!!!!!!!!!!!!

            d.PTT = +d.PTT;
            d.MAX_DBAR = +d.MAX_DBAR;
            d.LAT = +d.LAT;
            d.LON = +d.LON;
            d.NUM = +d.NUM;
            d.N_TEMP = +d.N_TEMP;
            d.N_COND = +d.N_COND;
            d.N_SAL = +d.N_SAL;
            //Temperature at different depths
            d.TEMP_DBAR = d.TEMP_DBAR.split(",");
            for (var i = 0; i < d.TEMP_DBAR.length; i++) {
                d.TEMP_DBAR[i] = +d.TEMP_DBAR[i];
            }
            d.TEMP_VALS = d.TEMP_VALS.split(",");
            for (var i = 0; i < d.TEMP_VALS.length; i++) {
                d.TEMP_VALS[i] = +d.TEMP_VALS[i];
            }
            //Salinity at different depths
            d.SAL_DBAR = d.SAL_DBAR.split(",");
            for (var i = 0; i < d.SAL_DBAR.length; i++) {
                d.SAL_DBAR[i] = +d.SAL_DBAR[i];
            }
            d.SAL_VALS = d.SAL_VALS.split(",");
            for (var i = 0; i < d.SAL_VALS.length; i++) {
                d.SAL_VALS[i] = +d.SAL_VALS[i];
            }
            //Sal_CORRECTED_VALS
            d.SAL_CORRECTED_VALS = d.SAL_CORRECTED_VALS.split(",");
            for (var i = 0; i < d.SAL_CORRECTED_VALS.length; i++) {
                d.SAL_CORRECTED_VALS[i] = +d.SAL_CORRECTED_VALS[i];
            }

            //Add objects for the various depths into sdata array
            for (var i = 0; i < d.N_TEMP; i++) {
                point = new dataPoint(d, d.TEMP_DBAR[i], d.TEMP_VALS[i], d.SAL_VALS[i]);
                sdata.push(point);
            }
        });
        console.log('file loaded')
    });
}

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('d3-request')) :
  typeof define === 'function' && define.amd ? define(['d3-request'], factory) :
  (global.d3 = global.d3 || {}, global.d3.promise = factory(global.d3));
}(this, (function (d3) { 'use strict';

function promisify(caller, fn) {
  return function () {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return new Promise(function (resolve, reject) {
      var callback = function callback(error, data) {
        if (error) {
          reject(Error(error));
          return;
        }
        resolve(data);
      };
      fn.apply(caller, args.concat(callback));
    });
  };
}

var module$1 = {};

['csv', 'tsv', 'json', 'xml', 'text', 'html'].forEach(function (fnName) {
  module$1[fnName] = promisify(d3, d3[fnName]);
});

return module$1;

})));


let promiseFile1 = d3.promise.csv("rs14years12.csv");
let promiseFile2 = d3.promise.csv("rs19years13.csv");
let promiseFile3 = d3.promise.csv("rs23years14-15.csv");