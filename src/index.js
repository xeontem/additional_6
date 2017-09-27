module.exports = function zeros(expression) {
	const blob = expression;// input value

	//------------------------- must have functions ---------------------------------
	const compose = f => g => x => f(g(x));
	const condF = x => f => g => x() ? f() : g();
	const cond = x => t => f => x ? t : f;

	//---------------------------------------------------------------------------
	const fact = num => num === 1 ? num * 1 : num * fact(num - 1);// factorial
	const multier = n => n > 0 ? n * multier(n - 2) : 1;// double factorial

	const factF = f => num => condF(x => num === 1)(x => num * 1)(x => num * f(num - 1));// factory for fact memoization
	const multierF = f => n => condF(x => n > 0)(x => n * f(n - 2))(x => 1);// factory for double fact memoization

	// exclamsCounter:: number -> string -> string -> number
	const exclamsCounter = mem => s => v => condF(x => s.lastIndexOf(v) === s.length-1)(x => exclamsCounter(mem + 1)(s.slice(0, -1))(v))(x => mem);// define how many '!' in a string

	// currExclamsCounter:: string -> string -> number
	const currExclamsCounter = exclamsCounter(0);// currying counter to store memory in scope
	
	//-------------------------------- calculate how many zeros in a number -----------------------------------
	const fifthCounter = mem => num => condF(x=> num <= 1)
		(x => mem)
		(x => cond(num % 5)
			(fifthCounter(mem)(num/5))
			(fifthCounter(mem+1)(num/5)));// count all cases which common factor is 5
	
	const twosCounter = mem => num => cond(num % 2)(mem)(mem+1);// count all cases which common factor is 2

	//counter:: number -> number -> (number -> number) -> number -> number
	const counter = mem => df => f => num => condF(x => num <= 1)// f - would be a 'fifthCounter' or 'twosCounter' to count zeros
    (x => mem)// if number is 1 return the count of cases
    (x => counter(f(mem)(num))(df)(f)(num - df));// recursive call counter

	// currCounter:: number -> (number -> number) -> number -> number
	const currCounter = counter(0);// currying counter to store memory in scope

	//-------------------------- memoization ---------------------------
	const Ymem = mem => F => F(x => condF(z => mem.has(x))
		(z => mem.get(x))
		(z => mem.set(x, Ymem(mem)(F)(x)).get(x)));// works from second call, because only one recurssion in the function
	
	const factMem = Ymem(new Map())(factF);
	const multMem = Ymem(new Map())(multierF);

	//------------------------------ performance check ----------------------------------------
	const perf = f => x => start => -start.valueOf(f(x)) + performance.now();// valueOf() - not necessary, just one-string hack for computing f(x)
	// console.log(perf(factMem)(40)(performance.now()));

	//-------------------------- apply functions ------------------------------------------
	const arr = blob.split('*');// split a string by '*'
	const excs = arr.map(blob => currExclamsCounter(blob)('!'));// factorial/double factorial check

	//----------------------------------- calculate zeros in every number --------------------
	let fifth = arr.map((blob, i) => compose(currCounter(excs[i])(fifthCounter))(parseInt)(blob))// count all matches when number is divided by 5
	let odds = arr.map((blob, i) => compose(currCounter(excs[i])(twosCounter))(parseInt)(blob))// count all matches when number is divided by 2

	//-------------------- sum of zeroes ------------------------------------------------
	fifth = fifth.reduce((acc, num) => acc + num, 0);
	odds = odds.reduce((acc, num) => acc + num, 0);

	return Math.min(fifth, odds);// return minimum value of both cases
}
