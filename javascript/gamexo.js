let fillInd;
let contentofres;
let putx = true;
let puto = false;
let arrX = [];
let arrO = [];
let indexArrX = 0;
let indexArrO = 0;
let numoftry = 0;

//get elements from html and set in this variables
let boxResult = document.getElementById('result');
let res1 = document.getElementById('res1st');
let res2 = document.getElementById('res2st');
contentofres = document.getElementById('contentres');

//=======================
//this condition check if 1st(X) or 2nd(O) player wined he will first begin to play
//by using sessionStorage technique  
//=======================
if (sessionStorage.length > 0) {
    if (sessionStorage.putx == 1) {
        putx = true;
        puto = false;
        contentofres.innerText = 'X is first playing';
    } else if (sessionStorage.puto == 1) {
        putx = false;
        puto = true;
        contentofres.innerText = 'O is first playing';
    }
    res1.innerText = sessionStorage.count1 > 0 ? sessionStorage.count1 : '0';
    res2.innerText = sessionStorage.count2 > 0 ? sessionStorage.count2 : '0';
}

//=======================
//this function that called in html file by event called onclick
//function do put XorY in box/index square
//=======================
function putxo(num) {
    fillInd = document.getElementsByClassName('indexempty')[num - 1];
    if (fillInd.textContent.length == 0) {
        if (putx) {
            contentofres.textContent = 'O next';
            fillInd.textContent = 'x';
            putx = false;
            puto = true;
            arrX[indexArrX] = num - 0; // to convert num from text to number
            indexArrX++;
            giveXorO(arrX.sort(), 1); //note: 1 ==> X , 2 ==> O
            return;
        }
        if (puto) {
            contentofres.textContent = 'X next';
            fillInd.textContent = 'o';
            putx = true;
            puto = false;
            arrO[indexArrO] = num - 0; // to convert num from text to number
            indexArrO++;
            giveXorO(arrO.sort(), 2);
            return;
        }
    }
    else {
        alert('cannot override of index!!');
    }
}

//=======================
//this function take two argumnets. the first is array of numbers (nums) and XorO this varaiable that determine of this exist box is X or O
//function do check this array that called (nums) and check numbers in this array . if numbers are found then X/O is win. 
//the numbers are must to check are: {1,2,3} / {1,5,9} / {1,4,7} / {2,5,8} / {3,5,7} / {3,6,9} / {4,5,6} / {7,8,9}. that should one of them be found   
//=======================
function giveXorO(nums, XorO) {
    numoftry++;
    let numofXorO = 0;
    let arrofwinning = [];
    console.log(nums); // to display array nums in console
    for (let z = 0; z < nums.length; z++) {
        if (nums[z] == 1) {
            for (let i = 0; i < nums.length; i++) {
                if (nums[i] == 2) {
                    numofXorO++;
                    for (let j = 0; j < nums.length; j++) {
                        if (nums[j] == 3) {
                            numofXorO++;
                        }
                        if (numofXorO == 2) {
                            arrofwinning[0] = 1;
                            arrofwinning[1] = 2;
                            arrofwinning[2] = 3;
                            showResult(arrofwinning, XorO);
                            return;
                        }
                    }
                    numofXorO = 0;
                }
                else if (nums[i] == 4) {
                    numofXorO++;
                    for (let j = 0; j < nums.length; j++) {
                        if (nums[j] == 7) {
                            numofXorO++;
                        }
                        if (numofXorO == 2) {
                            arrofwinning[0] = 1;
                            arrofwinning[1] = 4;
                            arrofwinning[2] = 7;
                            showResult(arrofwinning, XorO);
                            return;
                        }
                    }
                    numofXorO = 0;
                }
                else if (nums[i] == 5) {
                    numofXorO++;
                    for (let j = 0; j < nums.length; j++) {
                        if (nums[j] == 9) {
                            numofXorO++;
                        }
                        if (numofXorO == 2) {
                            arrofwinning[0] = 1;
                            arrofwinning[1] = 5;
                            arrofwinning[2] = 9;
                            showResult(arrofwinning, XorO);
                            return;
                        }
                    }
                    numofXorO = 0;
                }
            }
        }
        else if (nums[z] == 2) {
            for (let i = 0; i < nums.length; i++) {
                if (nums[i] == 5 || nums[i] == 8) {
                    numofXorO++;
                }
                if (numofXorO == 2) {
                    arrofwinning[0] = 2;
                    arrofwinning[1] = 5;
                    arrofwinning[2] = 8;
                    showResult(arrofwinning, XorO);
                    return;
                }
            }
            numofXorO = 0;
        }
        else if (nums[z] == 3) {
            for (let i = 0; i < nums.length; i++) {
                if (nums[i] == 5) {
                    numofXorO++;
                    for (let j = 0; j < nums.length; j++) {
                        if (nums[j] == 7) {
                            numofXorO++;
                        }
                        if (numofXorO == 2) {
                            arrofwinning[0] = 3;
                            arrofwinning[1] = 5;
                            arrofwinning[2] = 7;
                            showResult(arrofwinning, XorO);
                            return;
                        }
                    }
                    numofXorO = 0;
                }
                else if (nums[i] == 6) {
                    numofXorO++;
                    for (let j = 0; j < nums.length; j++) {
                        if (nums[j] == 9) {
                            numofXorO++;
                        }
                        if (numofXorO == 2) {
                            arrofwinning[0] = 3;
                            arrofwinning[1] = 6;
                            arrofwinning[2] = 9;
                            showResult(arrofwinning, XorO);
                            return;
                        }
                    }
                    numofXorO = 0;
                }
            }
        }
        else if (nums[z] == 4) {
            for (let i = 0; i < nums.length; i++) {
                if (nums[i] == 5 || nums[i] == 6) {
                    numofXorO++;
                }
                if (numofXorO == 2) {
                    arrofwinning[0] = 4;
                    arrofwinning[1] = 5;
                    arrofwinning[2] = 6;
                    showResult(arrofwinning, XorO);
                    return;
                }
            }
            numofXorO = 0;
        }
        else if (nums[z] == 7) {
            for (let i = 0; i < nums.length; i++) {
                if (nums[i] == 8 || nums[i] == 9) {
                    numofXorO++;
                }
                if (numofXorO == 2) {
                    arrofwinning[0] = 7;
                    arrofwinning[1] = 8;
                    arrofwinning[2] = 9;
                    showResult(arrofwinning, XorO);
                    return;
                }
            }
            numofXorO = 0;
        }
    }
    //if all boxes is filled without found this numbers so the result is draw by the two sides and reload the website  
    if (numoftry == 9) {
        showAndAddScorePlayers(3);
        let box;
        boxResult.classList.add('resultStyleAfterRound');
        for (let i = 0; i < 9; i++) {
            box = document.getElementById(`${i+1}`);
            box.classList.add("draw","win-animate")
        }
        contentofres.textContent = 'Draw';
        MadeFnReload();
    }
}

