document.addEventListener("DOMContentLoaded", () => {
  // Page content has Loaded!
  let player = sessionStorage.getItem("player");
  let won = 0;
  let won_rate = sessionStorage.getItem("won");
  let fail = 0;
  let fail_rate = sessionStorage.getItem("fail");
  //checking is any player exists in session
  if (player != null) {
      document.querySelector("#player_box").style.display = "none";
      document.querySelector("#start_box").style.display = "block";
      document.querySelector("#welcome_player_name").innerHTML = player;
      document.querySelector("#game_player_name").innerHTML = player;
  }
  if (won_rate != null) {
      won = won_rate;
  }
  if (fail_rate != null) {
      fail = fail_rate;
  }
  document.querySelector(".won-count").innerHTML = won;
  document.querySelector(".fail-count").innerHTML = fail;
});


//changing the difficulty level
function gameMode(mode) {
  document.querySelector(".flag-count").innerHTML = mode;
  document.querySelector(".bomb-count").innerHTML = mode;
}


//after filling player name opening game menu page
document.querySelector("#go_button").addEventListener("click", function() {
  player = document.querySelector("#player_input").value;

  if (player != null) {
      sessionStorage.setItem("player", player);
      document.querySelector("#welcome_player_name").innerHTML = player;
      document.querySelector("#game_player_name").innerHTML = player;
      document.querySelector("#player_box").style.display = "none";
      document.querySelector("#start_box").style.display = "block";
  }
  if (player == "" || player == null) {
      document.querySelector("#player_box").style.display = "block";
      document.querySelector("#start_box").style.display = "none";
  }
});


//after click start button game page loading
document.querySelector("#start").addEventListener("click", function() {
  let boxes = [];
  let bombs = parseInt(document.getElementById("difficulty").value);
  let i = 0;
  let mineRemoved = 0;
  let flagCLick = 0;

  // creating a suffled array with bombs and valids
  const gameArray = Array(bombs)
      .fill("mine")
      .concat(Array(100 - bombs).fill("empty"))
      .sort(() => Math.random() - 0.5);


  // displaying existing flags 
  for (let i = bombs; i > 0; i--) {
      flags = document.createElement("li");
      flags.className = "fa fa-flag flag_exist";
      document.querySelector(".flags-left").appendChild(flags);
  }

  document.querySelector("#start_box").style.display = "none";
  document.querySelector("#game_box").style.display = "block";

  // left click event
  function leftClick(box) {
      // is there any mine detected  redirect to game over .
      if (box.classList.contains("flag")) {
        e.preventDefault();
      }else{
      if (box.classList.contains("mine")) {
          box.style.background = "red";
          box.innerHTML = '<li class="fa fa-bomb"></li>';
          mines = document.getElementsByClassName("mine");
          for (var i = 0; i < mines.length; i++) {
              mines[i].style.backgroundColor = "red";
              mines[i].innerHTML = '<li class="fa fa-bomb"></li>';
          }
          let fail = 0;
          if (sessionStorage.getItem("fail") != null) {
              fail = parseInt(sessionStorage.getItem("fail"));
          }
          fail++;
          sessionStorage.setItem("fail", fail);
          document.getElementById("gameover").style.display = "block";
      } else {
          let number = box.getAttribute("data");
          if (number == 0) {
              box.classList.add("checked");
              empty = document.getElementsByClassName("empty");
              for (var i = 0; i < empty.length; i++) {
                  if (empty[i].getAttribute("data") == 0) {
                      empty[i].classList.add("checked");
                  }
              }
          } else {
              box.innerHTML = number;
              box.classList.add("checked");
              box.classList.add("number");
          }
      }
    }
  }
  // right click event
  function rightClick(box) {
      flagCLick++;
      if (flagCLick > bombs || box.classList.contains("checked")) {
          e.preventDefault();
      }
      document.querySelector(".flags-left").innerHTML = "";
      for (let i = bombs - flagCLick; i > 0; i--) {
          flags = document.createElement("li");
          flags.className = "fa fa-flag flag_exist";
          document.querySelector(".flags-left").appendChild(flags);
      }
      if (box.classList.contains("mine")) {
          box.classList.add("flag");
          box.innerHTML = '<li class="fa fa-flag"></li>';
          mineRemoved++;
          if (mineRemoved == bombs) {
              let won = 0;
              if (sessionStorage.getItem("won") != null) {
                  won = parseInt(sessionStorage.getItem("won"));
              }
              won++;
              sessionStorage.setItem("won", won);
              document.getElementById("victory").style.display = "block";
          }
      } else {
          box.classList.add("flag");
          box.innerHTML = '<li class="fa fa-flag"></li>';
      }
  }

  //creating the game board.. total 100 divs inside 

  function create_game_board() {
      while (i < 100) {
          const box = document.createElement("div");
          box.setAttribute("id", i);
          box.classList.add(gameArray[i]);
          document.querySelector(".game_board").appendChild(box);
          boxes.push(box);
          box.addEventListener("click", function(e) {
              leftClick(box);
          });
          box.oncontextmenu = function(e) {
              e.preventDefault();
              rightClick(box);
          };
          i++;
      }

      //adding numbers inside and divs .
      for (let i = 0; i < boxes.length; i++) {
          let width = 10;
          let total = 0;
          const isInLeft = i % width === 0;
          const isInRight = i % width === width - 1;

          if (boxes[i].classList.contains("empty")) {
              if (i > 0 && !isInLeft && boxes[i - 1].classList.contains("mine"))
                  total++;
              if (
                  i > 9 &&
                  !isInRight &&
                  boxes[i + 1 - width].classList.contains("mine")
              )
                  total++;
              if (i > 10 && boxes[i - width].classList.contains("mine")) total++;
              if (
                  i > 11 &&
                  !isInLeft &&
                  boxes[i - 1 - width].classList.contains("mine")
              )
                  total++;
              if (i < 98 && !isInRight && boxes[i + 1].classList.contains("mine"))
                  total++;
              if (
                  i < 90 &&
                  !isInLeft &&
                  boxes[i - 1 + width].classList.contains("mine")
              )
                  total++;
              if (
                  i < 88 &&
                  !isInRight &&
                  boxes[i + 1 + width].classList.contains("mine")
              )
                  total++;
              if (i < 89 && boxes[i + width].classList.contains("mine")) total++;
              boxes[i].setAttribute("data", total);
          }
      }
  }
  create_game_board();


});