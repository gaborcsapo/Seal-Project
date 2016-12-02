var file1, file2, file3;

// sdata combines all data files and contains objects for each depth measurement
var sdata = new Array();

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

// load data year 12
d3.csv("rs14years12.csv", function(data) {
    file1 = data;
    data.forEach(function(d) {
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
});

// load data year 13
d3.csv("rs19years13.csv", function(data) {
    file2 = data;
    data.forEach(function(d) {
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
});

// load data year 14-15
d3.csv("rs23years14-15.csv", function(data) {
    file3 = data;
    data.forEach(function(d) {
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
});

console.log(sdata);
