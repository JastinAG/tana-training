let fellows = { qa: 'Jastin', devops: 'Christopher', trainer: 'Daisy' };

let { qa: qaName } = fellows;
console.log('=================================================');
console.log('One of the Fellows in QA is :', qaName);
console.log('=================================================');

let profile = {
	company: { companyName: 'Invicti', location: 'TX' },
	fellow: { fellowName: 'Evans', fellowRole: 'QA' },
};

let {
	company: { companyName: partnerCompany },
} = profile;
console.log('=================================================');
console.log(partnerCompany);
console.log('=================================================');

//Destructuring in Arrays
const [a, b] = ['Dennis', 'Peter', 'Nancy', 'Jastin', 'Evans'];
console.log('The destructured elements in the array are: ');
console.log(a, b);
