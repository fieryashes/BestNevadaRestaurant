// global var
let selectedRow = null;
let rowClicked = false;
let phraseHovered = false;
let phraseClicked = false;
let phraseSelected = null;
let link_dict = null;

function loadTable(foodCategoryData) {
    // load the food category table
    let foodCategoryTable = document.querySelector("#foodCategoryTable tbody");

    // loop through each of the category
    for (const category in foodCategoryData) {
        let foodCategory = category;
        let foodRelevance = foodCategoryData[foodCategory];

        // adding a new row
        let row = document.createElement("tr");
        row.setAttribute("onclick", "onRowClick()");
        row.setAttribute("onmouseover", "onRowHoverIn()");
        row.setAttribute("onmouseout", "onRowHoverOut()");

        // creating the two col value for the new row
        let categoryCell = document.createElement("td");
        let relevanceCell = document.createElement("td");
        

        categoryCell.innerText = foodCategory;
        relevanceCell.innerText = foodRelevance;

        // appending the two col value to the row
        row.appendChild(categoryCell);
        row.appendChild(relevanceCell);

        // appending the new row to table
        foodCategoryTable.appendChild(row);
    }
}


function getLinkedCategoryDict(foodCategoryData) {
    // key: category value: row of category on table
    let linked_d = {}
    let rowNumber = 0;

    for (const category in foodCategoryData) {
        linked_d[category] = rowNumber;
        rowNumber += 1;
    }

    return linked_d;
}


function onRowClick() {
    // on row click, gets the food category
    let hoveredRow = event.srcElement;
    selectedRow = hoveredRow.parentNode.firstChild.innerText;
    rowClicked = true;
    clearTipSentimentTable();
    clearReviewSentimentTable();
    clearReviewText();
    clearTipText();
}

function onRowHoverIn() {
    let hoveredRow = event.srcElement.parentNode;
    // change background color
    hoveredRow.style.backgroundColor = "grey";
    let foodCategory = hoveredRow.firstChild.innerText;

}

function onRowHoverOut() {
    let hoveredRow = event.srcElement.parentNode;
    //change background color
    hoveredRow.style.backgroundColor = "";
}


function selectTableRow() {
    if (selectedRow != null) {
        selectedRow.style.backgroundColor = "";
    }

    let inputRow = link_dict[document.getElementById("rowNumber").value];
    
    if (inputRow != null) {
        selectedRow = document.querySelectorAll("#foodCategoryTable tbody tr")[inputRow];
        selectedRow.style.backgroundColor = "grey";
    }
    
}


function convertStars(rating) {
    let stars = "";
    rating = parseInt(rating);
    for (let i = 0; i < rating; i++) {
        stars += "⭐";
    }
    return stars;
}


function convertPrice(price) {
    let priceSymbol = "";
    price = parseInt(price);
    for (let i = 0; i < price; i++) {
        priceSymbol += "💲";
    }
    return priceSymbol;
}


function loadRestaurantScoreCard(topRestaurantCategoryData, category) {

    document.getElementById("scoreCardLabel").innerHTML="";

    let top3Restaurant = topRestaurantCategoryData[category];
    let tableNum = 1;
    for (const dict of top3Restaurant) {
        // getting the table
        let table = document.querySelector(`#topRestaurant${tableNum} tbody`);
        for (const key in dict) {
            let row = document.createElement("tr");
            if (key == "name") {
                // creating the header
                let header = document.createElement("th");
                header.setAttribute("colspan", "2");
                
                // creating a href with no underline and color black
                header.innerHTML = `<a href="${dict["link"]}" target="_blank"><div class="link">${dict[key]}</div></a>`;
                
                // adding the header to table
                row.appendChild(header);
                document.querySelector(`#topRestaurant${tableNum} thead`).appendChild(header);
            } else if (key != "link" & key!= "hours") {
                let cell1 = document.createElement("td");
                let cell2 = document.createElement("td");
                cell1.innerText = key;
                
                // converting to symbol
                if (key == "price") {
                    cell2.innerText = convertPrice(dict[key]);
                } else if (key == "stars") {
                    cell2.innerText = convertStars(dict[key]);
                } else {
                    cell2.innerText = dict[key];
                }

                row.appendChild(cell1);
                row.appendChild(cell2);
                table.appendChild(row);
            }
        }
        tableNum += 1;
    }
    document.getElementById("scoreCardLabel").innerHTML = `<i>Top 3 <b>${category}</b> Restaurant</i>`;

}


