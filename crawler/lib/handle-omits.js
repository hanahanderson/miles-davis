const async = require("async");
const fs = require("fs");
	
var pageDataObj = {
	Miles_Davis: {
		pageId: "page-1895",
		URL: "Miles_Davis",
		name: "Miles Davis",
		subject: "musicians",
		// sectionHeader: sectionHeader,
		// sectionIndex: sectionIndex,
		pageViews: "undefined",
		nameOverride: "Miles Davis",
		subjectRemapping: "musicians",
		// sectionRemapping: sectionRemapping,
		omit: "",
		miles_work: ""
	}
};

async.series({
  readRemapped: (cb) => {

    fs.readFile(`${__dirname}/../../data/re-mapped-data-id.tsv`, "utf8", (error, rows) => {
      if (error) throw error;
     		
     	async.forEachSeries(rows.split("\n").slice(1), (row, cb1) => {

     		if(row.trim().length > 0){
     			var parts = row.split("\t");
     			pageId	= parts[0];
     			URL	= parts[1];
     			name	= parts[2];
     			subject	= parts[3];
     			sectionHeader	= parts[4];
     			sectionIndex	= parts[5];
     			pageViews	= parts[6];
					//= parts[7];
     			nameOverride	= parts[8];
     			subjectRemapping	= parts[9];
     			sectionRemapping	= parts[10];
     			omit = parts[11];
     			miles_work = parts[12];

     			if(typeof pageDataObj[URL.toLowerCase()] === "undefined") {
     				pageDataObj[URL.toLowerCase()] = {
     					pageId: pageId,
							URL: URL,
							name: name,
							subject: subject,
							// sectionHeader: sectionHeader,
							// sectionIndex: sectionIndex,
							pageViews: pageViews,
							nameOverride: nameOverride,
							subjectRemapping: subjectRemapping,
							// sectionRemapping: sectionRemapping,
							omit: omit,
							miles_work: miles_work
     				}
     			}

          if( omit === "1"){
            pageDataObj[URL.toLowerCase()].omit = "1";
          }
     		}
     		async.setImmediate(() => { cb1(); });
     	}, () => {
     		cb();
     	});

    });

  },
  iterateGeneratedData: (cb) => {
  	var files = ["", "-dates", "-from", "-genres", /*"-image",*/ "-mentions", "-music", "-subject", "-types", "-url-link"];

  	console.log(Object.keys(pageDataObj).length)
  	async.forEachSeries(files, (fileName, cb1) => {

  		fs.readFile(`${__dirname}/../../data/d3-data-obj${fileName}.tsv`, "utf8", (error, rows) => {
	      if (error) throw error;
	     	
	     	var outputRows = "Page Id\t" + rows.split("\n")[0] + "\n";
	     	var index = 0
	     	async.forEachSeries(rows.split("\n").slice(1), (row, cb2) => {

	     		if(row.trim().length > 0){
     				var parts = row.split("\t");
	     			var URL = parts[0];

	     			var d = pageDataObj[URL.toLowerCase()];
	     			console.log(URL)

	     			if(typeof d !== "undefined"){
		     			if(d.omit !== "1"){
		     				outputRows += d.pageId + "\t" + parts.join("\t") + "\n";
		     			}
		     		}
	     		}
	     		async.setImmediate(() => { cb2(); })

		   	}, () => {
		   		fs.writeFile(`${__dirname}/../../data/d3-data-obj${fileName}.tsv`, outputRows);
		   		cb1();
		   	});
	  	});

	  }, () => {
  		cb();
  	});
  },
  correctEntityType: (cb) => {
		fs.readFile(`${__dirname}/../../data/d3-data-obj.tsv`, "utf8", (error, rows) => {
      if (error) throw error;
     	
     	var outputRows = rows.split("\n")[0] + "\tsubject\tmiles_work\n" ;

     	async.forEachSeries(rows.split("\n").slice(1), (row, cb1) => {

     		if(row.length > 0){
     			var parts = row.split("\t");
     			var URL = parts[1];
     			var d = pageDataObj[URL.toLowerCase()];
     			outputRows += row + "\t" + d.subjectRemapping + "\t" + d.miles_work + "\n";
     		}
     		async.setImmediate(() => { cb1(); })
     	}, () => {
     		fs.writeFile(`${__dirname}/../../data/d3-data-obj.tsv`, outputRows);
     		cb();
     	});

    });

  },
  done: (cb) => {

  }
})