const async = require("async");
const request = require("request");
const cheerio = require("cheerio");
const fs = require("fs");
const util = require("util");
const moment = require("moment");

var starTime = moment();

var index = 0;
var rows = "Page URL\timage URL\n";

fs.readFile(`${__dirname}/../../wiki-links.html`, "utf8", (err, data) => {

	var $ = cheerio.load(data);

 	var allHREFs = [];
	$("li").each((i, li) => {
		var href = $(li).find("a").attr("href").slice(6);
		allHREFs.push(href.toLowerCase())
		
	});
	
	async.forEachSeries($("li"), (li, cb) => {

		var href = $(li).find("a").attr("href").slice(6);

		console.log("-----------------------------");
		console.log(`${index}/${$("li").length}`);
		console.log(href);
		console.log(`time elapsed: ${moment().diff(starTime, "minutes")} minutes \n`);
	
		index++;

		var associateObject = { 
			name: $($(li).find("a")[0]).text(), 
			href: `http://en.wikipedia.org/wiki/${href}`,
			mentions: [] 
		};
		console.log(`http://en.wikipedia.org/wiki/${href}`)
		request(`http://en.wikipedia.org/wiki/${href}`, (err1, resp, body) => {

			if(err1){
				async.setImmediate(() => { cb(); });
			} else {

				var $1 = cheerio.load(body);

				rows += `${href}\t${$1(".infobox img").attr("src")}\n`;

				fs.writeFile(`${__dirname}/../../data/d3-data-obj-image.tsv`, rows);

				async.setImmediate(() => { cb(); });
			}
		});

	}, () => {

	});

});