function clearRestaurantScoreCard() {
    for (let tableNum = 1; tableNum < 4; tableNum++) {
        let table = document.querySelector(`#topRestaurant${tableNum}`);
        table.children[0].innerHTML = "";
        table.children[1].innerHTML = "";
    }
    
}


function getTimeRange(startTime, endTime) {
    let startTimeList = startTime.split(":");
    let endTimeList = endTime.split(":");

    
    let parsedStartTime = parseInt(startTimeList[0]);
    let parsedEndTime = parseInt(endTimeList[0]);

    if (startTimeList[1].includes("a.m")) {
        if (parsedStartTime == 12) {
            parsedStartTime = 0;
        }
    }

    if (startTimeList[1].includes("p.m")) {
        parsedStartTime += 12;
    }

    if (endTimeList[1].includes("a.m")) {
        if (parsedEndTime == 12) {
            parsedEndTime = 0;
        }
    }

    if (endTimeList[1].includes("p.m")) {
        parsedEndTime += 12;
    }

    let timeRange = parsedEndTime - parsedStartTime;
    
    if (timeRange <= 0) {
        // returns 24 hour if difference is 0
        return 24;
    } else {
        return timeRange;
    }
}


function createTimeBar(parentContainer, day, startTime, endTime) {

    // gets the hours opened
    let hoursOpened = getTimeRange(startTime, endTime);

    // create the container for hour bar
    let hourContainer = document.createElement("div");
    hourContainer.className = "hourBar";

    parentContainer.appendChild(hourContainer);

    // styling for bar
    let alignmentStyling = "vertical-align: middle";
    let heightStyling = "height: 40px";


    // create the label for the hour bar
    let hourLabel = document.createElement("label");
    hourLabel.setAttribute("for", `${day}Bar`);
    hourLabel.style = alignmentStyling + ";padding-right: 2% ;font-weight: bold; display: inline-block; font-size:1em;width: 80px";
    hourLabel.innerText = `${day}`;

    // create the start time text
    let startTimeText = document.createElement("span");
    startTimeText.style = alignmentStyling + "; font-size:0.8em; display: inline-block; width: 65px; padding-left:3%";
    startTimeText.innerHTML = `${startTime}`;

    // create the end time text
    let endTimeText = document.createElement("span");
    endTimeText.style = alignmentStyling + "; font-size:0.8em; display: inline-block; width: 65px;padding-left: 2%";
    endTimeText.innerHTML = `${endTime}`;

    // create the bar
    let hourBar = document.createElement("progress");
    hourBar.setAttribute("id", `${day}Bar`);
    hourBar.setAttribute("value", `${hoursOpened}`);
    hourBar.setAttribute("max", "24");
    hourBar.style = alignmentStyling + ";" + heightStyling + ";width: 40%";

    hourContainer.appendChild(hourLabel);
    hourContainer.appendChild(startTimeText);
    hourContainer.appendChild(hourBar);
    hourContainer.appendChild(endTimeText);
}


function clearHours() {
    document.getElementById("hourChart").innerHTML = "";
    //document.querySelector("hr").remove();
}

function loadHoursChart(hoursOpenData, hoursclosedData, category) {
    // get the container
    let hourChartContainer = document.getElementById("hourChart");
    
    let caption= document.getElementById("hourCaption");
    caption.innerHTML = `Common Hours for <b>${category}</b>`;
    caption.style = "font-style: italic;"


    if (hourChartContainer.children.length != 0) {
        clearHours();
    }
    let hoursOpenDataCategory = hoursOpenData[category];
    let hoursClosedDataCategory = hoursclosedData[category];
   
    let days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    

    for (let day of days) {
        createTimeBar(hourChartContainer, day, hoursOpenDataCategory[day], hoursClosedDataCategory[day]);
        //console.log(hourChartContainer);
    }
    
}


