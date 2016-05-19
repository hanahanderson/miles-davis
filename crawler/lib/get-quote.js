const async = require("async");
const fs = require("fs");

var pageUrlIds = {};
var yearsObj = {};
var pageDataObj = {};
var mentionsObj = {};
var linksOutObj = {};
var linksInObj = {};

async.series({
	getPageIds: (cb) => {

		fs.readFile(`${__dirname}/../../data/page-ids.tsv`, "utf8", (err, data) => {
			var rows = data.split("\n").slice(1);

			async.forEachSeries(rows, (row, cb1) => {

				if(row.length > 0){
					var parts = row.split("\t");
					var id = parts[0]
					var URL = parts[1].toLowerCase()
					pageUrlIds[URL] = id;
				}
				async.setImmediate(() => { cb1(); });

			}, () => {
				console.log(Object.keys(pageUrlIds))
				cb();
			});

		});

	}, 
	getInterconnected: (cb) => {
		fs.readFile(`${__dirname}/../../data/interconnected.tsv`, "utf8", (error, rows) => {
      if (error) throw error;
    	
    	async.forEachSeries(rows.split("\n").slice(1), (row, cb1) => {

    		if(row.length > 0){

    			var parts = row.split("\t");
    			var source = pageUrlIds[parts[0].toLowerCase()];
    			var dest = pageUrlIds[parts[1].toLowerCase()];

    			if(typeof linksOutObj[source] === "undefined"){
    				linksOutObj[source] = [];
    			}
    			linksOutObj[source].push(dest);

    			if(typeof linksInObj[dest] === "undefined"){
    				linksInObj[dest] = [];
    			}
    			linksInObj[dest].push(source);

    		}
    		async.setImmediate(() => { cb1(); });
    	}, () => {
    		cb();
    	})
    });
		
	},
	getYears: (cb) => {
		fs.readFile(`${__dirname}/../../data/page-years.tsv`, "utf8", (error, rows) => {
      if (error) throw error;
    	
    	async.forEachSeries(rows.split("\n").slice(1), (row, cb1) => {

    		if(row.length > 0){
    			var parts = row.split("\t");

    			if(parts[1] !== "null"){
    				yearsObj[parts[0]] = parts[1];
    			}

    		}
    		async.setImmediate(() => { cb1(); });
    	}, () => {
    		cb();
    	
	    });
		});

	},
	getReMapped: (cb) => {

		fs.readFile(`${__dirname}/../../data/re-mapped-data-id.tsv`, "utf8", (err, data) => {
			var rows = data.split("\n").slice(1);

			async.forEachSeries(rows, (row, cb1) => {

				if(row.length > 0){
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

     			if(typeof pageDataObj[pageId] === "undefined") {
     				pageDataObj[pageId] = {
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

     		}

    		async.setImmediate(() => { cb1(); });

			}, () => {
				cb();
			})
		});

	}, 
	getMentions: (cb) => {

		var numQuotes = 0;
		fs.readFile(`${__dirname}/../../data/d3-data-obj-mentions.tsv`, "utf8", (error, rows) => {
      if (error) throw error;
    	
    	async.forEachSeries(rows.split("\n").slice(1), (row, cb1) => {

    		if(row.length > 0){
      		var parts = row.split("\t");
	      	var URL = parts[0];
	      	var sectionIndex = parts[4];
	      	var quote = parts[6];

	        var sectionHeader = parts[2].replace(/[^a-z|A-Z|0-9|\s]/gi, "").toLowerCase();
	        if(sectionHeader.trim().length === 0) {
	          sectionHeader = "first paragraph";
	          sectionIndex = 0;
	        }

	        var id = pageUrlIds[URL.toLowerCase()];

	        if(typeof mentionsObj[id] === "undefined"){
	          mentionsObj[id] = [];
	        }

	        mentionsObj[id].push({
	        	sectionHeader: sectionHeader, 
	        	sectionIndex: sectionIndex,
	        	quote: quote
	        });
	        numQuotes++;

	      }

	      async.setImmediate(() => { cb1(); });

      }, () => {
      	console.log(numQuotes)
      	cb();
      });

    });

	},
	rewriteMentions: (cb) => {

		var index = 0;
		var outputRows = `id\tURL\tname\tsubject\tpageViews\tnameOverride\t
											subjectRemapping\tomit\tmiles_work\tyear\tsectionHeader\t
											sectionIndex\tquote\tlinksFromPage\tlinksToPage \n`
		async.forEachSeries(Object.keys(pageDataObj), (id, cb1) => {

			var page = pageDataObj[id];
		
   		var year = "";
   		if(typeof yearsObj[id] !== "undefined") {
   			year = yearsObj[id];
   		}
   		var linksOut = 0;
   		if(typeof linksOutObj[id] !== "undefined") {
   			linksOut = linksOutObj[id].length;
   		}
   		var linksIn = 0;
   		if(typeof linksInObj[id] !== "undefined") {
   			linksIn = linksInObj[id].length;
   		}

			if(typeof mentionsObj[id] !== "undefined") {
				async.forEachSeries(mentionsObj[id], (mention, cb2) => {
					index++;
					outputRows+= [
										id,
										page.URL,
										page.name,
										page.subject,
										page.pageViews,
										page.nameOverride,
										page.subjectRemapping,
										page.omit,
										page.miles_work,
										year,
										mention.sectionHeader,
										mention.sectionIndex,
										mention.quote,
										linksOut,
										linksIn,
										"\n"].join("\t")
					async.setImmediate(() => { cb2(); });
				}, () => {
	      	async.setImmediate(() => { cb1(); });
				})
			} else {
				
	      async.setImmediate(() => { cb1(); });
			}
			

		}, () => {

			fs.writeFile(`${__dirname}/../../data/NEW-remapped-data.tsv`, outputRows);
			cb();
		})

	},
	done: () => {
		console.log("done");
	}
})
