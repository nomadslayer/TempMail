const names = require('./data.json')


function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }

function getRandomSeparator() {
    let separators = ['.', '-', '_']

    return separators[Math.floor(Math.random() * Math.floor(separators.length))];
}


generateName = (domain) => {
    //generate random names
    let name_random = [
        getRandomInt(names.name.length),
        getRandomInt(names.lastname.length)
    ];
    // console.log(name_random)


    //get names
    let name = names.name[name_random[0]]
    let lastname = names.lastname[name_random[1]]

    return `${name}${getRandomSeparator()}${lastname}${getRandomInt(100)}@${domain}`.toLowerCase()
}

module.exports = generateName