function loadHoursChart1(hoursOpenData, hoursclosedData, category) {
    google.charts.load('current', {
        'packages': ['timeline']
    });
    google.charts.setOnLoadCallback(drawChart);
    
    function drawChart() {
        let container = document.getElementById('hourChart');
        let chart = new google.visualization.Timeline(container);
        let dataTable = new google.visualization.DataTable();

        let startTime = hoursOpenData[category];
        let endTime = hoursclosedData[category];

        let dateRow = [];
        let days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        for (let day of  days) {
            let start = startTime[day];
            let end = endTime[day];
            let row = [day, new Date(0,0,0,start,0,0), new Date(0,0,0,end,0,0)];
            dateRow.push(row);
        }
    
        console.log(dateRow)
        dataTable.addColumn({
            type: 'string',
            id: 'Days'
        });
        dataTable.addColumn({
            type: 'date',
            id: 'Start'
        });
        dataTable.addColumn({
            type: 'date',
            id: 'End'
        });
        dataTable.addRows(dateRow);
    
        var options = {
            timeline: {
                singleColor: '#0FF4E9'
            }
        };
        chart.draw(dataTable, options);
    }
}


function loadPriceColumnChart(priceData, category) {
    let xCategory = ["💲", "💲💲", "💲💲💲", "💲💲💲💲"];
    let yValue = [];

    for (let i = 1; i <= 4; i++) {
        let price = priceData[category];
        if (price[i + ".0"] == null) {
            yValue.push(0);
        } else {
            yValue.push(parseInt(price[i + ".0"]));
        }
    }

    let priceChart = Highcharts.chart('priceChart', {
        chart: {
            type: 'column'
        },
        title: {
            text: `Common Restaurant Price Range for <strong>${category}</strong>`,
            style: {
                "font-style": "italic",
                "color": "black"
            }
        },
        xAxis: {
            categories: xCategory
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Count',
                rotation: 0,
                align: 'high'
            }
        },
        tooltip: {
            formatter: function () {
                return this.y;
            },
        },
        credits: {
            enabled: false
        },
        legend: {
            enabled: false
        },
        series: [{
            data: yValue,
            color: "lightgreen"
        }]
    });
}


function onRowClickPhrase() {
    // on row click, gets the food category
    let hoveredRow = event.srcElement;
    phraseClicked = true;
    console.log(hoveredRow.parentNode.firstChild.innerText);
    phraseSelected = hoveredRow.parentNode.firstChild.innerText;
}

function onRowHoverInPhrase() {
    let hoveredRow = event.srcElement.parentNode;
    // change background color
    hoveredRow.style.backgroundColor = "grey";
    phraseHovered = true;

}

function onRowHoverOutPhrase() {
    let hoveredRow = event.srcElement.parentNode;
    //change background color
    hoveredRow.style.backgroundColor = "";
    phraseHovered = false;
}


function clearPhraseTable() {
    document.querySelector("#commonPhraseTable").innerHTML = "";
}


function loadPhraseTable(phraseData, categoryData) {
    
    clearPhraseTable();

    let phraseCategory = phraseData[categoryData];

    // adding caption of table
    let phraseTable = document.getElementById("commonPhraseTable");
    let caption = document.createElement("caption");
    caption.innerHTML = `Top 10 Common Phrases found in Review for <b>${categoryData}</b> Restaurants`;
    caption.style = "font-size: 1.1em;";
    phraseTable.appendChild(caption);

    // setting the header
    let phraseTableHeader = document.createElement("thead");
    let phraseTableHeaderRow = document.createElement("tr");
    
    
    let header1 = document.createElement("td");
    let header2 = document.createElement("td");
    let header3 = document.createElement("td");
    

    header1.innerText = "Phrase";
    header2.innerText = "Sentiment";
    header3.innerText = "Confidence of Sentiment";
    phraseTableHeaderRow.appendChild(header1);
    phraseTableHeaderRow.appendChild(header2);
    phraseTableHeaderRow.appendChild(header3);

    phraseTableHeader.appendChild(phraseTableHeaderRow);
    phraseTable.appendChild(phraseTableHeader);


    // the body of table
    let pharseTableBody = document.createElement("tbody");

    // loop through each of the category
    for (const cat in phraseCategory) {
        let sentiment = phraseCategory[cat].replace("[", "").replace("]", "").split(":");

        // adding a new row
        let row = document.createElement("tr");
        row.setAttribute("onclick", "onRowClickPhrase()");
        row.setAttribute("onmouseover", "onRowHoverInPhrase()");
        row.setAttribute("onmouseout", "onRowHoverOutPhrase()");

        // creating the two col value for the new row
        let phraseCell = document.createElement("td");
        let sentimentCell = document.createElement("td");
        let confidenceCell = document.createElement("td");

        phraseCell.innerText = cat;
        sentimentCell.innerText = sentiment[0];
        confidenceCell.innerText = (parseFloat(sentiment[1])*100).toFixed(0) + "%";

        // appending the two col value to the row
        row.appendChild(phraseCell);
        row.appendChild(sentimentCell);
        row.appendChild(confidenceCell);

        // appending the new row to table
        pharseTableBody.appendChild(row);
    }

    phraseTable.appendChild(pharseTableBody);
}



