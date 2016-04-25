const async = require("async");
const request = require("request");
const cheerio = require("cheerio");
const fs = require("fs");
const util = require("util");
const moment = require("moment");

var starTime = moment();
var index = 0;

var outputFileName = "PageViews"

fs.writeFile(`${__dirname}/../../data/${outputFileName}.tsv`, "href\tname\tpage views\n");

fs.readFile(`${__dirname}/../../wiki-links.html`, "utf8", (err, data) => {
	var $ = cheerio.load(data);

	async.forEachSeries($("li"), (li, cb) => {

		var href = $(li).find("a").attr("href").slice(6);
		var name = $($(li).find("a")[0]).text();

		console.log("-----------------------------");
		console.log(`${index}/${$("li").length}`);
		console.log(href);
		console.log(`time elapsed: ${moment().diff(starTime, "minutes")} minutes \n`);
	
		index++;

		request(`https://wikimedia.org/api/rest_v1/metrics/pageviews/per-article/en.wikipedia/all-access/all-agents/${href}/daily/2015010100/2015123100`, 
			(err1, resp, body) => {
				if(err1){
					async.setImmediate(() => { cb(); });
				} else {
					var pageViews = JSON.parse(body);

					var count = 0;
					async.forEach(pageViews.items, (day, cb1) => {

						count += day.views;
						async.setImmediate(() => { cb1(); });
						
					}, () => {
						fs.appendFile(`${__dirname}/../../data/${outputFileName}.tsv`, 
							`${href}\t${name}\t${count}\n`, 
							(err2) => {
								async.setImmediate(() => { cb(); });

							});
					})
					
				}

		});

	}, () => {

		console.log("done");
	});
});