//=======================
//this function show result who is win 1st(X) / 2nd(O) player in rectangle box in up of XO boxes 
// and put specific background color in the three boxes of right choices of box
//Reload the website..
//=======================
function showResult(showofRightChoice, XorO) {
    let rightbox;
    boxResult.classList.add('resultStyleAfterRound');
    for (let i = 0; i < showofRightChoice.length; i++) {
        rightbox = document.getElementById(`${showofRightChoice[i]}`);
        rightbox.classList.add('rotate');
    }
    setInterval(() => {
        for (let i = 0; i < showofRightChoice.length; i++) {
            rightbox = document.getElementById(`${showofRightChoice[i]}`);
            rightbox.classList.add("winner", "win-animate");
        }
    }, 300)
    //if X/O is win so: add one point to 1st/2nd player and the first begin in the second round
    if (XorO == 1) {
        sessionStorage.setItem('putx', 1);
        sessionStorage.setItem('puto', 0);
        if (sessionStorage.count1 > 0) {
            showAndAddScorePlayers(1); //===> this function that add one point to player wins of other player
        } else {
            sessionStorage.setItem('count1', 0);
            showAndAddScorePlayers(1);
        }
        contentofres.textContent = 'X is winning';
    }
    if (XorO == 2) {
        sessionStorage.setItem('putx', 0);
        sessionStorage.setItem('puto', 1);
        if (sessionStorage.count2 > 0) {
            showAndAddScorePlayers(2);
        } else {
            sessionStorage.setItem('count2', 0);
            showAndAddScorePlayers(2);
        }
        contentofres.textContent = 'O is winning';
    }
    MadeFnReload();
}

//=======================
//this function do reload of website after 3 seconds of show result of win or draw
//=======================
function MadeFnReload() {
    let z = 0;
    setTimeout(() => {
        contentofres.textContent = 'Reloading'
    }, 1000);
    let realoading = setInterval(() => {
        contentofres.textContent += '.';
        z++;
        if (z == 3) {
            clearInterval(realoading);
            location.reload();
        }
    }, 1000);
}

//=======================
//this function do add one point to player is winning
// 1 ==> X (count1) , 2 ==> O (count2) , 3 ==> Draw.
//this result is called the finalResult in the html file and that located in the bottem of XO boxes
//=======================
function showAndAddScorePlayers(FstOrSnd) {
    if (FstOrSnd == 1) {
        sessionStorage.count1++;
        res1.innerText = sessionStorage.count1;
    }
    if (FstOrSnd == 2) {
        sessionStorage.count2++;
        res2.innerText = sessionStorage.count2;
    }
    if (FstOrSnd == 3) {
        res1.innerText = sessionStorage.count1 > 0 ? sessionStorage.count1 : '0';
        res2.innerText = sessionStorage.count2 > 0 ? sessionStorage.count2 : '0';
    }
}

//=======================
//this part to do reset of result , reload of website , clear sessionStorage and begin new round
//=======================
let resetbtn = document.getElementById('resetbtn');

resetbtn.onclick = () => {
    let z = 0;
    boxResult.classList.add('resultStyleAfterRound');
    contentofres.textContent = 'Reloading';
    let realoading = setInterval(() => {
        contentofres.textContent += '.';
        z++;
        if (z == 3) {
            clearInterval(realoading);
            sessionStorage.clear();
            location.reload();
        }
    }, 1000);
}