function parsedContextData(contextData) {
    // returns a dict with key: tipStatData, reviewStatData, review, tip
    
    let context = {}
    for (let key in contextData) {
        if (key == "review") {
            reviewDict = {};
            let reviewData = contextData[key];
            for (let attr in reviewData) {
                if (attr == "text") {
                    context["review"] = reviewData[attr];
                } else {
                    reviewDict[attr] = reviewData[attr];
                }
            }
            context["reviewStatData"] = reviewDict;
        } else {
            let tipData = contextData[key];
            let tipDict = {}
            for (let attr in tipData) {
                if (attr == "text") {
                    context["tip"] = tipData[attr];
                } else {
                    tipDict[attr] = tipData[attr];
                }
            }
            context["tipStatData"] = tipDict;
        }
    }
    return context;
}


function loadTipSentimentTable(tipStatData) {

    // clear existing table
    clearTipSentimentTable();


    // reviewStatData : {key: statName value: stat}

    let table = document.getElementById("tipSentimentTable");
    
    // the header of table
    let tableHeader = document.createElement("thead");
    let tableHeadRow = document.createElement("tr");
    let tableHeadCell1 = document.createElement("td");
    let tableHeadCell2 = document.createElement("td");


    tableHeadCell1.innerText = "Sentiment";
    tableHeadCell2.innerText = "Sentiment Confidence";
    tableHeadRow.appendChild(tableHeadCell1);
    tableHeadRow.appendChild(tableHeadCell2);
    tableHeader.appendChild(tableHeadRow);
    table.appendChild(tableHeader);

    // the body of table
    let tableBody = document.createElement("tbody");

    // loop through each of the category
    for (const stat in tipStatData) {
        // adding a new row
        let row = document.createElement("tr");

        // creating the two col value for the new row
        let cell1 = document.createElement("td");
        let cell2 = document.createElement("td");

        let sentiment = tipStatData[stat].replace("[", "").replace("]", "").split(":")
        cell1.innerText = sentiment[0];
        cell2.innerText = (parseFloat(sentiment[1])*100).toFixed(0) + "%";
        
        // appending the two col value to the row
        row.appendChild(cell1);
        row.appendChild(cell2);
        
        // appending the new row to table
        tableBody.appendChild(row);
    }

    table.appendChild(tableBody);
    console.log(table);
}


function clearTipSentimentTable() {
    document.getElementById("tipSentimentTable").innerHTML = "";
}


function clearReviewSentimentTable() {
    document.getElementById("reviewSentimentTable").innerHTML="";
}


