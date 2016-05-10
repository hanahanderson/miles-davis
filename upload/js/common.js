/*
  missing entity types
  'Alfred_%22Pee_Wee%22_Ellis' - Musical Artist
  'Leon_%22Ndugu%22_Chancler' - Musical Artist
  'Coltrane_%22Live%22_at_the_Village_Vanguard' - Album
  'Andy_%22Stoker%22_Growcott' - Musical Artist
  'The_Complete_%22Is%22_Sessions' - Album
  'Oscar_Peterson_%2B_Harry_Edison_%2B_Eddie_%22Cleanhead%22_Vinson' - Album
  'James_%22Tootie%22_Hogan' - Musical Artist
  'The_Bill_Evans_Trio_%22Live%22' - Album
  'Jimmy_%22Jammin%27%22_Smith' - Musical Artist
*/



//works
var worksRegex = new RegExp(/album\)|albums|ballads|books|comics titles|compositions|dances|discographies|documentaries|episodes|films|grammy award for|jazz standards|live album|magazines|music history|music related lists|musicals|novels|radio programs|songs|singles|soundtracks|television series|video games/, "gi");

//musicians
var musiciansRegex = new RegExp(/accordionists|audio engineers|band\)|\(band\) members|band members|bandleaders|baritones|bassists|bassoonists|beatboxers|cellists|choreographers|clarinetists|composers|conductors|dancers|djs|drummers|ensembles|flautists|flugelhornists|frank sinatra|guitarists|harpists|hip hop groups|horn players|instrumentalists|jazz organizations|keyboardist|keyboardists|keytarists|lyricists|mandolinists|mastering engineers|military personnel|music groups|music organizations|musical advocacy groups|musical artist|musical groups|musical quartets|musician\)|musicians|occupations in music|orchestra members|percussionists|performers|pianists|production companies|rappers|recordings artists|record labels|records artists|record producers|rock groups|saxophonists|singer\)|singers|songwriters|sopranos|trombonists|trumpeters|tubists|violinists|vibraphonists/, "gi");

//people
var peopleRegex = new RegExp(/actors|actresses|activists|artists|births|biographers|boxing promoters|businesspeople|deaths|directors|dramatists|entertainers|fictional characters|filmmakers|historians|journalists|linguists|models|novelists|painters|passions characters|people from|personalities|playwrights|photographers|poets|politicians|presenters|producers|scientist|sculptors|socialists|sports announcers|surgeon|writers/, "gi");

