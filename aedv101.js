
const contractCode = `
 contract AeternityFoods =
      
      record foody =
        { conAddress  : address,
          name      : string,
          foodpics    : string, 
          foodPrice   : int, 
          foodDesc    : string }   

      record state = 
        { food        : map(int, foody),
          foodslength : int }

      entrypoint init() = 
        { food        = {},
          foodslength = 0 }

      entrypoint getfoody(index : int) : foody = 
        state.food[index]
        
      entrypoint getFoodslength() : int =
        state.foodslength
              
      stateful entrypoint uploadFood(name' : string, foodpics' : string, foodDesc' : string, foodPrice' : int) =
        let foods = { conAddress = Call.caller, name = name', foodpics = foodpics', foodPrice = foodPrice', foodDesc = foodDesc'}
        let index = getFoodslength() + 1
        put(state {food[index] = foods, foodslength = index })

` ;


// const contractAddress = 'ct_7W4TBmvpHMpmp95stctgmBQoL9kqh6eLQUZNYRt7uHyiGdKUD';
// const contractAddress = 'ct_2VZeyiXtgLv3zGih9sGEnQMtzojRgcg9WYZtK4VQx7NfzBG2TA';
const contractAddress = 'ct_SYi6Xg78ZE25vfQcyS1oZsR89zW6sYE2sezBYyTGkYUzuNCnc';


var client = null;
var foodsLength = 0;

var foodArray = [];
  

function renderFoods(){
  var template = $('#template').html();
  Mustache.parse(template);
  var rendered = Mustache.render(template, {foodArray});
  $('#myDiv').html(rendered);
}


async function callStatic(func, args) {
  //Create a new contract instance that we can interact with
  const contract = await client.getContractInstance(contractCode, {contractAddress});
  //Make a call to get data of smart contract func, with specefied arguments 
  const calledGet = await contract.call(func, args, {callStatic: true}).catch(e => console.error(e));
  console.log('calledGet', calledGet);
  //Make another call to decode the data received in first call
  const decodedGet = await calledGet.decode().catch(e => console.error(e));

  return decodedGet;
}

async function contractCall(func, args, value) {
  const contract = await client.getContractInstance(contractCode, {contractAddress});
  //Make a call to write smart contract func, with aeon value input
  const calledSet = await contract.call(func, args, {amount: value}).catch(e => console.error(e));
  return calledSet;
}

 window.addEventListener('load', async() => {
   //Display the loader .
  $("#loader").show();

  client = await Ae.Aepp();

  foodsLength = await callStatic('getFoodslength', []); 
  console.log(foodsLength)

  for (let i = 1; i <= foodsLength; i++) {

//call to the blockchain to get saved data
  const foody = await callStatic('getfoody', [i]);

//Display our foods from  blockchain
    foodArray.push({
      // name: foody.name,
      foodpics: foody.foodpics,
      foodPrice: foody.foodPrice,
      foodDesc: foody.foodDesc,
    })
  
  }

     renderFoods(); 
  $("#loader").hide();
})

jQuery("#myDiv").on("click", ".buyFood", async function(event){
  $("#loader").show();
  const vague = parseInt(document.getElementById('ize'));
  console.log(value)
  console.log(loggy)
  $("#loader").hide()
})

//     };

//        async function callStatic(func,args){
//   const contract = await clik.getContractInstance(contractSource, {contractAddress});
//   console.log('args', args);
//   console.log('func', func);

//   const calledGet = await contract.call(func, args, {callStatic: true}).catch(e => console.error(e));
//   console.log('calledGet', calledGet);

// } 
          
	// { "foodpics":"images (3).jpeg","foodPrice":"3 AE","foodDesc":"noel longs fooods"},
	// { "foodpics":"images (13).jpeg","foodPrice":"2 AE","foodDesc":"chicken and suya"},
	// { "foodpics":"images (11).jpeg","foodPrice":"45 AE","foodDesc":"suya fiery"}

// //Create a asynchronous write call for our smart contract
// async function contractCall(func, args, value) {
//   const contract = await client.getContractInstance(contractSource, {contractAddress});
//   //Make a call to write smart contract func, with aeon value input
//   const calledSet = await contract.call(func, args, {amount: value}).catch(e => console.error(e));
//   return calledSet;
//   }

 //   const value = ($('#ize').val());
 // //index of the food to buy. 
 //   const dataIndex = event.target.id;

 //   alert(value);
 //   renderFoods();
 // })
