const async = require("async");
const request = require("request");
const cheerio = require("cheerio");
const fs = require("fs");
const util = require("util");
const moment = require("moment");

var hrefObj = {};

async.series({
	getAllLinks: (cb) => {

		fs.readFile(`${__dirname}/../../wiki-links.html`, "utf8", (err, data) => {
			var $ = cheerio.load(data);
			$("li").each((i, li) => {
				var href = $(li).find("a").attr("href").slice(6);
				hrefObj[href] = {
					name: $($(li).find("a")[0]).text(),
					fileName: `${href.replace(/\:/g, "_").replace(/\//g, "_")}`
				}

			});
			cb();
		});

	},
	getPageViews: (cb) => {
		
		fs.readFile(`${__dirname}/../../data/PageViews.tsv`, "utf8", (err, data) => {
			var rows = data.split("\n").slice(1);
				
			async.forEach(rows, (row, cb1) => {

				if(row.length > 0){
					var parts = row.split("\t");
					var href = parts[0];
					var pageViews = parts[2];
					hrefObj[href].pageViews = pageViews;
				}
				async.setImmediate(() => { cb1(); });

			}, () => {
				async.setImmediate(() => { cb(); });
			});

		});

	}, 
	getEntityType: (cb) => {

		var rows = "URL\tName\tEntityType\tPageViews\n";

		async.forEach(Object.keys(hrefObj), (href, cb1) => {

			var pageInfo = hrefObj[href];

			fs.readFile(`${__dirname}/../../data/output/links/${pageInfo.fileName}.json`, 
				"utf8", (err, data) => {
					if(typeof data !== "undefined"){

						var dbpediaInfo = "";
						eval(`dbpediaInfo = ${data}`);

						console.log(dbpediaInfo.entityType)
						rows += `${href}\t${pageInfo.name}\t${dbpediaInfo.entityType}\t${pageInfo.pageViews}\n`;

					}
					async.setImmediate(() => { cb1(); });
				});

		}, () => {	
			fs.writeFile(`${__dirname}/../../data/d3-data-obj.tsv`, rows);
			cb();
		});

		//console.log(hrefObj)
	}, 	
	done: () => {

		
	
	}
});