function loadReviewSentimentTable(reviewStatData, isTipReview=false) {

    // clear existing table
    clearReviewSentimentTable();

    // reviewStatData : {key: statName value: stat}
    let table;
    if (isTipReview) {
        table = document.getElementById("tipSentimentTable");
        clearTipSentimentTable();
    } else {
        table = document.getElementById("reviewSentimentTable");
    }
    
    // the header of table
    let tableHeader = document.createElement("thead");
    let tableHeadRow = document.createElement("tr");
    let tableHeadCell1 = document.createElement("td");
    let tableHeadCell2 = document.createElement("td");


    tableHeadCell1.innerText = "Review Attribute";
    tableHeadCell2.innerText = "Review Stats";
    tableHeadRow.appendChild(tableHeadCell1);
    tableHeadRow.appendChild(tableHeadCell2);
    tableHeader.appendChild(tableHeadRow);
    table.appendChild(tableHeader);


    // the body of table
    let tableBody = document.createElement("tbody");

    // loop through each of the category
    for (const stat in reviewStatData) {
        // adding a new row
        let row = document.createElement("tr");

        // creating the two col value for the new row
        let cell1 = document.createElement("td");
        let cell2 = document.createElement("td");

        if (stat == "sentiment_analysis") {
            let sentiment = reviewStatData[stat].replace("[", "").replace("]", "").split(":")
            cell1.innerText = sentiment[0];
            cell2.innerText = (parseFloat(sentiment[1])*100).toFixed(0) + "%";
        } else {
            cell1.innerText = stat;

            // converting stars to symbol star
            if (stat == "stars") {
                cell2.innerHTML = convertStars(reviewStatData[stat]);
            } else {
                cell2.innerText = reviewStatData[stat];
            }
        }
        
        

        // appending the two col value to the row
        row.appendChild(cell1);
        row.appendChild(cell2);
        
        // appending the new row to table
        tableBody.appendChild(row);
    }

    table.appendChild(tableBody);
    console.log(table);
}


function clearReviewText() {
    document.getElementById("Review").innerHTML = "";
}


function clearTipText() {
    document.getElementById("Tip").innerHTML = "";
}


function loadReviewText(review, category, phrase) {
    
    // clear existing review
    clearReviewText();

    // load the review text

    let reviewContainer = document.getElementById("Review");
    let textArea = document.createElement("section");
    let label = document.createElement("label");
    label.innerHTML = `Context of ${phrase} in Top Review for ${category}`;
    label.style = "font-weight:bold; display: inline-block; padding-bottom:1.4%;";
    reviewContainer.appendChild(label);
    textArea.id = "reviewText";
    textArea.className = "yelpText";
    textArea.style= "width:350px; height:250px;overflow-y: auto;border-style: inset;";
    textArea.setAttribute("readonly", true);
    textArea.innerText = review;

    // adding the textArea to review container
    reviewContainer.appendChild(textArea);
}


function loadTipText(tip, category, phrase, isReview=false) {
    
    //clear existing tip
    clearTipText();
    
    // load the review text

    let tipContainer = document.getElementById("Tip");
    let textArea = document.createElement("section");
    let label = document.createElement("label");
    
    if (isReview == true) {
        label.innerHTML = `Context of <u>${phrase}</u> in Another Top Review for <i>${category}</i>`;
    } else {
        label.innerHTML = `Context of <u>${phrase}</u> in Top Tip for <i>${category}</i>`;
    }
    
    label.style = "font-weight:bold; display: inline-block; padding-bottom:1.4%; margin-top:3%";
    tipContainer.appendChild(label);
    textArea.id = "tipText";
    textArea.className = "yelpText";
    textArea.style= "width:350px; height:250px;overflow-y: auto; border-style: inset;";
    textArea.setAttribute("readonly", true);
    textArea.innerText = tip;

    // adding the textArea to review container
    tipContainer.appendChild(textArea);
}


function loadContextGrid(contextCategory, category, phrase) {
    
    let contextCategoryPhraseData = parsedContextData(contextCategory[category][phrase]);
    let isTipReview = false;
    
    
    // check if there is two review
    if ("stars" in contextCategoryPhraseData["tipStatData"]) {
        isTipReview = true;
        loadReviewSentimentTable(contextCategoryPhraseData["tipStatData"], isTipReview);
    } else {
        loadTipSentimentTable(contextCategoryPhraseData["tipStatData"]);
    }

    loadReviewSentimentTable(contextCategoryPhraseData["reviewStatData"]);
    
    loadReviewText(contextCategoryPhraseData["review"], category, phrase);
    loadTipText(contextCategoryPhraseData["tip"], category, phrase, isTipReview);

    let instanceTip = new Mark(document.querySelector("#tipText"));
    instanceTip.mark(phrase, {
                        "ignoreJoiners": true,
                        "separateWordSearch": false
                    });
    let instanceReview = new Mark(document.querySelector("#reviewText"));
    instanceReview.mark(phrase, {
                        "ignoreJoiners": true,
                        "separateWordSearch": false
                    });
}


