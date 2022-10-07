document.addEventListener("DOMContentLoaded",() => {

// Stats from https://countryeconomy.com/indicators

const APIkey = "68f76a4a7b8ab0f24fbe47ad30c65e6731a5b235";
const trafficAccidentsUrl = "https://data.gov.gr/api/v1/query/mcp_traffic_accidents";
const crimesUrl = "https://data.gov.gr/api/v1/query/mcp_crime";
const suicidesURL = "https://leonalkalai.github.io/Greece-mortality/suisides.json";

const localSuicidesURL = "https://leonalkalai.github.io/Greece-mortality/suisides.json";

let selectedDate ={};

// get user input 
const $forminput = document.querySelector(".form-row"); 
const $userinput = document.querySelector("input");
const $button = document.querySelector(".btn");


// button event
$button.addEventListener("click",(e)=> {
    e.preventDefault(); 
    mydate =  parseInt($userinput.value);
    selectedDate = {value:mydate};
    //console.log(finalresults)
    All()  
 });



// function to count total object records
const totalrecords=(data)=>JSON.parse(data).length * Object.keys(JSON.parse(data)[0]).length;
 

//-------------------------------get crimes data----------------------------------//

const getAccidentsData = async () =>{
try{
    const res = await fetch(`${trafficAccidentsUrl}`,
        {
        dataType: 'jsonp',
        headers:
        {
            Authorization: `Token ${APIkey}`
        }
    })
    const data = await res.text();

    const result = JSON.parse(data).map(({ year,jurisdiction ,deadly_accidents, deaths }) => ({
        year, 
        // jurisdiction,
        // deadly_accidents,
        deaths
      }));

   

    const filtered = JSON.parse(data).filter( (el) => el.year === selectedDate.value);
   

    const totala = filtered.reduce( function(tot, record) {
         return tot + record.deaths;
     },0);

     
     const accidentsTotalRecords =  totala!==0?totalrecords(data):"ΔΕΝ ΥΠΑΡΧΟΥΝ ΔΕΔΟΜΕΝΑ";

    //console.log( accidentsTotalRecords)

     accidentsfinalresults = {sum: totala, records :accidentsTotalRecords};
 

}
catch (error) {console.log(error)}
}



//getAccidentsData()


//------------------------------------Get crimes data-----------------------------//

const getCrimesData = async () =>{
    try{
        const res = await fetch(`${crimesUrl}`,
            {
            dataType: 'jsonp',
            headers:
            {
                Authorization: `Token ${APIkey}`
            }
        })
        const data = await res.text();

    
        const result = JSON.parse(data).map(({ year, crime ,committed }) => ({
            year, 
            crime,
            committed
            
          }));


        const filtered = JSON.parse(data).filter( (el) => el.year ===selectedDate.value && el.crime=== "ΑΝΘΡΩΠΟΚΤΟΝΙΕΣ");
   

        const totalb = filtered.reduce( function(tot, record) {
             return tot + record.committed;
         },0);
    
         
    
        const crimesTotalRecords =  totalb!==0?totalrecords(data):"ΔΕΝ ΥΠΑΡΧΟΥΝ ΔΕΔΟΜΕΝΑ";
        // console.log( crimesTotalRecords)
     

         crimesfinalresults = {sum: totalb, records :crimesTotalRecords};

    }
    catch (error) {console.log(error)}
    }
    
    
    
//getCrimesData()


//------------------------------------get suicides-------------------------------------//

const getSuicidesData = async () =>{
    try{
        const res = await fetch(`${localSuicidesURL}`,
            {
            dataType: 'jsonp',
            headers:
            {
                'Access-Control-Allow-Origin':'*',
                Authorization: `Token ${APIkey}`
            }
        })
        const data = await res.text();

    
        const result = JSON.parse(data).map(({ Date, Suicides }) => ({
            Date, 
            Suicides
          }));
    

        const filtered = JSON.parse(data).filter( (el) => el.Date === selectedDate.value);
     

        const totalc = filtered.reduce( function(tot, record) {
         return tot + record.Suicides;
        },0);

     
        
        const suicidesTotalRecords =  totalc!==0?totalrecords(data):"ΔΕΝ ΥΠΑΡΧΟΥΝ ΔΕΔΟΜΕΝΑ";
        // console.log( suicidesTotalRecords)


        suicidesfinalresults = {sum: totalc, records :suicidesTotalRecords};

    }
    catch (error) {console.log(error)}
    }
    
    
    
//getSuicidesData()


class finalResult {
    constructor( caraccidents,murders, suicides ) {
        this.caraccidents =  caraccidents;
        this.murders = murders;
        this.suicides = suicides;
    }
 }

 

function All(){

    Promise.all([getAccidentsData(), getCrimesData(), getSuicidesData()]).then((values) => {
        const $result = document.querySelector(".card-deck"); 
        
        $result.innerHTML = ""; //empty result before render

        // remove elements if already exist to rerender
        if(document.querySelector("h1")) document.querySelector("h1").remove();
        if(document.querySelector(".chartcontainer")) document.querySelector(".chartcontainer").remove();
       
        // create new object   
        const finalresult = new finalResult({numbers:accidentsfinalresults.sum,records:accidentsfinalresults.records}, {numbers:crimesfinalresults.sum,records:crimesfinalresults.records},{numbers:suicidesfinalresults.sum,records: suicidesfinalresults.records});

        // convert object to array
        const totaldeaths = Object.keys(finalresult).map(key => ({"label": key, ...finalresult[key]}))
        // calculate sum 
        const sum = totaldeaths.reduce((accum,item) => accum + item.numbers, 0);
        //console.log(totaldeaths)
            
        let $sum = document.createElement("h1");
        $sum.innerHTML = `Total deaths: ${sum}`;
        document.body.append($sum);    

        let $chart = document.createElement("div");
        $chart.classList.add("container" , "chartcontainer", "text-center");
        $chart.style.height = "256px";
        $chart.innerHTML =
        `<div id="barchartReport" class="d-inline-flex align-items-center chart-container m-auto" style="height:256px; width:256px">
            <canvas id="barChart"></canvas>
        </div>
        <div id="piechartReport" class="d-inline-flex align-items-center chart-container m-auto" style="height:256px; width:256px">
            <canvas id="pieChart"></canvas>
        </div>
        `;

        $sum.after($chart);

        const statsHtml =  `
            ${

                Object.entries(finalresult)
                .sort((a, b) => b[1].numbers - a[1].numbers)
                .map(([key, value] ,index) => {
                    
                    key==="caraccidents"?"car accidents":key;
                    let numbers = value.numbers;
                    let records = value.records;

                    return `

                    <div id="${key}-card" class="card mb-4 box-shadow">
                        <div class="card-header">
                        <h4 class="my-0 font-weight-normal"> ${key}</h4>
                        </div>
                        <div class="card-body">
                        <h1 class="card-title pricing-card-title">
                            ${numbers!==0?numbers:"ΔΕΝ ΥΠΑΡΧΟΥΝ ΔΕΔΟΜΕΝΑ"}
                        </h1>
                        <ul class="list-unstyled mt-3 mb-4">
                            <li class="mt-3 mb-4"> ${records!==0?records:"ΔΕΝ ΥΠΑΡΧΟΥΝ ΔΕΔΟΜΕΝΑ"} records included</li>
                            <li class="mt-3 mb-4">${index+1}rd place in danger</li>
                            <li class="${index===0?"bg-danger":index===1?" bg-warning":"bg-success"}">${index===0?"red alarm":index===1?"yellow alarm":"green alarm"}</li>
                        </ul> 
                        <button
                            type="button"
                            class="btn btn-lg btn-block btn-primary"
                        >
                                    Year : ${selectedDate.value}
                        </button>
                        </div>
                    </div>
                    `;
                }).join('')

             
            }          
            `;
    
        $result.innerHTML = statsHtml;


// Chart

//document.querySelector("#chartReport").innerHTML = '<canvas id="pieChart"></canvas><canvas id="barChart"></canvas>';
const $barChart = document.getElementById('barChart');
const $pieChart = document.getElementById('pieChart');


// pie chart

let pieconfig = {
    type: 'pie',
    data: {
      datasets: [{
        data: [accidentsfinalresults.sum, crimesfinalresults.sum, suicidesfinalresults.sum].sort((a, b) => b - a),
        backgroundColor: ['#dc3545', '#ffc107','#28a745']
      }],
      labels:Object.entries(finalresult).sort((a, b) => b[1].numbers - a[1].numbers).map((key => key[0]))
    },
    options: {
      responsive: true,
      legend: {
        position: 'top',
      },
      animation: {
        animateScale: true,
        animateRotate: true
      }
    }
  };


// line chart

let barconfig = {
    type: 'bar',
    data: {
        datasets: [{
        label:"Line chart",
        data: [accidentsfinalresults.sum, crimesfinalresults.sum, suicidesfinalresults.sum].sort((a, b) => b - a),
        backgroundColor: ['#dc3545', '#ffc107','#28a745']
        }],
        labels:Object.entries(finalresult).sort((a, b) => b[1].numbers - a[1].numbers).map((key => key[0]))
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
};

new Chart($barChart, barconfig);
new Chart($pieChart, pieconfig);

                   
    }).catch((reason) => {
        console.log(reason);
    });

}



});



