let $$pokemonContainer = document.querySelector(".pokedex-father");
let $$inputText = document.getElementById("input-text");
let $$buttonSearch = document.getElementById("button-search");
const $$buttonAll = document.getElementById("all");
const $$buttonCatchs = document.getElementById("catchs");
const $$buttonNotCatchs = document.getElementById("notcatchs");

let pokemon = [];
let catchAll = [];
let notcatch = [];


const getPokemon = async () => {
  const url = "https://pokeapi.co/api/v2/pokemon/?offset=0&limit=151";
  const resp = await fetch(url);
  const data = await resp.json();
 

  const pokemonData = data.results.map((pokemon) => ({
    url: pokemon.url,
    name: pokemon.name,
  }));
  
  for (const pokemonItem of pokemonData) {
    const response = await fetch(pokemonItem.url);
    const responseJson = await response.json();
    
    function check(array1, array2) {
      for (let i = 0; i < array1.length; i++) {
        const id = array1[i].id;
        const valor = array1[i].fav;
    
        for (let j = 0; j < array2.length; j++) {
          if (array2[j].id === id) {
            array2[j].fav = valor;
            
          }
        }
      }
    }
    
  

    pokemon.push({
      id: responseJson.id,
      name: responseJson.name,
      image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${responseJson.id}.png`,
      type: responseJson.types.map((type) => type.type.name),
      fav: check(catchAll, pokemon),
    });    
  }

  

  renderPokemon(pokemon);
  if (notcatch.length === 0){
    notcatch = [...pokemon];
  } 
};


const renderPokemon = (pokemon) => {
  let html = "";
  
  for (const poke of pokemon) {
   
    const { id, name, image, type, fav } = poke;
    let pokeId = id.toString();
    if (pokeId.length === 1) {
      pokeId = "00" + pokeId;
    } else if (pokeId.length === 2) {
      pokeId = "0" + pokeId;
    }

    html += `
      <div class="pokedex-container-primary" id="pokedex-primary">
        <div class="container-secundary">
          <div class="img-pokemon">
            <img class="pokemon" src="${image}" alt="${name}">
          </div>
          <div class="info-pokemon">
            <h2>${name}</h2>
            <div class="type-container">`;
    for (const types of type) {
      html += `<img class="type" src="img/icons types/${types}.png" alt="${name}">`;
    }
    html += `
    </div>
    </div>
  </div>
  <div class="container-number">
    <div class="container-number-secundary">
      <div class="fav">
        <img id="button-${id}" class="disable" src="img/catch-${fav ? 'red' : 'white'}.svg" alt="">
      </div>
      <h3> No. ${pokeId}</h3>
    </div>
  </div>
</div>
    `;
  }
  $$pokemonContainer.innerHTML = html;
  

  for (const poke of pokemon) {
    const $$button = document.getElementById(`button-${poke.id}`);

    $$button.addEventListener("click", function () {
      const index = pokemon.findIndex((e) => e.id === poke.id);// usa findIndex para encontrar el id del pokemon seleccionado en el arreglo pokemon.
      const isFav = pokemon[index].fav;
      

      if (isFav) {
        pokemon[index].fav = false;
        notcatch.push(pokemon[index]);
        catchAll = catchAll.filter((e) => e.id !== poke.id);
     
        
      } else {
        pokemon[index].fav = true;
        catchAll.push(pokemon[index]);
        notcatch = notcatch.filter((e) => e.id !== poke.id);
        
      }
      localStorage.setItem("catchPokemon" ,JSON.stringify(catchAll))
      localStorage.setItem("notcatchPokemon", JSON.stringify(notcatch));
      renderPokemon(pokemon);
      
      
    });
  }
};

const searchPokemon = () => {
  const search = $$inputText.value.toLowerCase();
  const filteredPokemon = pokemon.filter((poke) =>
    poke.name.toLowerCase().includes(search)
  );
  renderPokemon(filteredPokemon);
};

const main = async () => {
  $$buttonSearch.addEventListener("click", (event) => {
    event.preventDefault();
    searchPokemon();
  });
  const getLocal = JSON.parse(localStorage.getItem("catchPokemon"))
  const getLocalNo = JSON.parse(localStorage.getItem("notcatchPokemon"))
  if(getLocalNo){
    notcatch = getLocalNo;
  }
  if(getLocal){
    catchAll = getLocal;
  }

  await getPokemon();
};


document.addEventListener("DOMContentLoaded", main);

$$buttonAll.addEventListener("click", (ev)=>{
  ev.preventDefault();
  renderPokemon(pokemon);
});

$$buttonCatchs.addEventListener("click", (ev)=>{
  ev.preventDefault();
  renderPokemon(catchAll);
});

$$buttonNotCatchs.addEventListener("click", (ev)=>{
  ev.preventDefault();
  renderPokemon(notcatch);
});