function loadExplanationText() {
    let explanationText = document.getElementById("explanation");

    let text = "The hours were determined by the most common hour of each day. The prices range from 💲 to 💲💲💲💲. The price rating is based on Yelp's price rating system. Click on any row in the common phrase table below to get its context(defined as the top review/tip using that phrase)";
    explanationText.innerText = text;
}


function loadPieChart() {
    

    // load the pie chart
    pieChart = Highcharts.chart('nevadaStateMap', {
        chart: {
            type: 'pie'
        },
        title: {
            text: 'Real Top 10 Restaurant Food Categories',
            style: {
                "font-style": "italic"
            }
        },
        subtitle: {
            text:"Placeholder for Nevada State Map Vis"
        },
        xAxis: {
            categories: [
                "Highly Illegal Substances",
                "Alcohol"
            ]
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
            pie: {
                startAngle: 90,
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b>: {point.percentage:.1f}%',
                    style: {
                        fontSize: '12px'
                    }
                },
                showInLegend: {
                    enabled: true
                }
            }
        },
        credits: {
            enabled: false
        },
        colors: ["red", "blue"],
        series: [{
            name: 'Yes',
            data: [{
                name: "Highly Illegal Substances",
                y: 0.5
            }, {
                name: 'Alcohol',
                y: 0.5
            }],
        }]
    })
 
}

async function loadJson(path) {
    // wait for the json to be to fetched
    let response = await fetch(path);
    // wait for the json to be loaded
    let data = await response.json();

    return data;
}


function init() {
    let top10FoodCategory = loadJson("data/top_10_food_category.json");
    let topRestaurantCategory = loadJson("data/top3_restaurant_category.json");
    let topHoursOpenCategory = loadJson("data/top_starttime_category.json");
    let topHoursClosedCategory = loadJson("data/top_endtime_category.json");
    let priceDistributionCategory = loadJson("data/price_distribution_category.json");
    let phraseCategory = loadJson("data/sentiment_common_phrase_category.json");
    let contextCategory = loadJson("data/context.json");

    let loadedHoursOpenCategory = null;
    let loadedHoursClosedCategory = null;
    let loadedPriceCategory = null;
    let loadedPhraseCategory = null;
    let loadedContextCategory = null;

    top10FoodCategory.then(function (foodCategory) {
        loadTable(foodCategory);
        loadPieChart();
        link_dict = getLinkedCategoryDict(foodCategory);
        
    });
    topHoursOpenCategory.then(function (hours) {
        loadedHoursOpenCategory = hours;
    });
    topHoursClosedCategory.then(function (hours) {
        loadedHoursClosedCategory = hours;
    });
    priceDistributionCategory.then(function (price) {
        loadedPriceCategory = price;
    });
    phraseCategory.then(function (phrase) {
        loadedPhraseCategory = phrase;
    });
    contextCategory.then(function (context) {
        loadedContextCategory = context;
    });


    window.addEventListener("click", function () {
        if ((selectedRow != null & rowClicked) | (selectedRow != null & phraseClicked)) {
            clearRestaurantScoreCard();
            topRestaurantCategory.then(function (restaurant){
                loadRestaurantScoreCard(restaurant, selectedRow);
                
            });
            loadExplanationText();
            
            if (loadedHoursOpenCategory != null & loadedHoursClosedCategory != null) {
                //loadHoursChart1(loadedHoursOpenCategory, loadedHoursClosedCategory, selectedRow);
                loadHoursChart(loadedHoursOpenCategory, loadedHoursClosedCategory, selectedRow);
                //let breakLine = document.createElement("hr");
                //let hours = document.getElementById("hour");
                //hours.insertBefore(breakLine, hours.childNodes[0]);
            }

            if (loadedPriceCategory != null) {
                loadPriceColumnChart(loadedPriceCategory, selectedRow);
            }
            
            if (phraseCategory != null) {
                loadPhraseTable(loadedPhraseCategory, selectedRow);
            }
            //loadContextGrid(loadedContextCategory, selectedRow, "burger");
            if (phraseClicked) {
                console.log(phraseSelected);
                loadContextGrid(loadedContextCategory, selectedRow, phraseSelected);
            }
            rowClicked = false;
            phraseClicked = false;
        }
        
        
    })
    
}


window.addEventListener("DOMContentLoaded", function() {
    init();
}, false);