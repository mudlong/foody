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
      stateful entrypoint orderFood(index : int) = 
        let foodos = getfoody(index)
        Chain.spend(foodos.conAddress, Call.value) 
` ;


// const contractAddress = 'ct_7W4TBmvpHMpmp95stctgmBQoL9kqh6eLQUZNYRt7uHyiGdKUD';
// const contractAddress = 'ct_2VZeyiXtgLv3zGih9sGEnQMtzojRgcg9WYZtK4VQx7NfzBG2TA';
// const contractAddress = 'ct_SYi6Xg78ZE25vfQcyS1oZsR89zW6sYE2sezBYyTGkYUzuNCnc';
const contractAddress = 'ct_o1sfXVQDhJT6Jg5m26D1sDXW2Wzj7yyrwQRbgiqP8yUHafmRi';

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

  var foodsLength = await callStatic('getFoodslength', []); 
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
      index :i,  
    })
  }

     renderFoods(); 
  $("#loader").hide();
  
  var x = document.getElementsByClassName('btn');
    for (let i = 0; i < x.length; i++) {
     
     x[i].addEventListener("click", async function(event){
      // document.getElementsByClassName('checkOut').style.display='block';
   $(".checkOut").style.display='block';

     $('.btt').on("click", async function(event){


     $("#loader").show();


     let template = "{{foodPrice}}",
      index = event.target.id,
      value = foodArray[i]['foodPrice'];

 
  await contractCall('orderFood', [index], value);
  console.log("purc succses");

    })
  $("#loader").hide();
});
 }

})