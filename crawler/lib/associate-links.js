const async = require("async");
const request = require("request");
const cheerio = require("cheerio");
const fs = require("fs");
const util = require("util");
const moment = require("moment");

var starTime = moment();
var index = 0;

fs.readFile(`${__dirname}/../../wiki-links.html`, "utf8", (err, data) => {

	var $ = cheerio.load(data);

	async.forEachSeries($("li"), (li, cb) => {

		var href = $(li).find("a").attr("href").slice(6);

		console.log("-----------------------------");
		console.log(`${index}/${$("li").length}`);
		console.log(href);
		console.log(`time elapsed: ${moment().diff(starTime, "minutes")} minutes \n`);
	
		index++;

		var associateObject = { 
			name: $($(li).find("a")[0]).text(), 
			entityType: null,
			href: `http://dbpedia.org/page/${href}`,
			values: {}
		};
		request(`http://dbpedia.org/page/${href}`, (err1, resp, body) => {

			if(err1){
				async.setImmediate(() => { cb(); });
			} else {

				var $1 = cheerio.load(body);

				var contents = $1(".page-resource-uri").contents();
				var linkIndex = -1;
				
				contents.each((i, part) => {
			  	if(part.type === "text"){
			  		if(part.data.match("Entity of Type")){
			  			linkIndex = i + 1;

			  		}
			  	}
			  })

				if(typeof contents[linkIndex] !== undefined){
					var link = $1(contents[linkIndex]);
					associateObject.entityType = $1(link).text();
				}

				console.log(associateObject.entityType)

				var rows = $1("table.description tr:nth-of-type(n + 2)");

				async.forEach(rows, (row, cb1) => {

					var cells = $1(row).find("td");
					var property = $1(cells[0]).text().trim();
					//var bulletPoints = $1(cells[1]).find("li:visible");
					var bulletPoints = $1(cells[1]).find("li:not([style])");

					var values = [];

					async.forEach(bulletPoints, (bulletPoint, cb2) => {


						var text = $1(bulletPoint).text();
						var href1 = $1(bulletPoint).find("a").attr("href");

						var valueObj = { value: text };

						if(typeof href1 !== "undefined"){
							valueObj.href = href1;
						}

						values.push(valueObj);
						async.setImmediate(() => { cb2(); });

					}, () => {
						associateObject.values[property] = values;
						async.setImmediate(() => { cb1(); });
					});

				}, () => {

					fs.writeFile(`${__dirname}/../../data/output/links/${href.replace(/\:/g, "_").replace(/\//g, "_")}.json`, util.inspect(associateObject, false, null));
					async.setImmediate(() => { cb(); });

		
				});
			}

		});

	}, () => {

		console.log("done");
	});
});