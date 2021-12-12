document.addEventListener("DOMContentLoaded",() => {

// const getdata = async () =>{
// try{
//     const res = await fetch('https://data.gov.gr/api/v1/query/mcp_traffic_accidents',{
//     dataType: 'jsonp',
//     headers: {
//         "Authorization": "Token 68f76a4a7b8ab0f24fbe47ad30c65e6731a5b235"
//     }
//     })
//     const data = await res.text();
//     console.log(data)
// }
// catch (error) {console.log(error)}
// }

const APIkey = "68f76a4a7b8ab0f24fbe47ad30c65e6731a5b235";
const trafficAccidentsUrl = "https://data.gov.gr/api/v1/query/mcp_traffic_accidents";
const crimesUrl = "https://data.gov.gr/api/v1/query/mcp_crime";
const suicidesURL = "https://leonalkalai.github.io/Greece-mortality/suisides.json";


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
    //console.log(trafficAccidentsUrl)
    //console.log(JSON.parse(data))

    const result = JSON.parse(data).map(({ year,jurisdiction ,deadly_accidents, deaths }) => ({
        year, 
        jurisdiction,
        deadly_accidents,
        deaths
      }));

    // Object.keys(JSON.parse(data)).forEach(function(key) {
    //     console.log(key, JSON.parse(data)[key]);
      
    // });

    Object.keys(result).forEach(function(key) {
        console.log(key, result[key]);
      
    });
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
        //console.log(trafficAccidentsUrl)
        //console.log(JSON.parse(data))
    
        const result = JSON.parse(data).map(({ year, crime ,committed }) => ({
            year, 
            crime,
            committed
            
          }));
    
        Object.keys(JSON.parse(data)).forEach(function(key) {
            console.log(key, JSON.parse(data)[key]);
          
        });
    
        // Object.keys(result).forEach(function(key) {
            
        //     if(result[key].crime==="ΑΝΘΡΩΠΟΚΤΟΝΙΕΣ") 
        //     console.log(key, result[key]);
          
        // });
    }
    catch (error) {console.log(error)}
    }
    
    
    
//getCrimesData()



//------------------------------------get suicides-------------------------------------//

const getSuicidesData = async () =>{
    try{
        const res = await fetch(`${suicidesURL}`,
            {
            dataType: 'jsonp',
            headers:
            {
                'Access-Control-Allow-Origin':'*',
                Authorization: `Token ${APIkey}`
            }
        })
        const data = await res.text();
        //console.log(trafficAccidentsUrl)
        //console.log(JSON.parse(data))
    
        const result = JSON.parse(data).map(({ Date, Suicides }) => ({
            year, 
            crime,
            committed
            
          }));
    
        Object.keys(JSON.parse(data)).forEach(function(key) {
            console.log(key, JSON.parse(data)[key]);
          
        });
    
        // Object.keys(result).forEach(function(key) {
            
        //     if(result[key].crime==="ΑΝΘΡΩΠΟΚΤΟΝΙΕΣ") 
        //     console.log(key, result[key]);
          
        // });
    }
    catch (error) {console.log(error)}
    }
    
    
    
getSuicidesData()




});


















 

// $.ajax({
//     url: 'https://data.gov.gr/api/v1/query/mcp_traffic_accidents',
//     dataType: 'jsonp',
//     headers: {
//         "Authorization": "Token 87a465af94af31194a24dcadf7e12b3c9e22b366"
//     },
//     success: function(data) {
//       alert('Total results found: ' + data.length)
//     }
//   });
    
    


