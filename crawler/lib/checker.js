const async = require("async");
const request = require("request");
const cheerio = require("cheerio");
const fs = require("fs");
const util = require("util");
const moment = require("moment");

var starTime = moment();
var index = 0;

var outputFileName = "PageViews"


var pageViewHrefs = [];
var pageViewFileNames = [];
var missingFromFile = [];

var rawURLs = [];
var fileNamePages = [];
var missingDBPedia = [];
var extraDBPedia = [];
var missingMention = [];
var extraMention = [];
var missingPageView = [];
var extraPageView = [];

var mentionFiles;
var linkFiles;

async.series({
	getLinks: (cb) => {
		fs.readFile(`${__dirname}/../../wiki-links.html`, "utf8", (err, data) => {
			var $ = cheerio.load(data);

			async.forEachSeries($("li"), (li, cb1) => {

				var href = $(li).find("a").attr("href").slice(6);
				var name = $($(li).find("a")[0]).text();

				if(rawURLs.indexOf(href.toLowerCase()) === -1) {
					rawURLs.push(href.toLowerCase())
				}
				
				var fileName = `${href.replace(/\:/g, "_").replace(/\//g, "_")}.js`;
				if(fileNamePages.indexOf(fileName.toLowerCase()) === -1){
					fileNamePages.push(fileName.toLowerCase());
				}
				
				async.setImmediate(() => { cb1(); });

			}, () => {

				console.log(`RawUrls: ${rawURLs.length}`)

				console.log(`File Names: ${fileNamePages.length}`)
				cb();
			});
		});
	},
	readPageViews: (cb) => {
		fs.readFile(`${__dirname}/../../data/PageViews.tsv`, "utf8", (err, data) => {

			var rows = data.split("\n").slice(1);
			console.log(`PageViews files:\t${rows.length}`)
			
			async.forEach(rows, (row, cb1) => {

				if(row.length > 0){
					var parts = row.split("\t");

					var href = parts[0];

					if(rawURLs.indexOf(href.toLowerCase()) === -1){
						extraPageView.push(href.toLowerCase());
					}
					pageViewHrefs.push(href.toLowerCase());
					pageViewFileNames.push(`${href.toLowerCase().replace(/\:/g, "_").replace(/\//g, "_")}.js`)
				}
				async.setImmediate(() => { cb1(); });

			}, () => {

				async.forEachSeries(rawURLs, (rawURL, cb1) => {
					if(pageViewHrefs.indexOf(rawURL) === -1){
						missingPageView.push(rawURL)
					}
					async.setImmediate(() => { cb1(); });
				}, () => {
					cb();
				})
				
			});

		});
	}, 
	checkAllLinks: (cb) => {
		fs.readdir(`${__dirname}/../../data/output/links`, (err, files) => {

			var theseFiles = [];
			console.log(`DBpedia files:\t${files.length}`)
			async.forEachSeries(files, (file, cb1) => {

				if(file !== ".DS_Store"){
					if(fileNamePages.indexOf(file.toLowerCase()) === -1){
						extraDBPedia.push(file.toLowerCase());
					}
					theseFiles.push(file.toLowerCase());
				}

				async.setImmediate(() => { cb1(); });

			}, () => {

				async.forEachSeries(fileNamePages, (fileNamePage, cb1) => {
					if(theseFiles.indexOf(fileNamePage) === -1){
						missingDBPedia.push(fileNamePage)
					}
					async.setImmediate(() => { cb1(); });
				}, () => {

					async.forEachSeries(pageViewFileNames, (fileNamePage, cb2) => {
						if(theseFiles.indexOf(fileNamePage) === -1){
							missingFromFile.push(fileNamePage)
						}
						async.setImmediate(() => { cb2(); });
					}, () => {
						cb();
					})
				})
			
			});

		});
	}, 
	checkAllMention: (cb) => {
		fs.readdir(`${__dirname}/../../data/output/mentions`, (err, files) => {

			var theseFiles = [];
			console.log(`Mention files:\t${files.length}`)
			async.forEachSeries(files, (file, cb1) => {

				if(file !== ".DS_Store"){
					if(fileNamePages.indexOf(file.toLowerCase()) === -1){
						extraMention.push(file.toLowerCase());
					}
					theseFiles.push(file.toLowerCase());
				}
				async.setImmediate(() => { cb1(); });

			}, () => {

				async.forEachSeries(fileNamePages, (fileNamePage, cb1) => {
					if(theseFiles.indexOf(fileNamePage) === -1){
						missingMention.push(fileNamePage)
					}
					async.setImmediate(() => { cb1(); });
				}, () => {
					cb();
				})

			});

		});
	}, 
	done: () => {
		console.log("missingDBPedia")
		console.log(missingDBPedia.length)
		console.log("--------------------------")
		console.log("extraDBPedia")
		console.log(extraDBPedia.length)
		console.log("--------------------------")
		console.log("missingMention")
		console.log(missingMention.length)
		console.log("--------------------------")
		console.log("extraMention")
		console.log(extraMention.length)
		console.log("--------------------------")
		console.log("missingPageView")
		console.log(missingPageView.length)
		console.log("--------------------------")
		console.log("extraPageView")
		console.log(extraPageView.length)
		console.log("--------------------------")
		console.log("missingFromFile")
		console.log(missingFromFile)
	}
})
