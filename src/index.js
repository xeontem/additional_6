module.exports = function zeros(blob) {
//------------------------- basic functions ---------------------------------
var compose = f => g => x => f(g(x));
var condF = x => f => g => x() ? f() : g();

//----------------------- calculate factorial -----------------------------------------
var fact = num => num === 1 ? num * 1 : num * fact(num - 1);

//----------------------- calculate mul: 10*8*6*4*2 || 9*7*5*3*1 -----------------------------------------
var multier = n => condF(x => n > 0)(x => n * multier(n - 2))(x => 1);

//----------------------- calculate count of entries in string -----------------------------------------
var valuesCounter = s => v => mem => 
    condF(x => s.lastIndexOf(v) === s.length-1)
        (x => mem.push(valuesCounter(s.slice(0, -1))(v)(mem)))
        (x => mem.length);

var zerosCounterF = mem => num => {
    if(num === 1) return mem;
    var temp = num;
    while (temp % 5 == 0){
        mem++
        temp /= 5;
    }
    return zerosCounterF(mem)(num - 1);
}

var zerosCounterDF = num => {
    var pyat = 0;
    while (num > 1){
        
        var temp = num;
        while (temp % 5 == 0){
            pyat++
            temp /= 5;
        }
        num -= 2;
    }
    return pyat;
}

//------------------------------------- memoization -------------------------------------------------
var memoize = mem => F => num => 
    condF(x => mem.has(num))
        (x => mem.get(num))
        (x => mem.set(num, F(num)).get(num));

var memFact = num => memoize(new Map())(fact)(num);
var memMultier = num => memoize(new Map())(multier)(num);

// var blob = '1!!*2!!*3!!*4!!*5!!*6!!*7!!*8!!*9!!*10!!';// input value

//-------------------------- apply functions ------------------------------------------
var arr = blob.split('*');// create an array of calculatable elements
var excs = arr.map(blob => valuesCounter(blob)('!')([]));// calculate count of exclamations in each element

//------------------------------------ array of calculated factorials and/or multiers ------------------------------- 
var res = arr.map((blob, i) => condF(x => excs[i] === 2)(x => compose(zerosCounterDF)(parseInt)(blob))(x => compose(zerosCounterF(0))(parseInt)(blob)));

//------------------------------------------ multiply elements/ counting of zeroes in the number -----------------------------------------------
var num = res.reduce((acc, num) => acc + num, 0);
return num;
}