//events
var eventsRegex = new RegExp(/\d{4}s|\d{4} in|annual events|awards|award categories|award ceremony|concert tours|concerts|days of the year|deaths by person|festivals|grammy award|recurring events|world\'s fairs/, "gi");

//places
var placesRegex = new RegExp(/buildings|cities|by city|by country|concert halls|districts in the united states|educational institutions |establishments|event venues |districts|districts and streets|hotels|jazz clubs|lincoln center|music venues|neighborhoods in|nightclubs|populated places|recording studios|restaurants|squares in |schools in|stadium|states|streets in|structures|territories|towns|venues|villages|washington\, d\.c\.|upstate new york|five points\, denver/, "gi");

//genres
var genresRegex = new RegExp(/australian jazz|british music|cabaret|classical music|counterculture|culture of|culture canon|drums|electro music|electronic organs|ethnic music in|experimental music|film styles|funk|genre|genres|industrial music|instruments|jazz by nationality|jazz terminology|modes|musical scales|musical subcultures|musical techniques|pitched percussion|popular culture|styles of music/, "gi");

//companies
var companiesRegex = new RegExp(/companies|headphones manufacturers|subsidiary/, "gi")


function getSubject(d, callback) {

  var URL = d.URL;

  //other
    //companies
    //headphones manufacturers
    //music industry associations


  //---Jimmy_Powell_(musician)


  var subjectList = pageSubjectObj[URL] || [];

  if( !URL.toLowerCase().startsWith("draft:")
    && !URL.toLowerCase().startsWith("file:")
    && !URL.toLowerCase().startsWith("portal:")
    && !URL.toLowerCase().startsWith("talk:")
    && !URL.toLowerCase().startsWith("user:")
    && !URL.toLowerCase().startsWith("user talk:")
    && !URL.toLowerCase().startsWith("wikipedia:")
    && !URL.toLowerCase().startsWith("wikipedia talk:")){
      subjectList.push(URL)
  }

  subjectList.push(d.EntityType);

  var subjectIdentifiers = {
    works: [],
    musicians: [],
    people: [],
    events: [],
    places: [],
    genres: [],
    companies: []
  }

  async.forEach(subjectList, function (subject, cb) {

    if(subject.match(worksRegex)){
      subjectIdentifiers.works = subjectIdentifiers.works.concat(subject.match(worksRegex));
    }
    if(subject.match(musiciansRegex)){
      subjectIdentifiers.musicians = subjectIdentifiers.musicians.concat(subject.match(musiciansRegex));
    }
    if(subject.match(peopleRegex)){
      subjectIdentifiers.people = subjectIdentifiers.people.concat(subject.match(peopleRegex));
    }
    if(subject.match(eventsRegex)){
      subjectIdentifiers.events = subjectIdentifiers.events.concat(subject.match(eventsRegex));
    }
    if(subject.match(placesRegex)){
      subjectIdentifiers.places = subjectIdentifiers.places.concat(subject.match(placesRegex));
    }
    if(subject.match(genresRegex)){
      subjectIdentifiers.genres = subjectIdentifiers.genres.concat(subject.match(genresRegex));
    }
    if(subject.match(companiesRegex)){
      subjectIdentifiers.companies = subjectIdentifiers.companies.concat(subject.match(companiesRegex));
    }

    async.setImmediate(function() { cb(); });


  }, function () {
    callback(subjectIdentifiers);
  });


}





var data;
var dates;

var genres;
var genreObj = {}
var mentions;
var imageObj = {};
var mentionsObj = {};
var mentionSectionObj = {};
var locationSubjectObj = {};
var pageLocationObj = {};
var pageLinkMappingObj = {};
var placeObj = {};
var subjectObj = {};
var pageSubjectObj = {};
var mainSubjectObj = {};
var pageArtistObj = {};
var artistOfObj = {};

var nodesObj = {};

var subjectMentionMappingObj = {
  works: [],
  musicians: [],
  people: [],
  events: [],
  places: [],
  genres: [],
  companies: [],
  other: []
}

var subjectColors = {
  works: "#F7CA18", //yellow
  musicians: "#D91E18", //red
  people: "#E87E04", //orange
  events: "#26A65B", //green
  places: "#9B59B6", //purple
  genres: "#3498DB", //blue
  companies: "#BDC3C7",
  other: "#BDC3C7"
}

function loadData(callback){



  async.series({
    getImageData: function (cb) {
      d3.tsv(`./../data/d3-data-obj-image.tsv`, function(error, imageData) {
        if (error) throw error;

        imageObj = {};
        imageData.forEach(function (d) {
          imageObj[d["Page URL"]] = d["image URL"];
        })

        cb();
      });
    },
    getSubjects: function (cb) {
      d3.tsv(`./../data/d3-data-obj-subject.tsv`, function(error, subjectData) {
        if (error) throw error;

        subjects = subjectData;
        subjectData.forEach(function (d) {
          var subject = d.Value
                      .replace(/(.)+\:/, "")
                      .replace(/[\_|\-]+/g, " ").toLowerCase();
          if(typeof subjectObj[subject] === "undefined"){
           subjectObj[subject] = 0;
          }
          subjectObj[subject]++;

          if(typeof pageSubjectObj[d.URL] === "undefined"){
            pageSubjectObj[d.URL] = [];
          }

          pageSubjectObj[d.URL].push(subject)
        })

        cb();
      });
    },
    getArtist: function (cb) {
      d3.tsv(`./../data/d3-data-obj-music.tsv`, function(error, artistData) {
        if (error) throw error;

        artistData.forEach(function (d) {

          var artistURL = d.Value.replace(/(.)+\:/, "");
          var artist = artistURL.replace(/[\_|\-]+/g, " ");

          if(typeof pageArtistObj[d.URL] === "undefined"){
            pageArtistObj[d.URL] = [];
          }

          pageArtistObj[d.URL].push({
            value: d.Value,
            name: artist
          });

          if(typeof artistOfObj[artistURL] === "undefined"){
            artistOfObj[artistURL] = [];
          }

          artistOfObj[artistURL].push(d.URL);

        });


        cb();
      });
    },
    getMetaDataLinks: function (cb) {
      d3.tsv(`./../data/d3-data-obj-url-link.tsv`, function(error, linkData) {
        if (error) throw error;

        var connectionAttr = [];
        linkData.forEach(function (d) {

          var attr = d.Attr.replace(/(.)+\:/, "")
                        //.replace(" of", "")
                        .toLowerCase();

          if(attr !== "subject"){

            if(connectionAttr.indexOf(attr) === -1){
              connectionAttr.push(attr)
            }

            if(typeof pageLinkMappingObj[d.URL] === "undefined"){
              pageLinkMappingObj[d.URL] = {};
            }

            if(typeof pageLinkMappingObj[d.URL][attr] === "undefined"){
              pageLinkMappingObj[d.URL][attr] = [];
            }

            if(pageLinkMappingObj[d.URL][attr].indexOf(d.Value) === -1){
              pageLinkMappingObj[d.URL][attr].push(d.Value)
            }
          }

        });

        // console.log(pageLinkMappingObj)
        // console.log(connectionAttr.sort())

        cb();
      });
    },
    getDatesData: function (cb) {
      d3.tsv(`./../data/d3-data-obj-dates.tsv`, function(error, datesData) {
        if (error) throw error;
        dates = datesData;

        var dateObj = {};
        dates.forEach(function (d) {
          var dateAttr = d.DateAttr.replace(/(.)+\:/, "").replace(/[\_|\-]+/g, " ").toLowerCase();
          if(typeof dateObj[dateAttr] === "undefined"){
           dateObj[dateAttr] = 0;
          }
          dateObj[dateAttr]++
        })

        var popularDates = Object.keys(dateObj).sort(function (a, b) { return dateObj[b] - dateObj[a] });
        // console.log(popularDates.length)
        // console.log(popularDates)

        cb();
      });
    },
    getGenreData: function (cb) {
        d3.tsv(`./../data/d3-data-obj-genres.tsv`, function(error, genreData) {
          if (error) throw error;
          genres = genreData;

          genreObj = {};
          genres.forEach(function (d) {
            if(typeof genreObj[d.URL] === "undefined"){
             genreObj[d.URL] = {};
            }

            var genreAttr = d.GenreAttr.replace(/(.)+\:/, "");
            var val = d.Genre.replace(/(.)+\:/, "");

            if(typeof genreObj[d.URL][genreAttr] === "undefined"){
              genreObj[d.URL][genreAttr] = [];
            }
            if(genreObj[d.URL][genreAttr].indexOf(val) === -1){
              genreObj[d.URL][genreAttr].push(val)
            }
          })

          // console.log(popularGenres.length)
          // console.log(popularGenres)
          cb();
        });
      },
      // getType: function (cb) {
      //   d3.tsv(`./../data/d3-data-obj-types.tsv`, function(error, typeData) {
      //     if (error) throw error;
      //     types = typeData;

      //     var typeObj = {};
      //     types.forEach(function (d) {
      //       var rdfType = d.Value
      //                   //.replace(/(.)+\:/, "")
      //                   .replace(/[\_|\-]+/g, " ").toLowerCase();
      //       if(typeof typeObj[rdfType] === "undefined"){
      //        typeObj[rdfType] = 0;
      //       }
      //       typeObj[rdfType]++
      //     })

      //     var popularTypes = Object.keys(typeObj).sort(function (a, b) { return typeObj[b] - typeObj[a] });
      //     // console.log(popularTypes.length)
      //     // console.log(popularTypes.map(function (t) { return `${typeObj[t]}\t${t}\n`}).join(""))

      //     cb();
      //   });
      // },
    getFrom: function (cb) {
      d3.tsv(`./../data/d3-data-obj-from.tsv`, function(error, fromData) {
        if (error) throw error;
        froms = fromData;

        locationSubjectObj = {};
        placeObj = {};
        froms.forEach(function (d) {

          var parts = d.Value.replace(/(.)+\:/, "").toLowerCase().split("_from_");

          if(typeof locationSubjectObj[parts[0]] === "undefined"){
           locationSubjectObj[parts[0]] = [];
          }
          locationSubjectObj[parts[0]].push(d);

          var place = parts[1].replace(/(.)+\,/, "").replace(/\_/g, " ").trim();

          if(typeof placeObj[place] === "undefined"){
           placeObj[place] = [];
          }
          placeObj[place].push(d);

          if(typeof pageLocationObj[d.URL] === "undefined"){
            pageLocationObj[d.URL] = [];
          }

          if(pageLocationObj[d.URL].indexOf(place) === -1){
            pageLocationObj[d.URL].push(place);

          }

        })

        // console.log(locationSubjectObj);
        // console.log(placeObj);

        cb();
      });
    },
    getPageData: function (cb) {
      d3.tsv(`./../data/d3-data-obj.tsv`, function(error, pageData) {
        if (error) throw error;

        data = pageData;

        var subjectIdentifierCount = {
          works: 0,
          musicians: 0,
          people: 0,
          events: 0,
          places: 0,
          genres: 0,
          companies: 0,
          other: 0
        }

        async.forEach(data, function(d, cb1) {

          d.imageURL = imageObj[d.URL];
          d.subjects = pageSubjectObj[d.URL];
          d.years = [];
          d.associatedYears = [];


          if(typeof pageLinkMappingObj[d.URL] !== "undefined"){
            d.otherPageLinks = pageLinkMappingObj[d.URL];
          }

          if(typeof pageArtistObj[d.URL] !== "undefined"){
            d.artists = pageArtistObj[d.URL];
          }
          if(typeof artistOfObj[d.URL] !== "undefined"){
            d.artistsOf = artistOfObj[d.URL];
          }
          if(typeof pageLocationObj[d.URL] !== "undefined"){
            d.locations = pageLocationObj[d.URL]
          }


          function addToDecades (subjects, yearsAttr){
            for(var x in subjects){
              var subject = subjects[x];

              if(subject.match(/\d{4}/gi) && !subject.match(/birth|death|disestablish|set in( the)* \d{2}/gi)){
                d[yearsAttr].push(subject);
              }
            }
          }

          addToDecades(d.subjects, "years");

          var associatedSubjectURLs = [];

          if(typeof d.artistsOf !== "undefined"){
            for(var x in d.artistsOf){
              var worksURL = d.artistsOf[x];
              if(associatedSubjectURLs.indexOf(worksURL) === -1){
                associatedSubjectURLs.push(worksURL)
              }
            }
          }

          if(typeof d.artists !== "undefined"){
            for(var x in d.artists){
              var worksURL = d.artists[x];
              if(associatedSubjectURLs.indexOf(worksURL) === -1){
                associatedSubjectURLs.push(worksURL)
              }
            }
          }

          if(typeof d.otherPageLinks !== "undefined"){
            for(var x in d.otherPageLinks){
              for(var y in d.otherPageLinks[x]){
                var worksURL = d.otherPageLinks[x][y];
                if(associatedSubjectURLs.indexOf(worksURL) === -1){
                  associatedSubjectURLs.push(worksURL)
                }
              }
            }
          }

          for(var x in associatedSubjectURLs){
            var worksURL = associatedSubjectURLs[x];
             addToDecades(pageSubjectObj[worksURL], "associatedYears");
          }

          getSubject(d, function(subjectIdentifiers){
            d.subjectIdentifiers = subjectIdentifiers;

            var mostIdentifiers = Object.keys(subjectIdentifiers)
                                    .filter(function(sub){
                                      return subjectIdentifiers[sub].length > 0;
                                    }).sort((a, b) => { return subjectIdentifiers[b].length - subjectIdentifiers[a].length});

            d.mainSubjectType = "other";
            if(mostIdentifiers.length > 0){

              d.mainSubjectType = mostIdentifiers[0];

              if(d.mainSubjectType === "people" && subjectIdentifiers["musicians"].length > 0){
                d.mainSubjectType = "musicians";
              }

            }

            for(var x in subjectIdentifiers){
              if(x.match(d.EntityType, "gi")){
                d.mainSubjectType = x;
              }
            }

            mainSubjectObj[d.URL] = d.mainSubjectType;

            subjectIdentifierCount[d.mainSubjectType]++;
            async.setImmediate(function() { cb1(); });
          });

        }, function() {

          var typeOrder = ["musicians", "works", "people", "genres", "events", "places", "companies", "other"]
          data = data.sort(function (a, b) {

            if(a.mainSubjectType !== b.mainSubjectType){
              return typeOrder.indexOf(a.mainSubjectType) - typeOrder.indexOf(b.mainSubjectType);
            } else {
              if(a.mainSubjectType === "works"){
                if(typeof a.artists === "undefined" && typeof b.artists !== "undefined"){
                  return 1;
                }
                if(typeof b.artists === "undefined" && typeof a.artists !== "undefined"){
                  return -1;
                }
              }
              return parseInt(b.PageViews) - parseInt(a.PageViews);
            }

          });

          Object.keys(subjectIdentifierCount).sort(function (a, b) {
            return subjectIdentifierCount[b] - subjectIdentifierCount[a]
          })
          .forEach(function (subject) {
            $("#entity-type-select")
               .append($(
                `<div class="check-button">
                  <label>
                    <input value='${subject}' type='checkbox' checked/>
                    <span>${subject} <small>(${subjectIdentifierCount[subject]})</small> </span>
                  </label>
                </div>`)) ;
          });

          cb();

        });

      });
    },
    getMentionData: function (cb) {
      d3.tsv(`./../data/d3-data-obj-mentions.tsv`, function(error, mentionData) {
        if (error) throw error;
        mentions = mentionData;

        mentions = mentions.sort(function (a, b) {
          if(parseInt(a.sectionIndex) === parseInt(b.sectionIndex)){
            return parseInt(a.wordCountBeforeSection) - parseInt(b.wordCountBeforeSection);
          }
          return parseInt(a.sectionIndex) - parseInt(b.sectionIndex)
        });

        mentions.forEach(function (d) {
          if(typeof mentionsObj[d.URL] === "undefined"){
            mentionsObj[d.URL] = [];
          }
          mentionsObj[d.URL].push(d);

          var sectionHeader = d.sectionHeader.replace(/[^a-z|A-Z|0-9|\s]/gi, "").toLowerCase();
          if(sectionHeader.trim().length === 0) {
            sectionHeader = "first paragraph";
          }

          if(typeof mentionSectionObj[sectionHeader] === "undefined"){
            mentionSectionObj[sectionHeader] = [];
          }

          if(mentionSectionObj[sectionHeader].indexOf(d.URL) === -1){
            mentionSectionObj[sectionHeader].push(d.URL);
          }

          var mainSubjectType = mainSubjectObj[d.URL];

          if(typeof subjectMentionMappingObj[mainSubjectType] !== "undefined"){
            if(subjectMentionMappingObj[mainSubjectType].indexOf(sectionHeader) === -1 ){
              subjectMentionMappingObj[mainSubjectType].push(sectionHeader);
            }
          }
        });

        Object.keys(mentionSectionObj)
          .filter(function(a) { return mentionSectionObj[a].length > 3 })
          .sort(function (a, b) {
            return mentionSectionObj[b].length - mentionSectionObj[a].length;
          })
          .forEach(function (sectionHeader) {
            $("#section-select")
              .append($(
                `<div class="check-button">
                  <label>
                    <input value='${sectionHeader}' type='checkbox' checked/>
                    <span>${sectionHeader}
                      <small>(${mentionSectionObj[sectionHeader].length})</small>
                    </span>
                  </label>
                </div>`));
          });


        cb();
      });
    },
    done: function () {


    	callback();


    }
  })

}
